#!/usr/bin/env python3
"""Build two self-contained wiki snapshots without fetching upstream content."""
import hashlib
import json
import re
import posixpath
import shutil
from pathlib import Path

import yaml
from mkdocs.commands.build import build
from mkdocs.config import load_config
from pymdownx.arithmatex import fence_mathjax_format
from pymdownx.emoji import to_svg
from pymdownx.slugs import uslugify

ROOT = Path(__file__).resolve().parents[1]
SLUGS = ('oi-wiki', 'cs-self-learning')


class NavigationLoader(yaml.SafeLoader):
    """Read nav/i18n data without executing Python tags in upstream configs."""


NavigationLoader.add_multi_constructor('tag:yaml.org,2002:python/name:', lambda loader, suffix, node: suffix)


def check_snapshot(folder):
    snapshot = json.loads((folder / 'snapshot.json').read_text())
    for path, checksum in snapshot['files'].items():
        file = folder / path
        if not file.is_file() or hashlib.sha256(file.read_bytes()).hexdigest() != checksum:
            raise ValueError(f'Copied source differs from pinned upstream snapshot: {file}')
    return snapshot


def extensions(slug, snapshot_folder):
    common = ['attr_list', 'md_in_html', 'footnotes', 'admonition', 'def_list', 'meta',
              {'toc': {'permalink': True, 'slugify': uslugify}},
              {'pymdownx.arithmatex': {'generic': True}},
              {'pymdownx.highlight': {'linenums': slug == 'oi-wiki'}},
              {'pymdownx.superfences': {'custom_fences': [{'name': 'math', 'class': 'arithmatex', 'format': fence_mathjax_format}]}},
              {'pymdownx.tabbed': {'alternate_style': True}},
              {'pymdownx.snippets': {'check_paths': True, 'base_path': [str(snapshot_folder)]}},
              {'pymdownx.emoji': {'emoji_generator': to_svg}},
              {'pymdownx.tasklist': {'custom_checkbox': True}}]
    return common + ['pymdownx.' + ext for ext in ('caret', 'critic', 'details', 'inlinehilite', 'keys', 'magiclink', 'mark', 'progressbar', 'smartsymbols', 'tilde')]


def about_text(snapshot, slug, assets):
    originals = '\n'.join(f'- [{name}](mirror-original/{name})' for name in ('README.md', 'LICENSE', 'CITATION.bib') if (ROOT / 'wiki-sources' / slug / name).exists())
    missing = [a for a in assets if 'error' in a and any(p.startswith(slug + '/') for p in a['used_by'])]
    missing_text = '\n'.join('- ' + a['url'] for a in missing) or '已将可解析的正文外部配图下载到本站。'
    license_text = '''- [CC BY-SA 4.0 全文](mirror-original/CC-BY-SA-4.0.txt)
- [SATA 许可全文](mirror-original/SATA.txt)

根据上游的附加许可说明，使用本内容时也请为原项目 Star 并感谢作者。改编的正文仍按相同内容许可共享。''' if slug == 'oi-wiki' else ''
    return f'''# 关于这份本站副本

这里是 **{snapshot['name']}** 的 LearnEverything 副本，可以直接阅读文章、浏览章节并搜索内容。

- 原作者与贡献者：{'OI Wiki Team 及原文 author 字段列出的贡献者' if slug == 'oi-wiki' else 'PKUFlyingPig / Yinmin Zhong 及项目贡献者'}。
- 上游项目：[{snapshot['upstream']}]({snapshot['upstream']})。
- 复制日期：**{snapshot['imported_at']}**；版本：[`{snapshot['commit'][:12]}`]({snapshot['upstream']}/tree/{snapshot['commit']})。
- 本次保存了 **{snapshot['markdown_count']} 个 Markdown 文档**及仓库内配图、示例代码。CS 自学指南的数量包含中英文页面。
- 内容许可：**{snapshot['license']}**。各页特别声明、作者署名和第三方资料的权利说明继续适用。

## 保留的许可与原始文件

{originals}

{license_text}

## 本站做了哪些适配

正文源文件按上述版本完整保存在本仓库的 `wiki-sources/{slug}/docs/`，并有逐文件 SHA-256 校验记录。本站调整了页面主题、导航、站内链接和图片路径，并修复原文英文学习规划的段落锚点、中文信息检索的脚注编号；公式、字体及搜索使用本地资源。原站的评论、统计、反馈服务和编辑脚本不在此副本启用。原文介绍这些功能的文字仍予保留。

文章引用的外部课程、书籍、视频、练习网站和贡献入口仍指向原作者的平台；它们不是这两份 Wiki 的正文。副本不会自动跟随上游更新。

## 配图复制记录

{missing_text}

[查看图片来源与下载记录](mirror-image-manifest.json)。英文工作流原文有一条图片地址被换行拆开，本站修复了图片语法；旧图床无法取得的图片，使用同一上游文章中文版对应位置的配图恢复，并在页首和清单中注明。
'''


