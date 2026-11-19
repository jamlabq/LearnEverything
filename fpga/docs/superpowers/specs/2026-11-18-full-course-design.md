# FPGA 全十课扩展设计

用户已确认继续完成全部课程，沿用已认可的前三课教学风格、交互式网页＋Vivado 实验，以及“只用内嵌图、不用 draw.io”的要求。直接实施，无需重复确认。

新增七课：4 加法器与位宽；5 时钟与寄存器；6 计数器；7 并行与流水线；8 有限状态机；9 PWM 与呼吸灯；10 从仿真到开发板。每课提供完整中文目标、操作引导、至少三段原理讲解、SVG 图解、源码逐行说明、仿真指导、修改练习和三题带解析的挑战。

模型契约：
- 04_adder / adder_demo：a,b 为4位，sum为5位，low_sum为低4位，carry为进位；显式扩展输入再相加。
- 05_register / register_demo：clk、同步高有效rst、en、d[3:0]、q[3:0]；上升沿复位优先，en为0保持。
- 06_counter / counter_demo：clk/rst/en，count[3:0]、wrap；15→0时wrap脉冲一个周期，停用时wrap清零。
- 07_pipeline / pipeline_demo：clk/rst、a,b[3:0]、valid_in；一级stage_sum[4:0]、valid_s1，二级y[5:0]、valid_out。每拍执行stage_sum<=扩展a+b，y<=旧stage_sum左移1；有效位同步移动。复位清零。
- 08_fsm / fsm_demo：clk/rst/tick，state[1:0]，red/green/yellow；RED=0→GREEN=1→YELLOW=2→RED，tick=0保持。非法状态恢复RED。简化交通灯，每个tick前进一状态，不声称是实际道路控制器。
- 09_pwm / pwm_demo：clk/rst、level[4:0]、breath_en；phase[3:0]，duty[4:0]，pwm。静态level限制在0..16；自动电平每16个时钟增减一步，从0升到16再降到0。有效输出 !rst && phase<duty；精确支持0%/100%。
- 10_board / board_demo：clk/rst（同步高有效），参数HALF_PERIOD默认4；计数至HALF_PERIOD-1翻转led。计数器位宽用clog2且至少1。上板例子给出真实频率换算和核对流程，外部复位需同步、按键需去抖；不代填未知板卡的引脚，不生成未经核实的下载文件。

网页序列模型初始状态明确显示“已复位”，默认rst=1，用户释放复位后开始。提供时钟高/低和完整周期按钮，只有0→1更新状态；支持慢放，切换课程时清除定时器。组合信号随输入变化，寄存器只在有效边沿更新。多位波形显示总线值；X/Z 保留；真实XSim与手动操作的来源、时间轴明确区分。

原生JS静态架构继续使用。新增课程内容、交互模型和模拟器分文件；旧三课保留。导航与进度改成10课，支持旧进度迁移。VCD导出器扩展到多位、指定顶层信号；十课均自检，真实VCD与JS模型对照。完成后更新README、下载包、验证记录，检查桌面和手机。
