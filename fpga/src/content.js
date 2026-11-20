import {practiceLessons} from './content-practice.js';
import {advancedLessons} from './content-advanced.js';
export const lessons = [
  {
    id: 1, lab: '01_parallel', title: '认识 FPGA', subtitle: '把想法，连接成电路。',
    description: 'FPGA 里面发生了什么？先拨动两个开关，看看三条电路如何一起响应。你不需要电路基础，也不需要一块开发板。',
    duration: '约 20 分钟', tags: ['可配置电路', '并行工作', '硬件描述'],
    experiment: '先动手，让电路亮起来', prompt: '点击 A、B 开关，观察三个输出。',
    observation: '试试把 A 和 B 都拨到 1：与门亮起，异或门熄灭。三条支路都在响应同一组输入，不需要逐条启动。',
    takeaway: [ ['可配置', '像搭积木一样连接电路', 'FPGA 的逻辑功能和内部连线可以通过配置改变。'], ['并行', '多条电路一起工作', '这里的三条逻辑支路会持续响应输入变化。'], ['可验证', '先在电脑中观察', '通过仿真，在下载到芯片之前检查电路行为。'] ],
    reading: `
      <article class="card"><div class="section-label">01 / FIRST PRINCIPLES</div><h3>先把它想成一盒“可以重新接线的电路积木”</h3><p>普通开关控制灯，只需要一根连接线。如果我们想让“两个开关都打开，灯才亮”，就需要增加一条判断规则。在数字电路中，<strong>实现这个规则的元件叫逻辑门</strong>。</p><p>FPGA 的全称是 Field-Programmable Gate Array，中文通常叫<strong>现场可编程门阵列</strong>。芯片内部有大量可配置的逻辑资源、保存状态的寄存器和连接它们的布线资源。我们可以把它们组合成计数器、图像处理电路或通信电路。</p><div class="concept-grid"><div class="concept"><b>逻辑资源</b><p>决定输入怎样影响输出。后面的实验 02 会认识几种最基本的规则。</p></div><div class="concept"><b>寄存器</b><p>保存一个时刻的状态，配合时钟更新。将在后续课中学习。</p></div><div class="concept"><b>连接资源</b><p>把各个逻辑单元连起来，让信号沿着设计好的路径传递。</p></div></div><div class="note">“重新接线”是帮助理解的比喻。实际是配置逻辑查找表（LUT）、连接开关等资源，不是改动芯片内部的金属导线。</div></article>
      <article class="card"><div class="section-label">02 / THINK IN CIRCUITS</div><h3>为什么三行代码可以一起工作？</h3><p>把 CPU 想成一位按步骤操作的工作人员，可以帮助理解“先做一件事，再做下一件事”。把 FPGA 想成一条由多个工位构成的生产线，可以帮助理解“不同电路可以同时处理信号”。</p><p>本课的三个 <code>assign</code> 语句描述了三条<strong>持续存在的连接关系</strong>。当输入改变时，每条支路都根据自己的规则重新得到结果。代码写在上面还是下面，不决定哪条电路先开始。</p><p><strong>并行不等于没有延迟。</strong>真实芯片里的信号传播需要时间，能运行多快还要考虑电路深度、布线和时序。本网页展示理想二值逻辑；本课的 XSim 行为仿真没有建模真实器件的传播延迟。</p><div class="note">右侧“逐步执行”只是顺序处理的教学示意，不是 CPU 性能测试。现代 CPU 也有流水线、SIMD、多核等并行机制；FPGA 并不一定比 CPU 快。</div></article>
      <article class="card"><div class="section-label">03 / FROM DESCRIPTION TO HARDWARE</div><h3>写 Verilog，接下来会发生什么？</h3><p>Verilog 是一种硬件描述语言，简称 HDL。你写下的是电路关系。工具先检查这些描述，再把可实现的部分映射到 FPGA 的资源上。</p><div id="flow-diagram"></div><p>这里先走上方的<strong>仿真路线</strong>：用测试台制造输入，让 XSim 计算输出，再看波形是否符合预期。前三课都是组合逻辑，不需要时钟；保存状态的电路将在后续课程引入。</p><div class="note">仿真通过，说明被测试的行为符合预期。它不等于已经完成综合、时序检查、布局布线，也不等于已经在开发板上运行。</div></article>`,
    codeNotes: [['module … endmodule', '一个电路模块的边界，可以把它理解成一个带接口的盒子。'], ['input wire a, b', '两根输入信号线。这里每根线只传递一位：0 或 1。'], ['output wire …', '三根输出信号线，分别连接三个逻辑规则的结果。'], ['assign y_and = a & b;', '持续连接：y_and 等于 A 与 B 的“与”运算。'], ['assign y_xor = a ^ b;', '持续连接：A 和 B 不同，y_xor 就是 1。'], ['assign y_not = ~a;', '持续连接：A 是 0 时输出 1；A 是 1 时输出 0。']],
    labGuide: '输入按 00 → 01 → 10 → 11 变化，每组保持 10 ns；三个输出分别计算与、异或和非。三条支路在每次输入变化时一起更新。',
    expected: 'A=B=0：y_and=0, y_xor=0, y_not=1。A=B=1：y_and=1, y_xor=0, y_not=0。',
    challenge: '把 design.v 中的三条 assign 语句交换顺序，重新运行。预测：输出波形会改变吗？答案：不会，它们描述的是三条并行连接。',
    quizzes: [
      {q:'三条 assign 语句调换书写顺序，电路结果会怎样？', answers:['后写的语句要等前面的语句执行完','对于本课这三条连续赋值，结果不变','只有第一条语句生效'], correct:1, explanation:'assign 描述持续存在的信号关系。三条独立支路并行工作，书写顺序不决定执行顺序。'},
      {q:'在本课的实验中，A=1、B=0 时，哪个输出是 1？',answers:['只有 y_and','只有 y_xor','y_and、y_xor、y_not 都是 1'],correct:1,explanation:'1 AND 0 = 0，1 XOR 0 = 1，NOT 1 = 0。可以回到互动实验验证。'},
      {q:'只用本机电脑，没有 FPGA 开发板，可以完成哪一步？',answers:['用 XSim 检查电路的行为和波形','直接验证开发板的 LED 引脚接线','证明真实芯片可以达到任意时钟频率'],correct:0,explanation:'仿真可以完全在电脑中运行。引脚、电压和实际时序需要后续约束与硬件验证。'}
    ]
  },
  {
    id:2, lab:'02_gates', title:'二进制与逻辑门', subtitle:'从 0 和 1，搭出判断力。',
    description:'一根信号线怎样表达信息？先点亮一个数，再试试与、或、异或和非。你会发现，电路的规则可以列成一张很小的表。',
    duration:'约 25 分钟',tags:['二进制', '四种逻辑门', '真值表'],
    experiment:'两根输入线，四种小规则',prompt:'选择一个逻辑门，再拨动输入开关。',
    observation:'选择 XOR，把 A、B 设成相同的值，再设成不同的值。只有不同的时候灯才亮。换成 OR 后，两个都是 1 时灯也会亮。',
    takeaway:[['0 / 1','一位信号，两种状态','这里将低电平抽象为 0，高电平抽象为 1。'],['真值表','列出每一种可能','两个一位输入有 4 种组合，检查 4 行就能覆盖。'],['位宽','多根线，一起表达数','四位无符号二进制，可以表达 0 到 15。']],
    reading:`
      <article class="card"><div class="section-label">01 / A BIT OF INFORMATION</div><h3>一根线，为什么用 0 和 1？</h3><p>数字电路把电压范围抽象成离散的状态。在前三课中，我们只关心<strong>低电平 0</strong>和<strong>高电平 1</strong>。一根这样的信号线携带一位信息，英文叫 bit。</p><p>这不是说“0 一定是 0V，1 一定是 5V”。真实 FPGA 的电压标准由器件、引脚所在的供电区域和 I/O 配置决定。此处只做逻辑仿真，不连接真实引脚。</p><p>仿真中还可能看到 <code>X</code>（未知）和 <code>Z</code>（高阻态）。例如未初始化或没有正确驱动的信号可能出现 X。本网页的手动开关只演示 0 和 1；实验的检查使用 <code>!==</code>，也能发现意外的未知值。</p></article>
      <article class="card"><div class="section-label">02 / BUILDING A NUMBER</div><h3>把四根线并在一起，就能表达一个数</h3><p>十进制从右向左的位权是 1、10、100；二进制从右向左的位权是 <strong>1、2、4、8</strong>。某一位是 1，就把那一位的权重加进来。</p><p>例如 <code>1010₂ = 1×8 + 0×4 + 1×2 + 0×1 = 10₁₀</code>。四位全部是 1，得到 15；全部是 0，得到 0。共 16 种组合。</p><div id="binary-reading"></div><div class="note">一位的“0/1”和多位组成的“数”要区分。这里演示的是无符号数，有符号数及溢出会在数据位宽一课继续讨论。</div></article>
      <article class="card"><div class="section-label">03 / FOUR SIMPLE RULES</div><h3>逻辑门，就是输入和输出之间的规则</h3><div class="concept-grid"><div class="concept"><b>与 AND · A &amp; B</b><p>两个条件都满足才输出 1。例如：门已关闭，并且按下启动键。</p></div><div class="concept"><b>或 OR · A | B</b><p>至少一个条件满足就输出 1。包括两者同时满足。</p></div><div class="concept"><b>异或 XOR · A ^ B</b><p>两个输入不同才输出 1。两个都是 1 时，输出反而是 0。</p></div></div><p style="margin-top:18px"><strong>非 NOT · ~A</strong> 只有一个输入：把 0 变成 1，把 1 变成 0。它不需要 B，所以切换到 NOT 后，演示会隐藏 B 开关。</p><p>“至少一个是 1”和“恰好一个是 1”看似只差几个字，电路结果却不同。真值表能把这种区别说清楚：<strong>OR 的 11 行输出 1，XOR 的 11 行输出 0。</strong></p><div class="note">这里用的是按位运算符 <code>&amp; | ^ ~</code>。逻辑运算符 <code>&amp;&amp; || !</code> 是另一类运算符。对于本课的一位 0/1 信号部分结果相同，但多位数据不能混用。</div></article>`,
    codeNotes:[['a & b','按位与。只有 1 & 1 的结果是 1。'],['a | b','按位或。只要 A 或 B 为 1，结果就是 1。'],['a ^ b','按位异或。输入不同，结果为 1。'],['~a','按位取反。本课 a 只有一位，因此结果也是一位。'],['wire','表示信号连线。本课的 wire 由 assign 或模块输出持续驱动。']],
    labGuide:'XSim 同时运行四种逻辑门。A、B 每隔 10 ns 切换到下一行输入组合，一共检查四行真值表。网页可分别选择一种门查看，HDL 中四条支路始终都存在。',
    expected:'输入 11 时，y_and=1，y_or=1，y_xor=0，y_not=0。输入 00 时，只有 y_not=1。',
    challenge:'将 y_or 的运算符从 | 改成 ^，先预测哪一行会出错。重新运行自检，11 这一行应该报告失败；把代码改回去后再次运行。',
    quizzes:[
      {q:'四位无符号二进制 1011 表示十进制多少？',answers:['11（8 + 2 + 1）','13（8 + 4 + 1）','1011'],correct:0,explanation:'从左到右的位权是 8、4、2、1。1011 表示 8 + 0 + 2 + 1 = 11。'},
      {q:'A=1、B=1 时，OR 和 XOR 的结果分别是多少？',answers:['OR=1，XOR=1','OR=1，XOR=0','OR=0，XOR=1'],correct:1,explanation:'OR 是“至少一个为 1”，XOR 是“两个不同”。两个都是 1 时，它们的输出不同。'},
      {q:'只改变 B，NOT A 的输出会改变吗？',answers:['一定会改变','不会，NOT A 只依赖 A','要等下一个时钟才能知道'],correct:1,explanation:'非门只有一个输入。~a 和 b 没有依赖关系；本课的组合逻辑也不需要等待时钟。'}
    ]
  },
  {
    id:3,lab:'03_mux',title:'选择器',subtitle:'一根控制线，决定信号的去向。',
    description:'当两路数据都准备好了，该把哪一路送到输出？用一个小小的二选一电路，理解“数据”和“控制”的区别。',
    duration:'约 20 分钟',tags:['数据通路', '控制信号', '条件表达式'],
    experiment:'选择一路，让信号通过',prompt:'把 A、B 设成不同的值，再切换 SEL。',
    observation:'先设 A=0、B=1。SEL=0 时 Y 跟随 A；SEL=1 时 Y 跟随 B。此时改变未选中的输入，Y 不会受影响。',
    takeaway:[['数据','A 与 B 是候选输入','选择器不把数据相加，只转送其中一路。'],['控制','SEL 决定选哪一路','SEL=0 选 A，SEL=1 选 B。'],['组合逻辑','输入决定当前输出','本课没有寄存器，输出不需要等时钟。']],
    reading:`
      <article class="card"><div class="section-label">01 / TWO INPUTS, ONE OUTPUT</div><h3>像一条可以切换的岔路</h3><p>想象耳机可以接电脑，也可以接手机。两个设备都有声音，但你选择其中一个送到耳机。这就是<strong>选择器</strong>的基本想法。</p><p>数字电路里的二选一选择器常写作 <strong>MUX</strong>，来自 multiplexer。它有两路数据输入 A、B，一根选择信号 SEL，以及一路输出 Y。</p><div class="concept-grid"><div class="concept"><b>A、B · 数据</b><p>等待被选择的两个值。本课每一路都是一位。</p></div><div class="concept"><b>SEL · 控制</b><p>决定选哪一路。0 选 A，1 选 B。</p></div><div class="concept"><b>Y · 输出</b><p>所选输入的值，可能是 0，也可能是 1。</p></div></div><div class="note">高亮的路径表示“这一路被选中”，不是表示“一定为 1”。被选中的是 0，输出也应该是 0；图中的 0/1 标签才表示信号值。</div></article>
      <article class="card"><div class="section-label">02 / DESCRIBING A CONNECTION</div><h3>一句条件表达式，描述一个选择电路</h3><p><code>assign y = sel ? b : a;</code> 可以读作：“如果 sel 是 1，y 连接 b；否则 y 连接 a”。问号后是条件成立时选的值，冒号后是条件不成立时选的值。</p><p>如果你学过编程，会觉得它像一次判断。但在这里，<strong>它描述的是一个持续存在的选择电路</strong>。A、B、SEL 任意一个改变，Y 都会按当前规则重新确定，不需要你再次调用这行代码。</p><p>注意：选择器只负责转送，不会保存之前的值。<strong>本课没有时钟，也没有寄存器。</strong>保存数据是后续“时钟与寄存器”一课的内容。</p></article>
      <article class="card"><div class="section-label">03 / USE WHAT YOU ALREADY KNOW</div><h3>它也能用上一课的逻辑门搭出来</h3><p>当 SEL=0 时，需要让 A 通过、B 被屏蔽；当 SEL=1 时则反过来。把规则写成逻辑表达式：</p><div class="callout"><code>Y = (A &amp; ~SEL) | (B &amp; SEL)</code></div><div id="mux-gates-diagram"></div><p>先用非门得到 ~SEL，再用两个与门分别控制两路输入，最后用或门合在一起。你可以用全部八组 0/1 输入检查它，结果与条件表达式完全一致。</p><div class="note">这是逻辑等价关系。工具可能把这整个小逻辑映射到一个 LUT 等资源中；不一定真的使用画面里的几个独立门。实际映射要查看综合结果。</div></article>`,
    codeNotes:[['input wire a, b','两路一位的数据输入，它们可以同时存在。'],['input wire sel','一位控制信号。0 和 1 分别对应两种选择。'],['output wire y','一路输出，跟随被选中的数据。'],['sel ? b : a','条件为 1 时选 b，为 0 时选 a。注意两个数据的书写位置。'],['assign','持续驱动输出，不是只赋值一次。']],
    labGuide:'依次施加 {SEL,A,B}=000 到 111，共八种输入，每组保持 10 ns。前 40 ns 检查 SEL=0 时 Y 跟随 A，后 40 ns 检查 SEL=1 时 Y 跟随 B。',
    expected:'20–30 ns：SEL=0、A=1、B=0，所以 Y=1。50–60 ns：SEL=1、A=0、B=1，所以 Y=1。',
    challenge:'把条件表达式改成等价写法 (a & ~sel) | (b & sel)，再运行测试。所有八组输入都应该继续通过。之后尝试互换 a、b，观察自检能否发现错误。',
    quizzes:[
      {q:'A=0、B=1、SEL=0，输出 Y 是多少？',answers:['0，因为选择的是 A','1，因为 B 是 1','1，因为 A 或 B 为 1'],correct:0,explanation:'SEL=0 选择 A。选择器不会把两路做“或”运算，所以没有被选中的 B 不影响输出。'},
      {q:'SEL=1 且 B=0，此时只改变 A，会发生什么？',answers:['Y 跟随 A 改变','Y 仍然是 0','Y 先变成 1，再回到 0'],correct:1,explanation:'SEL=1 时 Y 跟随 B。没有选中的 A 变化，不影响当前输出。这里没有建模真实器件毛刺。'},
      {q:'怎样验证这个一位二选一选择器的全部二值输入？',answers:['只检查 SEL=0 的一次结果','检查 SEL、A、B 的全部 8 种组合','必须先购买 FPGA 开发板'],correct:1,explanation:'三个一位二值输入，一共 2³=8 种组合。配套 testbench 已全部检查，XSim 在电脑上就能运行。'}
    ]
  }
  ,...advancedLessons,...practiceLessons
];

