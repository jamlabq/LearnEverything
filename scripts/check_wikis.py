#!/usr/bin/env python3
"""Check snapshot completeness, generated pages and every local HTML resource URL."""
import hashlib
import json
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

from wiki_links import HOSTS, page_route

ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / '_site'
SLUGS = ('oi-wiki', 'cs-self-learning')


class Links(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.links = []
        self.embeds = []
        self.upstream = []
        self.in_article = False
        self.ids = set()
        self.fragments = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        for key in ('id', 'name'):
            if attrs.get(key): self.ids.add(attrs[key])
        if tag == 'article': self.in_article = True
        for key in ('href', 'src', 'poster'):
            if key not in attrs: continue
            url = attrs[key]
            parsed = urlsplit(url)
            if self.in_article and key == 'href' and parsed.fragment and not parsed.scheme and not parsed.netloc:
                self.fragments.append(url)
            if not url or url.startswith(('data:', 'mailto:', 'javascript:', 'tel:', '#')): continue
            if parsed.scheme or parsed.netloc:
                if key in ('src', 'poster') or (tag == 'link' and attrs.get('rel') == 'stylesheet'):
                    self.embeds.append(url)
                if self.in_article and parsed.hostname in HOSTS: self.upstream.append(url)
            else: self.links.append(url)

    def handle_endtag(self, tag):
        if tag == 'article': self.in_article = False


def main():
    errors = []
    counts = {}
    ids = {}
    fragments = []
    for slug in SLUGS:
        folder = ROOT / 'wiki-sources' / slug
        manifest = json.loads((folder / 'snapshot.json').read_text())
        for name, checksum in manifest['files'].items():
            path = folder / name
            if not path.is_file() or hashlib.sha256(path.read_bytes()).hexdigest() != checksum:
                errors.append(f'Source checksum mismatch: {slug}/{name}')
        sources = list((folder / 'docs').rglob('*.md'))
        if len(sources) != manifest['markdown_count']: errors.append(f'Unexpected source count: {slug}')
        for source in sources:
            route = page_route(source.relative_to(folder / 'docs').as_posix())
            if not (SITE / slug / route / 'index.html').is_file(): errors.append(f'Missing generated page: {slug}/{route}')
        pages = list((SITE / slug).rglob('*.html'))
        counts[slug] = {'source_documents': len(sources), 'generated_html': len(pages)}
        for page in pages:
            parser = Links()
            parser.feed(page.read_text())
            ids[page.resolve()] = parser.ids
            fragments.extend((page, url) for url in parser.fragments)
            for url in parser.links:
                parsed = urlsplit(url)
                decoded = unquote(parsed.path)
                target = SITE / decoded.lstrip('/') if decoded.startswith('/') else page.parent / decoded
                if target.is_dir(): target = target / 'index.html'
                if not target.is_file(): errors.append(f'{page.relative_to(SITE)} → missing {url}')
            for url in parser.embeds: errors.append(f'{page.relative_to(SITE)} → remote embedded resource {url}')
            for url in parser.upstream: errors.append(f'{page.relative_to(SITE)} → unconverted upstream wiki link {url}')
        index = SITE / slug / 'search' / 'search_index.json'
        if not index.is_file() or not json.loads(index.read_text()).get('docs'): errors.append(f'Missing search index: {slug}')
    for page, url in fragments:
        parsed = urlsplit(url)
        target = page.parent / unquote(parsed.path) if parsed.path else page
        if target.is_dir(): target = target / 'index.html'
        if target.resolve() in ids and unquote(parsed.fragment) not in ids[target.resolve()]:
            errors.append(f'{page.relative_to(SITE)} → missing fragment {url}')
    for asset in json.loads((ROOT / 'wiki-theme' / 'external-images' / 'manifest.json').read_text()):
        if 'file' in asset:
            path = ROOT / 'wiki-theme' / 'external-images' / asset['file']
            if hashlib.sha256(path.read_bytes()).hexdigest() != asset['sha256']: errors.append(f'Image checksum mismatch: {path}')
    print(json.dumps(counts, ensure_ascii=False, indent=2))
    report = ROOT / 'build' / 'wiki-validation.json'
    report.parent.mkdir(exist_ok=True, parents=True)
    report.write_text(json.dumps({'counts': counts, 'errors': errors}, ensure_ascii=False, indent=2) + '\n')
    if errors:
        print('\n'.join(errors[:80]))
        raise SystemExit(f'{len(errors)} wiki validation failures. Full report: {report}')
    print('PASS: every copied Markdown page was generated; all local HTML links and assets exist; no remote embeds or unconverted wiki links.')


if __name__ == '__main__': main()
