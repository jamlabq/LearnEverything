# LearnEverything 中的 Wiki 副本

正文已复制进本仓库，不是 iframe，也不是将目录链接到原站。构建后可从总首页进入 `/oi-wiki/` 与 `/cs-self-learning/`，直接阅读、切换章节和搜索。

| 内容 | 上游与固定版本 | 原始 Markdown 数量 | 许可 |
| --- | --- | --- | --- |
| OI Wiki | [OI-wiki/OI-wiki](https://github.com/OI-wiki/OI-wiki/tree/f80d6d6f780ced1c216c71ad96cabaea9308a62c) | 465 | 除代码和特别注明部分外，CC BY-SA 4.0 + SATA；详见原文 |
| CS 自学指南 | [pkuflyingpig/cs-self-learning](https://github.com/pkuflyingpig/cs-self-learning/tree/2c591834a1e4101e2e7579dc7f49bdeb4a6153a2) | 270（包括中文与英文） | 贡献者创作部分 MIT；第三方资料保留原有权利 |

复制日期：2026-11-20。感谢 OI Wiki Team、PKUFlyingPig / Yinmin Zhong，以及两项目的所有作者和贡献者。OI Wiki 页面中的 `author`、`copyright` 元数据与原文特别声明都已保留，页面底部可展开署名。内容不适用本仓库其他教程可能采用的许可证。

- [OI Wiki 原始 README / 版权声明](oi-wiki/README.md)
- [CC BY-SA 4.0 全文](licenses/CC-BY-SA-4.0.txt)，[官方来源](https://creativecommons.org/licenses/by-sa/4.0/legalcode.txt)
- [SATA 许可全文](licenses/SATA.txt)，[上游来源](https://github.com/zTrix/sata-license/blob/master/LICENSE.txt)。请按上游说明为原项目 Star 并感谢作者。
- [CS 自学指南原始 README](cs-self-learning/README.md) 与 [MIT 许可](cs-self-learning/LICENSE)

## 原始内容和构建适配

`<项目>/docs/` 完整保存了上游 docs 目录的全部文件，包括正文、插图、代码片段。`snapshot.json` 记录版本、源地址和每个复制文件的 SHA-256。构建会先校验文件，防止遗漏或意外覆盖原文；不访问上游，也不执行原仓库的构建脚本。

`scripts/build_wikis.py` 在被忽略的 `build/wiki-mirrors/` 内制作副本，使用共用 Material 主题输出到 `_site/`。适配包括：

- 保留原导航、代码高亮、可展开提示、选项卡、脚注与公式；保留 CS 自学指南的语言切换。
- 将指向 `oi-wiki.org`、`csdiy.wiki` 的文章链接改为本站的相对路径，兼容 GitHub Pages 的 `/LearnEverything/` 前缀。
- 保留原始源版本链接、署名、许可，并增加返回 LearnEverything 的入口。
- 自带 MathJax 3.2.2（Apache-2.0，包含完整字体和扩展）和本地搜索资源；不加载原站评论、统计和反馈服务。
- 下载正文引用的外部配图到 `wiki-theme/external-images/`，记录原 URL、所在页面和文件哈希；原始 Markdown 不改动。
- 对上游已不存在的站内路径，优先使用唯一匹配的同名文章；若无法找到，进入明确说明缺失的本站页面，不冒充有对应内容。

源码、主题和配图共同提交，生成的 `_site/` 不提交。首次构建需按根 README 安装固定版本 Python 依赖。页面内的课程、视频、书籍、作业平台及贡献操作仍保留第三方地址；没有复制这些第三方服务的全部内容。

## 原文已知问题

CS 自学指南英文 `docs/必学工具/workflow.en.md` 有一条图片地址被空行拆开，且旧图床无法取得。本站修复了分裂的图片语法，并用同一文章中文版对应位置的配图恢复旧图床图片；页首和图片清单均标明替换来源。原文件保持原样。外部配图的复制状态见 [图片来源清单](../wiki-theme/external-images/manifest.json)。

另外修复了两处上游页面内跳转：英文学习规划的 `#yourmap` 段落锚点，以及中文信息检索文中 `[^1]` 与 `[^ 1]` 不一致的脚注编号。深度生成模型路线图的显式英文 Markdown 链接也改为本站对应英文页。以上改动仅发生在构建暂存目录。

## 验证与后续更新

```bash
.venv/bin/python scripts/build_pages.py
.venv/bin/python -m unittest discover -s scripts/tests -v
.venv/bin/python scripts/check_wikis.py
```

副本不自动更新。更新时需获取明确的上游版本，整体替换对应 `docs/` 与原始说明文件，重新生成 `snapshot.json` 校验记录，检查许可变化、补存新增图片，再构建并验证。不要在 `wiki-sources/<项目>/docs/` 中直接混入本站界面修改。
