# 电路之间 · FPGA 互动入门

面向没有 FPGA、数字电路和 Verilog 经验的读者，完整提供十课。每课都有互动电路、内嵌 SVG 图解、波形、逐行代码说明、Vivado 实验、修改练习和三道带解析的挑战。基础学习不需要开发板。

| 课程 | 直观看到什么 | 实验目录 / 设计顶层 |
| --- | --- | --- |
| 01 认识 FPGA | 同一组输入，三条电路并行工作 | `01_parallel` / `parallel_demo` |
| 02 二进制与逻辑门 | 位权、AND / OR / XOR / NOT 与真值表 | `02_gates` / `gates_demo` |
| 03 选择器 | 控制线选择哪一路数据 | `03_mux` / `mux_demo` |
| 04 加法器与位宽 | 完整结果、低四位、进位 | `04_adder` / `adder_demo` |
| 05 时钟与寄存器 | 上升沿采样、同步复位、使能保持 | `05_register` / `register_demo` |
| 06 计数器 | 反馈、15→0 回绕、单周期提示 | `06_counter` / `counter_demo` |
| 07 并行与流水线 | 两级数据流、旧值、有效位与气泡 | `07_pipeline` / `pipeline_demo` |
| 08 有限状态机 | 状态保存、条件转移、输出译码 | `08_fsm` / `fsm_demo` |
| 09 PWM 与呼吸灯 | 0%～100% 占空比、逐帧升降 | `09_pwm` / `pwm_demo` |
| 10 从仿真到开发板 | 参数分频、频率换算、约束与工具流程 | `10_board` / `board_demo` |