export function labInstructions(lesson) {
  return `<article class="card"><div class="section-label">HANDS-ON / VIVADO 2022.2</div><h3>在真正的仿真器里运行<span class="pill">无需开发板</span></h3><p>网页里的操作帮你形成直觉。接下来，使用同一套电路的 Verilog 源码和测试台，在本机 XSim 中验证。</p>
  <ol class="steps"><li><b>打开项目目录的终端</b>克隆仓库后进入 <code>LearnEverything/fpga</code>。也可以下载实验包，解压后在包含 <code>labs</code> 和 <code>scripts</code> 的文件夹运行。</li><li><b>运行本课实验</b><div class="code-block"><div class="code-heading"><span>终端 · Bash</span><button class="copy-btn" data-copy="bash scripts/run_labs.sh ${lesson.lab}">复制</button></div><pre>bash scripts/run_labs.sh ${lesson.lab}</pre></div>脚本会依次编译、展开电路、运行仿真。第一次运行可能需要等待数十秒。</li><li><b>确认检查结果</b>终端应出现 <code>PASS ${lesson.lab}:</code>。这说明测试台检查的输入组合全部符合预期。<div class="callout"><p>${lesson.labGuide}</p></div></li><li><b>打开波形界面</b><div class="code-block"><div class="code-heading"><span>终端 · 使用本机安装路径</span><button class="copy-btn" data-copy="source /opt/Xilinx/Vivado/2022.2/settings64.sh&#10;cd build/${lesson.lab}&#10;xsim tutorial_sim.wdb -gui">复制</button></div><pre>source /opt/Xilinx/Vivado/2022.2/settings64.sh
cd build/${lesson.lab}
xsim tutorial_sim.wdb -gui</pre></div>在 Scopes 中选择 <code>tb</code>，在 Objects 中选中本课输入和输出（时序课还包括 clk、rst），右键 <strong>Add to Wave Window</strong>，再点击 <strong>Zoom Fit</strong> 看完整波形。若已显示信号，可直接缩放查看。</li></ol>
  <div class="callout"><h4>预期观察</h4><p>${lesson.expected}</p></div><div class="note">${lesson.id<=4||lesson.id===12?'这里 testbench 里的 <code>#10</code> 是“每组输入保持 10 ns”，不是电路传播延迟。':'时序实验的时钟每 5 ns 翻转一次，完整周期为 10 ns。测试台在上升沿后等待 1 ns 再检查，让本边沿触发的寄存器更新先完成；这 1 ns 不是寄存器的物理延迟。'}行为仿真不包含布局布线后的真实延迟。</div>
  <details><summary>想通过 Vivado 工程界面操作？</summary><p>在项目根目录运行下面的命令。脚本从已安装器件中选择一个作为教学目标，并在终端打印型号；也可通过 PART 环境变量指定器件。这里先进行电脑仿真，不连接真实板卡。实验 10 讲解实际上板所需的板卡核对和约束。</p><div class="code-block"><pre>source /opt/Xilinx/Vivado/2022.2/settings64.sh
vivado -mode gui -source scripts/create_project.tcl -tclargs ${lesson.lab}</pre></div><p>打开后，在左侧 <strong>Flow Navigator → Simulation → Run Simulation → Run Behavioral Simulation</strong> 运行仿真。在 <strong>RTL Analysis → Open Elaborated Design → Schematic</strong> 查看 RTL 电路；这个视图是展开后的逻辑结构，和综合、布局布线后的物理电路有区别。</p></details>
  <details><summary>波形不对、出现 X，或脚本找不到 Vivado？</summary><p>先确认修改的是 <code>design.v</code>。测试台 <code>tb.sv</code> 负责施加输入并检查输出。确认仿真顶层是 tb，而设计顶层是电路模块。X 表示未知，检查输入是否初始化、输出是否有驱动。脚本日志保存在 <code>build/${lesson.lab}/</code>。</p><p>不同安装路径可以这样指定：</p><div class="code-block"><pre>VIVADO_SETTINGS=/你的路径/settings64.sh bash scripts/run_labs.sh ${lesson.lab}</pre></div></details>
  <div class="inline-links"><a href="labs/${lesson.lab}/design.v" download>↓ 电路源码 design.v</a><a href="labs/${lesson.lab}/tb.sv" download>↓ 自检测试台 tb.sv</a><a href="assets/fpga-labs.zip" download>↓ 完整实验包</a></div></article>
  <article class="card"><div class="section-label">TRY A CHANGE</div><h3>改一点，再验证一次</h3><p>${lesson.challenge}</p><p>保留“先预测 → 再运行 → 对照波形 → 解释差异”这个习惯，会比只复制代码学得更扎实。</p></article>`;
}
