import {practiceInitial,practiceInput,practiceClock,practiceSignals,practiceWidths} from './practice-logic.mjs';
import {practiceDiagram} from './practice-diagrams.js';
import {escapeHtml as esc} from './simulators.js';
const numeric={11:[['d','装入数据 D',255]],12:[['a','输入 A',255],['b','输入 B',255]],13:[['data','待统计字节',255]],14:[],15:[],16:[['parallel_in','并行输入字节',255]],17:[['addr','地址 ADDR',3],['wdata','写入数据',255]],18:[['din','入队字节 DIN',255]],19:[['data','发送字节 DATA',255]],20:[]};
const bits={11:[['load','装入 LOAD'],['add_en','加一 ADD_EN'],['sub_en','减一 SUB_EN']],12:[],13:[['start','开始 START']],14:[['en','允许 EN']],15:[['raw','原始按钮 RAW']],16:[['load','并行装入 LOAD'],['en','允许移位 EN'],['serial_in','串行输入']],17:[['we','写入 WE'],['re','读取 RE']],18:[['push','请求入队 PUSH'],['pop','请求出队 POP']],19:[['start','开始 START']],20:[['rx','串行输入 RX']]};
const displayed={11:['q','ge10'],12:['y','carry','zero'],13:['parallel_count','work','partial','steps','result','busy','done'],14:['phase','tick','count'],15:['raw','meta','sync','bounce_count','stable','press'],16:['q','serial_out','ones'],17:['rdata','rvalid','m0','m1','m2','m3'],18:['head','dout','count','full','empty','accepted_push','accepted_pop'],19:['tx','busy','done','bit_index','baud_count'],20:['rx_valid','rx_data','queued','tx_busy','tx','overflow','framing_error']};
const show=v=>v===null||v==='x'?'X':String(v);
const toggle=(key,title,value)=>`<div class="input-control"><div class="input-label">${title}</div><button class="toggle" data-practice-bit="${key}" aria-label="切换 ${key.toUpperCase()}" aria-pressed="${Boolean(value)}"><b>${value}</b><span class="switch-track" aria-hidden="true"><span class="switch-thumb"></span></span></button></div>`;
export function practiceMarkup(l){
 const s=practiceInitial(l.id);
 return `<div class="lab practice-lab"><div class="lab-top"><span class="lab-caption">PRACTICE ${l.id} / READ · BUILD · VERIFY</span><span class="live-indicator">${l.id===12?'组合电路':'时钟驱动 · 旧值采样'}</span></div><div class="practice-controls">${numeric[l.id].map(([key,title,max])=>`<label class="practice-number"><span class="input-label">${title}</span><input type="number" min="0" max="${max}" step="1" value="${s[key]}" data-practice-number="${key}" aria-label="${title}"><small>0…${max}</small></label>`).join('')}${l.id===12?`<label class="practice-number"><span class="input-label">运算 OP</span><select data-practice-number="op" aria-label="ALU 运算">${['加法','减法（C 表示借位）','按位 AND','按位 OR','按位 XOR','A 逻辑左移一位','A 逻辑右移一位','无符号 A < B'].map((name,i)=>`<option value="${i}">${i} · ${name}</option>`).join('')}</select></label>`:''}${bits[l.id].map(([key,title])=>toggle(key,title,s[key])).join('')}${l.id!==12?toggle('rst','同步复位 RST',1):''}</div><div class="practice-drawing" id="practice-circuit"></div><div class="lab-bottom"><span id="practice-status" aria-live="polite"></span><div class="lab-buttons">${l.id!==12?'<button class="dark-btn" id="practice-clock">CLK 置 1 ↑</button><button class="dark-btn" id="practice-step">走一拍 →</button><button class="dark-btn" id="practice-eight">走 8 拍</button><button class="dark-btn" id="practice-run">连续慢放</button>':''}<button class="dark-btn" id="practice-reset">重开实验</button></div></div></div><p class="kbd-tip">${l.id===12?'本课输入改变就重新计算，没有保存状态的寄存器。':'初始状态表示已经复位。先把 RST 置 0；数据和控制改变不会自动产生上升沿。'} 下方示例会自动从复位状态开始。窄屏可在电路图中左右滑动，查看完整数据通路。</p><div id="practice-message" class="practice-message" role="status"></div>${l.id===20?'<div class="serial-controls"><label>串口接收字节（十进制） <input id="serial-byte" aria-label="串口接收字节" type="number" min="0" max="255" value="165"></label><button class="secondary-btn" id="serial-send">送入此字节（走 44 拍）</button><button class="secondary-btn" id="serial-bad">送入坏停止位</button><button class="secondary-btn" id="serial-drain">再走 80 拍，等待回显</button><p>本课每位 4 拍；送入是实际驱动 RX 位序列，字节还要经过接收、FIFO 和发送器。</p></div>':''}<article class="card scenario-card"><div class="section-label">WORKED EXAMPLES</div><h3>先预测，再运行这些例子</h3><div class="scenario-buttons">${scenarios(l.id).map((scenario,i)=>`<button class="secondary-btn" data-scenario="${i}">${esc(scenario.title)}</button>`).join('')}</div><p id="scenario-description">点击示例会重开实验、释放复位，再按预置输入实际走时钟。运行后可查看状态、波形和上升沿记录。</p></article>`;
}
export function practiceSupport(l){
 return `<div class="two-col"><article class="card"><div class="section-label">CURRENT SIGNALS</div><h3>这些线和寄存器，现在是什么值？</h3><div class="state-readout" id="practice-readout"></div><p class="truth-caption">数值为十进制；X 表示尚未写入的未知值，不能当成 0。接受请求的标志表示当前输入下，下一个上升沿是否接收。</p>${l.id>=19?'<h4 class="serial-log-title">从 TX 线独立解码的字节</h4><div class="serial-log" id="serial-log" aria-live="polite">尚未发完一个字节</div>':''}</article><article class="card"><div class="section-label">EDGE BY EDGE</div><h3>${l.id===12?'当前选择的运算':'最近的上升沿：旧值 → 新值'}</h3><div class="practice-trace" id="practice-trace"></div><p class="truth-caption">${l.id===12?'组合电路不需要等待上升沿，输出跟随输入和 OP。':'表格列出本次边沿之前与之后的主要状态。输入变化和下降沿不新增行。'}</p></article></div>`;
}
const action=(values={},cycles=1)=>({values,cycles});
const frameActions=(data,bad=false)=>[0,...Array.from({length:8},(_,i)=>(data>>i)&1),bad?0:1].map(rx=>action({rx},4));
function scenarios(id){
 const scenario=(title,description,actions)=>({title,description,actions});
 const a=action;
 return {
 11:[scenario('装入、加一、保持','装入 9，再加到 10：GE10 随 Q 改变。关闭加一后保持。',[a({d:9,load:1}),a({load:0,add_en:1}),a({add_en:0},2)]),scenario('条件同时成立','LOAD 与两种使能一起为 1 时装入 42；关闭 LOAD 后，加一优先于减一。',[a({d:42,load:1,add_en:1,sub_en:1}),a({load:0})]),scenario('255 回绕与减法','装入 255，加一回到 0，再减一回到 255；这是八位取余。',[a({load:1,d:255}),a({load:0,add_en:1}),a({add_en:0,sub_en:1})])],
 12:[scenario('255 + 1','Y=0，进位为 1，零标志为 1。',[a({a:255,b:1,op:0},0)]),scenario('3 − 5：借位','Y=254，C=1 表示本课定义的借位；不是有符号结果 −2。',[a({a:3,b:5,op:1},0)]),scenario('移出最高位','A=129 左移一位得到 Y=2，原来的最高位进入 C。',[a({a:129,op:5},0)])],
 13:[scenario('并行与八拍迭代','0xA5 有四个 1。开始沿只锁存，随后八个忙边沿处理数据。',[a({data:165,start:1}),a({start:0},8)]),scenario('开始后改变输入','内部 WORK 使用旧快照：输入从 0x0F 改成 0，最终仍得到 4；并行输出变为 0。',[a({data:15,start:1}),a({data:0,start:0},8)]),scenario('忙时再次开始','锁存 0x01 后忙时改成 0xFF 并保持 START=1，忙期内不重启；首份结果是 1。',[a({data:1,start:1}),a({data:255},8)])],
 14:[scenario('跑满两个周期','每四拍计数一次。第 3 拍后 TICK=1，下一上升沿才被子模块使用。',[a({en:1},8)]),scenario('在边界暂停','相位停在 3 时 EN=0，TICK 变 0；恢复后下一沿计数一次。',[a({en:1},3),a({en:0},3),a({en:1})]),scenario('同步复位优先','使能保持为 1，RST=1 的上升沿仍将两个子模块复位。',[a({en:1},7),a({rst:1}),a({rst:0},0)])],
 15:[scenario('稳定按下、保持','RAW=1 后两级同步，再由三个连续不同样本确认。PRESS 只高一拍。',[a({raw:1},5),a({},3)]),scenario('弹跳后才稳定','几次短高低没有形成三个连续样本，最终按稳才确认。',[a({raw:1}),a({raw:0}),a({raw:1}),a({raw:0},3),a({raw:1},5)]),scenario('释放后再次按下','释放也要确认；重新按稳产生新的 PRESS，按住不会连续触发。',[a({raw:1},6),a({raw:0},5),a({raw:1},5)])],
 16:[scenario('八拍拼出 0xA5','按最高位先来送入 10100101，八拍后 Q=165。',[...'10100101'].map(bit=>a({serial_in:Number(bit),en:1}))),scenario('装入优先于移位','LOAD=1 时，即使 EN=1 也装入 129；下一拍右端送 0 后 Q=2，旧最高位已移出。',[a({load:1,en:1,parallel_in:129}),a({load:0,serial_in:0})]),scenario('停止与恢复','先装入 15，关闭 EN 两拍，恢复后送入 1 得到 31。',[a({load:1,parallel_in:15}),a({load:0,en:0},2),a({en:1,serial_in:1})])],
 17:[scenario('先读未写地址','读地址 2 得到 X；RVALID=1 说明读操作完成，不保证数据已初始化。',[a({addr:2,re:1})]),scenario('同地址读写：读旧值','先写 42，再同时读写 99：本拍读 42；下一拍读到 99。',[a({addr:1,we:1,wdata:42}),a({re:1,wdata:99}),a({we:0})]),scenario('复位不清存储','写地址 3 为 123，复位清输出；再次读地址 3 仍为 123。',[a({addr:3,we:1,wdata:123}),a({rst:1,we:0,re:0}),a({rst:0,re:1})])],
 18:[scenario('入队再出队','依次放入 65、66、67，再逐个弹出；DOUT 最后为 67。',[a({push:1,din:65}),a({din:66}),a({din:67}),a({push:0,pop:1},3)]),scenario('满队列同时进出','队列满后单独 PUSH 被拒绝；同时 POP/PUSH 接受两者，旧头 1 弹出，9 入队。',[a({push:1,din:1}),a({din:2}),a({din:3}),a({din:4}),a({din:9}),a({pop:1})]),scenario('空队列同时进出','空时 POP 不接受；PUSH 接受 42。本课没有空队列直通。',[a({push:1,pop:1,din:42})])],
 19:[scenario('发送 0xA5','TX 依次为起始位、1 0 1 0 0 1 0 1、停止位，每位四拍。',[a({data:165,start:1}),a({start:0},40)]),scenario('忙时换输入','起始沿锁存 0，忙时把 DATA 改成 255 也不影响正在发的帧。',[a({data:0,start:1}),a({data:255},40)]),scenario('复位中止发送','帧发送中复位，下个上升沿回空闲高，不产生完成脉冲。',[a({data:165,start:1}),a({start:0},10),a({rst:1}),a({rst:0},0)])],
 20:[scenario('三个字节连续回显','实际送入 00、A5、FF 三个 8N1 帧。等待发送完毕，从 TX 解码应得到同样顺序。',[...frameActions(0),...frameActions(165),...frameActions(255),a({rx:1},100)]),scenario('错误停止位拒收','一个数据帧的停止位为 0，出现 FRAMING_ERROR，不将这份错误帧入队。',[...frameActions(165,true),a({rx:1},20)]),scenario('复位中止并恢复','先送半帧，复位清接收、队列和发送状态；随后发送字节 66，回显只保留新的完整帧。',[...frameActions(165).slice(0,5),a({rst:1,rx:1},3),a({rst:0,rx:1},4),...frameActions(66),a({rx:1},90)])]
 }[id];
}
export function mountPractice(l,onSample,onReset){
 const id=l.id;let state=practiceInitial(id),timer=null,edge=0,trace=[],serialLog=[],decoder=null;
 const outputKeys=displayed[id];
 const primary={11:'q',13:'partial',14:'count',15:'stable',16:'q',17:'rdata',18:'count',19:'bit_index',20:'queued'}[id];
 const emit=(refresh=true)=>onSample(practiceSignals(id,state),practiceWidths(id),refresh);
 const message=text=>document.querySelector('#practice-message').textContent=text;
 function stop(){clearInterval(timer);timer=null;const button=document.querySelector('#practice-run');if(button)button.textContent='连续慢放';}
 function observeSerial(value){
  if(id<19)return;
  if(state.rst){decoder=null;return;}
  if(!decoder){if(value===0)decoder={position:0,value:0};else return;}
  const p=decoder.position;
  if(p>=6&&p<=34&&(p-6)%4===0)decoder.value|=value<<((p-6)/4);
  if(p===38){if(value===1){serialLog.push(decoder.value);if(serialLog.length>20)serialLog.shift();}else message('TX 停止位不为高；这份帧没有加入解码结果。');}
  if(p===39)decoder=null;else decoder.position++;
 }
 function changeClock(next){
  const rising=state.clk===0&&next===1,old=practiceSignals(id,state);
  if(rising)observeSerial(old.tx);
  state=practiceClock(id,state,next);
  if(rising){edge++;trace.push({edge,old:old[primary],value:practiceSignals(id,state)[primary],flag:id===13?state.done:id===15?state.press:id===20?state.receiver.valid:state.rst});if(trace.length>8)trace.shift();}
  emit(false);
 }
 function step(){if(state.clk)changeClock(0);changeClock(1);changeClock(0);}
 function batch(n){for(let i=0;i<n;i++)step();emit();update();}
 function reset(released=false){stop();state=practiceInitial(id);if(released&&id!==12)state=practiceInput(id,state,'rst',0);edge=0;trace=[];serialLog=[];decoder=null;onReset();emit(false);}
 function update(){
  const o=practiceSignals(id,state);
  document.querySelector('#practice-circuit').innerHTML=practiceDiagram(id,state);
  document.querySelectorAll('[data-practice-bit]').forEach(b=>{const v=state[b.dataset.practiceBit];b.setAttribute('aria-pressed',String(Boolean(v)));b.querySelector('b').textContent=v;});
  document.querySelectorAll('[data-practice-number]').forEach(input=>{input.value=state[input.dataset.practiceNumber];input.removeAttribute('aria-invalid');});
  document.querySelector('#practice-status').textContent=id===12?`OP=${state.op} · 组合输出随输入变化`:`CLK=${state.clk} · 上升沿 ${edge} 次 · RST=${state.rst}`;
  const clockButton=document.querySelector('#practice-clock');if(clockButton)clockButton.textContent=state.clk?'CLK 置 0 ↓':'CLK 置 1 ↑';
  document.querySelector('#practice-readout').innerHTML=outputKeys.map(k=>`<div><small>${k.toUpperCase()}</small><b data-practice-output="${k}">${show(o[k])}</b></div>`).join('');
  document.querySelector('#practice-trace').innerHTML=id===12?`<p>OP=${state.op} · A=${state.a} · B=${state.b}</p><p>Y=${o.y} · C=${o.carry} · ZERO=${o.zero}</p>`:trace.length?`<table class="truth-table"><thead><tr><th>上升沿</th><th>旧 ${primary.toUpperCase()}</th><th>新值</th><th>${id===13?'DONE':id===15?'PRESS':id===20?'RX_VALID':'RST'}</th></tr></thead><tbody>${trace.map(t=>`<tr><td>${t.edge}</td><td>${show(t.old)}</td><td>${show(t.value)}</td><td>${t.flag}</td></tr>`).join('')}</tbody></table>`:'<p>还没有时钟上升沿。可以先预测，再走一拍。</p>';
  const log=document.querySelector('#serial-log');if(log)log.innerHTML=serialLog.length?serialLog.map(v=>`<span class="serial-byte" data-decoded-byte="${v}">0x${v.toString(16).padStart(2,'0').toUpperCase()}${v>=32&&v<=126?' · '+esc(String.fromCharCode(v)):''}</span>`).join(''):'尚未发完一个字节';
 }
 document.querySelectorAll('[data-practice-bit]').forEach(button=>button.addEventListener('click',()=>{stop();state=practiceInput(id,state,button.dataset.practiceBit,1-state[button.dataset.practiceBit]);emit();update();message('');}));
 document.querySelectorAll('[data-practice-number]').forEach(el=>el.addEventListener('input',()=>{
  stop();if(el.value===''||!el.checkValidity()){el.setAttribute('aria-invalid','true');message('请输入控件标注范围内的整数。');return;}
  state=practiceInput(id,state,el.dataset.practiceNumber,Number(el.value));emit();update();message('');
 }));
 document.querySelector('#practice-clock')?.addEventListener('click',()=>{stop();changeClock(1-state.clk);emit();update();});
 document.querySelector('#practice-step')?.addEventListener('click',()=>{stop();batch(1);});
 document.querySelector('#practice-eight')?.addEventListener('click',()=>{stop();batch(8);});
 document.querySelector('#practice-run')?.addEventListener('click',()=>{if(timer){stop();return;}document.querySelector('#practice-run').textContent='暂停慢放';timer=setInterval(()=>batch(id>=19?4:1),450);});
 document.querySelector('#practice-reset').addEventListener('click',()=>{reset();emit();update();message('已重开实验。同步电路先释放 RST 再运行。');});
 document.querySelectorAll('[data-scenario]').forEach(button=>button.addEventListener('click',()=>{
  const scenario=scenarios(id)[Number(button.dataset.scenario)];reset(true);
  for(const {values,cycles} of scenario.actions){for(const [key,value] of Object.entries(values))state=practiceInput(id,state,key,value);emit(false);for(let i=0;i<cycles;i++)step();}
  emit();update();message('已从复位状态实际运行该示例。');document.querySelector('#scenario-description').textContent=scenario.description;
 }));
 function send(bad){
  stop();if(state.rst){message('先把 RST 置 0，再送入串口帧。');return;}
  const input=document.querySelector('#serial-byte');if(input.value===''||!input.checkValidity()){message('串口字节应是 0…255 的整数。');return;}
  for(const {values,cycles} of [...frameActions(Number(input.value),bad),action({rx:1},4)]){state=practiceInput(id,state,'rx',values.rx);emit(false);for(let i=0;i<cycles;i++)step();}
  emit();update();message('帧已送到 RX；继续走时钟可以观察 FIFO 与 TX 回显。');
 }
 document.querySelector('#serial-send')?.addEventListener('click',()=>send(false));
 document.querySelector('#serial-bad')?.addEventListener('click',()=>send(true));
 document.querySelector('#serial-drain')?.addEventListener('click',()=>{stop();batch(80);});
 emit();update();return stop;
}
