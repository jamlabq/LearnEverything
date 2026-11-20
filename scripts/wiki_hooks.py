"""Presentation-only adaptations; wiki-sources stays byte-for-byte upstream."""
import json
import posixpath
from pathlib import Path
from urllib.parse import quote, unquote

from bs4 import BeautifulSoup
from wiki_links import MirrorLinks

ROOT = Path(__file__).resolve().parents[1]
LINKS = MirrorLinks({slug: {p.relative_to(ROOT / 'wiki-sources' / slug / 'docs').as_posix()
                           for p in (ROOT / 'wiki-sources' / slug / 'docs').rglob('*.md')}
                     for slug in ('oi-wiki', 'cs-self-learning')})


def on_page_markdown(markdown, page, config, files):
    extra = config['extra']
    original = Path(page.file.abs_src_path).relative_to(config['docs_dir']).as_posix()
    page.meta['mirror_source'] = extra['upstream'] + '/blob/' + extra['commit'] + '/docs/' + quote(original)
    page.meta['mirror_original'] = original
    return markdown


def on_page_content(html, page, config, files):
    soup = BeautifulSoup(html, 'html.parser')
    # The two upstream UI scripts depend on the original theme/editing service.
    # Removing rendered script elements leaves fenced code examples intact.
    for script in soup.find_all('script'):
        script.decompose()
    edit = soup.find(id='btn-startedit')
    if edit:
        edit['href'] = config['extra']['upstream'] + '/contribute'
        edit.string = '前往上游贡献内容'
    for node in soup.find_all(['a', 'img', 'source']):
        attr = 'href' if node.name == 'a' else 'src'
        if node.get(attr) and attr == 'src' and 'mirror-assets/imported/' in node[attr]:
            target = 'mirror-assets/imported/' + node[attr].split('mirror-assets/imported/', 1)[1]
            node[attr] = posixpath.relpath(target, unquote(page.url) or '.')
        if node.get(attr):
            node[attr] = LINKS.rewrite(node[attr], config['extra']['mirror_slug'], page.url)
    return str(soup)


def on_post_build(config):
    slug = config['extra']['mirror_slug']
    report = [{'site': site, 'path': path} for site, path in sorted(LINKS.missing)]
    (Path(config['site_dir']) / 'mirror-link-report.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
