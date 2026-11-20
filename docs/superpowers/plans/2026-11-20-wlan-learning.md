# WLAN 学习导航实现计划

**Goal:** 交付可本地浏览并接入现有站点的视频与文字资源导航。

**Architecture:** `wlan/resources.js` 保存资源、阅读路线与概念；`wlan/app.js` 管理筛选、卡片和本地记录；`wlan/index.html` 与 `wlan/styles.css` 提供响应式布局。沿用现有静态构建器。

**Tech Stack:** HTML、CSS、JavaScript ES modules、Python、Playwright。

- [x] 搜索与阅读来源，保存 `wlan/SOURCES.md`；为每个原始视频保留直达或明确标注的搜索链接。
- [x] 创建 `wlan/tests/browser_check.py`，先验证缺失页面导致失败；覆盖资源检索、媒体和主题筛选、阅读标记/收藏持久化、移动布局、子目录部署。
- [x] 实现资料数据和中文导读，确保文字资源按章节划分，路线中的引用均能定位资源。
- [x] 实现页面、样式与交互，增加无结果恢复、键盘焦点、减少动画和本地存储降级。
- [x] 在根 `index.html`、`README.md` 添加 WLAN 入口，新增 `wlan/README.md`。
- [x] 执行 `python3 wlan/tests/browser_check.py` 和 `python3 scripts/build_pages.py`，检查桌面及手机截图，核对所有入口与 `git diff --check`。

测试重点是学习者实际浏览流程，无需为静态文案或 CSS 逐项添加镜像单测。研究和页面实现由当前会话连续完成。

验证结果：39 份资料（18 组视频、21 篇文字选读），浏览器脚本错误 0；320/375/768/844 像素视口无横向溢出。所有本地链接、配套资源引用、路线引用和概念引用检查通过。24 个不同文字来源地址均已访问核对，其中 Bootlin PDF 单独下载解析。视频无法确认直达 ID 的保留为标注清楚的搜索入口。
