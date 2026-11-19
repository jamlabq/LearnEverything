// 实践篇使用与基础篇相同的内容字段；interface 与 practice 供共享实践面板渲染。
// reading 中的 data-practice-diagram 由 practice-simulators.js 填充内嵌 SVG。
const section = (n, title, body) => `<article class="card"><div class="section-label">${n} / PRACTICE</div><h3>${title}</h3>${body}</article>`;
const table = (heads, rows) => `<table><thead><tr>${heads.map(x => `<th>${x}</th>`).join('')}</tr></thead><tbody>${rows.map(row => `<tr>${row.map(x => `<td>${x}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
const code = text => `<div class="code-block"><pre>${text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')}</pre></div>`;

export const practiceLessons = [
  {
    id: 11, lab: '11_variables', title: '变量、条件与优先级', subtitle: '同一份代码，先问它要长成什么电路。',
    description: '从软件变量迁移到硬件信号：做一个可装载、加一、减一的八位状态寄存器。把复位、多个请求同时到达、255 回绕和条件优先级都写成可检验的规则。',
    duration: '约 45 分钟', tags: ['信号与存储', '优先级', '八位回绕', '第一份自检'],
    experiment: '一拍里有多个请求，谁来决定 Q？', prompt: '先复位并装载 9，再同时开启 ADD_EN 与 SUB_EN。预测 Q 和 GE10，走一个上升沿；随后试试 LOAD 与加减请求同时有效。',
    observation: '加减同时请求时只加一，9 变成 10，GE10 随新 Q 变成 1。LOAD 的优先级更高；八位 255 加一变成 0，0 减一变成 255。输入开关变化本身不会改写 Q。',
    takeaway: [['State', '变量名不保证存储', 'q 在时钟过程里保存状态；ge10 是当前 q 的组合比较。'], ['Priority', '把冲突写进接口契约', 'rst > load > add_en > sub_en > 保持，每拍最多选择一个动作。'], ['256', '八位无符号数按模回绕', '范围 0…255，进位丢弃是本课明确的设计选择。']],
    interface: [
      { name: 'clk / rst', meaning: '上升沿更新；rst 为同步高有效复位，优先清 q=0。' },
      { name: 'load / d[7:0]', meaning: '非复位边沿 load=1 时装载 d，优先于加减。' },
      { name: 'add_en / sub_en', meaning: '非装载时先判断加一，再判断减一；都为 0 则保持。' },
      { name: 'q[7:0] / ge10', meaning: 'q 是八位无符号状态；ge10=(q>=10)，是组合输出。' }
    ],
    reading: [
      section('01', '把 CPU 的变量直觉拆成“线”和“状态”', `<p>写软件时，<code>int score</code> 常让人想到内存中的一个位置。在 HDL 中，名字先表示某个信号或过程变量；是否需要存储，取决于<strong>何时赋值、是否必须记住上一次的值</strong>。Verilog 的 <code>reg</code> 表示可以在过程内赋值，不能单凭这个词认定一定有触发器。</p>${table(['写法与场景', '形成的硬件含义', '如何检查'], [['assign ge10 = (q >= 8\'d10)', '比较器，随当前 q 改变', '没有时钟也会重新计算'], ['always @* 中所有路径都给 y 赋值', '组合运算或选择网络', '只依赖当前输入'], ['always @(posedge clk) 中 q &lt;= …', '上升沿采样的状态寄存器', '比较边沿前输入和边沿后 q']])}<p>本课数据通路是“旧 Q → 加/减运算与选择 → 新 Q”，而 ge10 从 Q 旁路进入比较器。软件里的 if 选择要执行的指令；这里的 if 描述<strong>多路选择器和优先选择关系</strong>。这些逻辑一直存在，不是在 CPU 上按需创建。</p><div data-practice-diagram="11"></div>`),
      section('02', '先写决策表，再写 if / else if', `<p>若复位、装载、加一、减一同时为 1，接口不能让调用者猜。采用一条有序链：复位最高，其次装载，再加一，再减一，最后保持。条件从高到低筛选，下一级只有在上一级未命中时才有机会。</p>${table(['边沿前条件', '边沿后的 q', '理由'], [['rst=1，其余任意', '0', '复位优先'], ['rst=0, load=1, d=42，其余任意', '42', '装载优先于加减'], ['rst=load=0, add_en=sub_en=1, q=9', '10', '只执行加一'], ['只有 sub_en=1, q=0', '255', '八位减法回绕'], ['所有控制=0, d 改变', '旧 q', '输入没有被接收']])}<p>若写成三个互不相连的 if，并在同一个过程里多次给 q 使用非阻塞赋值，后面的有效赋值可能覆盖前面的更新，得到另一套优先关系。先用决策表确定“只选一个动作”，再用 <code>if … else if …</code> 直接表达它。</p>`),
      section('03', '同一串位，可以有两种数字解释', `<p><code>8'hFF</code> 是八位 11111111。按本课的无符号规则，它是 255；按八位有符号补码，它可解释为 −1。位图相同，比较、扩展与右移的含义却可能不同。因此本课明确 q 和 d 是无符号数，常量写成 <code>8'd1</code>、<code>8'd10</code>，不要悄悄混入 signed 变量。</p><p>八位 q 只保存低八位。255+1=256 的二进制需要九位，本课有意丢掉最高位得到 0；0−1 的低八位得到 255。<code>ge10</code> 比较的是<strong>保存之后的当前 q</strong>，所以 255 加一后它会从 1 变成 0。无符号进位也不等于有符号溢出，日后做带符号 ALU 时需要另立规则。</p>${code("always @(posedge clk) begin\n  if (rst)         q <= 8'd0;\n  else if (load)   q <= d;\n  else if (add_en) q <= q + 8'd1;\n  else if (sub_en) q <= q - 8'd1;\nend\nassign ge10 = (q >= 8'd10);")}<p>时钟过程中缺少最后的 else 表示触发器保持旧值；组合过程中缺少必需的赋值却可能形成锁存器。这两个场景不能套用同一口诀。</p>`),
      section('04', '从“看起来正确”走到第一份自检', `<p>测试台也有时序。若在 <code>@(posedge clk)</code> 后立即检查 q，设计的非阻塞赋值可能尚未提交；若也在这个边沿修改 load，又可能与设计采样竞争。采用固定约定：<strong>下降沿驱动输入，上升沿后 #1 检查输出</strong>。这里 #1 是测试台的观察间隔，不放进可综合设计里。</p>${code("@(negedge clk); rst=0; load=1; d=8'd9;\n@(posedge clk); #1;\nif (q !== 8'd9) $fatal(1, \"load failed\");\n@(negedge clk); load=0; add_en=1; sub_en=1;\n@(posedge clk); #1;\nif (q !== 8'd10 || ge10 !== 1'b1)\n  $fatal(1, \"priority failed\");")}<p><code>!==</code> 是包含 X/Z 的严格比较，未知输出不能蒙混过关。先手写几条预期，再做一个八位 reference 变量：在每个有效边沿按契约计算下一值，延后检查 DUT。不要把 DUT 的 q 拷回参考值，否则错误会被一同抄进去。测试结束打印 <code>PASS 11_variables:</code>，另设最大仿真时间，防止漏掉结束条件而一直运行。</p>`),
      section('05', '读波形时先标“旧”，再写“新”', `<p>在纸上画三列：边沿编号、边沿前 q 与控制、边沿后 q 与 ge10。装载 9 的边沿之后才是 q=9；下一拍加一读取旧 9，保存 10，随后组合比较输出 1。把检查错误写成“第几拍、输入是什么、预期多少、实际多少”，调试就有了坐标。</p><p>本课的完成标准包括保持、全部优先级冲突、上下回绕和同步复位，而不只是成功加几次数。后面的每个模块都沿用这种接口表、旧值表、自检三步法。</p>`)
    ].join(''),
    codeNotes: [['output reg [7:0] q', '八位过程变量；结合上升沿更新规则才可判断它保存状态。'], ['else if (load) q <= d;', '装载压过加减；一条条件链让优先级与决策表一致。'], ["q <= q + 8'd1;", '右侧读取旧 q；输出只留下八位，255 加一回到 0。'], ["assign ge10 = (q >= 8'd10);", '比较当前无符号 q，不需要额外一拍，也不是一个记忆单元。'], ['@(posedge clk); #1;', '测试台在 NBA 更新之后采样；设计本身没有 #1 延迟。']],
    labGuide: '运行 bash scripts/run_labs.sh 11_variables。先对照复位、装载、保持三个检查，再在测试台中找到 255→0、0→255 和多控制冲突。逐条解释为何使用下降沿驱动与上升沿后检查，最后自己补一条“rst 与 load 同时有效”的断言。',
    expected: '复位上升沿后 q=0、ge10=0；装载 9 后加减同时有效一拍，q=10、ge10=1；装载 255 后加一得到 0；从 0 减一得到 255。',
    waveNote: '看 clk、rst、load、add_en、sub_en、d、q、ge10。输入在下降沿改变，沿上升沿读取控制与旧 q；ge10 在 q 更新后重新计算。用 Unsigned Decimal 读数，再用 Hex 验证 FF→00。',
    challenge: '把优先级改成 rst > load > sub_en > add_en，先修改书面契约和参考模型，再修改设计；证明原先加减冲突测试会失败，新测试会通过，最后恢复课程契约。',
    practice: [
      { title: '预测：一拍只能选一个动作', task: '复位后依次执行 load=1,d=9；add_en=sub_en=1；所有控制=0,d=77；load=1,d=255 且 add_en=1；再只加一。先写每拍 q、ge10。', hint: '每拍从 rst 向下找第一个成立条件，保持拍不采样 d。', acceptance: '五个边沿后的 q 依次为 9、10、10、255、0；ge10 依次为 0、1、1、1、0。' },
      { title: '实现：为边界补自检', task: '在测试台加入 0 减一和 rst/load/add_en 同时有效两组检查，并让失败信息打印实际值。', hint: '下降沿设置刺激，上升沿后 #1 使用 !==；测试台给每组一个独立说明。', acceptance: '两组预期分别是 255 与 0；正常设计打印 PASS，临时删去复位分支时必须报错。' },
      { title: '定位：为什么加减同时开却减了一？', task: '临时把加减拆成两个独立 if，运行冲突场景，指出哪条赋值最后生效，恢复 else if。', hint: '同一过程同一拍对 q 多次非阻塞赋值时，不能把它当数学上的加一再减一。', acceptance: '用一行边沿记录复现 9→8 的故障；恢复后同样刺激得到 9→10，全套自检通过。' }
    ],
    quizzes: [
      { q: 'rst=0、load=1、d=20、add_en=1，旧 q=7；边沿后 q 是多少？', answers: ['8', '20', '21'], correct: 1, explanation: 'load 比 add_en 优先，装载动作读取 d=20，本拍不执行加一。' },
      { q: '八位无符号 q=0，执行一次减一后 ge10 是多少？', answers: ['1', '0', '无法确定'], correct: 0, explanation: 'q 按模 256 变成 255，组合比较 255>=10 为真。' },
      { q: '为什么不在 posedge 后立刻检查 q？', answers: ['因为 q 只有下降沿更新', '因为所有输出必须等一个完整周期', '因为非阻塞赋值可能还未提交，需避开采样竞争'], correct: 2, explanation: '设计在边沿读取旧值，并在 NBA 阶段更新。测试台延后一个小的观察间隔可读取本拍更新结果。' }
    ]
  },
  {
    id: 12, lab: '12_alu', title: '用 case 做八位 ALU', subtitle: '八种运算并列存在，操作码负责选择。',
    description: '做一个有明确进位、借位和零标志的组合运算单元。把加减、按位操作、逻辑移位与无符号比较放在同一个接口里，学会默认赋值、位宽推理和表驱动测试。',
    duration: '约 50 分钟', tags: ['case', '组合逻辑', '进位与借位', '无锁存器'],
    experiment: '同样的 A、B，切换八种解释', prompt: '先设 A=255、B=1，依次切换 OP=0、1、2、7；再设 A=129，看左移与右移被移出的位。',
    observation: '255+1 得到 y=0、carry=1、zero=1；0−1 得到 y=255、carry=1（这里表示借位）。移位中的 carry 是被移出的原始位；位运算与比较的 carry 固定为 0。',
    takeaway: [['case', '操作码选择组合结果', '本课没有时钟和 busy，输入变化后重新计算。'], ['9 bits', '扩展后再保存进位', '加法先做九位运算，减法借位按 a<b 单独定义。'], ['Defaults', '每条路径都给确定结果', '完整默认值加 case 覆盖，避免输出依赖上一次的值。']],
    interface: [{ name: 'a[7:0], b[7:0]', meaning: '八位无符号操作数；移位只使用 a。' }, { name: 'op[2:0]', meaning: '0 加、1 减、2 AND、3 OR、4 XOR、5 左移、6 右移、7 无符号小于。' }, { name: 'y[7:0], carry, zero', meaning: 'y 为八位结果；carry 含义由 op 明确约定；zero=(y==0)。' }],
    reading: [
      section('01', 'ALU 是一个接口，不是一段逐条执行的程序', `<p>CPU 中的算术逻辑单元也会根据操作码选运算。本课只实现其中的组合数据通路：输入 a、b 和 op 通过运算电路与选择器产生 y，没有指令存储器，也没有取指执行循环。Verilog 的 case 描述选择关系，不能从八个分支推断它要执行八个时钟。</p><div data-practice-diagram="12"></div>${table(['op', '功能与 y', 'carry'], [['0', '(a+b) 的低八位', '九位和的最高位'], ['1', '(a−b) mod 256', 'a&lt;b 时为 1，表示借位'], ['2 / 3 / 4', 'a AND b / a OR b / a XOR b', '0'], ['5', '{a[6:0],1\'b0}', '旧 a[7]'], ['6', '{1\'b0,a[7:1]}', '旧 a[0]'], ['7', 'a&lt;b 时 8\'d1，否则 8\'d0', '0']])}<p>zero 始终来自最终 y。比如相等的两个数相减后 y=0、zero=1、carry=0。先写清各标志语义，调用者才不会把减法借位误读为“没有借位”。</p>`),
      section('02', '位宽、符号和按位运算，分别思考', `<p>加法写 <code>{1'b0,a}+{1'b0,b}</code>，两个操作数明确扩展到九位，再拆出 carry 与 y。在本例九位左值上下文中，直接写 a+b 也能保留进位；显式扩展是为了让意图清楚。若先把和存入八位临时量，进位就已经被截掉，之后再扩宽也无法恢复。减法的低八位用于回绕，借位直接判断无符号 <code>a&lt;b</code>。例如 a=0、b=1，y=255 且 borrow=1；a=200、b=1，y=199 且 borrow=0。</p><p>按位 AND 将对应两位都为 1 的位置保留；OR 是任一为 1 就保留；XOR 是两位不同为 1。a=0xA5、b=0x3C 时，AND=0x24、OR=0xBD、XOR=0x99。这些是八个并列的位运算，不是软件里的逻辑判断 <code>&amp;&amp;</code> 或 <code>||</code>。</p><p>a=0x81 时左移 y=0x02、carry=1；逻辑右移 y=0x40、carry=1。右侧高位补 0，不进行符号扩展。op=7 以<strong>无符号</strong>解释 0xFF 和 0x01，所以 255&lt;1 为假；换成 signed 的 −1&lt;1 会是另一道题。</p>`),
      section('03', '阻塞赋值和默认值让组合过程闭合', `<p>组合过程用阻塞赋值 <code>=</code>，先给 y、carry 和临时扩展结果默认值，再按 case 覆盖；case 后根据最终 y 计算 zero。默认值的含义是“这个输入组合的输出也有定义”，而不是“把硬件按时间先清零一次”。</p>${code("always @* begin\n  y = 8'd0;\n  carry = 1'b0;\n  wide = 9'd0;\n  case (op)\n    3'd0: begin\n      wide = {1'b0,a} + {1'b0,b};\n      y = wide[7:0]; carry = wide[8];\n    end\n    3'd1: begin y = a-b; carry = (a<b); end\n    // 其余六种操作同样给出完整定义\n    default: begin y = 8'd0; carry = 1'b0; end\n  endcase\n  zero = (y == 8'd0);\nend")}<p>代码片段只展示结构，完整八种操作在 design.v 中。若某个分支漏写 carry，又没默认赋值，该输出可能保留上一次结果，综合出锁存器。一个纯组合 ALU 不应根据“上一次选择什么操作”决定当前 carry。不要用非阻塞赋值制造额外 delta 周期来掩盖这个问题。</p>`),
      section('04', '测试“操作序列”，也测试每一种输入关系', `<p>没有时钟时，测试台设置 a、b、op 后延后 #1 检查，允许组合过程重新求值。参考结果要明确为九位加法、八位截断和布尔借位；不能拿主机无限精度整数直接与八位回绕结果比较。先做定向边界，再遍历全部 8×256×256=524,288 组输入，覆盖范围仍然很小。</p>${table(['用例', '预期', '抓住的错误'], [['255+1', 'y=0, carry=1, zero=1', '漏保留进位'], ['0−1', 'y=255, carry=1, zero=0', '借位极性反了'], ['0x81 右移', 'y=0x40, carry=1', '错用符号右移或取错位'], ['先加法产生 carry=1，再做 AND', 'AND 的 carry 必须回 0', '遗漏默认赋值'], ['op=7, a=128,b=127', 'y=0, carry=0, zero=1', '误做有符号比较']])}<p>每次失败报告 op、a、b、y 与两个标志。给测试台加一个总运行时限。测试末尾只在所有检查通过后打印 <code>PASS 12_alu:</code>，而不是无条件打印成功。</p>`),
      section('05', '从输出反推故障所在层', `<p>若 y 正确但 zero 错，先看 zero 是否在 case 前就用到旧 y；若所有 op 都能算但切换后 carry 不清，先看缺失赋值；若只有大于 127 的比较错，检查 signed、常量宽度和扩展。将问题缩成一对输入和一次 op 切换，比直接阅读全部波形更有效。</p><p>后续需要状态时，会把这个组合 ALU 的结果接到寄存器 D 端；组合计算与采样保存是两种职责。今天先独立证明“输入到输出的关系”，再考虑是否需要流水线、怎样满足时序。</p>`)
    ].join(''),
    codeNotes: [['always @*', '组合过程对所读输入敏感，没有 posedge，不保存跨拍状态。'], ['y = 0; carry = 0;', '先写所有输出的默认值，分支只覆盖本操作需要改变的部分。'], ["{1'b0,a}+{1'b0,b}", '九位无符号加法明确保存高位；y 取低八位。'], ['carry = (a < b);', '本课减法 carry=1 代表借位，与一些处理器的标志定义不同。'], ['zero = (y == 0);', '用阻塞赋值在分支之后计算，使它对应本次最终 y。']],
    labGuide: '运行 bash scripts/run_labs.sh 12_alu。对照操作表手算 0xA5 与 0x3C 的三种位运算，在测试台中找到加减边界和运算切换检查。确认默认赋值与最终 zero 的顺序，再添加一组 unsigned 与 signed 会给出不同答案的比较。',
    expected: '255+1→y=0,carry=1,zero=1；0−1→y=255,carry=1,zero=0；0xA5 XOR 0x3C→0x99；0x81 左移→0x02/carry1，右移→0x40/carry1。',
    waveNote: '看 a、b、op、y、carry、zero；本课没有 clk。用 Hex 观察位运算，用 Unsigned Decimal 观察比较。切换操作后留一个组合稳定区间再判断，不能把显示刷新当成一个硬件周期。',
    challenge: '临时删掉 carry 默认值，执行“255+1 → 0xA5 AND 0x3C”。观察 carry 是否错误保留 1，解释为什么只单独跑 AND=0 的测试可能漏掉它，然后恢复。',
    practice: [
      { title: '预测：逐位画出答案', task: '固定 a=0x81、b=0x01，写出 op=0、1、4、5、6、7 的 y、carry、zero。', hint: '左移保留低七位再补 0；右移高位补 0；比较看 129 和 1。', acceptance: 'y 依次为 0x82、0x80、0x80、0x02、0x40、0；carry 依次为 0、0、0、1、1、0；仅最后 zero=1。' },
      { title: '实现：加一条针对位宽的用例', task: '给测试台加入 a=128,b=128 的加法和 a=128,b=127 的比较，自行写参考值与失败信息。', hint: '第一组数学和是 256，第二组比较必须按无符号解释。', acceptance: '加法 y=0,carry=1,zero=1；比较 y=0,carry=0,zero=1；临时将加法分支改成先用八位临时量保存 a+b，再令 {carry,y}={1\'b0,临时量}；128+128 的丢失进位必须被测试发现。' },
      { title: '定位：标志跟着上一次运算走', task: '构造先让 carry=1 再切到 XOR 的序列，删除一个默认赋值复现错误，再修复。', hint: '独立验证结果和标志，不要只看 y。', acceptance: 'XOR 分支的 carry 无论前一操作是什么都为 0；恢复后全部组合检查通过。' }
    ],
    quizzes: [
      { q: '本课 a=0、b=1 做减法时，carry=1 的含义是什么？', answers: ['表示发生借位', '表示没有借位', '表示有符号结果为正'], correct: 0, explanation: '接口明确把 a<b 定义为借位，故 0−1 得到 y=255、carry=1。' },
      { q: '组合 case 中漏写某些输出且没有默认值，会有什么风险？', answers: ['自动得到零', '输出可能要保持旧值，形成锁存器', '只会让时钟慢一拍'], correct: 1, explanation: '未覆盖路径需要记住先前输出，违背纯组合接口的要求。默认值与完整分支可消除这种遗漏。' },
      { q: 'op=7，a=0xFF、b=1，本课 y 是多少？', answers: ['255', '1', '0'], correct: 2, explanation: '按无符号解释 0xFF=255，255<1 为假，比较输出八位 0。' }
    ]
  },
  {
    id: 13, lab: '13_popcount', title: 'for 并行展开与八拍迭代', subtitle: '写八次运算，不等于等待八个时钟。',
    description: '用两种硬件统计一个字节里 1 的个数：组合 for 立刻给出当前输入的结果，迭代电路锁存一次输入并用八拍完成。通过 busy/done、输入快照和最后一位，理解面积、延迟与握手。',
    duration: '约 55 分钟', tags: ['for 展开', '迭代数据通路', 'busy / done', '输入快照'],
    experiment: '并行结果在变，迭代任务仍算旧输入', prompt: 'DATA=0xA5 时在空闲发 START，接受后立刻把 DATA 改成 0xFF，并在忙时再次发 START。逐拍观察 WORK、PARTIAL、STEPS 和 DONE。',
    observation: 'parallel_count 随 DATA 变成 8，但已启动的任务仍统计 0xA5，八个忙边沿后 result=4。busy 时的 START 被忽略，DONE 只高一拍，result 随后保持。',
    takeaway: [['Unroll', 'for 是空间重复', '组合 for 展开八次加法关系，不会等八拍。'], ['Snapshot', '接受请求时锁存输入', 'work 保存 data 快照，任务不再跟随外部 data。'], ['8 edges', '第八拍算入最后一位', '完成值必须是旧 partial + 旧 work[0]，不能漏最后一位。']],
    interface: [{ name: 'clk,rst,start,data[7:0]', meaning: '同步复位；空闲边沿 start=1 接受 data，忙时忽略 start。' }, { name: 'parallel_count[3:0]', meaning: '组合统计当前 data，随 data 改变，与是否正在迭代无关。' }, { name: 'busy,done,result[3:0]', meaning: '接受后 busy=1；第八个忙边沿给出 result、busy=0、done=1；done 每拍默认清零。' }, { name: 'work[7:0],partial[3:0],steps[3:0]', meaning: '可观察迭代状态；接受时 work=data、partial=0、steps=0；每个忙边沿处理旧 work[0]。' }],
    reading: [
      section('01', '同一个 for，在硬件里并不安排时间', `<p>软件 CPU 常逐条执行循环体，因此 for 容易让人联想到八个先后步骤。组合 HDL 中边界固定的循环描述八份组合运算关系：<code>for(i=0;i&lt;8;i=i+1) count=count+data[i];</code> 在综合时展开，输入变化后整片网络求值，不自动插入时钟。</p><div data-practice-diagram="13"></div>${table(['实现', '输入属于哪一刻', '等待关系', '可能的资源取舍'], [['组合 for', '当前 data', '不等时钟，仍有传播延迟', '同时存在多个加法关系'], ['八拍迭代', '空闲 start 接受的快照', '接受沿后再处理八个忙边沿', '复用一位累加和移位状态']])}<p>综合器可优化组合求和结构，不能仅凭源码断言确切 LUT 数或最高频率。这里比较的是<strong>空间展开与时间复用的架构</strong>；真实面积与时序仍看综合、实现报告。</p>`),
      section('02', '把一次任务分成接受、工作、完成', `<p>空闲且 start=1 的上升沿只<strong>接受</strong>：busy←1，work←data，partial←0，steps←0。这一沿还没有处理输入最低位。随后每个 busy 的边沿执行 partial←旧 partial+旧 work[0]、work←旧 work&gt;&gt;1、steps←旧 steps+1。旧 steps=7 的边沿就是第八个工作沿。</p>${table(['边沿', '旧 work[0]', '更新后 partial', '更新后 steps / busy / done'], [['接受 0xA5', '不处理', '0', '0 / 1 / 0'], ['工作 1', '1', '1', '1 / 1 / 0'], ['工作 2', '0', '1', '2 / 1 / 0'], ['工作 3', '1', '2', '3 / 1 / 0'], ['工作 4…7', '0,0,1,0', '2,2,3,3', '4…7 / 1 / 0'], ['工作 8', '1', '4', '8 / 0 / 1']])}<p>本次 result 在最后一行更新为 4，之前仍保持上一次已完成任务的结果。busy=1 表示已有未完成任务，done=1 是完成事件脉冲，两者不是互为反相。若 start 一直为 1，完成沿仍走忙分支，下一空闲沿才可重新接受。</p>`),
      section('03', '非阻塞赋值不会让下一行看到新累加值', `${code("if (busy) begin\n  partial <= partial + work[0];\n  work <= work >> 1;\n  steps <= steps + 1'b1;\n  if (steps == 4'd7) begin\n    result <= partial + work[0];\n    busy <= 1'b0;\n    done <= 1'b1;\n  end\nend")}<p>右侧全部读取边沿前的旧状态。若最后写 <code>result &lt;= partial;</code>，拿到的是尚未加第八位的旧 partial。数据 0x80 的前七次读到 0，第八次才读到 1，特别适合暴露“漏最后一位”的错误。</p><p>partial、result、parallel_count 必须能保存 8，所以用四位。三位最大只有 7，会把 0xFF 的答案截成 0。work 是八位快照；测试中改变 data 只应影响 parallel_count，不应改变本次迭代结果。</p>`),
      section('04', '把等待写成有上限的测试', `<p>别只写 <code>wait(done)</code> 然后期待它永远会到。测试任务应在下降沿发 start，接受后清 start，记录参考答案，并最多观察八个工作沿。每个上升沿后 #1 检查 steps、partial、work；第八次必须完成，第九次 done 必须回 0。</p>${code("// ref_count 在发起任务时由输入字节独立计算\nfor (k=1; k<=8; k=k+1) begin\n  @(posedge clk); #1;\n  if (k<8 && (busy !== 1'b1 || done !== 1'b0))\n    $fatal(1, \"early completion step=%0d\", k);\nend\nif (done !== 1'b1 || result !== ref_count)\n  $fatal(1, \"completion mismatch\");")}<p>参考统计函数可用 integer 累加输入各位，但不要调用 DUT 的 partial 作为预期。先覆盖 0x00、0xFF、0x80、0x01、0xA5，再遍历 256 个字节。在一次 busy 窗口里改 data 和乱发 start，确认请求没有被抢占；最后检查复位能中止任务而清状态。</p>`),
      section('05', '如何描述一个可复用计算模块', `<p>把接口写成一句话：“空闲沿采样 start 与 data，八个忙边沿后 result 有效，done 脉冲通知，busy 时请求不排队。”这样上层不用知道 work 的移位方向也能使用模块。work、partial、steps 的额外端口只是教学观察窗；最终工程可以把它们放入调试层。</p><p>吞吐率也要区别延迟：一次任务的迭代部分是八拍，但接口有接受边沿，连续任务还受空闲接收规则影响。不能因为组合和迭代都用了 for，就给它们相同的周期标签。</p>`)
    ].join(''),
    codeNotes: [['for (i=0; i<8; i=i+1)', '组合循环的固定次数表示展开，循环内没有等待边沿。'], ['if (!busy && start)', '只接受空闲请求，data 在此边沿复制为 work。'], ['partial <= partial + work[0];', '每拍处理最低一位，读取旧 partial 与旧 work。'], ["if (steps == 4'd7)", '旧计数为 7 表示正在做第八次处理。'], ['result <= partial + work[0];', '把本拍最后一位一起写入结果，不能只复制旧 partial。']],
    labGuide: '运行 bash scripts/run_labs.sh 13_popcount。先逐拍手推 0x80，再看 0xA5，标出接受沿和八个忙边沿。让输入在忙时变化，区分组合答案与快照答案，最后读懂带超时的完成检查。',
    expected: '0xA5 被接受后，工作八拍得到 result=4；忙时把 data 改成 0xFF，parallel_count=8 而 result 最终仍为 4。0x80 直到第八个工作沿才把最后一个 1 加入 result。',
    waveNote: '加入 clk、rst、start、data、parallel_count、busy、done、work、partial、steps、result。接受沿不计入八个处理沿；done 只高一个时钟周期。看 work 用 Binary，partial/steps 用 Unsigned Decimal。',
    challenge: '临时将最后的 result 赋值改成 partial，用 0x01 与 0x80 对比：前者可能恰巧通过，后者必错。指出只测一个输入为什么不能证明最后一拍正确，然后恢复。',
    practice: [
      { title: '预测：把八拍写成表', task: '对 0x81 逐拍列出工作前的 work[0]、工作后的 partial/steps，标出 done。', hint: '先读最低位，再右移；最高位要等到第八次才处理。', acceptance: 'partial 在第 1…7 个工作沿后均为 1，第 8 个为 2；done 仅第 8 个工作沿后为 1。' },
      { title: '实现：让测试能抓住无响应', task: '给一次 start 增加最多八个工作边沿的检查，失败消息打印 steps 与 busy；同时验证下一拍 done=0。', hint: '不要只等 done；完成过早、过晚和持续为 1 都是错误。', acceptance: '正常输入 0xFF 得到 8；临时把完成门槛改为 8 后，测试在规定边沿主动失败而非挂住。' },
      { title: '定位：忙时输入污染任务', task: '接受 0xA5 后改 data=0，并再发 start。说明若迭代直接读 data 而非 work，哪条契约被破坏。', hint: '参考值只在请求被接受时保存，不应随外部输入变化。', acceptance: 'parallel_count 变成 0，任务仍 result=4；busy 中的第二个 start 不增加新完成脉冲。' }
    ],
    quizzes: [
      { q: '组合 always 中执行八次 for，是否自动需要八个时钟？', answers: ['是，每次循环一拍', '否，它描述展开的组合关系', '只有数据为 1 才要时钟'], correct: 1, explanation: '没有等待边沿的固定组合循环不安排时间，真实电路只有组合传播延迟。' },
      { q: '第八个工作沿写 result<=partial，为什么可能错误？', answers: ['它读取旧 partial，尚未包含最后一位', 'partial 总是九位', 'result 必须使用阻塞赋值才行'], correct: 0, explanation: '非阻塞赋值的所有右侧读取旧状态，应写旧 partial+旧 work[0] 才包含本拍处理的一位。' },
      { q: 'busy 时改变 data，会怎样？', answers: ['自动重启当前任务', 'result 立即变成新数据的计数', 'parallel_count 改变，迭代仍处理已接受快照'], correct: 2, explanation: '组合统计跟随当前 data；迭代只读取接受时锁存的 work，busy 时 start 也被忽略。' }
    ]
  },
  {
    id: 14, lab: '14_modules', title: '模块层次：定时器驱动计数器', subtitle: '模块是一直工作的硬件，不是调用一次的函数。',
    description: '把四拍节拍器与四位事件计数器拆成两个子模块，再在顶层连接起来。认识端口、实例与参数，理解同一时钟边沿跨模块仍采样旧值，避免凭源码顺序想象执行顺序。',
    duration: '约 50 分钟', tags: ['模块实例', '层次连接', '同拍旧值', '时钟使能'],
    experiment: '在相位 3 到来前，节拍就已经准备好', prompt: '完成复位后 EN=1 连走四拍，看 PHASE 和 COUNT；再在 PHASE=3 时关闭 EN，观察 TICK 被屏蔽但相位保留，重新打开后走一拍。',
    observation: 'phase 依次 1、2、3、0；第 4 拍 counter 读取边沿前已经为 1 的 tick，count 变成 1。停用时 phase/count 均保持，tick=0；模块的书写先后不决定谁“先运行”。',
    takeaway: [['Hierarchy', '实例代表一份硬件', '定时器与计数器同时存在，通过端口连线协作。'], ['Old tick', '同拍读取边沿前信号', '旧 phase=3 时组合 tick=1，该上升沿同时让 phase 回 0、count 加一。'], ['Enable', '用使能选择更新', '所有状态共用 clk，en 不用于制造新时钟。']],
    interface: [{ name: 'clk,rst,en', meaning: '所有子模块共享上升沿与同步高有效复位；en=0 保持状态。' }, { name: 'phase[1:0]', meaning: 'timer 子模块的 0…3 相位；默认周期为四拍。' }, { name: 'tick', meaning: '组合 !rst && en && phase==3，在即将计数的边沿之前有效。' }, { name: 'count[3:0]', meaning: 'counter 子模块读取旧 tick，有效时加一并按模 16 回绕。' }],
    reading: [
      section('01', '从函数分解转向硬件分解', `<p>软件函数可被调用、返回，下次调用复用同一段指令。HDL 的模块实例表示一份电路：实例化两个 timer 通常就要求两份独立状态，而不是排队调用同一个 timer。顶层 modules_demo 负责连接，timer 负责周期相位，counter 负责累计事件。</p><div data-practice-diagram="14"></div>${table(['软件中的直觉', '本课硬件中的对应', '容易误解之处'], [['函数参数', '模块端口', '端口是信号连接，不是调用时复制一遍参数'], ['调用函数', '实例化电路', '实例不会在一次返回后消失'], ['函数先后执行', '各时序块并行采样', '源码前后不规定跨模块执行顺序'], ['可配置常量', 'parameter PERIOD=4', '参数在展开设计时确定，不是运行中修改的输入']])}<p>本课把至少两个子模块写在同一个 design.v 内，保证实验能独立编译。用命名端口 <code>.clk(clk)</code>、<code>.tick(tick)</code>，比位置连接更容易检查；内部信号与端口同名是习惯，不代表它们自动相连。</p>`),
      section('02', '节拍是边沿前的组合条件', `<p>tick 明确定义为 <code>!rst &amp;&amp; en &amp;&amp; phase==3</code>。旧 phase=3 且 en=1 时，tick 在边沿到来前已经为 1；该边沿 timer 将相位回到 0，counter 同时按旧 tick 加一。边沿后 phase=0，tick 也随之回 0。</p>${table(['有效上升沿编号', '边沿前 phase / tick', '边沿后 phase / count'], [['复位沿', '任意 / 0（rst 屏蔽）', '0 / 0'], ['第 1 拍', '0 / 0', '1 / 0'], ['第 2 拍', '1 / 0', '2 / 0'], ['第 3 拍', '2 / 0', '3 / 0（随后 tick 变 1）'], ['第 4 拍', '3 / 1', '0 / 1']])}<p>所以在上升沿后 #1 观察到 tick=0，并不意味着这一拍没计数。判断“这一沿是否接收事件”应看边沿前 tick；判断新状态看边沿后 phase/count。这是连接模块时最重要的时间坐标。</p>`),
      section('03', '使能暂停进度，不重造一个时钟', `<p>en=0 时 timer 不改 phase，counter 不增加 count，组合 tick 强制为 0。若停在 phase=3，恢复 en 后 tick 立即根据现有相位变为 1，下一上升沿完成一次计数。使能保持的是当前进度，不是自动从头开始一轮。</p>${code("// timer 输出条件，所有状态仍由原始 clk 驱动\nassign tick = !rst && en && (phase == 2'd3);\n// timer 子模块\nalways @(posedge clk)\n  if (rst) phase <= 0;\n  else if (en) phase <= phase + 1'b1;\n// counter 子模块\nalways @(posedge clk)\n  if (rst) count <= 0;\n  else if (tick) count <= count + 1'b1;")}<p>不要写 <code>always @(posedge tick)</code> 来代替 counter 的时钟使能。那会把组合条件当成另一个时钟，增加时钟与约束问题。本课目标是一个时钟域内的层次划分。rst 虽然同步更新状态，仍出现在 tick 的组合屏蔽中，因此 rst 拉高会先令 tick=0，但 phase/count 要到上升沿才清零。</p>`),
      section('04', '顶层测试检查协作，子模块规则帮助定位', `<p>测试台不应只检查“很久之后 count 变了”。每个边沿保存旧 phase、旧 count 与旧 tick，计算新相位和计数，再在 NBA 后核对。暂停场景覆盖 phase=0 和 phase=3；复位场景覆盖运行中与暂停中；持续运行至少 64 个有效沿，证明四位 count 从 15 回到 0。</p>${code("@(negedge clk); en = 1;\n// 在上升沿之前按旧状态算期望，别用更新后的 tick\nold_tick = !rst && en && (phase == 3);\nold_count = count;\n@(posedge clk); #1;\nif (count !== ((old_count + old_tick) & 15))\n  $fatal(1, \"counter event mismatch\");")}<p>参考模型最好维护独立 phase_ref/count_ref，以上片段只演示采样时间。如果相位正确、计数晚一拍，检查 tick 是否误改成了寄存器；若只在暂停后出错，检查停用是否错误清 phase。成功日志为 <code>PASS 14_modules:</code>。</p>`),
      section('05', '模块边界应该隐藏什么', `<p>上层要知道 tick 的时序契约，不必依赖 timer 内部如何加法；counter 只消费每拍条件，不该去读取 timer 的内部寄存器。phase 作为教学观察输出保留，帮助解释过程，而不是鼓励上层跨层次读写内部实现。</p><p>练习改 timer 周期时，要同时修改相位范围、结束比较、位宽与测试预期。只把常量 3 改成 4，却继续用两位相位，永远到不了 4。参数化不是字符串替换，而是重新检查允许范围。</p>`)
    ].join(''),
    codeNotes: [['timer … u_timer (...);', '建立一份定时器硬件，命名实例便于波形中展开层次。'], ['counter … u_counter (...);', '建立独立计数器，连接相同 clk/rst 和 timer 的 tick。'], ['.tick(tick)', '左边是子模块端口名，括号里是当前层信号。'], ['assign tick = !rst && en && phase==3;', '组合终点条件，供同一个上升沿前采样。'], ['else if (tick) count <= count + 1;', '仍使用原始 clk；tick 是使能，不是新时钟。']],
    labGuide: '运行 bash scripts/run_labs.sh 14_modules。在 design.v 中找顶层和两个子模块，画出每个端口的来源。逐拍验证四拍一次事件；在 phase=3 暂停两拍再恢复，最后检查 count 回绕。',
    expected: '从已复位状态连续使能，前四拍后的 phase=1,2,3,0，count=0,0,0,1。停在 phase=3 时 en=0，tick=0 且状态保持；恢复后的第一个上升沿 count 加一。',
    waveNote: '看 clk、rst、en、phase、tick、count，并展开 dut 的两个实例确认连接。放大第 4 拍：tick 在边沿前为 1、边沿后为 0，count 在边沿后增加；不要用边沿后的 tick 反推本拍事件。',
    challenge: '临时把 tick 改成时钟过程输出，保持 counter 不变，比较计数变晚的原因。说明新接口改变了哪些边沿，再恢复组合 tick 契约。',
    practice: [
      { title: '预测：暂停在终点', task: '让 phase 到 3，在下一上升沿前关闭 en，保持两拍，再重新打开一拍。写出 phase/tick/count。', hint: 'tick 受 en 组合屏蔽；暂停不把 phase 归零。', acceptance: '暂停中 phase=3、tick=0、count 保持；恢复后首沿 phase=0、count 增 1，沿后 tick=0。' },
      { title: '实现：独立的小模块连接', task: '不改变功能，把 timer 与 counter 的端口连线重新画出来，再用命名端口从头写一个同接口顶层。', hint: '两个实例共用 clk/rst；只有 timer 读 en，counter 读 tick。', acceptance: '与原顶层在至少 80 个含暂停和复位的边沿上，phase/tick/count 逐拍一致，且 count 覆盖一次 15→0。' },
      { title: '定位：计数总晚一拍', task: '把 tick 临时注册一拍，找到旧 phase=3 的边沿，解释 counter 此时读到哪个 tick。', hint: '跨模块同拍读取依旧是旧值，实例写在文件前面也不会先更新。', acceptance: '能指出错误来自接口从组合事件变成延迟事件；恢复后计数发生于旧 phase=3 的原定边沿。' }
    ],
    quizzes: [
      { q: '两个子模块在同一 clk 上升沿更新，哪个先看到另一个的新寄存器值？', answers: ['文件里写在前面的模块', '实例名较短的模块', '都按边沿前旧值采样'], correct: 2, explanation: '模块不是按源文件顺序调用的函数，非阻塞时序逻辑共同采样旧状态。' },
      { q: '旧 phase=3、en=1、rst=0，上升沿后是什么？', answers: ['phase=0，count 加一', 'phase=0，count 不变，下一拍再加', 'phase 保持 3'], correct: 0, explanation: '边沿前组合 tick 已为 1；同一边沿 timer 回零，counter 接收这个旧 tick。' },
      { q: '为什么 counter 不用 posedge tick 作时钟？', answers: ['因为 tick 永远为 0', '本课用原 clk 加事件使能，保持单一时钟域', '因为模块不能有时钟'], correct: 1, explanation: 'tick 是组合条件，作为使能能让所有状态在原 clk 上同步更新，避免额外制造时钟。' }
    ]
  },
  {
    id: 15, lab: '15_debounce', title: '两级同步与连续样本消抖', subtitle: '先接住异步信号，再判断它是否足够稳定。',
    description: '把一个有抖动的原始输入变成稳定电平与单拍按下事件。分清同步和消抖的职责，用旧值逐拍追踪 meta、sync、计数器，认识数字仿真不能证明的模拟亚稳态边界。',
    duration: '约 55 分钟', tags: ['异步输入', '两级同步', '连续三样本', '事件脉冲'],
    experiment: '几个短尖峰，能不能算一次按下？', prompt: '给 RAW 短暂的 1/0 交替，再持续为 1。逐拍记录 META、SYNC、BOUNCE_COUNT；观察 STABLE 改变与 PRESS 脉冲。再持续为 0 看释放。',
    observation: 'raw 先进入 meta，再进入 sync，消抖逻辑读旧 sync。需要三个连续、不同于 stable 的同步样本才改变 stable；只在稳定变为 1 时生成一拍 press，稳定释放不生成 press。',
    takeaway: [['Synchronize', '两级处理跨时钟采样风险', '降低亚稳态传播概率，不能在纯数字波形中证明风险消失。'], ['3 samples', '连续不同才确认', '遇到与 stable 相同的同步样本就清计数，不能累计零散尖峰。'], ['Pulse', '稳定电平与事件分开', 'stable 可持续很多拍，press 只表示稳定按下的那一拍。']],
    interface: [{ name: 'clk,rst,raw', meaning: '同步高有效复位；raw 是相对于 clk 的外部原始电平。' }, { name: 'meta,sync', meaning: '每拍 meta<=raw，sync<=旧 meta；消抖规则读取旧 sync。' }, { name: 'stable,press', meaning: 'stable 为确认后的电平；press 每拍默认 0，只在 stable 从 0 确认到 1 时脉冲。' }, { name: 'bounce_count[1:0]', meaning: '连续不同样本累计为 0→1→2，第 3 个样本（旧计数=2）确认改变并清零。' }],
    reading: [
      section('01', '同步与消抖解决两种不同的问题', `<p>原始按钮信号可能在时钟采样窗口附近变化，也可能因机械接触产生多次跳变。<strong>两级同步器</strong>给第一级的亚稳状态更多恢复时间；<strong>消抖器</strong>要求输入在多个采样点连续一致，过滤数字层面上的短暂变化。前者不等于后者，去掉任何一层都不能声称解决了全部问题。</p><div data-practice-diagram="15"></div>${table(['现象', '本课用什么处理', '验证边界'], [['异步变化靠近采样边沿', 'meta→sync 两级触发器', '数字仿真展示延迟，不能模拟真实模拟恢复概率'], ['采样后出现 1/0/1 短跳变', '连续三个不同于 stable 的样本', '可用确定的输入序列逐拍验证'], ['长按导致多次计数', '稳定电平转单拍 press', '按住时 stable=1，但 press 只出现一次']])}<p>真实同步器的可靠性还依赖器件、时钟频率、布置与约束。课程没有实际引脚或板卡证据，不把仿真“没有 X”解释为硬件没有亚稳态。</p>`),
      section('02', '三层寄存器读取的是三份旧状态', `<p>同一个上升沿执行 <code>meta&lt;=raw; sync&lt;=meta;</code>，第二级得到旧 meta，消抖判断得到旧 sync，不会在这一拍直通 raw。若复位后 raw 在第一个采样沿前保持为 1，可得到下面的过程。</p>${table(['边沿', '沿前 meta/sync/count', '沿后 meta/sync/count', '沿后 stable / press'], [['1', '0 / 0 / 0', '1 / 0 / 0', '0 / 0'], ['2', '1 / 0 / 0', '1 / 1 / 0', '0 / 0'], ['3', '1 / 1 / 0', '1 / 1 / 1', '0 / 0'], ['4', '1 / 1 / 1', '1 / 1 / 2', '0 / 0'], ['5', '1 / 1 / 2', '1 / 1 / 0', '1 / 1'], ['6', '1 / 1 / 0', '1 / 1 / 0', '1 / 0']])}<p>“三样本”说的是消抖器消费的连续同步样本，不是 raw 变高后三个任意时钟。把延迟分成同步链和确认链，才能正确预测 press 在哪个边沿出现。</p>`),
      section('03', '计数的是连续候选样本，不是累计按下次数', `${code("press <= 1'b0;\nif (sync == stable) bounce_count <= 0;\nelse if (bounce_count == 2) begin\n  stable <= sync;\n  press <= sync;\n  bounce_count <= 0;\nend else bounce_count <= bounce_count + 1'b1;")}<p>这段处于非复位时钟分支，所有右侧是旧值。stable=0 时，sync 的序列 1,1,0,1,1,1 使 count 先到 1、2，然后遇 0 清零，再从头数，最后一个 1 才确认按下。若只在 raw 为 1 时加计数、为 0 时不清，就会把零散噪声凑成“稳定”。</p><p>确认释放时旧 sync=0、旧 stable=1，第三个低样本令 stable=0、press=0。press 不能简单写成 stable，因为长按会持续高；也不能只在确认按下时赋值 1 而忘记每拍默认 0，否则它不会自动缩成单拍。</p>`),
      section('04', '测试噪声要看同步后的窗口', `<p>先让 raw 在下降沿改变，避免与数字采样竞争；这只是可重复的测试刺激，不是假装物理输入同步了。设计参考模型保存 meta_ref、sync_ref、stable_ref、count_ref，先用旧 sync_ref 算消抖，再推进同步链，或者显式保存 old 变量，不能用阻塞赋值把同步两级串成同拍直通。</p>${table(['测试场景', '必须检查', '失败通常意味着'], [['一拍高尖峰后回低', 'stable 不变、无 press', '错误累计或阈值太小'], ['同步样本 1,1,0,1,1,1', '只最后确认一次', '计数未在匹配 stable 时清零'], ['持续高十拍', 'stable=1，press 总数为 1', '事件脉冲未清'], ['持续低直到释放', 'stable=0，无新 press', '把释放也当按下'], ['处理中复位', 'meta/sync/stable/press/count 全清零', '未覆盖完整状态']])}<p>检查“总 press 次数”时，统计边沿后脉冲，不要仅肉眼扫波形。每个稳定阶段给出有限等待上限，避免过滤器永不确认仍被误判通过。成功打印 <code>PASS 15_debounce:</code>。</p>`),
      section('05', '从玩具阈值迁移到可计算的需求', `<p>三拍阈值只是为了在波形中看清，不是声称真实按钮三拍就足够。若已知采样时钟周期 T，希望连续确认时间不少于 W，需要依据采样策略选择 N，使 N×T 达到需求，同时把两级同步延迟算入用户可见响应。大时钟频率下三个周期可能仅几十纳秒，远小于常见机械抖动持续时间。</p><p>不要把 raw 接到一个新时钟端，也不要把这个单比特同步器直接套到多位数据总线：各位独立同步并不保证一个完整字的数据一致。今天建立的是单比特电平与按下事件契约。</p>`)
    ].join(''),
    codeNotes: [['meta <= raw; sync <= meta;', '同时更新但分别读取旧值，形成两级采样路径。'], ['if (sync == stable)', '使用旧同步电平；回到已确认电平就清除候选计数。'], ['bounce_count == 2', '旧计数已经看到两个不同样本，当前是第三个。'], ['press <= 0;', '每个非复位边沿先安排清零，确认按下时再覆盖为 1。'], ['press <= sync;', '确认到高电平才报按下；确认释放到低电平不报按下。']],
    labGuide: '运行 bash scripts/run_labs.sh 15_debounce。按逐拍表核对持续高输入的五个边沿，再找到尖峰、打断计数、长按和释放场景。自己统计 press 数量，说明数字仿真验证的是过滤算法与采样延迟。',
    expected: '从全零复位状态开始，raw 连续为 1 且在第 1 沿前稳定：第 1 沿 meta=1，第 2 沿 sync=1，第 3/4 沿 count=1/2，第 5 沿 stable=1、press=1，第 6 沿 press=0。',
    waveNote: '看 raw、meta、sync、stable、bounce_count、press、clk、rst。为每条跳变标注它被下一层消费的边沿；消抖读取旧 sync，比看到 sync 新值还要等一次处理沿。数字 X 不等于真实亚稳态波形。',
    challenge: '将计数遇到匹配样本时的清零临时删除，构造 1,1,0,1 的同步样本序列，证明零散高电平可能被拼成错误按下，然后恢复并用自检锁定。',
    practice: [
      { title: '预测：样本中断后从头数', task: '假设 stable=0，消抖依次消费 sync=1,1,0,1,1,1，写每拍 count、stable、press。', hint: '这里给的是被消费的旧 sync，不必再额外加同步链延迟。', acceptance: 'count=1,2,0,1,2,0；stable 只最后变 1，press 只最后为 1。' },
      { title: '实现：检查按住和释放', task: '编写任务持续 raw=1 十二拍，再持续 raw=0 十二拍，统计按下脉冲，检查稳定电平最终值。', hint: '每次上升沿后 #1 统计 press；切换 raw 放下降沿。', acceptance: '按住阶段恰有一个 press；释放阶段零个 press；最终 stable=0、count=0，整个过程带超时。' },
      { title: '定位：为什么只等三拍没 press？', task: '从复位状态给 raw=1，在第 3 拍记录全部五个状态，指出三样本计数从哪里开始。', hint: '同步器与消抖器都在同一沿读旧值。', acceptance: '第 3 沿后 meta=1、sync=1、count=1、stable=0、press=0；第 5 沿才确认，而非判定设计漏事件。' }
    ],
    quizzes: [
      { q: '消抖时看到 sync=1,1,0,1，而 stable=0，应当确认按下吗？', answers: ['应当，累计有三个 1', '不应，0 打断连续计数', '只看 raw 最后值'], correct: 1, explanation: '算法要求连续三个不同于 stable 的同步样本，匹配 stable 的 0 会清零候选计数。' },
      { q: '两级同步器在数字仿真里没有 X，能证明硬件绝无亚稳态吗？', answers: ['能，因为两级已经完全消除风险', '只要仿真时间长就能', '不能，数字模型不证明模拟亚稳态风险消失'], correct: 2, explanation: '两级结构降低传播概率，实际可靠性还受器件、时序与实现影响，纯数字仿真只展示逻辑行为。' },
      { q: '确认稳定释放到 0 的那一拍，press 是多少？', answers: ['0', '1', '保持上一次的 1'], correct: 0, explanation: 'press 表示确认按下，确认分支写 press<=旧 sync；释放样本为 0，并且每拍都有清零默认。' }
    ]
  },
  {
    id: 16, lab: '16_shift', title: '移位寄存器与串并转换', subtitle: '一根线传八次，重建一个字节。',
    description: '做一个有并行装载、串行移入和组合统计的八位寄存器。通过输入方向、移出采样时刻、使能暂停与装载优先级，提前练好 UART 中的数据打包与位顺序。',
    duration: '约 45 分钟', tags: ['拼接', 'MSB-first', '并行装载', '边沿前采样'],
    experiment: '先移出的那一位，什么时候还在输出上？', prompt: '装载 0xA5，沿前记下 SERIAL_OUT，再使能移位并送入 0。连续八次比较“移出的旧位”和“边沿后的新输出”；清零后输入 1,0,1,0,0,1,0,1。',
    observation: '移位规则是 q={旧 q[6:0],serial_in}，串行输出始终是当前 q[7]。旧 MSB 必须在移位沿前读取；按 MSB-first 连续送八位后 q=0xA5。load 与 en 同时为 1 时只装载。',
    takeaway: [['Direction', '移位方向是协议约定', '输入进入最低位、旧数据向高位移动，连续八次 MSB-first 重建字节。'], ['Before edge', '移出旧位要在边沿前看', 'serial_out 是 q[7] 的连线，没有另存一份上一拍值。'], ['Load first', '装载优先于移位', 'rst > load > en > 保持，ones 始终统计当前 q。']],
    interface: [{ name: 'clk,rst,load,en', meaning: '同步高有效复位清 q；load 优先装载，未装载且 en=1 才移位。' }, { name: 'serial_in,parallel_in[7:0]', meaning: '移位时低位接 serial_in；装载时一次接收 parallel_in。' }, { name: 'q[7:0],serial_out', meaning: 'q 保存当前字节；serial_out=当前 q[7]，旧移出位需在边沿前采样。' }, { name: 'ones[3:0]', meaning: '组合统计当前 q 的 1 个数，范围 0…8。' }],
    reading: [
      section('01', '存储八位，连接方式决定串并转换', `<p>寄存器的每位都能同时采样，只是本课把相邻位串成“接力”：q[7] 的下一值来自旧 q[6]，一直到 q[1] 来自旧 q[0]，q[0] 的下一值来自 serial_in。拼接 <code>{q[6:0],serial_in}</code> 一次描述八个 D 端连接，不是让一个比特沿电路物理跑过八级才停下。</p><div data-practice-diagram="16"></div><p>CPU 做位移时得到一条运算结果；这里 q 还会在每次上升沿保存结果，因此可以用八次采样把串行位流拼成一个字节。所有级别同一沿读取旧值，不能用阻塞赋值从低位逐个写到高位，否则可能在仿真中把一个新位一拍复制到全部位置。</p>`),
      section('02', '先约定顺序，再写接线', `${table(['操作', '边沿前', '边沿后', '意义'], [['装载', 'parallel_in=0xA5', 'q=10100101', '八位同时进入'], ['移入 0', 'q=10100101，serial_out=1', 'q=01001010，serial_out=0', '旧最高位被移出'], ['再移入 1', 'q=01001010，serial_out=0', 'q=10010101，serial_out=1', '新位进入最低位'], ['en=0 且 load=0', 'serial_in 任意变化', 'q 保持', '没有接收位']])}<p>从零开始依次输入 1,0,1,0,0,1,0,1，q 依次为 01、02、05、0A、14、29、52、A5。最先输入的位经历最多次左移，最终位于 q[7]，所以这条接法重建字节时用 <strong>MSB-first</strong>。</p><p>UART 的数据位采用 LSB-first；不能直接把今天的位序约定照搬过去。后面的 UART 接收器将按位索引写入 shift[bit_index]，使线路先来的最低位进入正确位置。位顺序和电路移位方向必须一起推导。</p>`),
      section('03', '串行输出不是“刚才移出的位”寄存器', `<p><code>assign serial_out=q[7];</code> 表示此刻的最高位。接收另一颗移位寄存器时，它可在同一个上升沿采到旧 q[7]；但测试台在该沿之后 #1 看到的是移位后的新 q[7]。想验证移出序列，必须在沿前保存 expected_out，再让时钟推进。</p>${code("@(negedge clk); en=1; serial_in=0;\nold_q = q;\nold_out = serial_out; // 沿前的移出位\n@(posedge clk); #1;\nif (old_out !== old_q[7]) $fatal(1, \"old MSB\");\nif (q !== {old_q[6:0],1'b0}) $fatal(1, \"shift\");")}<p>ones 是组合输出，q 改变后重新计数；0xA5 的 ones=4，装载 0xFF 时为 8。四位才装得下 8。ones 不把移出过的 1 累加成历史总数，它只描述当前窗口内的位。</p>`),
      section('04', '一份有顺序的自检比单次移位更有用', `<p>编写“发送八位”的测试任务，输入一个字节和有效位掩码；任务逐位在下降沿驱动 serial_in，只有 en=1 的上升沿才更新参考 q。插入两拍 en=0 的空档，证明暂停不会丢位；在中途同时拉高 load 与 en，证明装载完全覆盖移位。</p>${table(['验收场景', '具体预期'], [['复位后 MSB-first 输入 0xA5', '八个有效移位沿后 q=0xA5、ones=4'], ['装载 0xA5，连续移入八个 0', '沿前移出序列 1,0,1,0,0,1,0,1，最终 q=0'], ['load=en=1，parallel_in=0x3C', '该沿 q=0x3C，不执行附加移位'], ['八位输入中暂停两拍', '第八个有效沿结果仍正确，总墙钟时间多两拍'], ['复位与装载同时有效', 'q=0，serial_out=0，ones=0']])}<p>失败信息同时打印“墙钟边沿编号”和“已经接收的有效位数”，可以区分时钟在走和数据是否前进。成功打印 <code>PASS 16_shift:</code>。</p>`),
      section('05', '从滑动窗口走向协议', `<p>如果继续不断移位，q 总保存最近接收的八个位，是一个八位滑动窗口；若每八位发出一次 byte_valid，就有了简单的串并转换模块。但它还不知道字节从哪里开始。真实串行协议需要起始位、位周期、结束条件，不能仅靠“数满八个时钟”恢复任意异步线路上的数据。</p><p>本课先把装载、暂停和位序做对；下一组存储与队列课将解决“字节来得比处理快时放在哪里”，UART 课再解决“何时采样一位”。每个模块承担一个清楚的问题。</p>`)
    ].join(''),
    codeNotes: [['q <= {q[6:0], serial_in};', '右侧使用旧 q，八位同时更新；输入进 bit0，旧位向 bit7 前进。'], ['else if (load) … else if (en) …', '装载优先于移位，均关闭则保持寄存器。'], ['assign serial_out = q[7];', '组合连接当前最高位，沿后看到的新值不是刚刚移出的旧值。'], ['ones = ones + q[i];', '组合循环统计当前窗口，循环开始先把 ones 设为 0。'], ['old_out = serial_out;', '测试台沿前保存移出位，用于验证实际串行序列。']],
    labGuide: '运行 bash scripts/run_labs.sh 16_shift。沿前记录输出，沿后记录 q；对照 01→02→05→0A→14→29→52→A5 的输入过程。加入使能空档并按有效位数而非总时钟数判断完成。',
    expected: '从 q=0 输入 MSB-first 的 0xA5，八次有效移位后 q=0xA5、ones=4。装载 A5 后移入八个 0，旧输出依次为 1,0,1,0,0,1,0,1，最终 q=0。',
    waveNote: '看 clk、rst、load、en、serial_in、parallel_in、q、serial_out、ones。q 用 Binary 可看出每次整体左移；把光标放边沿前读移出位，边沿后读新 q，避免把两者错开一位。',
    challenge: '把测试台输入字节改为 0x96，再故意按 LSB-first 发送。预测最终得到位反转值 0x69；解释不是寄存器坏了，而是位序契约不匹配。',
    practice: [
      { title: '预测：两个时间点的串行输出', task: '装载 q=0xC1，移入 0 一次，写出沿前 serial_out、沿后 q、沿后 serial_out 与 ones。', hint: '0xC1=11000001；输出只是当前 bit7。', acceptance: '沿前输出 1；沿后 q=0x82、serial_out=1、ones=2。再移入 0 后 q=0x04，沿后输出才为 0。' },
      { title: '实现：带空档传一个字节', task: '为 0x96 写 MSB-first 发送任务，在第 3 位后插入两拍 en=0，逐拍维护参考移位值。', hint: '暂停拍 serial_in 可变化，参考值只在 en=1 且未 load 时更新。', acceptance: '共十个时钟沿、八个有效移位，最终 q=0x96、ones=4；任意暂停拍 q 不变。' },
      { title: '定位：移出序列为什么少了第一位？', task: '比较在 posedge 后读取 serial_out 与沿前读取的两组记录，修正验证任务。', hint: '输出没有独立的“上一移出位”寄存器。', acceptance: '装载 A5 后能严格得到 1,0,1,0,0,1,0,1；错误任务至少第一位不匹配，修正后完整序列通过。' }
    ],
    quizzes: [
      { q: '从 0 开始，要用本课左移接法重建字节，应按什么顺序送入？', answers: ['最低位先来', '每位重复两次', '最高位先来'], correct: 2, explanation: '最先输入的位会经历七次后续左移并最终到 bit7，因此重建字节采用 MSB-first。' },
      { q: 'load=1、en=1 的一个边沿会做什么？', answers: ['只装载 parallel_in', '先装载再移位', '只移位'], correct: 0, explanation: '优先级是 rst>load>en>保持，装载分支命中后不执行移位分支。' },
      { q: 'serial_out 在移位边沿之后代表什么？', answers: ['专门保存的刚移出旧位', '新 q 的最高位', '本拍 serial_in'], correct: 1, explanation: '它由 assign serial_out=q[7] 直接连接；要验证旧移出位必须在边沿前采样。' }
    ]
  },
  {
    id: 17, lab: '17_memory', title: '同步 RAM：地址、有效位与读写冲突', subtitle: '有四个位置可以写，但没写过的内容不是零。',
    description: '实现一个 4×8 单端口教学存储器。分开理解数组内容和输出寄存器，亲自验证未写未知值、同步读、同址 read-first 以及复位保留内容，避免把软件数组初始化直觉搬到硬件。',
    duration: '约 55 分钟', tags: ['4×8 RAM', '同步读', 'read-first', '未知值 X'],
    experiment: '同一个地址一边读一边写，读到新还是旧？', prompt: '复位后先读尚未写过的地址，再给地址 1 写入 0x12。下一次同址同时读写 0x34，看 RDATA；之后只读一次，再复位并重读地址 1。',
    observation: '未写位置读出 X，rvalid=1 只说明读操作完成，不代表数值已初始化。同址读写先输出旧 0x12，存储格变成 0x34；再读得到 0x34。复位清输出但不清存储格。',
    takeaway: [['Synchronous', '读结果在上升沿后出现', '地址变化不会立即改 rdata；rvalid 表示这一拍有读操作。'], ['Read first', '同址冲突返回旧内容', '读写都读取边沿前状态，写入不穿透到本拍读结果。'], ['Unknown', '复位输出不等于初始化 RAM', '未写单元保持 X，测试台必须记录哪些地址已经写过。']],
    interface: [{ name: 'clk,rst,we,re', meaning: '同步高有效复位只清 rdata/rvalid；非复位沿 we 写、re 读，可以同时为 1。' }, { name: 'addr[1:0],wdata[7:0]', meaning: '一个共享地址选择四个八位存储格之一；读写同拍只能操作这个地址。' }, { name: 'rdata[7:0],rvalid', meaning: 're=1 的非复位沿 rdata<=旧 mem[addr]，rvalid<=1；re=0 时 rdata 保持、rvalid=0。' }, { name: 'mem[0:3] / 测试台 m0…m3', meaning: '数组未写位置未知；顶层观察线可导出内容，rst 不修改数组。' }],
    reading: [
      section('01', '地址选择一个位置，不是选择一根数据位', `<p><code>reg [7:0] mem [0:3];</code> 表示四个元素，每个元素八位。addr 的两位编号 0…3，选择其中一个字节；wdata 的八位是要写进去的内容。它与 <code>reg [3:0] q</code> 的四位寄存器不是同一种尺寸。用“深度×宽度”描述，本课是 4×8，共 32 个数据位。</p><div data-practice-diagram="17"></div>${table(['对象', '本课含义', '变化时机'], [['mem[addr]', '某地址保存的字节', '非复位且 we=1 的上升沿'], ['rdata', '上一次读出的输出寄存器', '非复位且 re=1 的上升沿，或复位清零'], ['rvalid', '最近一个边沿是否执行读', '每拍更新，复位为 0'], ['addr', '当前选中位置', '只是选择线，改地址不自动改变 rdata']])}<p>软件数组常由语言运行时或程序显式初始化；这里没有“自动填零”的承诺。即使网页模型先给过复位，RAM 单元仍然可能未知。小数组如何映射为触发器、分布式 RAM 或块 RAM，要看综合器与写法，不能把四个字节直接称为必然使用 BRAM。</p>`),
      section('02', '同步读和输出保持是两条规则', `${code("always @(posedge clk) begin\n  if (rst) begin\n    rdata <= 8'd0;\n    rvalid <= 1'b0;\n  end else begin\n    rvalid <= re;\n    if (we) mem[addr] <= wdata;\n    if (re) rdata <= mem[addr];\n  end\nend")}<p>读请求在边沿前给出 re 和 addr，结果在这个边沿的非阻塞更新之后可见。若 re=0，rdata 保持上一次结果，但 rvalid 变成 0；不能看见总线上有一个旧字节，就当作又收到一条新数据。</p><p>同步复位时两条 RAM 访问都被跳过，因此 rst 与 we 同时有效不会写存储。复位只是重置接口输出，不遍历数组；这让“系统重新开始”和“数据存储清空”成为两件可以独立定义的事。</p>`),
      section('03', 'read-first 从旧值采样自然得到', `${table(['步骤', '边沿前 mem[1]', '控制', '边沿后 mem[1] / rdata / rvalid'], [['第一次读未知', 'X', 're=1,we=0', 'X / X / 1'], ['写入 0x12', 'X', 'we=1,re=0,wdata=12', '12 / 保持 / 0'], ['同址读写 0x34', '12', 'we=re=1,wdata=34', '34 / 12 / 1'], ['再次读取', '34', 're=1,we=0', '34 / 34 / 1'], ['复位', '34', 'rst=1', '34 / 00 / 0'], ['复位后读取', '34', 'rst=0,re=1', '34 / 34 / 1']])}<p>非阻塞赋值先取右侧旧值，所以同址同时写 34 和读出 12 是完全一致的接口行为。它称为 read-first（旧数据）策略。其他存储器也可能定义 write-first 或 no-change，需要查对应接口，不要用“RAM 本来就这样”概括所有实现。</p><p>这里是单地址端口，不能在同拍写地址 1、读地址 2。若要同时使用两个地址，接口就要新增读/写地址或独立端口，硬件资源与冲突规则也随之改变。</p>`),
      section('04', 'scoreboard 不仅记数据，还记已知性', `<p>参考模型建立 ref_mem[0:3] 与 written[0:3]。开始 written 全为 0；接受写入后置相应标志为 1。读检查先依据边沿前 written 判断：已写位置严格比较数值，未写位置验证未知；同址读写要先取旧参考值，再更新 ref_mem。</p>${code("// 在边沿前保存本次读的旧参考值\nexpected_known = written[addr];\nexpected_data = ref_mem[addr];\n@(posedge clk); #1;\nif (re && expected_known && rdata !== expected_data)\n  $fatal(1, \"RAM read mismatch\");\nif (re && !expected_known && (^rdata !== 1'bx))\n  $fatal(1, \"unwritten memory should be unknown\");")}<p>在 SystemVerilog 测试台也可用 <code>$isunknown(rdata)</code>。不能给整个测试使用 <code>==</code> 并把 X 当作正常 false 跳过，也不要为了让波形好看而在 DUT 复位循环清 RAM。参考的 written 标志在只重置接口的 rst 后同样要保留；否则测试台和设计契约不一致。</p>`),
      section('05', '观察内部存储格，仍以端口行为为验收', `<p>测试台可声明顶层 wire m0…m3 分别连接 dut.mem[0]…dut.mem[3]，以便波形导出显示每个格子。但正常功能判断仍通过 re/rdata/rvalid 完成：先读未知，再写满四个地址，验证地址独立，再做同址冲突与复位保留。</p><p>为随机序列加入独立地址/数据参考与每次接受事件记录；失败时打印地址、写前内容、读期望和实际值，能区分地址错、读延迟错和写穿透错。测试成功打印 <code>PASS 17_memory:</code>，不把没有覆盖到的存储器类型也算作已验证。</p>`)
    ].join(''),
    codeNotes: [['reg [7:0] mem [0:3];', '深度为四、每格八位；声明不自动把格子清零。'], ['rvalid <= re;', '非复位时每拍更新有效标志；re=0 不代表要清 rdata。'], ['if (we) mem[addr] <= wdata;', '同一边沿写入所选地址，新值在 NBA 阶段出现。'], ['if (re) rdata <= mem[addr];', '读取边沿前存储内容，因此同址冲突是 read-first。'], ['rst 分支只清 rdata/rvalid', '数组保留；rst 同时屏蔽该沿的读写，不把复位当作 RAM 清空。']],
    labGuide: '运行 bash scripts/run_labs.sh 17_memory。先确认未写地址的 X 没被网页或参考模型伪装为 0，再看写入、读有效、同址读写与复位保留。把 m0…m3 加入波形并对照端口，说明接口复位和数组初始化为何不同。',
    expected: '同址已存 0x12 时，we=re=1 写 0x34 的边沿之后 mem=0x34、rdata=0x12、rvalid=1。下一次只读得到 0x34。rst 边沿后 rdata=0、rvalid=0，但再读仍为 0x34。',
    waveNote: '看 clk、rst、we、re、addr、wdata、rdata、rvalid、m0…m3。X 表示未确定数字值，不能当 0。rvalid 为 0 时 rdata 可能保持旧结果；同址冲突先看沿前存储格，再看沿后读输出与新存储格。',
    challenge: '故意把读路径改成 we ? wdata : mem[addr]，它变成 write-first。找到哪个同址用例应失败，说明这不是随机仿真现象，而是接口行为被改变，然后恢复。',
    practice: [
      { title: '预测：读有效不代表数值已知', task: '从新仿真开始，复位后读地址 2；再 re=0 保持一拍；写 0x55 后再读。列出 rdata/rvalid。', hint: '首次读的格子未写；停止读不会自动清输出。', acceptance: '首次为 X/1，停止读为 X/0，写入沿 rvalid=0，随后读为 0x55/1；不能把未知值硬编码为零。' },
      { title: '实现：建立四格 scoreboard', task: '在测试台维护四个参考字节和四个 written 标志，覆盖每个地址写后读、同址读写和复位后重读。', hint: '同址冲突先得到旧读预期，再更新参考存储；rst 不清 written。', acceptance: '四地址互不污染；冲突读旧值；复位后全部已写值保留；失败消息包含地址与期望/实际。' },
      { title: '定位：复位后数据为何不见了？', task: '临时在 rst 分支加入 for 清数组，运行复位保留测试，定位是哪一条契约被破坏。', hint: '清输出寄存器与清数据阵列不是同一项需求。', acceptance: '测试必须抓住重读已写地址得到 0 的错误；删除清数组后恢复通过，并保留首次读 X 的检查。' }
    ],
    quizzes: [
      { q: '新仿真里复位后读取从未写过的 RAM 位置，rdata 应怎样理解？', answers: ['必须是 0', '必须是 255', '可能为未知 X，复位没有初始化数组'], correct: 2, explanation: '本课仅复位输出寄存器和有效标志，未写单元未定义，不应伪造零值。' },
      { q: '同地址旧值为 0x12，同拍读并写 0x34，读输出是什么？', answers: ['0x12', '0x34', '固定为 0'], correct: 0, explanation: 'read-first 规则读取旧 mem，非阻塞写在随后提交；新存储值为 0x34，读输出仍为旧 0x12。' },
      { q: 're=0 的普通边沿，rdata 与 rvalid 怎样变化？', answers: ['两者清零', 'rdata 保持、rvalid=0', 'rdata 变成当前 addr 的内容'], correct: 1, explanation: 'rdata 只在读或复位时更新；rvalid 每拍等于是否执行读，防止把旧总线内容重复消费。' }
    ]
  },
  {
    id: 18, lab: '18_fifo', title: '四深度 FIFO 与边界握手', subtitle: '先决定接不接受，再改变指针和数量。',
    description: '用四格存储、两个指针和一个计数器建立先进先出缓冲。明确空/满时同时 push/pop 的策略，区分组合 head 与弹出寄存器 dout，亲手写一个按接受事件更新的队列 scoreboard。',
    duration: '约 65 分钟', tags: ['环形队列', '接受事件', '空满边界', 'scoreboard'],
    experiment: '满队列同时出一个、进一个，旧队头去哪了？', prompt: '先推入 0x11、22、33、44 填满；令 PUSH=POP=1 且 DIN=0x55。看 accepted_push/pop、DOUT、新 HEAD 与 COUNT。然后清空，在空队列同时推拉。',
    observation: '满队列同时操作，两边都接受，dout 得到旧头 0x11，新队列为 22,33,44,55，count 仍为 4。空队列同时推拉只接受 push，没有直通，dout 保持；新字节成为 head。',
    takeaway: [['Accepted', '请求不等于实际发生', '只在 accepted_push/pop 为真时写数据、推进指针和统计事件。'], ['Boundary', '空满策略是接口的一部分', '空时双请求只入；满时若同时成功出队则允许入队。'], ['Old head', '同拍出队拿旧队头', '存储和指针一起更新，但 dout 读取沿前 head。']],
    interface: [{ name: 'clk,rst,push,pop,din[7:0]', meaning: '同步复位清指针、计数与 dout，不清数组；push/pop 是请求。' }, { name: 'head[7:0],dout[7:0]', meaning: 'head 为组合队头，空时固定 0；dout 只在成功 pop 边沿保存旧 head。' }, { name: 'count[2:0],full,empty', meaning: '占用量 0…4；empty=(count==0)，full=(count==4)。' }, { name: 'accepted_pop / accepted_push', meaning: '沿前组合判断：pop&&!empty&&!rst；push&&(!full||accepted_pop)&&!rst。' }, { name: 'wptr[1:0],rptr[1:0]', meaning: '环形写/读指针，只在相应请求被接受时加一，按模 4 回绕。' }],
    reading: [
      section('01', 'FIFO 管顺序，不按地址让外部随意取数', `<p>普通 RAM 的调用者提供地址；FIFO 的调用者只请求入队或出队。模块自己管理 wptr（下次写哪里）、rptr（当前头在哪里）和 count（已占多少格），保证先进入的数据先出来。这很适合连接偶尔快一点的生产者和消费者。</p><div data-practice-diagram="18"></div><p>两个指针都能回绕到相同值，所以只看 wptr==rptr 不能区分空和满。本课额外保存 0…4 的 count，需要三位。四个存储单元并非每次出队后整体移动，只移动指针，成本随存储深度增长更合理。</p>${table(['信号', '是否保存状态', '用途'], [['head', '组合输出', '让消费者提前看到下一字节；空时输出 0'], ['dout', '寄存器', '记录最近一次成功弹出的字节'], ['accepted_push/pop', '组合条件', '告诉双方这一上升沿将接受什么'], ['count,wptr,rptr', '状态', '跟踪占用和环形位置']])}`),
      section('02', '把四种边界写成表，而不是靠猜', `${table(['沿前状态 / 请求', 'accepted_push', 'accepted_pop', '该沿后的结果'], [['空 / 只 pop', '0', '0', '保持空，dout 保持'], ['空 / push+pop', '1', '0', '入队一个，没有同拍直通'], ['非空非满 / push+pop', '1', '1', '弹旧头、写新尾，count 保持'], ['满 / 只 push', '0', '0', '拒绝新字节，旧队列保持'], ['满 / push+pop', '1', '1', '弹旧头并补新尾，count 保持 4'], ['任意 / rst=1', '0', '0', '复位沿清指针、count、dout']])}<p><code>accepted_push=push &amp;&amp; (!full || accepted_pop) &amp;&amp; !rst</code> 允许满时“边出边进”，但空时 accepted_pop 仍为 0，因此不是 bypass FIFO。这是一种明确的设计选择，其他队列可以采用另一种策略，但测试和调用方必须一致。</p><p>accepted 信号描述<strong>上升沿前条件</strong>。边沿后 count 改变，它们也可能立刻重新计算。测试台应在沿前保存事件，不能在 #1 后拿新的 accepted 判断刚才发生了什么。</p>`),
      section('03', '满时读写指针相等，仍要弹出旧数据', `<p>当四格全满，wptr 和 rptr 可以指向同一个位置。同拍 pop 与 push 会从这个位置取旧 head，并写入新 din。非阻塞赋值让 dout&lt;=head 读旧内容；写入在之后生效。结果是旧头正确出队，新数据排到尾部，而不是用新 din 顶替正在弹出的字节。</p>${code("if (accepted_pop) begin\n  dout <= head;\n  rptr <= rptr + 1'b1;\nend\nif (accepted_push) begin\n  mem[wptr] <= din;\n  wptr <= wptr + 1'b1;\nend\ncase ({accepted_push,accepted_pop})\n  2'b10: count <= count + 1'b1;\n  2'b01: count <= count - 1'b1;\n  default: count <= count;\nendcase")}<p>两边同时接受时 count 不变，但两个指针都要前进。拒绝的请求不应改指针，更不应只因 push=1 就覆盖存储。rst 不清数组，空时 head 通过条件选择固定为 0，因此旧存储不暴露为有效队头。</p>`),
      section('04', '参考队列只消费接受事件', `<p>测试台用一个软件队列表示预期顺序，不需要复制 DUT 的环形指针实现。每个边沿前保存 old_head、take_push、take_pop；如果 pop 接受，先与参考队列旧头比较并移除；如果 push 接受，再把 din 追加到参考尾。空时双请求只追加，满时双请求先出后进。</p>${code("// 降沿设置请求；上升沿前保存旧条件\ntake_pop = pop && (ref_size != 0) && !rst;\ntake_push = push && ((ref_size < 4) || take_pop) && !rst;\n// 保存 ref_head，然后按 pop、push 顺序更新参考队列\n@(posedge clk); #1;\nif (count !== ref_size) $fatal(1, \"occupancy\");\nif (take_pop && dout !== saved_ref_head)\n  $fatal(1, \"FIFO order\");")}<p>实际写测试时也核对 DUT 沿前 accepted 与参考计算相等，并严格区分复位分支。每拍检查 0≤count≤4、full/empty 一致、空时 head=0、未 pop 时 dout 保持。定向覆盖边界之后，发至少几十轮随机请求迫使指针反复回绕；最后排空并比较全部顺序。</p>`),
      section('05', '缓冲容量和吞吐能力不能混为一谈', `<p>四深度表示最多存四个尚未取出的字节，不能把持续过载变成无损。若平均每拍来两个字节、只能处理一个，任何有限 FIFO 最终都会满。调用者需要观察接受信号、提供背压，或定义丢弃/溢出策略。</p><p>本课被拒绝的 push 不会自动重试；外部若只发送一拍请求，就必须知道它有没有被接收。最终 UART 项目无法要求异步串口发送端根据本地 FIFO 接受信号暂停，因此会显式记录 overflow，而不假装无限缓冲。成功日志为 <code>PASS 18_fifo:</code>。</p>`)
    ].join(''),
    codeNotes: [['head = empty ? 0 : mem[rptr]', '组合预览下一字节，空时输出确定的 0，不泄漏旧数组值。'], ['accepted_pop = pop && !empty && !rst', '空队列拒绝 pop，同步复位请求也组合屏蔽接受。'], ['push && (!full || accepted_pop)', '满时只有本拍也能成功 pop 才允许 push。'], ['dout <= head;', '成功弹出时保存旧队头；拒绝或无请求时保持。'], ['case ({accepted_push,accepted_pop})', '根据真正接受的事件改 count，而非原始 push/pop。']],
    labGuide: '运行 bash scripts/run_labs.sh 18_fifo。先做空/满边界表中的每一行，再跟踪 11,22,33,44 填满后同时弹入 55 的过程。读懂参考队列为何先出后进，以及 accepted 为什么必须沿前采样。',
    expected: '空时 push=pop=1 只接受 push，count 变 1，dout 不变。满且队列 11,22,33,44 时同时 pop/push55，dout=11，head=22，count=4；随后弹出顺序为 22,33,44,55。',
    waveNote: '看 clk、rst、push、pop、din、accepted_push、accepted_pop、head、dout、count、empty、full、wptr、rptr。沿前读 accepted/head，沿后看 dout 与指针。队列满时指针相同不等于空，必须结合 count。',
    challenge: '临时将 accepted_push 改成 push&&!full，运行满队列同时出入场景。解释为什么旧数据仍能出队但新数据被丢弃，随后恢复允许边出边进的契约。',
    practice: [
      { title: '预测：两种同时请求', task: '分别从空和满队列出发令 push=pop=1，din=0x55；满队列原顺序是 11,22,33,44。列出接受信号、count、dout 和 head。', hint: '用边沿前 empty/full 判定，不存在空时直通。', acceptance: '空：只 push、count1、dout 保持、head55；满：两者接受、count4、dout11、head22。' },
      { title: '实现：让 scoreboard 与地址实现解耦', task: '用参考数组加队列长度模拟先入先出，加入至少 64 个混合请求和最后排空阶段。', hint: '参考可以移动数组元素，不必模仿 DUT 指针；每次只依据参考状态算接受事件。', acceptance: '全部接受 pop 的字节与参考顺序一致；四种空满边界都实际覆盖；count 始终在 0…4，结束时为空。' },
      { title: '定位：为什么计数正确但字节错了？', task: '在满时同时读写同一格，检查若 dout 错接 din 会发生什么，用固定数据定位。', hint: 'count 不变并不能证明顺序正确，必须逐字节核对旧头。', acceptance: 'scoreboard 应抓住弹出 55 而非 11 的错误；恢复 dout<=旧 head 后得到完整 11,22,33,44,55 顺序。' }
    ],
    quizzes: [
      { q: '空 FIFO 同时 push 和 pop，本课接受哪些请求？', answers: ['两者都接受，数据直通', '只接受 push', '只接受 pop'], correct: 1, explanation: 'accepted_pop 要求非空；本课没有空时旁路，新数据在该沿入队，之后才能弹出。' },
      { q: '满 FIFO 同时成功 pop 和 push 后，count 怎样变？', answers: ['保持为 4', '变为 3', '变为 5'], correct: 0, explanation: '同拍腾出一格又填入一格，两个指针前进，占用量不变。' },
      { q: 'scoreboard 应在什么时候判断这一边沿的 accepted？', answers: ['边沿后任意时刻', '只看最终 count', '在边沿前保存接受条件'], correct: 2, explanation: '边沿后 full/empty 变化会重新计算组合 accepted；沿前条件才决定刚刚执行的操作。' }
    ]
  },
  {
    id: 19, lab: '19_uart', title: 'UART 发送：从字节到 8N1 帧', subtitle: '没有共享时钟，双方靠位周期与起始位对齐。',
    description: '把八位字节打包为起始位、八个数据位和停止位，用可参数化计数器保持每个符号足够长。实现 start/busy/done 握手，再用独立的线路检查器验证所有符号和持续时间。',
    duration: '约 65 分钟', tags: ['UART 8N1', 'LSB-first', '参数化位周期', '独立解码'],
    experiment: '一帧十个符号，每个符号四拍', prompt: '空闲时 DATA=0xA5，脉冲 START 一拍。先写线路序列，再批量运行 40 拍；忙时改 DATA 并再次发 START，确认正在发送的帧不变。',
    observation: '接受沿 tx 拉低开始起始位，随后 LSB-first 发出 1,0,1,0,0,1,0,1，最后停止位为 1。每个符号保持四个时钟间隔，接受沿后经过 40 个时钟完成，done 只高一拍。',
    takeaway: [['8N1', '一字节要占十个位周期', '一个起始位、八个数据位、无校验、一个停止位。'], ['LSB first', '线路顺序与字节书写相反', '最先发送 data[0]，frame[0] 为起始位。'], ['Handshake', '只在空闲接受 start', '忙时请求被忽略，数据在接受沿形成快照。']],
    interface: [{ name: 'clk,rst,start,data[7:0]', meaning: '同步高有效复位中止发送；仅空闲上升沿 start=1 接受 data。' }, { name: 'tx,busy,done', meaning: 'tx 空闲为 1；接受后 busy=1；十个符号结束后 busy=0、done=1 一拍。' }, { name: 'frame[9:0],bit_index[3:0]', meaning: '接受时 frame={1\'b1,data,1\'b0}，从 index0 发送到 index9；忙时 frame 保持。' }, { name: 'CLKS_PER_BIT / baud_count', meaning: '参数默认 4，支持整数>=2；baud_count 按参数选择位宽，默认两位，每个符号累计四拍。' }],
    reading: [
      section('01', '串口线上没有陪着数据一起传的时钟', `<p>UART 的发送端和接收端各自有时钟，线路只传电平。双方事先约定波特率和帧格式，接收端从起始位下降沿附近建立时间基准，在每位中点附近采样。这里的 tx 是数字协议线，不提供真实板卡电压、电气驱动或引脚连接方案。</p><div data-practice-diagram="19"></div><p>8N1 表示八个数据位、无校验位、一位停止位。空闲高，起始位低，八个数据位从最低位开始发送，停止位高。一字节有效数据用了十个位周期，所以理想字节率为 baud/10，而不是 baud/8。</p>${table(['位置', 'frame 索引', '0xA5 的线路值'], [['起始位', '0', '0'], ['数据位 bit0…bit7', '1…8', '1,0,1,0,0,1,0,1'], ['停止位', '9', '1']])}<p>十位帧写成 <code>{1'b1,data,1'b0}</code>：拼接左侧是最高位，发送索引却从 0 向上走。不要因为源码把停止位写在最左边，就误以为它最先发。</p>`),
      section('02', '接受沿启动，之后每 CPB 拍前进一个符号', `<p>CLKS_PER_BIT（简称 CPB）是一个线路位占多少系统时钟。默认 CPB=4 是教学加速参数，若系统时钟确实为 f_clk，理想 baud=f_clk/CPB；真实波特率要求重新选择整数分频与误差预算，不能把默认 4 称为固定标准波特率。</p>${table(['相对接受沿的时刻', 'bit_index', 'baud_count', '线路含义'], [['接受后 t=0', '0', '0', '起始位刚开始，busy=1'], ['t=1,2,3', '0', '1,2,3', '仍是起始位'], ['t=4', '1', '0', '开始 data[0]'], ['t=8…32，每隔四拍', '2…8', '0', '依次开始 data[1]…data[7]'], ['t=36', '9', '0', '停止位开始'], ['t=40', '9（保持）', '回零', '停止位已保持四拍，busy=0、done=1']])}<p>busy 时 tx 组合选 <code>frame[bit_index]</code>，空闲时固定为 1。即使停止位和空闲同为高，也必须保持完整停止周期才报告 done。发送 0xFF 时大多数线路电平都高，只有观察 index/count 才能看出协议时间仍在前进。</p>`),
      section('03', '计数器、快照与请求边界', `${code("// 空闲接受分支\nif (start) begin\n  frame <= {1'b1,data,1'b0};\n  bit_index <= 0;\n  baud_count <= 0;\n  busy <= 1;\nend\n// 忙分支中，每满一个符号周期推进一次\nif (baud_count == CLKS_PER_BIT-1) begin\n  baud_count <= 0;\n  if (bit_index == 9) begin busy <= 0; done <= 1; end\n  else bit_index <= bit_index + 1'b1;\nend else baud_count <= baud_count + 1'b1;")}<p>这是两个状态分支的结构片段，不应在同一拍让接受与忙逻辑一起运行。done 每拍默认清零；忙时 start 不触发任何新的 frame 装载。若在最后一个忙边沿 start=1，它仍被忽略；要等下一空闲边沿才可能接受。</p><p>计数位宽至少为 <code>$clog2(CPB)</code> 并保证最少一位，默认 CPB4 用两位，CPB2 用一位。不能只改比较常量却让计数器无法达到 CPB−1。复位优先中止当前帧，busy 清零后 tx 回空闲高；这是一条中止语义，不会把半帧神奇补完。</p>`),
      section('04', '自检分成内部节拍检查和外部线路检查', `<p>第一层检查每个符号完整保持 CPB 个时钟间隔。从接受沿后开始，记录 t=0…39 的 tx、index 与 count，预期符号用测试台自己的 <code>{1'b1,byte,1'b0}</code> 建立。t=40 必须 done=1、busy=0，t=41 done 回 0。输入驱动仍放在下降沿，检查放上升沿后 #1。</p><p>第二层只看 tx，另写一个接收任务：等待下降沿作为候选起始，移到起始位中点确认低；再每隔 CPB 个周期在数据位中点采样，从 bit0 到 bit7 写入参考接收字节；最后检查停止位高。它不能读取 DUT frame 或 bit_index 决定答案，否则打包错误可能被一起掩盖。</p>${table(['刺激', '验收'], [['0x00、0xA5、0xFF 多字节', '十符号序列、每位时长、独立解码值均正确'], ['busy 时改变 data 并发 start', '当前帧不变，不多出完成事件'], ['发送中 rst=1', '下个上升沿中止，tx=1、busy=0'], ['CPB=2 的额外实例', '一帧准确 20 个时钟间隔'], ['测试故障或 tx 不下降', '有限超时主动失败，不能永久 wait']])}<p>同时保存发送队列和已解码队列，按字节比较；测试全通过后才打印 <code>PASS 19_uart:</code>。</p>`),
      section('05', '用算术检查吞吐，用波形检查边界', `<p>默认 CPB4，十符号帧从接受沿到完成沿为 40 个系统时钟间隔。连续帧之间是否额外空闲，要看上层何时再次提供 start；本模块只在空闲边沿接受请求，不能用“busy 下降的一瞬间”直接假定下一帧已开始。</p><p>若独立解码得到位反转，检查 bit_index 与数据位编号；若字节正确但符号过短，检查计数从 0 开始及 CPB−1 比较；若停止位被裁掉，检查 done 是否在进入 index9 时就错误宣布完成。输出每个错误的符号编号与采样时刻，比只显示“串口失败”更容易修复。</p>`)
    ].join(''),
    codeNotes: [["frame <= {1'b1,data,1'b0};", '十位快照：最高位停止，最低位起始，发送从 frame[0] 开始。'], ['assign tx = busy ? frame[bit_index] : 1\'b1;', '忙时选当前符号，空闲保持高。'], ['baud_count == CLKS_PER_BIT-1', '旧计数达到最后一格才切换；0…CPB−1 恰好 CPB 个间隔。'], ['bit_index == 9', '只有停止位也完成一个完整 CPB 周期才结束。'], ['done <= 0;', '每拍默认清零，完成分支覆盖为 1，因此通知为单拍。']],
    labGuide: '运行 bash scripts/run_labs.sh 19_uart。先手写 0xA5 的十符号序列，在波形上量每个符号四拍。阅读线路独立解码任务，确认它不借用 frame；再验证忙时请求、复位中止和 CPB=2 边界。',
    expected: '0xA5 的序列是 0 | 1,0,1,0,0,1,0,1 | 1，每个符号四个时钟间隔。接受沿 t=0 起始位开始，t=36 停止位开始，t=40 busy=0、done=1，下一拍 done=0。',
    waveNote: '看 clk、rst、start、data、tx、busy、done、frame、bit_index、baud_count。用游标量周期而不只数电平翻转；连续相同数据位之间可以没有跳变。选一个完整 40 拍观察窗，另看复位中止片段。',
    challenge: '临时把停止条件改成进入 index9 就完成，独立线路检查器必须报告停止位时长错误。再把发送方向反过来，确认 0xA5 可能因位对称掩盖问题，改用 0x96 后能抓出位反转。',
    practice: [
      { title: '预测：别只看电平有没有变化', task: '写出 0x96 的十符号发送序列与默认 CPB4 下每个符号的开始时刻。', hint: '0x96=10010110，线路先发最低位；相邻符号相同也占独立位周期。', acceptance: '序列为 0|0,1,1,0,1,0,0,1|1；符号起点为 t=0,4,8,…,36，完成 t=40。' },
      { title: '实现：写一个看线的解码任务', task: '测试台只输入 tx 与 CPB，检测起始、在中点依次采八位并检查停止；给每次等待增加超时。', hint: '接收字节按 received[i]=采样值，i 从 0 到 7；不读取 DUT frame/index。', acceptance: '独立解码 00、96、FF 正确；错误位序或过短符号会使测试失败；无法起始时有明确超时消息。' },
      { title: '定位：最后一个忙边沿的 start', task: '仅在当前帧完成边沿前发 start，观察是否接受；随后在真正空闲边沿再发，比较结果。', hint: '分支根据旧 busy 判定，旧 busy=1 的边沿仍走忙分支。', acceptance: '完成沿请求被忽略，只有原帧 done；后续空闲沿请求才开始新帧，无隐式排队。' }
    ],
    quizzes: [
      { q: '默认 CPB4 的 8N1 一帧占多少个系统时钟间隔？', answers: ['32', '36', '40'], correct: 2, explanation: '起始1+数据8+停止1共十个符号，每个四拍，合计 40。' },
      { q: '线路上第一个数据位是哪个？', answers: ['data[0]', 'data[7]', '停止位'], correct: 0, explanation: 'UART 数据采用 LSB-first，起始位之后先发最低位。' },
      { q: 'busy=1 时发一拍 start，并改变 data，会怎样？', answers: ['立刻覆盖当前 frame', '请求被忽略，当前 frame 快照保持', '自动排队等下帧'], correct: 1, explanation: '接口没有内部请求队列，只在空闲边沿接受 start，忙时不会修改正在发送的帧。' }
    ]
  },
  {
    id: 20, lab: '20_project', title: '毕业项目：带 FIFO 的 UART 回显系统', subtitle: '从一根输入线，到可自检的小系统。',
    description: '独立接通 UART 接收、四深度 FIFO 与 UART 发送。验证异步输入采样、假起始位、坏停止位、同拍旧值、数据顺序和有限缓存的边界，最后用独立线路解码与 scoreboard 证明系统行为。',
    duration: '约 100 分钟，可分两次', tags: ['UART RX', 'FIFO 缓冲', '模块集成', '独立毕业验收'],
    experiment: '帧先变字节，字节入队，再重新变帧', prompt: '先发送 0x00、0xA5、0xFF 连续输入帧，观察 RX_VALID→QUEUED→TX_BUSY 的交接。再发送假起始、坏停止位和复位中断，判断哪些字节应该回显、哪些只报错。',
    observation: 'RX 只对起始确认与停止检查都通过的帧产生一拍 valid。顶层下一沿才把旧 rx_valid 送入 FIFO；空闲发送器与 FIFO 在同一沿分别接受旧 head 和 pop。正常字节保持顺序，坏帧不入队；overflow 记录无法接收的有效字节。',
    takeaway: [['Protocol', '位采样和字节搬运分层', 'RX 负责同步、半位确认和中点采样；FIFO 负责字节顺序；TX 负责发送位周期。'], ['Same edge', '模块连接也遵守旧值规则', 'rx_valid、head、busy 都按沿前状态交接，不能凭源码顺序消除等待。'], ['Evidence', '用独立解码和有界验收毕业', '正常序列、错误帧、复位和压力测试分别证明；有限 FIFO 不承诺无限无损输入。']],
    interface: [{ name: 'clk,rst,rx', meaning: '同步高有效复位；rx 是空闲为高的异步串行输入；CPB 默认 4、允许整数>=4。' }, { name: 'tx,tx_busy', meaning: '输出标准 8N1、LSB-first 回显；tx_busy 表示发送器忙。' }, { name: 'rx_valid,rx_data[7:0]', meaning: '接收器通过停止位检查后更新数据并脉冲 valid 一拍；FIFO 于下一沿消费旧 valid。' }, { name: 'queued[2:0]', meaning: 'FIFO 已缓存且尚未交给 TX 的字节数 0…4，不包括 TX 正在发送的字节。' }, { name: 'overflow,framing_error', meaning: 'overflow 在旧 rx_valid 且入队拒绝时置 1 并保持至 rst；framing_error 是坏停止位的一拍错误脉冲。' }],
    reading: [
      section('01', '先画三块硬件与两种数据尺度', `<p>系统由 project_demo 顶层连接独立命名的 RX、四深度 FIFO、TX 子模块，全部放在该课 design.v 内，不 include 其他课程。RX/TX 操作串行位，FIFO 操作完整字节；模块只通过端口协作，共用系统 clk，rx 自己不充当时钟。</p><div data-practice-diagram="20"></div>${table(['模块', '接收什么', '交出什么', '必须知道的规则'], [['UART RX', '异步 rx 电平', 'data 与单拍 valid/error', '先同步、确认起始、按中点采样'], ['FIFO', 'push+字节 / pop 请求', '旧 head、count、接受事件', '空不旁路，满时可同拍出入'], ['UART TX', '空闲 start+字节', '串行 tx、busy', '忙时不接收新字节'], ['顶层', '三块模块的沿前信号', '连接和 sticky overflow', '不能假设同沿读到另一块新寄存器']])}<p>queued 只数 FIFO 内字节，已经交给发送器的字节不再占队列空间。若 queued=0 且 tx_busy=1，系统仍有一帧在路上；不能把“队列空”当成“全部发送完成”。</p>`),
      section('02', '接收从两级同步和半位确认开始', `<p>接收器每沿执行 meta&lt;=rx、sync&lt;=旧 meta；状态机判断旧 sync。IDLE 检测到低电平只是候选起始，进入 START 且 timer=0。START 在旧 timer==CPB/2−1 时再次判断 sync：仍低才进入 DATA，否则回 IDLE，不产生有效字节。</p>${table(['状态', '等待与动作', '为什么需要'], [['IDLE=0', '旧 sync=0 时进入 START', '空闲高，低电平可能是起始也可能是噪声'], ['START=1', '约半位后确认仍为低，清 timer，进入 DATA', '过滤在确认点前已经结束的假起始'], ['DATA=2', '每 CPB 拍采旧 sync 到 shift[bit]，bit 从 0 到 7', '按 LSB-first 放到正确字节位置'], ['STOP=3', '再等 CPB 拍检查旧 sync；高则 data<=shift,valid=1；低则 error=1', '停止位验证帧边界，坏帧不发布有效数据']])}<p>确认起始之后，第一数据位在一个 CPB 周期后采样，其后每 CPB 周期采一次，采样落在各数据位的中间附近。默认 CPB4 时，从 IDLE 检出低电平的边沿起，START 再等两拍，第一数据采样在第六拍，后续数据在第10、14…34拍，停止检查在第38拍。这些编号以<strong>状态机检出同步低的边沿</strong>为零点，不是原始 rx 刚下降的时刻。</p><p>CPB 取奇数时，整数 CPB/2 向下取整，中点只是离散时钟格上的近似。两级同步引入延迟；它降低硬件亚稳态传播风险，数字模型不能证明模拟风险消失。测试的重点是契约采样点和允许范围 CPB>=4。</p>`),
      section('03', '沿前旧值决定三块硬件如何交接', `<p>RX 在边沿 R 完成停止检查，安排 rx_data、rx_valid 更新。顶层/FIFO 在同一边沿仍读到旧 rx_valid=0，不会立刻入队。到 R+1 沿，旧 rx_valid=1，FIFO 接受字节。若队列之前为空，R+1 沿前 empty=1，所以这沿不能同时将新字节直接弹给 TX；R+2 沿才可使用已存在的 head。</p>${code("// 顶层组合连线；所有消费由同一 clk 的沿前状态决定\npush = rx_valid;\npop = !tx_busy && !empty;\ntx_start = pop;\ntx_data = head;\n// 顶层粘滞溢出标志\nalways @(posedge clk)\n  if (rst) overflow <= 0;\n  else if (rx_valid && !accepted_push) overflow <= 1;")}<p>pop 的边沿，FIFO 弹出旧 head，同时 TX 采样旧 head 形成自己的 frame；不能把 tx_data 改接成 dout，因为 dout 也要到这个沿后才更新，会把上一个弹出的字节发出去。TX 在一个忙边沿结束帧后，busy 的新 0 要等之后空闲边沿才使下一次 start 被接收。</p>${table(['边沿', '沿前关键条件', '沿后动作'], [['R', 'RX STOP 到检查点，旧 valid=0', 'RX 发布 data/valid，FIFO 未接收它'], ['R+1', '旧 valid=1，旧 empty=1', '字节入 FIFO，queued=1，RX valid 清 0'], ['R+2', '旧 empty=0，旧 tx_busy=0，旧 head 有效', 'FIFO pop 与 TX start 同时接受同一旧字节'], ['之后的完成沿', '旧 tx_busy=1', 'TX 完成，直到后续空闲沿才能再接受']])}`),
      section('04', '错误分三类：假起始、坏帧和缓冲溢出', `<p>假起始在 START 确认点前回到同步高电平，RX 回 IDLE，不发 valid，也不把它当成“停止位错误”。测试要构造<strong>在同步确认点看来足够短</strong>的低脉冲；任意一个时钟宽度的原始脉冲未必都在量化和同步后被拒绝，应以采样表验证刺激。</p><p>坏停止位是在完整八位后、STOP 采样点仍低：framing_error 高一拍、valid=0，错误字节不得入队。坏停止后要让线路保持足够长的空闲高再开始下一帧，避免把持续低电平的后续行为误当作一个全新的独立错误测试。error 每拍默认清零，与保持到复位的 overflow 不同。</p><p>overflow 在<strong>已成功解码的字节</strong>无法入 FIFO 时置 1，该字节被丢弃。满队列但同拍可 pop 时允许 push，不应误报 overflow。复位清除队列、接收/发送过程与 overflow，也会中止半帧；测试台参考队列要在同一复位事件清空，不再期待旧任务回显。</p><p>输入线路每帧十位，理想字节到达间隔 10×CPB。TX 也需十个位周期，并受模块间启动边沿开销影响。四格 FIFO 能吸收短期积压，不能承诺无限长连续输入始终无损；更高发送速率、流控或更深队列应作为明确的新需求设计。</p>`),
      section('05', '自己写出系统测试台的三位“角色”', `<p><strong>输入驱动器</strong>接受一个字节，按 0、bit0…bit7、1 驱动 rx，每个符号保持 CPB 拍；驱动放在下降沿，可连续发送 00、A5、FF。<strong>输出监视器</strong>只读 tx，检测起始、在中点采八位并验证停止位，不能窥读 TX frame 当答案。<strong>scoreboard</strong>保存应回显字节，逐个核对监视器输出，检查数量、顺序与超时。</p>${code("// 输入角色：每个符号在下降沿驱动并保持 CPB 个周期\nrx = 0; repeat (CPB) @(negedge clk);\nfor (i=0; i<8; i=i+1) begin\n  rx = byte_to_send[i]; repeat (CPB) @(negedge clk);\nend\nrx = stop_is_good; repeat (CPB) @(negedge clk);\n// 另一个独立监视进程解码 tx，不与驱动器串行等待")}<p>驱动器与监视器必须并行：若发送完所有输入才开始监听 tx，可能已经错过前几帧。测试台可用独立 initial 进程或 fork/join 组织，每个进程使用自己的局部变量，避免共享循环索引互相覆盖。参考计数/队列变量不需要作为课程波形导出，防止淹没真正接口。</p><p>正常无溢出场景把原始期望字节入参考队列；带压力的场景还要依据顶层沿前 rx_valid 与 FIFO 接受规则，另记实际接受/丢弃事件，避免把设计规定的丢弃当成顺序错。两层参考分别检查“RX 正确解码了哪些字节”和“接受后最终发出了哪些字节”。</p>`),
      section('06', '毕业验收：交一份可以复现的证据', `<p>先不看完整顶层，从接口表与数据流图独立完成连接，再与课程版本对照。用相同单文件编译方式验证，design.v 与 tb.v 均使用 <code>timescale 1ns/1ps</code>，测试台顶层 tb。所有检查避开 NBA 竞争，整个测试设置总超时；仅在全部通过后打印 <code>PASS 20_project:</code>。</p>${table(['必须提交的验收', '可检查标准'], [['连续正常帧', '至少 00,A5,FF 无间隔输入；独立 tx 解码严格按原顺序得到三字节，overflow=0'], ['更多数据与回绕', '增加 96,3C,81 等非对称字节，覆盖 FIFO 指针回绕，发送/接收数量一致'], ['假起始与坏停止', '假起始不回显；坏停止出现 error 脉冲但无该字节回显；之后正常帧仍可通过'], ['复位中止', '在接收中、队列有数据或发送中复位；参考队列清空，复位后新数据正常回显'], ['流量与容量', '记录 queued 峰值和接受/丢弃数；解释有限 FIFO 的边界，不把未溢出的短测试当无限保证'], ['失败能被发现', '故意把 tx_data 接 dout 或改错位序，独立 scoreboard 必须报错，恢复后通过'], ['调试说明', '附一个失败最小用例、沿前/沿后表、修复理由和重跑命令']])}<p>可用更长连续输入做压力探索，并以有界仿真记录是否积压/溢出；不要求编造特定硬件上的吞吐率。结课证据是可重复的数字仿真与解释，不是未知板卡的电压、引脚、时序或真实串口上板认证。</p>`)
    ].join(''),
    codeNotes: [['meta <= rx; sync <= meta;', '接收器两级同步；状态机处理旧 sync，不同拍直通。'], ['timer == CLKS_PER_BIT/2-1', 'START 的半位确认点；参数要求>=4，整数中点按离散周期近似。'], ['shift[bit_index] <= sync;', 'LSB-first 按索引写位；停止检查时八位 shift 已完整。'], ['push=rx_valid; pop=!tx_busy&&!empty;', '顶层以寄存器旧值交接；空 FIFO 没有输入到输出旁路。'], ['tx_start=pop; tx_data=head;', '弹出与发送同沿使用旧 head；接 dout 会晚一个数据事件。'], ['if (rx_valid && !accepted_push) overflow<=1;', '有效字节被拒绝才记溢出，保持到同步复位；framing_error 则为 RX 脉冲。']],
    labGuide: '运行 bash scripts/run_labs.sh 20_project。先从 00,A5,FF 的独立回显自检开始，再看假起始、坏停止、复位中止与队列顺序。分别保存一个正常交接窗口和一个错误窗口，按 R/R+1/R+2 标记旧 valid、入队与 TX 接受，最后自己执行毕业验收清单。',
    expected: '正常 00,A5,FF 连续帧被按序回显，坏停止位的字节不回显且产生一拍 framing_error。空队列情况下 RX 发布 valid 后下一沿入队，再下一沿旧 head 被 FIFO/TX 同时接收。overflow 仅在有效字节无法入队时置 1 并保持到复位。',
    waveNote: '优先看 clk、rst、rx、rx_valid、rx_data、queued、tx_busy、tx、overflow、framing_error；需要时展开 RX 的 meta/sync/state/timer/bit 和 FIFO head/accepted。长波形选取首帧交接、FIFO回绕、错误帧、复位四个观察段；TX 独立解码的参考队列不必导出。',
    challenge: '不复制顶层连接，从空白写出 RX/FIFO/TX 端口图、顶层和独立线路监视器。用 00,A5,FF,96,3C,81 跑正常与错误场景，再故意将 TX 数据接 dout，留下一个能复现首字节/顺序错误的最小测试，恢复并重跑全部验收。',
    practice: [
      { title: '预测：追一字节跨过三块模块', task: '假设 FIFO 为空、TX 空闲，RX 在边沿 R 通过停止检查。写出 R、R+1、R+2 的旧 valid/empty/busy，以及字节何时入队和开始发送。', hint: '一个模块的新寄存器输出要到边沿后才可见，其他模块本沿仍读旧值。', acceptance: 'R 只发布 RX data/valid；R+1 入 FIFO、queued=1；R+2 pop 与 TX start 共同使用旧 head；不能声称 R 沿直接开始回显。' },
      { title: '实现：完成独立毕业项目', task: '自行连接自包含 RX/FIFO/TX；编写并行输入驱动、独立 tx 解码、参考队列与总超时，完成正常多帧、假起始、坏停止与复位中止。', hint: '先证明无错无溢出的字节序列，再加入错误和压力；每次改变只引入一种新条件。', acceptance: '00,A5,FF 连续输入顺序一致；至少六种字节覆盖回绕；坏帧不回显且有 error；复位后新帧正常；所有检查完成才打印 PASS 20_project:。' },
      { title: '定位与扩展：容量不是无限吞吐', task: '记录长序列下 queued 峰值、RX有效数量、接受与丢弃数量、TX 解码数量；故意接错 head/dout 验证检查器，再提出一种有明确契约的流控或吞吐改进。', hint: '按 TX 完成沿记账的已发送数+队列数+正在发送数，应与已接受字节守恒；独立解码器在停止位中点采样，不要提前把它计作完整发送。复位清除未完成任务；overflow sticky 与错误脉冲分开记录。', acceptance: '顺序按实际接受字节核对、没有凭空多字节；溢出时能指出被拒绝事件并保持标志；错误接线会主动报错，恢复后全套通过。改进方案给出输入/输出、接受条件与新的边界测试。' }
    ],
    quizzes: [
      { q: '为什么 TX 数据接 FIFO head，而不是弹出寄存器 dout？', answers: ['因为 head 永远是 0', '因为同一 pop/start 沿要读取旧 head，dout 要沿后才更新', '因为 dout 不能保存字节'], correct: 1, explanation: 'FIFO pop 和 TX 接受同一边沿发生，都读取旧值。若接 dout，TX 看到的是上一次弹出的字节。' },
      { q: '收到坏停止位时，应有哪些结果？', answers: ['framing_error 脉冲，且不发布该字节的 rx_valid', '仍正常回显，并清 overflow', '立即把整个 FIFO 清空'], correct: 0, explanation: 'RX 只有停止位高才发布有效数据；低停止位产生一拍错误，不把坏字节交给 FIFO。' },
      { q: '四深度 FIFO 能保证任意长、任意快输入永远不丢字节吗？', answers: ['能，环形指针可以无限回绕', '只要数字仿真通过就能', '不能，容量有限，持续过载需要流控或提高服务能力'], correct: 2, explanation: '指针回绕不增加容量；平均输入超过处理能力时积压会持续增长，最终需拒绝并记录 overflow。' }
    ]
  }
];
