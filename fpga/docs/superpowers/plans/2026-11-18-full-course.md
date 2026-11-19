# FPGA 全十课 Implementation Plan

> 用户已授权完成全部十课。在当前工作目录实施；按独立职责并行，禁止多个任务修改同一文件。

**Goal:** 将已验证的三课教程扩展成全部十课，提供真实XSim实验、交互图解、代码说明和练习。

**Architecture:** 课程数据追加至独立content-advanced.js；时序纯模型在advanced-logic.mjs，渲染和控制在advanced-simulators.js。公共应用、波形和工具脚本支持可变课程数与多位信号。

**Tech Stack:** 原生HTML/CSS/JS、内嵌SVG、Verilog/SystemVerilog、XSim/Vivado 2022.2、Python、Playwright。

## Task 1 — 七课 HDL 实验（独立文件）

- [x] 在labs/04_adder至10_board各编写自检tb.sv，再实现design.v；契约见设计文档。
- [x] adder穷举256组；register检查边沿/使能/复位；counter检查回卷和暂停；pipeline检查有效位、气泡与旧值；FSM检查保持/转换/复位；PWM检查0..16占空比与完整呼吸周期；board检查分频及HALF_PERIOD=1。
- [x] 使用本机xvlog/xelab/xsim验证，输出PASS及VCD/WDB，写明证据。

## Task 2 — 七课完整教学内容（content-advanced.js）

- [x] 按已批准的界面字段提供7个课程对象，id=4..10；可直接由app组合。
- [x] 每课含互动操作引导、3块原理讲解、代码说明、修改练习、3题带解析测验。
- [x] 说明非阻塞赋值、周期与延迟、valid对齐、同步复位、PWM边界和硬件约束，避免仿真/上板混淆。

## Task 3 — 时序与多位交互（主任务）

- [x] tests/advanced-logic.test.mjs先定义穷举加法、寄存器边沿、回卷、流水线、FSM、PWM和分频行为，观察失败，再实现src/advanced-logic.mjs。
- [x] src/advanced-simulators.js提供SVG数据路径、二值/数值输入、时钟高低、一步周期、连续播放与复位；真实模型驱动图和波形。
- [x] src/waveform.js支持多位总线数值，单位与未知值明确。
- [x] app.js/index.html整合10课，替换固定3与课号补零；课程及面板切换清除播放定时器。

## Task 4 — 工具、文档、验收（主任务）

- [x] run_labs.sh/create_project.tcl支持所有课程；导出器读取顶层多位信号并排除测试循环变量。
- [x] 运行十课XSim及Vivado展开检查；实际VCD与模型对照。
- [x] 扩展浏览器验证覆盖10课、30题、所有面板、多位和时序关键行为，检查375px及横屏。
- [x] 更新README、下载包、验证记录；独立审查并解决重要问题。

命令：node --test tests/*.test.mjs；bash scripts/run_labs.sh all；python3 scripts/export_waves.py；python3 tests/browser_check.py。
