# Wiki 副本实现计划

**Goal:** 在 LearnEverything 内直接阅读 OI Wiki 与 CS 自学指南的完整仓库内容。

**Architecture:** `wiki-sources/` 保存固定提交的原始 docs、导航和许可；`wiki-theme/` 提供本站页头、署名和本地数学渲染；`scripts/build_wikis.py`、`wiki_hooks.py` 与 `wiki_links.py` 负责构建时适配与校验，`scripts/build_pages.py` 合并现有教程和两套 MkDocs 输出。

**Tech Stack:** Python、MkDocs Material、mkdocs-static-i18n、Pymdown Extensions、MathJax、Playwright。

- [x] 保存两个源内容快照和许可证、上游提交及 SHA256 文件清单。
- [x] 下载本地公式脚本及必要字体，收集远程插图并记录结果。
- [x] 先写链接改写与源码完整性测试，确认缺失功能失败。
- [x] 实现配置生成、临时源目录、相对/绝对内部链接适配、静态资源本地化和来源署名。
- [x] 将两个站点构建整合进 build_pages.py、CI 与总首页，更新 README。
- [x] 扫描全部生成文章的本地链接，验证所有原始 Markdown 都有输出。
- [x] 用真实浏览器验证离线正文/公式/代码、搜索、中英文切换、返回首页与手机导航，检查截图。
- [x] 完成独立代码审查，记录构建输出大小和明确的外部资源限制。

发布配置应可使用 `python3 -m pip install -r requirements-wikis.txt` 后运行 `python3 scripts/build_pages.py`，无须在构建时访问上游 Wiki。源码与脚本变更全部保持本地，供用户查看。

## 验证结果（2026-11-20）

- `.venv/bin/python scripts/build_pages.py` 成功。整个 `_site/` 约 277 MB；导入原始文件约 62 MB，主题/公式/补存图片约 29 MB。
- `.venv/bin/python -m unittest discover -s scripts/tests -v`：5 项链接转换测试通过，覆盖跨 Wiki、中文编码、旧路径、中英文和子目录部署。
- `.venv/bin/python scripts/check_wikis.py`：所有 735 个原始 Markdown 有输出；745 个 HTML 页的本地链接、资源、正文锚点均通过；无远程嵌入资源、无遗留原 Wiki 正文跳转。复制文件和图片哈希通过。
- 与本次克隆的固定版本逐文件比较：OI docs 全部 3,128 个文件、CS docs 全部 276 个文件字节一致。
- `python3 scripts/tests/browser_wikis.py`：在阻断外网的浏览器中验证中文搜索、英文页、文章原始版本、15 张工作流配图、线段树公式和代码、返回总首页、390 px 手机导航。外部请求、HTTP 失败、JS 异常均为 0。
- 使用 `/LearnEverything/` 前缀的同一浏览器套件通过，确认 Pages 子目录部署兼容。截图和报告在被忽略的 `build/wiki-browser/`。
- 独立只读审查无待处理的重要问题。修复了审查发现的上游两处锚点/脚注错误；原始文件未改动。HTML 检查增加正文锚点验证。
- 原文英文工作流的旧图床不可用，采用同一上游文章中文版对应插图恢复，并记录替换来源。没有复制引用的第三方大学课程、视频或书籍本体。
- 变更保留本地，未提交、推送或部署。
