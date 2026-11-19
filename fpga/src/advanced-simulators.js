import {initialState,setInput,clock,signals,signalWidths} from './advanced-logic.mjs';
import {escapeHtml} from './simulators.js';
const label=n=>String(n).padStart(2,'0');
const names={4:'ADDER / BIT WIDTH',5:'CLOCK / REGISTER',6:'COUNTER / ENABLE',7:'TWO-STAGE PIPELINE',8:'FINITE STATE MACHINE',9:'PWM / BREATHING',10:'FROM RTL TO BOARD'};
const inputSpec={4:[['a','A / 四位输入',15],['b','B / 四位输入',15]],5:[['d','D / 待保存数据',15]],6:[],7:[['a','A / 四位输入',15],['b','B / 四位输入',15]],8:[],9:[['level','LEVEL / 静态占空比',16]],10:[['half','H / 半周期参数',8,1]]};
const bitSpec={4:[],5:[['en','EN / 允许写入']],6:[['en','EN / 允许计数']],7:[['valid_in','VALID / 输入有效']],8:[['tick','TICK / 允许转移']],9:[['breath_en','BREATH / 自动呼吸']],10:[]};
const btn=(key,text,value)=>`<div class="input-control"><div class="input-label">${text}</div><button class="toggle" data-advanced-bit="${key}" aria-label="切换 ${key.toUpperCase()}" aria-pressed="${Boolean(value)}"><b>${value}</b><span class="switch-track" aria-hidden="true"><span class="switch-thumb"></span></span></button></div>`;
const range=(key,text,max,min=0,value=0)=>`<label class="numeric-control"><span class="input-label">${text}</span><span class="number-entry"><input type="range" data-advanced-number="${key}" aria-label="${text}" min="${min}" max="${max}" step="1" value="${value}"><output data-number-value="${key}">${value}</output></span></label>`;
export function advancedMarkup(l){
  const s=initialState(l.id);
  return `<div class="lab advanced-lab"><div class="lab-top"><span class="lab-caption">CIRCUIT ${label(l.id)} / ${names[l.id]}</span><span class="live-indicator">${l.id===4?'组合逻辑':'同步时序电路'}</span></div><div class="lab-content"><div class="inputs advanced-inputs">${inputSpec[l.id].map(([k,t,max,min])=>range(k,t,max,min||0,s[k])).join('')}${bitSpec[l.id].map(([k,t])=>btn(k,t,s[k])).join('')}${l.id>=5?btn('rst','RST / 同步复位',1):''}</div><div class="svg-wrap" id="advanced-circuit"></div></div><div class="lab-bottom"><span id="advanced-status" aria-live="polite"></span><div class="lab-buttons">${l.id>=5?'<button class="dark-btn" id="clock-toggle">CLK 置 1 ↑</button><button class="dark-btn" id="clock-step">走一个时钟周期 →</button>':''}<button class="dark-btn" id="advanced-run">${l.id===4?'自动换输入':'连续慢放'}</button><button class="dark-btn" id="advanced-reset">重新复位</button></div></div></div>
  <p class="kbd-tip" id="edge-note">${l.id===4?'拖动输入滑块；结果随输入更新，不需要时钟。':'初始状态表示已复位。先把 RST 置 0，再走时钟。输入变化不会自动触发上升沿。'}</p>
  ${l.id===9?'<div class="frame-controls"><button class="secondary-btn" id="frame-step">走完整个 PWM 周期（16 拍）</button><span>慢放按 PWM 周期前进；瞬时 PWM 和平均亮度分别显示。</span></div>':''}`;
}
const block=(x,y,w,h,title,sub='',active=true)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="9" fill="${active?'#234435':'#1c362f'}" stroke="${active?'#b2ce91':'#77998a'}" stroke-width="1.5"/><text x="${x+w/2}" y="${y+h/2-3}" text-anchor="middle" class="block-title">${title}</text><text x="${x+w/2}" y="${y+h/2+18}" text-anchor="middle" class="tiny">${sub}</text>`;
const arrow=(d,color='#9fbf93')=>`<path d="${d}" fill="none" stroke="${color}" stroke-width="2" marker-end="url(#adv-arrow)"/>`;
const svg=(body,alt)=>`<svg class="circuit advanced-svg" viewBox="0 0 640 285" role="img" aria-label="${escapeHtml(alt)}"><defs><marker id="adv-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="#9fbf93"/></marker></defs>${body}</svg>`;
const clockLine=(s,bottom=190,x=335)=>`<path d="M${x} 270V${bottom}" stroke="#cfdd9c" stroke-width="2"/><path d="M${x-8} ${bottom}L${x} ${bottom-13}L${x+8} ${bottom}" fill="none" stroke="#cfdd9c" stroke-width="2"/><text x="${x+15}" y="265" class="tiny">CLK=${s.clk} · RST=${s.rst}</text>`;
function diagram(id,s){
  const out=signals(id,s);let body='',alt='';
  if(id===4){
    const {sum,low_sum,carry}=out;
    body=`<text x="22" y="47" class="tiny">无符号数 · 输入 4 位，完整结果 5 位</text><text x="20" y="103">A = ${s.a} (${s.a.toString(2).padStart(4,'0')})</text><text x="20" y="183">B = ${s.b} (${s.b.toString(2).padStart(4,'0')})</text>${arrow('M170 100H226')}${arrow('M170 180H226')}${block(230,80,140,120,'+','显式扩展后相加')}${arrow('M370 140H420')}<text x="435" y="132" class="big">${sum}</text><text x="435" y="155" class="tiny">SUM[4:0] = ${sum.toString(2).padStart(5,'0')}</text><text x="435" y="193">低四位 = ${low_sum}</text><text x="435" y="220" class="${carry?'label-high':''}">进位 = ${carry}</text>`;
    alt=`四位加法 A=${s.a}，B=${s.b}，完整结果=${sum}，低四位=${low_sum}，进位=${carry}`;
  }else if(id===5){
    body=`<text x="20" y="40" class="tiny">D 会改变；Q 只在有效上升沿保存新值</text><text x="25" y="130" class="big">D=${s.d}</text>${arrow('M105 125H220')}${block(225,85,215,105,'四位寄存器',`EN=${s.en} · RST=${s.rst}`)}${arrow('M440 125H495')}<text x="510" y="130" class="big">Q=${s.q}</text><text x="510" y="155" class="tiny">${s.q.toString(2).padStart(4,'0')}</text>${clockLine(s)}<text x="225" y="212" class="tiny">0→1：先看 RST，再看 EN</text>`;
    alt=`寄存器 D=${s.d}，Q=${s.q}，CLK=${s.clk}，RST=${s.rst}，EN=${s.en}`;
  }else if(id===6){
    body=`<text x="20" y="36" class="tiny">反馈路径：把旧计数加 1，交给下一拍保存</text>${block(80,82,125,80,'+ 1','四位回卷')}${arrow('M205 120H285')}${block(290,72,175,100,`COUNT = ${s.count}`,s.count.toString(2).padStart(4,'0'))}${arrow('M465 120H535')}<text x="490" y="95" class="tiny">WRAP=${s.wrap}</text><path d="M500 120V205H45V120H75" fill="none" stroke="#9fbf93" stroke-width="2" marker-end="url(#adv-arrow)"/><text x="65" y="236" class="tiny">EN=${s.en}：${s.en?'下一拍允许 +1':'保持旧值'} · 15→0 时 WRAP=1</text>${clockLine(s,172,377)}`;
    alt=`计数器 COUNT=${s.count}，WRAP=${s.wrap}，EN=${s.en}，CLK=${s.clk}`;
  }else if(id===7){
    body=`<text x="20" y="33" class="tiny">两级寄存器 · 第一拍相加，第二拍输出旧一级的两倍</text><text x="10" y="88">A=${s.a}</text><text x="10" y="113">B=${s.b}</text>${arrow('M68 105H100')}${block(105,68,78,84,'+','组合')}${arrow('M183 105H217')}${block(222,60,112,100,`R1=${s.stage_sum}`,'第一级',Boolean(s.valid_s1))}${arrow('M334 105H370')}${block(375,68,70,84,'×2','组合')}${arrow('M445 105H480')}${block(485,60,135,100,`Y=${s.y}`,'第二级',Boolean(s.valid_out))}<text x="15" y="210" class="tiny">VALID_IN=${s.valid_in}</text>${arrow('M115 205H218')}${block(222,180,112,54,`V1=${s.valid_s1}`,'',Boolean(s.valid_s1))}${arrow('M334 205H480')}${block(485,180,135,54,`VOUT=${s.valid_out}`,'',Boolean(s.valid_out))}<text x="20" y="267" class="tiny">输出${s.valid_out?'有效：可读取 Y':'无效：Y 的数值不作为本拍结果'} · CLK=${s.clk}</text>`;
    alt=`流水线 A=${s.a}，B=${s.b}，一级=${s.stage_sum}，Y=${s.y}，输出有效=${s.valid_out}`;
  }else if(id===8){
    body=`<text x="20" y="35" class="tiny">TICK=1 的上升沿前进一状态；TICK=0 保持</text>`;
    ['RED','GREEN','YELLOW'].forEach((name,i)=>{const active=s.state===i;body+=`<circle cx="${100+i*215}" cy="125" r="51" fill="${active?['#6f3930','#355331','#65572a'][i]:'#233b31'}" stroke="${active?['#f1a18c','#d5ee9d','#edce7a'][i]:'#638575'}" stroke-width="${active?3:1.5}"/><text x="${100+i*215}" y="122" text-anchor="middle">${name}</text><text x="${100+i*215}" y="147" text-anchor="middle" class="tiny">STATE=${i}</text>`;});
    body+=arrow('M156 125H258')+arrow('M371 125H473')+arrow('M530 181V220H100V181')+`<text x="160" y="102" class="tiny">tick</text><text x="375" y="102" class="tiny">tick</text><text x="250" y="251" class="tiny">TICK=${s.tick} · CLK=${s.clk} · RST=${s.rst}</text>`;
    alt=`状态机 STATE=${s.state}，${['红灯','绿灯','黄灯'][s.state]}，TICK=${s.tick}`;
  }else if(id===9){
    const duty=out.duty;
    body=`<text x="20" y="30" class="tiny">一个 PWM 周期 = 16 个时钟格；亮格表示高电平</text>`;
    for(let i=0;i<16;i++)body+=`<rect x="${20+i*37}" y="70" width="31" height="52" rx="4" fill="${!s.rst&&i<duty?'#bfdc84':'#2b4337'}" stroke="${s.phase===i?'#f4d895':'#56745f'}" stroke-width="${s.phase===i?3:1}"/><text x="${35+i*37}" y="143" text-anchor="middle" class="tiny">${i}</text>`;
    body+=block(20,176,195,80,`PHASE=${s.phase}`,`DUTY=${duty} / 16`)+arrow('M215 215H255')+block(260,176,170,80,`PWM=${out.pwm}`,'phase < duty')+arrow('M430 215H470')+`<circle cx="520" cy="211" r="30" fill="#d5ee9d" opacity="${s.rst?.08:.08+duty/16*.92}"/><text x="475" y="262" class="tiny">平均亮度示意</text><text x="472" y="172" class="tiny">${(duty/16*100).toFixed(2)}%</text>`;
    alt=`PWM PHASE=${s.phase}，占空比=${duty}/16，瞬时输出=${out.pwm}，模式=${s.breath_en?'自动呼吸':'静态'}`;
  }else{
    body=`<text x="20" y="38" class="tiny">仿真用小参数 H=${s.half}；真实板按晶振频率设置参数</text>${block(18,90,130,90,'时钟 CLK',`当前电平=${s.clk}`)}${arrow('M148 130H202')}${block(207,75,225,115,`COUNT=${s.count}`,`计到 ${s.half-1}，LED 翻转`)}${arrow('M432 130H490')}<circle cx="535" cy="130" r="30" class="${s.led?'led-on':'led-off'}"/><text x="505" y="187">LED=${s.led}</text><text x="75" y="238" class="tiny">f_LED = f_CLK / (2 × H) · rst 是同步高有效复位</text>`;
    alt=`LED 分频计数器 H=${s.half}，COUNT=${s.count}，LED=${s.led}`;
  }
  return svg(body,alt);
}
export function advancedSupport(l){
  const hints={4:['为什么 15 + 1 会变成 0？','完整结果是 16，即二进制 10000。如果只保存低四位，就得到 0000；最高位的 1 需要额外的位保存。本课同时显示两种结果。'],5:['输入改变，不代表已经保存','把 RST 置 0，改变 D；此时 Q 保持旧值。再把 CLK 从 0 置 1，Q 才跟随 D。把 EN 置 0，即使时钟继续，Q 也保持。'],6:['回卷，不是计算出错','四位无符号计数只有 0～15。继续加 1 时回到 0，WRAP 提示这一拍发生了回卷。把 EN 置 0，下一拍不计数且 WRAP 清零。'],7:['数值和“这份数是否有效”一起走','每个上升沿，R1 保存本拍的 A+B，Y 保存旧 R1 的两倍。取消 VALID_IN 会插入一个气泡，两个上升沿后输出有效标志相应为 0；那时不要使用 Y。'],8:['状态，保存了过去发生过什么','红、绿、黄是三个离散状态。TICK 只是允许转移，不是新时钟；只有 CLK 上升沿才保存下一状态。RST 优先回到 RED。'],9:['瞬时亮灭和平均亮度分开看','一格对应一拍。高电平格数 / 16 就是占空比。静态模式拖动 LEVEL；自动模式每个完整 PWM 周期把占空比加减一级。圆形灯的渐亮只是占空比近似示意。'],10:['从可运行电路，到可核实的硬件配置','H 是综合时参数，网页改动 H 会重新开始演示。8 Hz 教学时钟配 H=4 得到 1 Hz；50 MHz 晶振要 H=25,000,000 才得到 1 Hz。上板还要确认管脚、电压和约束。']}[l.id];
  return `<div class="two-col"><article class="card"><div class="section-label">OBSERVE / PREDICT / VERIFY</div><h3>${hints[0]}</h3><p>${hints[1]}</p><div class="state-readout" id="state-readout"></div></article><article class="card"><div class="section-label">${l.id===4?'BIT BY BIT':'RISING-EDGE TRACE'}</div><h3>${l.id===4?'把位宽展开来看':'最近的上升沿，发生了什么？'}</h3><div id="edge-trace"></div><p class="truth-caption">${l.id===4?'左边是最高位。进位不等于有符号数的溢出，本课只处理无符号数。':'表格只记录上升沿后的状态。普通输入变化和下降沿不会增加一行。同步复位也要等上升沿生效。'}</p></article></div>${l.id===10?boardWorkflow():''}`;
}
function boardWorkflow(){
  const stages=[['行为仿真','用本课 testbench 检查分频器。仿真通过后，查看波形是否符合预期；仿真不检查真实管脚。'],['确认板卡与约束','从板卡手册查器件型号、晶振频率、时钟/复位/LED 引脚、I/O 电压和有效电平。外部按键先同步、去抖。不要用教学器件型号代替真实板卡。'],['综合与实现','在实际板卡工程中设置 HALF_PERIOD 和有效 XDC，运行 Synthesis、Implementation，检查利用率、DRC 与时序报告。WNS ≥ 0 只是指定时序约束满足，仍要确认约束完整。'],['生成比特流','确认没有未约束的必需时钟、未定义引脚或电压问题后，运行 Generate Bitstream。比特流只适用于匹配的器件和配置。'],['硬件验证','连接板卡，在 Hardware Manager 中识别实际目标并配置对应 bitstream；观察复位、LED 频率，必要时用 ILA 检查内部信号。课程没有替你验证未知板卡。']];
  return `<article class="card board-workflow"><div class="section-label">FROM SIMULATION TO HARDWARE</div><h3>把整个工具流程串起来</h3><div class="workflow-tabs">${stages.map(([title],i)=>`<button class="secondary-btn ${i===0?'selected':''}" data-workflow="${i}" aria-pressed="${i===0}">${i+1}. ${title}</button>`).join('')}</div><p id="workflow-explanation">${stages[0][1]}</p><script type="application/json" id="workflow-data">${JSON.stringify(stages).replace(/</g,'\\u003c')}</script><div class="frequency-calculator"><label>教学参数 H <b id="half-summary">4</b></label><label>示例输入频率 <select id="frequency-select" aria-label="示例时钟频率"><option value="8">8 Hz（慢放教学）</option><option value="50000000">50 MHz（常见晶振示例）</option><option value="100000000">100 MHz（示例）</option></select></label><output id="frequency-result">LED 完整亮灭频率：1 Hz</output></div><p class="truth-caption">这里计算的是公式，不会改变电脑仿真时间或实际硬件。50 MHz 下需要 H=25,000,000 才能得到 1 Hz，真实参数应在 design.v/工程中设置。</p></article>`;
}
export function mountAdvanced(l,onSample,onReset){
  const id=l.id;let s=initialState(id),timer=null,edges=0,trace=[];
  function record(){onSample(signals(id,s),signalWidths(id,s));}
  function stop(){clearInterval(timer);timer=null;const b=document.querySelector('#advanced-run');if(b)b.textContent=id===4?'自动换输入':'连续慢放';}
  function update(){
    document.querySelector('#advanced-circuit').innerHTML=diagram(id,s);
    document.querySelectorAll('[data-advanced-bit]').forEach(b=>{const value=s[b.dataset.advancedBit];b.setAttribute('aria-pressed',String(Boolean(value)));b.querySelector('b').textContent=value;});
    document.querySelectorAll('[data-advanced-number]').forEach(input=>{input.value=s[input.dataset.advancedNumber];document.querySelector(`[data-number-value="${input.dataset.advancedNumber}"]`).textContent=input.value;});
    const out=signals(id,s);
    document.querySelector('#advanced-status').innerHTML=id===4?`完整结果 <strong>${out.sum}</strong> · 低四位 <strong>${out.low_sum}</strong> · 进位 <strong>${out.carry}</strong>`:`CLK=<strong>${s.clk}</strong> · 已走 <strong>${edges}</strong> 个上升沿 · ${s.rst?'RST=1：下一上升沿复位':'RST=0：正常工作'}`;
    if(id>=5)document.querySelector('#clock-toggle').textContent=s.clk?'CLK 置 0 ↓':'CLK 置 1 ↑';
    const data=Object.entries(out).filter(([name])=>!['clk','rst','a','b','d','level','en','tick','valid_in','breath_en'].includes(name));
    document.querySelector('#state-readout').innerHTML=data.map(([name,value])=>`<div><small>${name.toUpperCase()}</small><b data-signal="${name}">${value}</b></div>`).join('');
    const table=document.querySelector('#edge-trace');
    if(id===4)table.innerHTML=`<div class="bit-result"><span>${out.sum.toString(2).padStart(5,'0').split('').map((v,i)=>`<b class="${i===0?'carry-bit':''}">${v}</b>`).join('')}</span><p>最高一位是进位，其余四位 = ${out.low_sum}</p></div>`;
    else{
      const key=id===5?'q':id===6?'count':id===7?'y':id===8?'state':id===9?'phase':'led';
      table.innerHTML=trace.length?`<table class="truth-table"><thead><tr><th>上升沿</th><th>${key.toUpperCase()}</th><th>${id===7?'VOUT':id===9?'DUTY':'RST'}</th></tr></thead><tbody>${trace.map(row=>`<tr><td>${row.edge}</td><td>${row.values[key]}</td><td>${row.values[id===7?'valid_out':id===9?'duty':'rst']}</td></tr>`).join('')}</tbody></table>`:'<p class="empty-trace">还没有走时钟。先释放 RST，再点击“走一个时钟周期”。</p>';
    }
    if(id===10)frequency();
  }
  function changeClock(next){
    const rising=s.clk===0&&next===1;s=clock(id,s,next);
    if(rising){edges++;trace.push({edge:edges,values:signals(id,s)});if(trace.length>6)trace.shift();}
    record();update();
  }
  function step(){if(s.clk)changeClock(0);changeClock(1);changeClock(0);}
  document.querySelectorAll('[data-advanced-bit]').forEach(b=>b.addEventListener('click',()=>{stop();s=setInput(id,s,b.dataset.advancedBit,1-s[b.dataset.advancedBit]);record();update();}));
  document.querySelectorAll('[data-advanced-number]').forEach(input=>input.addEventListener('input',()=>{stop();s=setInput(id,s,input.dataset.advancedNumber,Number(input.value));if(input.dataset.advancedNumber==='half'){edges=0;trace=[];onReset();}record();update();}));
  document.querySelector('#clock-toggle')?.addEventListener('click',()=>{stop();changeClock(1-s.clk);});
  document.querySelector('#clock-step')?.addEventListener('click',()=>{stop();step();});
  document.querySelector('#frame-step')?.addEventListener('click',()=>{stop();for(let i=0;i<16;i++)step();});
  document.querySelector('#advanced-reset').addEventListener('click',()=>{stop();s=initialState(id);edges=0;trace=[];onReset();record();update();});
  document.querySelector('#advanced-run').addEventListener('click',()=>{
    if(timer){stop();return;}
    document.querySelector('#advanced-run').textContent='暂停慢放';
    timer=setInterval(()=>{
      if(id===4){s=setInput(id,s,'a',(s.a+1)%16);s=setInput(id,s,'b',(s.b+3)%16);record();update();}
      else if(id===9){for(let i=0;i<16;i++)step();}
      else step();
    },id===9?220:700);
  });
  function frequency(){const h=document.querySelector('#half-summary');if(!h)return;h.textContent=s.half;const hz=Number(document.querySelector('#frequency-select').value)/(2*s.half);document.querySelector('#frequency-result').textContent=`LED 完整亮灭频率：${hz.toLocaleString('zh-CN',{maximumFractionDigits:4})} Hz`;}
  document.querySelector('#frequency-select')?.addEventListener('change',frequency);
  const workflow=document.querySelector('#workflow-data');
  if(workflow){const stages=JSON.parse(workflow.textContent);document.querySelectorAll('[data-workflow]').forEach(b=>b.addEventListener('click',()=>{document.querySelector('#workflow-explanation').textContent=stages[Number(b.dataset.workflow)][1];document.querySelectorAll('[data-workflow]').forEach(v=>{v.setAttribute('aria-pressed',String(v===b));v.classList.toggle('selected',v===b);});}));}
  record();update();return stop;
}
export function mountAdvancedConcept(l){
  const target=document.querySelector(`[data-advanced-diagram="${l.id}"]`);if(!target)return;
  const s={...initialState(l.id),rst:0};
  if(l.id===4){s.a=15;s.b=1;}if(l.id===5){s.d=9;s.q=3;}if(l.id===7){s.a=4;s.b=2;s.stage_sum=5;s.y=10;s.valid_s1=1;s.valid_out=1;}
  target.innerHTML=`<figure class="diagram advanced-concept"><div class="concept-circuit">${diagram(l.id,s)}</div><figcaption>电路结构示意。动态值以本课“动手实验”为准；手机上可左右滑动查看。</figcaption></figure>`;
}