在线学习：[FPGA 互动教程](https://jamlabq.github.io/LearnEverything/fpga/)。仓库中从 `fpga/` 目录执行下列命令；下载实验包则从解压目录执行。

## 打开教程

```bash
bash scripts/start.sh
```

打开 **http://localhost:8000**。也可用 `bash scripts/start.sh 8080` 选择其他端口。按 Ctrl+C 停止服务。网页采用 JavaScript ES modules，需要本地 HTTP 服务，请不要直接双击 `index.html`。

只需要 Python 3 和浏览器；无外部字体、CDN、图片服务或前端框架依赖。所有图形均为网页内嵌 SVG，没有使用 draw.io。下载包解压后也能独立启动；第一次启动时会自动生成可再次下载的实验包，无需先运行 Vivado。

建议按“动手实验 → 原理图解 → Verilog 与仿真 → 课后挑战”的顺序学习。第五课起，初始画面表示已经复位，RST 默认是 1；先把 RST 置 0，再走时钟。可以单独切换时钟高低、走完整周期或连续慢放，最近的上升沿结果会列在表格中。输入变化与下降沿不会更新同步寄存器。

## 使用本机 Vivado / XSim

已实际使用本机 **Vivado / XSim 2022.2**，安装目录为 `/opt/Xilinx/Vivado/2022.2`。XSim 是 Vivado 自带的仿真器，包含 `xvlog`、`xelab`、`xsim`；十个实验都可在电脑上运行。

运行全部实验，或用表中的目录名单独运行一课：

```bash
bash scripts/run_labs.sh all
bash scripts/run_labs.sh 05_register
bash scripts/run_labs.sh 09_pwm
```

`labs/<课程>/design.v` 是可综合的电路，`tb.sv` 是只供仿真的自检测试台。成功时打印 `PASS`。脚本同时检查错误日志、PASS 标记与 VCD，避免只凭 XSim 的退出码误判。覆盖范围包括全部逻辑门输入、选择器 8 组输入、加法 256 组输入，以及寄存器边沿、计数回绕、流水线气泡、状态机非法状态恢复、PWM 端点及完整呼吸周期、分频 H=1 边界。

每课生成于 `build/<课程>/`：

- `signals.vcd`：可交换的波形记录；
- `tutorial_sim.wdb`：XSim 原生波形数据库；
- `compile.log`、`elaborate.log`、`simulate.log`：工具日志。

其他 Vivado 安装目录可这样指定：

```bash
VIVADO_SETTINGS=/你的安装目录/settings64.sh bash scripts/run_labs.sh all
```

### 用 XSim 查看保存的波形

先运行实验，再从项目根目录执行：

```bash
source /opt/Xilinx/Vivado/2022.2/settings64.sh
cd build/05_register
xsim tutorial_sim.wdb -gui
```

在 **Scopes** 中选 `tb`，在 **Objects** 选信号，右键 **Add to Wave Window**，再 **Zoom Fit**。多位信号右键选择 **Radix → Unsigned Decimal**，需要逐位看时换成 Binary。WDB 已记录所有信号，初始窗口为空时手动添加即可。其他课程只需替换目录名。

### 用 Vivado 查看电路结构

在项目根目录运行：

```bash
source /opt/Xilinx/Vivado/2022.2/settings64.sh
vivado -mode gui -source scripts/create_project.tcl -tclargs 05_register
```

课程名可替换为表中的任意实验。工程保存于 `build/vivado_<课程>/`，再次运行会打开已有工程。

- 行为仿真：**Simulation → Run Simulation → Run Behavioral Simulation**。
- RTL 展开电路：**RTL Analysis → Open Elaborated Design → Schematic**。
- 仿真顶层始终为 `tb`；综合顶层是表中对应设计模块。

脚本优先选择已安装的 `xc7a35tcpg236-1`，否则选本地可用器件，并打印工程实际器件型号。它仅用于教学，不能据此认定开发板型号。确认完整型号且安装支持后，可以用 `PART=实际器件型号 vivado ...` 指定；打开已有工程时，显式 PART 也会更新工程器件。

批量复核十课工程的行为仿真和 RTL 展开：

```bash
source /opt/Xilinx/Vivado/2022.2/settings64.sh
vivado -mode batch -nojournal -nolog -source scripts/validate_projects.tcl
```

## 波形和时序的读法

**手动操作记录**由网页的教学模型生成，保存最近 64 次输入或时钟操作，横轴是操作序号。多位总线用十进制标值。切课、切面板或复位后重开实验；修改第十课 H 相当于重新选择综合参数，也会清除该次记录。

**XSim 实测波形**来自实际运行 testbench 得到的 VCD，横轴为 ns，是固定记录，不随网页开关变化。多位信号保留位宽，X/Z 用不同颜色标识未知/高阻。较长的记录可切换推荐片段、开头/结尾 160 ns 或完整记录。第九课推荐片段展示静态 50% 占空比；要看呼吸包络，请选完整记录或在 XSim 缩放。

前四课为组合逻辑。测试台中每组输入保持 10 ns，这不是逻辑门的计算时间。第五课起测试时钟为 10 ns 周期，检查在上升沿后的非阻塞更新完成后进行。行为仿真不包含器件布线传播延迟，不能用来证明真实板卡的最高频率。

第七课首组输入在第一个上升沿进入一级，在第二个上升沿到达输出：经过两个寄存器级，从首次采样边沿到输出边沿相隔一个周期。填满后每拍可输出一组，只有 `valid_out=1` 时数据才作为有效结果。

第九课 phase 和自动电平同步复位，但 PWM 输出还受 `!rst` 组合屏蔽，RST 拉高会立即关断 PWM；不要把这一步与寄存器同步清零混淆。静态门限若在帧内修改，该帧不再代表固定占空比。

第十课完整 LED 频率为 `f_clk/(2H)`；默认 H=4 只为方便仿真。真实 50 MHz 时钟要用 H=25,000,000 才能得到 1 Hz 完整亮灭周期。课程提供板卡资料、引脚、电压、XDC、综合、实现、时序、比特流、Hardware Manager 的核对流程。尚未指定真实开发板，因此未填写引脚、未生成板卡配置文件、未进行硬件下载验证。

## 更新与验证

修改 HDL 并重新运行实验后，更新网页的真实波形、源码与下载包：

```bash
python3 scripts/export_waves.py
```

导出器面向本教程：读取 `tb` 顶层标量和总线，排除测试计分变量，保留未知值；不是通用 VCD 查看器。`src/lab-data.js` 已携带通过验证的记录和源码，普通读者无需先安装 Vivado。下载包 `assets/fpga-labs.zip` 包含完整十课网页、HDL、测试和脚本；不包含生成的 Vivado 工程及 WDB，可用实验脚本重新生成。

```bash
node --test tests/*.test.mjs
python3 tests/export_waves_test.py
bash scripts/run_labs.sh all
python3 scripts/export_waves.py
python3 tests/browser_check.py
```

模型测试会逐事件对照实际 XSim VCD，检查每课输出以及状态机故障注入后的恢复。浏览器测试使用 Python Playwright 和本机 Chrome，覆盖十课关键操作、30 道挑战、学习进度、全部面板、下载链接，以及手机横竖屏布局。截图保存到 `build/screenshots/`；网页本身不依赖这些测试工具。

内容入口：`src/content.js`（1～3课）、`src/content-advanced.js`（4～10课）。互动电路在 `src/simulators.js` 和 `src/advanced-simulators.js`；纯逻辑模型在两个 `logic` 文件中，样式在 `assets/style.css`。

学习进度仅存于浏览器本地，无账号和上传。浏览器禁止存储时仍可学习，当前记录在内存中保留。
