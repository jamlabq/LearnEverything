# LearnEverything

用互动图解、动手实验和真实代码，记录从零开始的学习。每门教程放在独立目录，使用同一个 GitHub Pages 站点发布。

- 教程总入口：**https://jamlabq.github.io/LearnEverything/**
- FPGA 教程：**https://jamlabq.github.io/LearnEverything/fpga/**
- FPGA 寄存器实验示例：**https://jamlabq.github.io/LearnEverything/fpga/#lesson-5**
- 英语实战手册：**https://jamlabq.github.io/LearnEverything/english/**
- WLAN 学习导航：**https://jamlabq.github.io/LearnEverything/wlan/**
- OI Wiki 本站副本：**https://jamlabq.github.io/LearnEverything/oi-wiki/**
- CS 自学指南本站副本：**https://jamlabq.github.io/LearnEverything/cs-self-learning/**

上面的地址会在 GitHub Pages 启用且部署成功后生效。

## 教程目录

| 教程 | 内容 | 源码与实验 |
| --- | --- | --- |
| [电路之间 · FPGA 互动入门](https://jamlabq.github.io/LearnEverything/fpga/) | 面向 C/Java 程序员：四阶段、20 个实验与 2 个配套案例，从电路直觉到 UART 回显；含互动图解、60 道挑战与 Vivado/XSim 自检 | [fpga/README.md](fpga/README.md) |
| [把英语用起来 · 45 篇实战学习手册](https://jamlabq.github.io/LearnEverything/english/) | 多主题 45 单元，含 25 篇 18～25 分钟完整长篇；B 站 / YouTube 直达、影视分步精听、五步训练与本地记录 | [english/README.md](english/README.md) |
| [无线之间 · WLAN 学习导航](https://jamlabq.github.io/LearnEverything/wlan/) | 18 组视频、21 篇文字选读、五阶段路线；从 Linux 数据包到 OFDM 与射频，含阅读指引、概念速查与本地记录 | [wlan/README.md](wlan/README.md) |
| [OI Wiki 本站副本](https://jamlabq.github.io/LearnEverything/oi-wiki/) | 465 篇算法、数据结构与竞赛文章；本地公式、配图、代码和搜索 | [来源与许可](wiki-sources/README.md) |
| [CS 自学指南本站副本](https://jamlabq.github.io/LearnEverything/cs-self-learning/) | 270 个中英文文档；完整学习规划、课程介绍与章节导航 | [来源与许可](wiki-sources/README.md) |

## 目录与 URL 约定

```text
LearnEverything/
├── index.html                 # 所有教程的入口
├── english/                   # 英语资源、训练方法与学习记录
├── wlan/                      # WLAN 视频、文字选读与概念导航
├── fpga/                      # FPGA 教程、源码和实验
│   ├── index.html
│   ├── src/
│   ├── assets/
│   ├── labs/
│   ├── workshops/
│   └── scripts/
├── wiki-sources/              # 两个 Wiki 的固定版本原始正文、图片、代码与许可
├── wiki-theme/                # 副本页面主题、本地公式引擎与补存的外部配图
├── requirements-wikis.txt     # 固定版本的 Wiki 构建依赖
├── scripts/build_wikis.py     # 从本地源文件生成两个 Wiki
├── scripts/build_pages.py     # 收集静态教程并构建 Wiki 副本
└── .github/workflows/pages.yml
```

建议课程目录用短小、稳定的小写英文名，多个单词用短横线，例如 `fpga/`、`linux/`、`python/`、`computer-networks/`。后面三项只是命名示例，尚未提供相应课程。

公开 URL 使用 `https://jamlabq.github.io/LearnEverything/<课程名>/`。保留仓库名 `LearnEverything` 的大小写；课程目录后保留 `/`，确保相对资源路径正确。目录名不加日期、序号或版本，展示标题可以自由调整。课程内部的小节可用锚点；FPGA 学习路线为 `#start`，稳定实验锚点为 `#lesson-1` 到 `#lesson-20`。

这个结构适合在一个仓库持续添加教程。独立子域名或每门教程一个仓库会增加管理工作，目前没有必要。以后若绑定自定义域名，可保留每门教程的路径结构。

## 首次启用 GitHub Pages

1. 打开仓库 [Settings → Pages](https://github.com/jamlabq/LearnEverything/settings/pages)。
2. 在 **Build and deployment → Source** 选择 **GitHub Actions**。
3. 打开 [Actions → Publish tutorials to GitHub Pages](https://github.com/jamlabq/LearnEverything/actions/workflows/pages.yml)，点击 **Run workflow**，选择 `main`。
4. 等 `deploy` 成功后访问上面的地址。

之后每次向 `main` 推送，都会自动构建并部署。尚未开启 Pages 时，工作流会构建、上传站点文件并提示设置步骤，跳过部署。构建和发布不需要 Vivado：教程自带已验证的真实仿真记录。

仅有 Git SSH 权限不能修改 Pages 设置；首次启用需要仓库管理员在网页操作，或使用具有相应管理权限的 GitHub API 凭据。

## 本地预览

在仓库根目录执行：

```bash
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements-wikis.txt
.venv/bin/python scripts/build_pages.py
.venv/bin/python scripts/check_wikis.py
python3 -m http.server 8000 --bind 127.0.0.1 --directory _site
```

打开 `http://localhost:8000/` 查看总入口，`http://localhost:8000/english/` 查看英语实战手册，`http://localhost:8000/fpga/` 查看 FPGA 教程。也可以进入 `fpga/`，用 `bash scripts/start.sh` 单独运行教程。实际 Vivado 实验的命令都在 `fpga/` 或解压后的实验包目录中执行。

WLAN 学习导航位于 `http://localhost:8000/wlan/`；支持视频/文字、主题与语言筛选，收藏和已学记录仅保存在当前浏览器。

两个 Wiki 可在 `http://localhost:8000/oi-wiki/` 和 `http://localhost:8000/cs-self-learning/` 直接阅读。它们是本仓库保存的正文副本，构建时不需要访问上游仓库，浏览文章、搜索与显示公式不需要请求原站。首次安装构建依赖需要网络。复制版本、署名、许可和原文已知问题见 [wiki-sources/README.md](wiki-sources/README.md)。

## 添加下一门教程

1. 在根目录创建稳定的课程名目录，并提供该目录的 `index.html`。
2. 将相关资源、代码、实验和 README 放在课程目录内，使用相对路径引用。
3. 在根目录 `index.html` 和本文件的目录表中添加课程入口。
4. 本地构建预览后推送到 `main`，发布脚本会自动发现新课程。

发布器收集静态 HTML/CSS/JS 教程，并使用 MkDocs Material 编译两个 Wiki 副本。未来若有其他需要编译的前端项目，应添加对应构建步骤。

各课 `build/`、Vivado 缓存、日志、`node_modules/` 不提交，也不发布。FPGA 的可下载实验 ZIP 与网页静态仿真数据保留在仓库中，浏览器无需安装 Vivado。