def build_one(slug, output):
    source = ROOT / 'wiki-sources' / slug
    snapshot = check_snapshot(source)
    original = yaml.load((source / 'mkdocs.yml').read_text(), Loader=NavigationLoader)
    stage = ROOT / 'build' / 'wiki-mirrors' / slug
    if stage.exists(): shutil.rmtree(stage)
    docs = stage / 'docs'
    shutil.copytree(source / 'docs', docs)
    shutil.copytree(ROOT / 'wiki-theme' / 'assets', docs / 'mirror-assets')
    asset_manifest = json.loads((ROOT / 'wiki-theme' / 'external-images' / 'manifest.json').read_text())
    image_folder = docs / 'mirror-assets' / 'imported'
    image_folder.mkdir()
    for asset in asset_manifest:
        if asset.get('file') and any(p.startswith(slug + '/') for p in asset['used_by']):
            shutil.copy2(ROOT / 'wiki-theme' / 'external-images' / asset['file'], image_folder / asset['file'])
    for file in docs.rglob('*.md'):
        text = file.read_text()
        if slug == 'cs-self-learning' and file.name == 'workflow.en.md':
            text = text.replace('2022/10\n\n/11', '2022/10/11')
            text = '> Mirror note: Images from the unavailable legacy host are restored from the corresponding illustrations in the upstream Chinese edition.\n\n' + text
        if slug == 'cs-self-learning' and file.name == 'CS学习规划.en.md':
            text = text.replace('## Customize Your Course Map', '## Customize Your Course Map {#yourmap}')
        if slug == 'cs-self-learning' and file.name == '信息检索.md':
            text = text.replace('[^ 1]:', '[^1]:')
        if slug == 'cs-self-learning' and file.name == 'roadmap.md':
            text = text.replace('./大语言模型/CMU15-779.en.md', 'https://csdiy.wiki/en/深度生成模型/大语言模型/CMU15-779/')
        for asset in asset_manifest:
            if asset.get('file') and asset['url'] in text:
                relative = posixpath.relpath('mirror-assets/imported/' + asset['file'], file.relative_to(docs).parent.as_posix())
                text = text.replace(asset['url'], relative)
        file.write_text(text)
    (docs / 'mirror-about.md').write_text(about_text(snapshot, slug, asset_manifest))
    (docs / 'mirror-missing.md').write_text('# 此链接在当前副本中没有对应页面\n\n原文包含了一个当前快照中不存在的 Wiki 路径。请使用本站的章节导航或搜索框查找相近主题。\n\n[返回本 Wiki 首页](index.md) · [查看复制说明](mirror-about.md)\n')
    (docs / 'mirror-image-manifest.json').write_text(json.dumps(asset_manifest, ensure_ascii=False, indent=2) + '\n')
    originals = docs / 'mirror-original'
    originals.mkdir()
    for name in ('README.md', 'README.en.md', 'LICENSE', 'CITATION.bib', 'snapshot.json', 'mkdocs.yml'):
        if (source / name).exists(): shutil.copy2(source / name, originals / name)
    # Keep README as a download, not an extra article with broken upstream-relative paths.
    for file in originals.glob('*.md'): file.rename(file.with_name(file.stem.replace('.', '-') + '-source.txt'))
    about = docs / 'mirror-about.md'
    about.write_text(about.read_text().replace('mirror-original/README.md)', 'mirror-original/README-source.txt)'))
    if slug == 'oi-wiki':
        for file in (ROOT / 'wiki-sources' / 'licenses').iterdir(): shutil.copy2(file, originals / file.name)
    plugins = [{'search': {'lang': ['zh', 'en']}}]
    if slug == 'cs-self-learning':
        language_config = next(p['i18n'] for p in original['plugins'] if isinstance(p, dict) and 'i18n' in p)
        plugins.insert(0, {'i18n': language_config})
    nav = original['nav'] + [{'本站副本说明': 'mirror-about.md'}]
    config = {
        'site_name': snapshot['name'],
        'site_url': f'https://jamlabq.github.io/LearnEverything/{slug}/',
        'site_description': f"{snapshot['name']} · LearnEverything 本站副本",
        'site_author': original.get('site_author', snapshot['name']),
        'docs_dir': str(docs), 'site_dir': str(output / slug),
        'use_directory_urls': True,
        'repo_url': snapshot['upstream'], 'repo_name': '上游项目', 'edit_uri': '',
        'copyright': f"{snapshot['name']} 原作者及贡献者 · {snapshot['license']}",
        'theme': {'name': 'material', 'language': 'zh', 'font': False,
                  'custom_dir': str(ROOT / 'wiki-theme' / 'overrides'),
                  'features': ['navigation.tabs', 'navigation.sections', 'navigation.top', 'search.highlight', 'search.suggest', 'content.code.copy'],
                  'palette': [{'scheme': 'default', 'primary': 'teal', 'accent': 'teal', 'toggle': {'icon': 'material/weather-night', 'name': '切换深色模式'}},
                              {'scheme': 'slate', 'primary': 'teal', 'accent': 'teal', 'toggle': {'icon': 'material/weather-sunny', 'name': '切换浅色模式'}}]},
        'nav': nav, 'plugins': plugins,
        'markdown_extensions': extensions(slug, source),
        'hooks': [str(ROOT / 'scripts' / 'wiki_hooks.py')],
        'extra_css': ['mirror-assets/mirror.css'],
        'extra_javascript': ['mirror-assets/math-config.js', 'mirror-assets/mathjax/tex-mml-chtml.js'],
        'extra': {**snapshot, 'mirror_slug': slug, 'learn_home': '../', 'generator': False},
        'validation': {'links': {'unrecognized_links': 'warn'}},
    }
    # The manifest belongs in the snapshot file; keep Jinja config lightweight.
    config['extra'].pop('files')
    config_file = stage / 'mkdocs.yml'
    config_file.write_text(yaml.dump(config, allow_unicode=True, sort_keys=False))
    build(load_config(config_file=str(config_file)))
    print(f"Built /{slug}/ from {snapshot['markdown_count']} pinned documents", flush=True)


def make_prefix_links_relative(output):
    # Material language selectors and 404 pages use the configured deployment
    # prefix. Relative links make the same artifact work at / and /LearnEverything/.
    from urllib.parse import unquote
    pattern = re.compile(r'(href|src)="/LearnEverything/([^"<>]*)"')
    for slug in SLUGS:
        for file in (output / slug).rglob('*.html'):
            current = file.parent.relative_to(output).as_posix()
            def replace(match):
                path = unquote(match[2])
                trailing = '/' if path.endswith('/') else ''
                return match[1] + '="' + posixpath.relpath(path, current) + trailing + '"'
            text = file.read_text()
            replaced = pattern.sub(replace, text)
            if text != replaced: file.write_text(replaced)


def main(output=None):
    output = Path(output or ROOT / '_site')
    for slug in SLUGS: build_one(slug, output)
    make_prefix_links_relative(output)


if __name__ == '__main__':
    main()
