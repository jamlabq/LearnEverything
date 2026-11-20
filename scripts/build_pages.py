#!/usr/bin/env python3
"""构建教程合集：收集静态课程，并从本地源文件生成 Wiki 副本。"""
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / '_site'
EXCLUDED = shutil.ignore_patterns('.git', '.Xil', 'build', 'node_modules', '__pycache__', '*.pyc', '*.log', '*.jou')


def main():
    if OUTPUT.exists():
        shutil.rmtree(OUTPUT)
    OUTPUT.mkdir()
    shutil.copy2(ROOT / 'index.html', OUTPUT / 'index.html')
    (OUTPUT / '.nojekyll').touch()
    courses = sorted(folder for folder in ROOT.iterdir()
                     if folder.is_dir() and not folder.name.startswith(('.', '_'))
                     and (folder / 'index.html').is_file())
    for folder in courses:
        shutil.copytree(folder, OUTPUT / folder.name, ignore=EXCLUDED)
        print(f'Published /{folder.name}/')
    if not courses:
        raise SystemExit('没有找到包含 index.html 的教程目录')
    from build_wikis import main as build_wikis
    build_wikis(OUTPUT)
    print(f'静态站点已生成：{OUTPUT}')


if __name__ == '__main__':
    main()
