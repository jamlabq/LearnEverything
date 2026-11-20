# 无线之间 · WLAN 学习导航

从 Linux 数据包到天线，结合视频与篇幅可控的文字选读，理解 WLAN 的宏观架构、关键概念和收发流程。

## 内容

- 18 组视频：完整覆盖原始推荐清单，系列的指定子标题写在观看重点中。
- 21 篇文字选读：ShareTechnote、Linux Wireless、Bootlin、PySDR 中文章节、DSP Illustrations、openwifi、GNU Radio 与 Wireshark。
- 五阶段推荐路线、六步交互式数据旅程、16 组概念速查。
- 每项包含重点、停止位置、理解问题、配套视频/文字和来源说明。
- 搜索、类型/主题/语言筛选、核心推荐、收藏与已学标记。

资料没有要求通读 IEEE 标准或整本教材。阅读时间是建议安排，视频时长和字幕没有未经核实的承诺。

## 来源

[SOURCES.md](SOURCES.md) 是完整的链接与选读清单，并记录搜索、核验结果和已修正的来源问题。它也可在不执行 JavaScript 的环境中阅读。

来源优先级：作者与项目官方目录、官方文档、标题与频道匹配的平台结果、最后为明确标注的搜索入口。部分 B站和 YouTube 条目无法确认直达地址，页面会标为搜索，不会使用猜测的 BV/视频 ID。HTTP 可访问不等于逐分钟观看或保证日后可播放。

## 本地使用

在仓库根目录执行：

```bash
python3 scripts/build_pages.py
python3 -m http.server 8000 --bind 127.0.0.1 --directory _site
```

访问 `http://localhost:8000/wlan/`。静态站点兼容 GitHub Pages 的 `/LearnEverything/wlan/` 子路径；无需 npm 构建或服务端。ES modules 需通过 HTTP 访问，直接双击 HTML 的 `file://` 模式可能被浏览器限制。

学习记录使用 localStorage 的 `wlan-guide-v1` 键，不上传，也不跨设备同步。隐私模式或存储被阻止时，页面会提示记录仅在本次浏览保留。

## 文件

| 文件 | 作用 |
| --- | --- |
| `resources.js` | 视频和文字资源、入口、来源说明与选读范围 |
| `guide.js` | 五阶段路线、数据流程、概念解释 |
| `app.js` | 渲染、筛选、深链接和本地记录 |
| `index.html` / `styles.css` | 页面结构和响应式样式 |
| `tests/browser_check.py` | 真实浏览器学习路径验证 |

修改资料时保持资源 ID 稳定，以保留深链接和用户记录。更新资料数量时同步首页、页面静态占位文本、元描述与本文。来源条目应重新检查作者、标题和实际落地页面，避免 HTTP 200 但返回首页的假成功。

## 验证

环境需安装 Python Playwright，默认使用 `/opt/google/chrome/chrome`：

```bash
python3 scripts/build_pages.py
python3 wlan/tests/browser_check.py
git diff --check
```

验证站点子目录访问、筛选组合、无结果恢复、收藏与已学刷新保留、损坏/受限存储、键盘展开、移动端和横屏布局。截图写入被 Git 忽略的 `wlan/build/`。
