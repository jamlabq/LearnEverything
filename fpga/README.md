# 电路之间 · FPGA 互动入门

面向会写 C/Java、没有 FPGA、数字电路和 Verilog 经验的读者。20 个实验按先修关系组织成四阶段：先理解代码如何成为电路，再迁移变量、条件、循环和模块的经验，最后逐步搭建小系统。每课包含明确目标、程序员视角、互动电路、内嵌 SVG、波形、Vivado 实验和分步练习；学习不需要开发板。

从[学习路线](https://jamlabq.github.io/LearnEverything/fpga/#start)进入。推荐顺序如下，数字是稳定的**实验编号**，不是左侧路线的步数：

1. 建立电路直觉：01 → 02 → 03 → 04 → 05。
2. 迁移编程经验：11 → 06 → 14 → 13 → 07 → 12。
3. 做出一个小系统：15 → 08 → 09 → 16。
4. 存储与串口项目：17 → 18 → 19 → 20 → 10。

先学“变量与条件”“模块与接口”，再看流水线；上板流程放到最后。每课按“运行并解释 → 改一个条件 → 补一小段 → 独立实现”递进。实验编号、目录、旧链接和浏览器学习记录保持兼容。

| 实验编号与主题 | 直观看到什么 | 实验目录 / 设计顶层 |
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
| 11 变量与条件 | 寄存器保存、优先级、加减回绕 | `11_variables` / `variables_demo` |
| 12 八位 ALU | 八种运算、进位与借位、完整组合赋值 | `12_alu` / `alu_demo` |
| 13 循环与多拍计算 | 组合展开和八拍迭代统计 1 的个数 | `13_popcount` / `popcount_demo` |
| 14 模块与接口 | 定时器与计数器同拍读取旧值 | `14_modules` / `modules_demo` |
| 15 同步与消抖 | 两级同步、连续样本确认、单拍事件 | `15_debounce` / `debounce_demo` |
| 16 移位寄存器 | 串并转换、装入优先、沿前移出位 | `16_shift` / `shift_demo` |
| 17 小型 RAM | 未写未知值、同步读取、读旧值策略 | `17_memory` / `memory_demo` |
| 18 FIFO | 有限容量、请求接受条件、满空同时读写 | `18_fifo` / `fifo_demo` |
| 19 UART 发送器 | 8N1、低位先发、每位时钟数、忙握手 | `19_uart` / `uart_demo` |
| 20 串口回显项目 | 接收同步与采样 → FIFO → UART 发送 | `20_project` / `project_demo` |

在线学习：[FPGA 互动教程](https://jamlabq.github.io/LearnEverything/fpga/)。仓库中从 `fpga/` 目录执行下列命令；下载实验包则从解压目录执行。

## 打开教程

```bash
bash scripts/start.sh
```

打开 **http://localhost:8000**。也可用 `bash scripts/start.sh 8080` 选择其他端口。按 Ctrl+C 停止服务。网页采用 JavaScript ES modules，需要本地 HTTP 服务，请不要直接双击 `index.html`。

只需要 Python 3 和浏览器；无外部字体、CDN、图片服务或前端框架依赖。所有图形均为网页内嵌 SVG，没有使用 draw.io。下载包解压后也能独立启动；第一次启动时会自动生成可再次下载的实验包，无需先运行 Vivado。

每课先读目标与先修链接，再按“动手实验 → 原理图解 → Verilog 与仿真 → 课后挑战”学习。复杂自检和拓展练习可稍后展开。原有时序实验的初始画面表示已经复位，RST 默认是 1；先把 RST 置 0，再走时钟。可以单独切换时钟高低、走完整周期或连续慢放，最近的上升沿结果会列在表格中。输入变化与下降沿不会更新同步寄存器。

## 使用本机 Vivado / XSim

已实际使用本机 **Vivado / XSim 2022.2**，安装目录为 `/opt/Xilinx/Vivado/2022.2`。XSim 是 Vivado 自带的仿真器，包含 `xvlog`、`xelab`、`xsim`；二十个实验都可在电脑上运行。

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

### 两个配套案例：赋值与按键计数

实验 05 新增 C/Java 顺序赋值与两个寄存器同沿更新的对照。初值 `a=1,b=2` 时，软件依次执行 `a=b; b=a;` 得到 `2/2`；寄存器使用 `a<=b; b<=a;` 在同一个边沿采样旧值，得到 `2/1`。网页可单步操作、换初值、查看沿前/沿后表与真实 XSim 波形。

实验 15 将之前的寄存器、计数器和模块接口串成按键计数案例。对同一输入，比较高电平计数、边沿计数和消抖事件计数：长按得到 `12/1/1`，带抖动按下得到 `14/3/1`，两拍尖峰得到 `2/1/0`。这样可以逐步解释为什么“按住”与“一次按下”不是同一件事。

```bash
bash scripts/run_workshops.sh all
bash scripts/run_workshops.sh old_values --starter
bash scripts/run_workshops.sh button_counter --starter
```

每个 `workshops/<案例>/` 包含 `README.md`、参考 `design.v`、待补全 `starter.v` 和配套 `tb.sv`。**原始 starter 故意未完成，报错是预期现象**：先运行参考版，再按 README 补齐少量代码，复用同一测试台检查。两个源码文件二选一编译。后续分别增加使能保持、十进制回绕，并自行补充验收场景。

结果保存在 `build/workshop_<案例>/`；待补全版本在对应的 `_starter/` 目录。查看 GUI 波形时进入该目录运行 `xsim workshop_sim.wdb -gui`。网页使用相同状态规则；初值表示已经复位，不表示实际 FPGA 上电状态。

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

批量复核二十课工程的行为仿真和 RTL 展开：

```bash
source /opt/Xilinx/Vivado/2022.2/settings64.sh
vivado -mode batch -nojournal -nolog -source scripts/validate_projects.tcl
```

## 波形和时序的读法

**手动操作记录**由网页的教学模型生成，保存实验 01–10 最近 64 次、实验 11–20 最近 512 次输入或时钟操作；赋值案例保留最近 64 次，按键案例保留最近 100 次，横轴是操作序号。多位总线用十进制标值。切课、切面板或复位后重开实验；修改实验 10 的 H 相当于重新选择综合参数，也会清除该次记录。

**XSim 实测波形**来自实际运行 testbench 得到的 VCD，横轴为 ns，是固定记录，不随网页开关变化。多位信号保留位宽，X/Z 用不同颜色标识未知/高阻。较长的记录可切换推荐片段、开头/结尾片段（一般 160 ns，串口课 640 ns） 或完整记录。实验 09 推荐片段展示静态 50% 占空比；要看呼吸包络，请选完整记录或在 XSim 缩放。

实验 01–04 及实验 12 为组合逻辑。测试台中每组输入保持 10 ns，这不是逻辑门的计算时间。其余时序实验的测试时钟为 10 ns 周期，检查在上升沿后的非阻塞更新完成后进行。行为仿真不包含器件布线传播延迟，不能用来证明真实板卡的最高频率。

实验 07 首组输入在第一个上升沿进入一级，在第二个上升沿到达输出：经过两个寄存器级，从首次采样边沿到输出边沿相隔一个周期。填满后每拍可输出一组，只有 `valid_out=1` 时数据才作为有效结果。

实验 09 phase 和自动电平同步复位，但 PWM 输出还受 `!rst` 组合屏蔽，RST 拉高会立即关断 PWM；不要把这一步与寄存器同步清零混淆。静态门限若在帧内修改，该帧不再代表固定占空比。

实验 10 完整 LED 频率为 `f_clk/(2H)`；默认 H=4 只为方便仿真。真实 50 MHz 时钟要用 H=25,000,000 才能得到 1 Hz 完整亮灭周期。课程提供板卡资料、引脚、电压、XDC、综合、实现、时序、比特流、Hardware Manager 的核对流程。尚未指定真实开发板，因此未填写引脚、未生成板卡配置文件、未进行硬件下载验证。

## 更新与验证

修改 HDL 并重新运行实验后，更新网页的真实波形、源码与下载包：

```bash
python3 scripts/export_workshops.py  # 两个配套案例重新仿真后
python3 scripts/export_waves.py
```

导出器面向本教程：读取 `tb` 顶层标量和总线，排除测试计分变量，保留未知值；不是通用 VCD 查看器。`src/lab-data.js` 已携带通过验证的记录和源码，普通读者无需先安装 Vivado。只修改网页内容时，用 `python3 scripts/export_waves.py --package-only` 重建下载包即可。下载包 `assets/fpga-labs.zip` 包含完整二十课网页、两个配套案例、HDL、测试和脚本；不包含生成的 Vivado 工程及 WDB，可用实验脚本重新生成。

```bash
node --test tests/*.test.mjs
python3 tests/export_waves_test.py
bash scripts/run_labs.sh all
bash scripts/run_workshops.sh all
python3 scripts/export_workshops.py
python3 scripts/export_waves.py
python3 tests/browser_check.py
python3 tests/practice_browser_check.py
python3 tests/programmer_browser_check.py
```

模型测试会逐事件对照实际 XSim VCD，检查每课输出以及状态机故障注入后的恢复。浏览器测试使用 Python Playwright 和本机 Chrome，覆盖二十课关键操作、60 道挑战、学习进度、全部面板、下载链接、推荐路线、两个配套案例，以及手机横竖屏和展开内容的布局。截图保存到 `build/screenshots/`；网页本身不依赖这些测试工具。

学习路线和每课引导位于 `src/learning-path.mjs` 与 `src/learning-guide.js`；两个配套案例的纯模型和交互位于 `programmer-logic.mjs` 与 `programmer-demos.js`。

内容入口：`src/content.js`（1～3课）、`src/content-advanced.js`（4～10课）、`src/content-practice.js`（11～20课）。实践篇的纯模型、交互和内嵌图解分别位于 `practice-logic.mjs`、`practice-simulators.js`、`practice-diagrams.js`；样式在 `assets/style.css`。

学习进度仅存于浏览器本地，无账号和上传。浏览器禁止存储时仍可学习，当前记录在内存中保留。

## 实践篇的学习方法与毕业目标

实验 11–20 每课增加三个可运行示例、模块接口表，以及三项递进源码练习。先预测结果，再运行预置场景，看上升沿前后状态和操作波形，最后到 Vivado 改设计并补充测试台。RST 复位和“重开实验”不同：实验 17 RST 保留 RAM，重开实验回到未写的 X。

建议按开头四阶段路线推进。串口回显分为五个检查点：TX 发送 → RX 接收 → FIFO 保存 → 顶层交接 → 连续流、错误与复位。先复用现成测试台验证单个正常字节，再逐步自己编写检查。网页选择题答对不等于能独立设计；练习验收要求你给出输入、预期结果、自检和波形解释。

完成后应能独立实现并验证“串口接收 → 四字节 FIFO → 原样回显”，理解每个模块的输入输出、时钟边沿和请求接受条件。毕业练习是独立连接 RX/FIFO/TX，并编写输入驱动、线路解码器和参考队列，自检连续帧、坏停止位，以及接收中、发送中和队列有数据时的复位恢复。实验 20 还给出队列容量与故障定位任务。

串口教学默认每位 4 个主时钟，便于逐拍观察；实际波特率为 `f_clk/CLKS_PER_BIT`，需要结合真实时钟、误差和时序重新选择参数。有限 FIFO 无法无限吸收更快的输入，没有硬件流控。数字行为仿真不能证明模拟亚稳态、板卡电气条件或时序收敛。

新增自检包括 ALU 全部 524,288 组组合、所有 256 个字节的 popcount、FIFO 随机软件队列对照、UART 逐符号时长、独立 TX 线解码及错误帧/复位恢复。ALU 网页只展示开头 320 ns 的代表波形，完整遍历仍在测试台中运行。实践纯模型另逐事件对照真实 XSim 波形。
