# 十课验证记录

日期：2026-11-18。环境：本机 Vivado / XSim 2022.2，Linux；真实 Chrome / Playwright。

## 逻辑、HDL 与波形

- `node --test tests/*.test.mjs`：20 项通过。其中 13 项检查组合/时序模型，7 项逐事件对照真实 XSim VCD，共核对 9,940 个数值。包括同步复位、保持、回绕、流水线旧值与有效位、状态机非法恢复、PWM 相位及自动包络、分频边界。
- `python3 tests/export_waves_test.py`：通过。覆盖顶层作用域、多位二进制转十进制、未知值、同信号别名、同一时间的最终值以及 ps→ns 转换。
- `bash scripts/run_labs.sh all`：十课全部 PASS，各有非空 VCD / WDB。总日志 `build/final-labs-check.log`。审查补充状态机故障注入后，另跑 `08_fsm` 通过，见 `build/fsm-final-check.log`；网页数据已重新导出。
- 组合实验穷举：逻辑门全部输入、选择器 8 组、加法器 256 组。时序实验检查寄存器使能/边沿/复位优先、计数回绕与暂停、流水线填充/连续输入/气泡/清空、状态机保持/译码/非法恢复、PWM 0～16 全部门限/越界限幅/完整呼吸周期/暂停/复位、分频 H=4 与 H=1。
- 状态机测试用 `force/release` 注入编码 3，分别检查 tick=0 与 tick=1 都恢复 RED。模型波形对照在相同事件注入故障，再检查恢复，而不是把正常路径测试当作故障覆盖。
- 前三课保留浏览器端 36 个真实波形输出对照。

日志：`build/js-validation.log`，各课 `build/<课程>/compile.log`、`elaborate.log`、`simulate.log`。

## Vivado 工程与电路展开

十个教学工程均经 `create_project.tcl` 打开，完成行为仿真和 `synth_design -rtl`。可用 `scripts/validate_projects.tcl` 复核。日志：`build/project-validation.log`。

| 实验 | RTL cells | 顶层端口位数 |
| --- | ---: | ---: |
| 01_parallel | 3 | 5 |
| 02_gates | 4 | 6 |
| 03_mux | 1 | 4 |
| 04_adder | 2 | 18 |
| 05_register | 4 | 11 |
| 06_counter | 11 | 8 |
| 07_pipeline | 17 | 24 |
| 08_fsm | 9 | 8 |
| 09_pwm | 29 | 18 |
| 10_board | 9 | 3 |

这些是 RTL 展开对象数，不是最终 LUT/FF 资源用量。十次 RTL 展开均报告 0 Warnings / 0 Critical Warnings / 0 Errors。项目行为仿真入口每课有一条 `Vivado 12-13277`：可选的预编译库路径为空；本教程使用的设计和所需库仍正常编译、自检通过，没有编译或仿真错误。

已有工程在显式 PART 改变后会更新器件，并打印工程实际器件。已实际复核切换到另一已安装器件，再恢复原器件，见 `build/part-reopen-validation.log`。

先前已保存 WDB 离线加载检查成功：`xsim tutorial_sim.wdb` 可加载顶层信号并 `add_wave`，见 `build/wdb-validation.log`。文档以 `xsim tutorial_sim.wdb -gui` 打开相同数据库。原前三课还保留一次负向检查：隔离副本中故意把 OR 改成 XOR，自检和脚本均正确报错，见 `build/negative-check.log`。

## 网页与交付

`python3 tests/browser_check.py` 通过，日志 `build/browser-validation.log`：

- 十课全部面板、30 题答错反馈及答对完成、进度刷新保存、源码与压缩包下载、本地链接可达。
- 前三课开关组合、真值表、二进制位权与顺序示意；后七课加法进位、寄存器仅上升沿采样、计数回绕、流水线有效位、状态转移、PWM 端点/逐帧更新、H=1/4/8 分频与动态位宽。
- XSim / 手动波形切换、长记录各个显示窗口、总线十进制标签、流程步骤与频率公式；切面板后旧播放定时器清理。
- 桌面 1440px、375×812 竖屏、812×375 横屏，全部十课的所有面板无页面横向溢出。电路和波形在自身区域可横向滚动，保留可读尺寸。
- 无页面 JavaScript 异常。截图在 `build/screenshots/`。

独立审查覆盖教学准确性、HDL / 网页模型一致性和图示。发现并修正 H 改变后的总线位宽、FSM 非法恢复规则、已有工程显式 PART 三项问题，审查无遗留重要问题。

ZIP 完整性和解压后重新打包已检查。实验包包含十课网页、静态波形、HDL、脚本、测试及 README；不依赖原目录、Vivado 工程缓存或在线资源。

全部图示为内嵌 SVG。未使用 draw.io、外部图片、CDN 或网络字体。验证范围为行为仿真和 RTL 展开；不包括未知开发板的实际引脚、电压、布局布线时序、比特流下载及硬件运行。
