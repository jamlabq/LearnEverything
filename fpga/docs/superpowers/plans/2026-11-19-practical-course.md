# FPGA 实践篇实施计划

**Goal:** 扩展至20课，使读者从理解元件走到能写测试台并组合一个带缓冲的UART回显系统。
**Architecture:** 新增practice内容/纯模型/内嵌SVG模块，保持原课号、基础代码与独立静态部署。所有时序契约见同日spec。
**Tech Stack:** 原生HTML/CSS/JS、SVG、Verilog/SystemVerilog、Vivado/XSim 2022.2、Python、Playwright。

- [x] 基线：隔离worktree，检查20项旧模型测试与仓库noreply身份。
- [x] HDL任务：仅新增labs/11_variables至20_project的design.v/tb.sv，先tb与占位实现观察失败，再实现。覆盖spec的各条边界，自运行xvlog/xelab/xsim，记录PASS/VCD/WDB；禁止改公共工具。
- [x] 内容任务：仅src/content-practice.js，10课完整对象、每课3题、CPU映射/时序/协议/自检、每课3个递进练习及最终独立验收。HTML预留data-practice-diagram课号，图由主任务填入。
- [x] 模型任务：tests/practice-logic.test.mjs先检查条件优先、ALU边界、快照/8拍、模块旧tick、同步/消抖、移位、RAM未知/读优先、FIFO四边界、UART帧/忙时、综合回显，再实现src/practice-logic.mjs。
- [x] 交互任务：src/practice-simulators.js共享控件但每课专用数据路径/存储/协议SVG；时钟操作、预设场景、成帧发送/自动步进、边沿/事务记录、清晰输入输出契约。接app.js/content.js/index.html，导航分组，课程数动态化。
- [x] 验证任务：用实际VCD逐事件对照新模型；更新run_labs/export_waves/create_project/validate_projects，全部20课真实仿真，新增10课Vivado工程仿真+RTL展开。
- [x] 浏览器：关键交互、20课全部面板/60题、真实波形/下载、手机横竖屏、课程切换清理定时器、Pages路径前缀；保留旧10课完整回归。
- [x] 独立审查：先契约与教学范围，再代码/时序/接口；解决重要问题后复核。
- [ ] 交付：README、验证记录、下载ZIP、合集首页更新20课；本地构建，noreply提交，合并main并push，检查Actions与真实线上行为。
