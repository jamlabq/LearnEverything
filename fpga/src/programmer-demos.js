import {assignmentInitial,softwareStep,hardwareClock,buttonInitial,buttonClock} from './programmer-logic.mjs';
import {manualWave,renderWave} from './waveform.js';
import {workshopData} from './workshop-data.js';
const diagram=(body,label)=>`<svg viewBox="0 0 660 220" class="bridge-svg" role="img" aria-label="${label}"><defs><marker id="bridge-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 Z" fill="#b8cf9b"/></marker></defs>${body}</svg>`;
const box=(x,y,w,title,value)=>`<rect x="${x}" y="${y}" width="${w}" height="66" rx="9"/><text x="${x+w/2}" y="${y+24}" text-anchor="middle">${title}</text><text x="${x+w/2}" y="${y+49}" text-anchor="middle" class="bridge-value">${value}</text>`;
const line=d=>`<path d="${d}" fill="none" class="bridge-wire" marker-end="url(#bridge-arrow)"/>`;
const linkBlock=name=>`<details class="workshop-files"><summary>在 Vivado 中验证，并补全一份小练习</summary><p>先从实验包根目录运行完整参考版本，再打开 starter.v 补全标注位置。待补全版本最初会失败；修改后必须通过同一份测试台。</p><pre>bash scripts/run_workshops.sh ${name}
bash scripts/run_workshops.sh ${name} --starter</pre><div class="inline-links"><a href="workshops/${name}/README.md" download>步骤说明</a><a href="workshops/${name}/starter.v" download>待补全 starter.v</a><a href="workshops/${name}/design.v" download>参考实现</a><a href="workshops/${name}/tb.sv" download>配套自检</a></div><button class="secondary-btn" data-workshop-wave="${name}">查看配套 XSim 波形</button><div class="wave-plot" data-workshop-actual="${name}" hidden></div></details>`;
export function programmerDemoMarkup(id){
 if(id===5)return `<article class="card programmer-demo" id="assignment-demo"><div class="section-label">C / JAVA → REGISTERS</div><h3>两行赋值：顺序执行与同沿更新</h3><p>先预测 a=1、b=2 时的结果。左边每次执行一条语句；右边每次给两个寄存器同一个上升沿。操作次数用于观察语义，不代表两种实现的性能。</p><div class="bridge-controls"><label>初值 a <input id="assignment-a" type="number" min="0" max="15" value="1"></label><label>初值 b <input id="assignment-b" type="number" min="0" max="15" value="2"></label><button class="secondary-btn" id="assignment-reset">用初值重开</button></div><p id="assignment-error" role="status"></p><div class="bridge-columns"><section><h4>C / Java：读到刚写入的值</h4><pre><code><span id="software-line-0">a = b;</span>
<span id="software-line-1">b = a;</span></code></pre><p id="software-values" aria-live="polite"></p><button class="secondary-btn" id="software-step">执行下一条语句</button></section><section><h4>两个寄存器：采样同一份旧状态</h4><pre><code>always @(posedge clk) begin
  a &lt;= b;
  b &lt;= a;
end</code></pre><p id="hardware-values" aria-live="polite"></p><button class="secondary-btn" id="hardware-step">走一个时钟周期</button></section></div><div class="bridge-diagram" id="assignment-circuit"></div><p id="assignment-explanation" aria-live="polite"></p><div class="table-scroll" id="assignment-trace"></div><details><summary>展开两个寄存器的操作波形</summary><div class="wave-plot" id="assignment-wave"></div><p>横轴为操作序号；低→高边沿交换数值，下降沿保持。初值表示已装入状态；Vivado 版本使用同步复位装入 1、2。</p></details>${linkBlock('old_values')}</article>`;
 if(id===15)return `<article class="card programmer-demo" id="button-project"><div class="section-label">ONE PROJECT / THREE VERSIONS</div><h3>把计数器接到按钮：从长按到一次事件</h3><p>需求：每次确认按下只加一。三条支路同时观察同一个同步后的按钮，比较长按、边沿和消抖事件。先选“长按”，再选“带抖动按下”。</p><div class="bridge-controls"><button class="secondary-btn" id="button-raw" aria-pressed="false">RAW = 0</button><button class="secondary-btn" id="button-step">走一拍</button><button class="secondary-btn" id="button-eight">走 8 拍</button><button class="secondary-btn" id="button-reset">同步复位一拍</button><button class="secondary-btn" id="button-restart">重开</button></div><div class="scenario-buttons"><button class="secondary-btn" data-button-scenario="hold">长按 12 拍，再释放</button><button class="secondary-btn" data-button-scenario="bounce">带抖动按下，再释放</button><button class="secondary-btn" data-button-scenario="short">仅两拍高尖峰</button></div><div class="bridge-diagram" id="button-circuit"></div><div class="bridge-counts" aria-live="polite"><p>高电平就计数 <b id="level-count">0</b></p><p>上升沿就计数 <b id="edge-count">0</b></p><p>确认按下才计数 <b id="clean-count">0</b></p></div><p id="button-explanation" aria-live="polite"></p><div class="table-scroll" id="button-trace"></div><details><summary>展开 RAW、同步、按下事件和计数波形</summary><div class="wave-plot" id="button-wave"></div></details><p>三个计数器均为四位，15 后回到 0。这里用三样本阈值方便观察；真实按钮需要根据采样周期选择更长窗口。计数器读取旧 PRESS，因此比 PRESS 新值出现晚一个上升沿计数。</p>${linkBlock('button_counter')}</article>`;
 return '';
}
function bindActual(root){
 root.querySelectorAll('[data-workshop-wave]').forEach(b=>b.addEventListener('click',()=>{
  const target=root.querySelector(`[data-workshop-actual="${b.dataset.workshopWave}"]`);target.hidden=false;
  renderWave(target,workshopData[b.dataset.workshopWave].wave,true);
 }));
}
export function mountProgrammerDemo(id){
 if(id===5)mountAssignment();if(id===15)mountButton();
 return ()=>{}; // No timers; listeners leave with their DOM nodes.
}
function mountAssignment(){
 const root=document.querySelector('#assignment-demo');if(!root)return;
 let cpu=assignmentInitial(),hw=assignmentInitial(),trace=[],samples=[{clk:0,a:1,b:2}];
 const record=()=>samples.push({clk:hw.clk,a:hw.a,b:hw.b});
 function draw(){
  root.querySelector('#software-values').textContent=`a=${cpu.a}，b=${cpu.b}；已执行 ${cpu.pc}/2 条`;
  root.querySelector('#hardware-values').textContent=`a=${hw.a}，b=${hw.b}；CLK=${hw.clk}`;
  root.querySelector('#software-step').disabled=cpu.pc===2;
  [0,1].forEach(i=>root.querySelector(`#software-line-${i}`).classList.toggle('current-statement',i===cpu.pc));
  root.querySelector('#assignment-circuit').innerHTML=diagram(box(90,70,150,'寄存器 A',`Q=${hw.a}  D=${hw.b}`)+box(420,70,150,'寄存器 B',`Q=${hw.b}  D=${hw.a}`)+line('M240 96 H315 V30 H390 V96 H420')+line('M570 96 H610 V185 H55 V96 H90')+'<text x="78" y="86">D</text><text x="244" y="86">Q</text><text x="408" y="86">D</text><text x="574" y="86">Q</text>'+'<text x="330" y="210" text-anchor="middle">同一 CLK ↑：A 采旧 B，B 采旧 A</text>',`A=${hw.a}，B=${hw.b}；两个寄存器交叉连接`);
  root.querySelector('#assignment-explanation').textContent=trace.at(-1)?.[2]||'D 是输入，Q 是现在保存的输出。沿箭头看：A 的 Q 接 B 的 D，B 的 Q 接 A 的 D；两个寄存器在同一边沿采样。';
  root.querySelector('#assignment-trace').innerHTML=`<table><thead><tr><th>操作</th><th>结果 a / b</th><th>发生了什么</th></tr></thead><tbody>${trace.slice(-6).map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  renderWave(root.querySelector('#assignment-wave'),manualWave(samples.slice(-64),{a:4,b:4}));
 }
 root.querySelector('#software-step').addEventListener('click',()=>{const before=cpu;cpu=softwareStep(cpu);trace.push([`语句 ${cpu.pc}`,`${cpu.a} / ${cpu.b}`,cpu.pc===1?`a 读取当前 b=${before.b}`:`b 读取上一条已更新的 a=${before.a}`]);draw();});
 root.querySelector('#hardware-step').addEventListener('click',()=>{const before=hw;hw=hardwareClock(hw,1);record();hw=hardwareClock(hw,0);record();trace.push(['时钟 ↑',`${hw.a} / ${hw.b}`,`沿前 a=${before.a}、b=${before.b}；两个右侧都从这份旧状态取值。`]);draw();});
 root.querySelector('#assignment-reset').addEventListener('click',()=>{
  const fields=['a','b'].map(k=>root.querySelector(`#assignment-${k}`));
  try{if(fields.some(f=>f.value.trim()===''))throw new Error();cpu=assignmentInitial(...fields.map(f=>Number(f.value)));hw={...cpu};samples=[{clk:0,a:hw.a,b:hw.b}];trace=[];root.querySelector('#assignment-error').textContent='';draw();}
  catch{root.querySelector('#assignment-error').textContent='初值请填写 0…15 的整数。';}
 });bindActual(root);draw();
}
function mountButton(){
 const root=document.querySelector('#button-project');if(!root)return;
 let s=buttonInitial(),trace=[],samples=[],count=0;
 const record=()=>samples.push({clk:s.clk,raw:s.raw,sync:s.sync,press:s.press,level_count:s.level_count,edge_count:s.edge_count,clean_count:s.clean_count});
 function cycle(){const old=s;s=buttonClock(s,1);record();trace.push([++count,old.raw,old.sync,old.press,s.press,s.clean_count]);s=buttonClock(s,0);record();}
 function draw(){
  const raw=root.querySelector('#button-raw');raw.textContent=`RAW = ${s.raw}`;raw.setAttribute('aria-pressed',String(Boolean(s.raw)));
  for(const [id,key] of [['level','level_count'],['edge','edge_count'],['clean','clean_count']])root.querySelector(`#${id}-count`).textContent=s[key];
  root.querySelector('#button-circuit').innerHTML=diagram(box(10,73,160,'RAW → META → SYNC',`${s.raw} → ${s.meta} → ${s.sync}`)+line('M170 105 H200 V33 H230')+line('M200 105 H230')+line('M200 105 V177 H230')+box(230,0,190,'高电平使能',`SYNC=${s.sync}`)+box(230,73,190,'边沿检测','SYNC &amp; !旧SYNC')+box(230,146,190,'消抖 + 单拍事件',`PRESS=${s.press}`)+line('M420 33 H460')+line('M420 105 H460')+line('M420 177 H460')+box(460,0,180,'电平计数',s.level_count)+box(460,73,180,'边沿计数',s.edge_count)+box(460,146,180,'事件计数',s.clean_count),'同一个按钮经过同步后，分别驱动电平、边沿、消抖事件三个计数器');
  root.querySelector('#button-trace').innerHTML=`<table><thead><tr><th>边沿</th><th>RAW</th><th>旧 SYNC</th><th>旧 PRESS</th><th>新 PRESS</th><th>事件计数</th></tr></thead><tbody>${trace.slice(-8).map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  renderWave(root.querySelector('#button-wave'),manualWave(samples.slice(-100),{level_count:4,edge_count:4,clean_count:4}));
 }
 root.querySelector('#button-raw').addEventListener('click',()=>{s={...s,raw:1-s.raw};record();draw();});
 root.querySelector('#button-step').addEventListener('click',()=>{cycle();draw();});
 root.querySelector('#button-eight').addEventListener('click',()=>{for(let i=0;i<8;i++)cycle();draw();});
 root.querySelector('#button-reset').addEventListener('click',()=>{s={...s,rst:1};cycle();s={...s,rst:0};draw();root.querySelector('#button-explanation').textContent='同步复位沿清空全部状态；RAW 开关保持原位，后续时钟会重新采样。';});
 root.querySelector('#button-restart').addEventListener('click',()=>{s=buttonInitial();trace=[];samples=[];count=0;record();draw();root.querySelector('#button-explanation').textContent='已从全部清零重新开始。';});
 root.querySelectorAll('[data-button-scenario]').forEach(b=>b.addEventListener('click',()=>{
  s=buttonInitial();trace=[];samples=[];count=0;record();
  const name=b.dataset.buttonScenario,values=name==='hold'?[...Array(12).fill(1),...Array(12).fill(0)]:name==='bounce'?[1,0,1,0,...Array(12).fill(1),...Array(12).fill(0)]:[1,1,...Array(10).fill(0)];
  for(const raw of values){s={...s,raw};record();cycle();}draw();
  root.querySelector('#button-explanation').textContent=name==='hold'?'长按：电平计数 12 次，边沿和确认事件各 1 次。释放不增加事件计数。':name==='bounce'?'抖动：边沿检测看到了 3 次上升，消抖确认只有 1 次。展开波形可看完整输入。':'两拍尖峰：边沿检测会加 1，消抖没有凑够 3 个连续样本，事件计数保持 0。';
 }));bindActual(root);record();draw();
}
