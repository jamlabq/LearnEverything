import {gate, mux, bitsToNumber} from './logic.mjs';

export const escapeHtml = value => String(value).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const svg = (body, view='0 0 560 255', label='互动电路图') => `<svg class="circuit" viewBox="${view}" role="img" aria-label="${escapeHtml(label)}">${body}</svg>`;
const wire = (d,high,extra='')=>`<path class="wire ${high?'high':''}" d="${d}" ${extra}/>`;
const led = (x,y,value,label)=>`<circle cx="${x}" cy="${y}" r="12" class="${value?'led-on':'led-off'}"/><text x="${x+24}" y="${y+5}" class="${value?'label-high':''}">${label} = ${value}</text>`;
const toggle = (name,label) => `<div class="input-control" id="input-group-${name}"><div class="input-label">${label}</div><button class="toggle" data-input="${name}" aria-label="切换 ${name.toUpperCase()} 输入" aria-pressed="false"><b>0</b><span class="switch-track" aria-hidden="true"><span class="switch-thumb"></span></span></button></div>`;

export function simulatorMarkup(lesson) {
  return `${lesson.id===2?'<div class="gate-select" aria-label="选择逻辑门">'+['AND','OR','XOR','NOT'].map(k=>`<button data-gate="${k}" class="${k==='AND'?'active':''}" aria-pressed="${k==='AND'}">${k}</button>`).join('')+'</div>':''}
  <div class="lab"><div class="lab-top"><span class="lab-caption">CIRCUIT ${String(lesson.id).padStart(2,'0')} / ${['PARALLEL LOGIC','LOGIC GATES','2 : 1 MULTIPLEXER'][lesson.id-1]}</span><span class="live-indicator">理想二值电路</span></div>
  <div class="lab-content"><div class="inputs">${toggle('a','INPUT A / 数据')}${toggle('b','INPUT B / 数据')}${lesson.id===3?toggle('sel','SELECT / 选择'):''}</div><div class="svg-wrap" id="circuit-diagram"></div></div>
  <div class="lab-bottom"><span id="circuit-status" aria-live="polite"></span><div class="lab-buttons"><button class="dark-btn" id="auto-run">自动遍历</button><button class="dark-btn" id="sim-reset">重置</button></div></div></div>
  <p class="kbd-tip">键盘也可以操作：Tab 选中开关，空格或 Enter 切换。${lesson.id===3?' 蓝色表示选中的路径；信号值以 0 / 1 为准。':' 绿色连线表示 1，暗色连线表示 0。'}</p>`;
}

function parallelDiagram(a,b) {
  const values = [gate('AND',a,b),gate('XOR',a,b),gate('NOT',a)];
  let body = `<text x="5" y="18" class="tiny">相同的输入 → 三条独立支路 → 同时响应</text>`;
  body += wire('M 15 53 H 85 V 213',a) + wire('M 15 90 H 65 M 65 71 V 147',b);
  body += [53,129,205].map(y=>`<circle cx="85" cy="${y}" r="3.5" fill="${a?'#d5ee9d':'#638174'}"/>`).join('') + [71,147].map(y=>`<circle cx="65" cy="${y}" r="3.5" fill="${b?'#d5ee9d':'#638174'}"/>`).join('');
  body += `<text x="10" y="44" class="${a?'label-high':''}">A=${a}</text><text x="10" y="113" class="${b?'label-high':''}">B=${b}</text>`;
  ['AND','XOR','NOT'].forEach((kind,i)=>{
    const y=55+i*76;
    body+=wire(`M 85 ${y-2} H 180`,a);
    if(i<2) body+=wire(`M 65 ${y+16} H 180`,b);
    body+=`<rect x="180" y="${y-22}" width="115" height="48" rx="8" class="gate-body"/><text x="237" y="${y+7}" text-anchor="middle">${kind}</text>`;
    body+=wire(`M 295 ${y+2} H 365`,values[i])+led(380,y+2,values[i],['AND','XOR','NOT'][i]);
  });
  return svg(body,'0 0 535 255',`A=${a}，B=${b}。与=${values[0]}，异或=${values[1]}，非=${values[2]}。三条支路并行工作`);
}

function gateDiagram(kind,a,b) {
  const y=gate(kind,a,b);
  let body = `<text x="10" y="28" class="tiny">${{AND:'两者都是 1',OR:'至少一个是 1',XOR:'两者不相同',NOT:'把 A 反过来'}[kind]}</text>`;
  if(kind==='NOT') {
    body+=wire('M 35 120 H 205',a)+`<path d="M205 75 L205 165 L295 120 Z" class="gate-body"/><circle cx="303" cy="120" r="8" class="gate-body"/>`+wire('M 311 120 H 410',y);
    body+=`<text x="48" y="104">A = ${a}</text><text x="248" y="206" text-anchor="middle">NOT / 非</text>`;
  } else {
    const inputX=kind==='AND'?205:218;
    body+=wire(`M 35 90 H ${inputX}`,a)+wire(`M 35 150 H ${inputX}`,b);
    body+=`<text x="48" y="72">A = ${a}</text><text x="48" y="177">B = ${b}</text>`;
    if(kind==='AND') body+=`<path d="M205 62 H250 A58 58 0 0 1 250 178 H205 Z" class="gate-body"/>`;
    else {
      body+=`<path d="M200 62 Q265 57 316 120 Q265 183 200 178 Q235 120 200 62 Z" class="gate-body"/>`;
      if(kind==='XOR') body+=`<path d="M187 62 Q222 120 187 178" fill="none" stroke="#88a796" stroke-width="1.5"/>`;
    }
    body+=wire(`M ${kind==='AND'?308:316} 120 H 410`,y)+`<text x="253" y="206" text-anchor="middle">${kind} / ${{AND:'与',OR:'或',XOR:'异或'}[kind]}</text>`;
  }
  body+=led(423,120,y,'Y');
  return svg(body,'0 0 535 240',`${kind} 逻辑门，A=${a}${kind==='NOT'?'':`，B=${b}`}，输出 Y=${y}`);
}

function muxDiagram(a,b,sel) {
  const y=mux(a,b,sel);
  const route=(path,active)=>`<path d="${path}" fill="none" stroke="${active?'#afd3f5':'#527064'}" stroke-width="${active?3:2}" stroke-linejoin="round"/>`;
  const body=`<text x="12" y="26" class="tiny">蓝色 = 被选中的路径；0/1 = 信号值</text>
  ${route('M 30 82 H 205',sel===0)}${route('M 30 176 H 205',sel===1)}
  <text x="38" y="65">A = ${a}</text><text x="38" y="202">B = ${b}</text>
  <path d="M205 48 L300 80 V176 L205 208 Z" class="gate-body"/>
  <text x="216" y="85" class="tiny">0</text><text x="216" y="181" class="tiny">1</text><text x="252" y="137" text-anchor="middle">MUX</text>
  ${route(`M 210 ${sel?176:82} L 282 128 H 411`,true)}
  <path d="M252 225 V190" stroke="#bacd84" stroke-width="2" stroke-dasharray="4 4"/><text x="175" y="246" style="fill:#d5ee9d">SEL = ${sel} → 选 ${sel?'B':'A'}</text>
  ${led(423,128,y,'Y')}`;
  return svg(body,'0 0 535 260',`选择器，A=${a}，B=${b}，SEL=${sel}，选择${sel?'B':'A'}，Y=${y}`);
}

function truthTable(kind,a,b,sel,lessonId) {
  if(lessonId===3) return `<table class="truth-table"><caption class="truth-caption">选择规则（A、B 可以是任意二值）</caption><thead><tr><th>SEL</th><th>选择</th><th>Y</th></tr></thead><tbody>${[0,1].map(s=>`<tr class="${sel===s?'current':''}"><td>${s}</td><td>${s?'B':'A'}</td><td>${s?'B':'A'}</td></tr>`).join('')}</tbody></table><p class="truth-caption">当前：SEL=${sel}，Y=${sel?'B':'A'}=${mux(a,b,sel)}。保持选择不变，试着改变另一根数据线。</p>`;
  const rows = kind==='NOT'?[[0,0],[1,0]]:[[0,0],[0,1],[1,0],[1,1]];
  return `<table class="truth-table"><thead><tr><th>A</th>${kind==='NOT'?'':'<th>B</th>'}<th>Y</th></tr></thead><tbody>${rows.map(([x,z])=>`<tr class="${a===x&&(kind==='NOT'||b===z)?'current':''}"><td>${x}</td>${kind==='NOT'?'':`<td>${z}</td>`}<td>${gate(kind,x,z)}</td></tr>`).join('')}</tbody></table><p class="truth-caption">浅绿色行对应当前输入。${kind==='NOT'?'NOT 只有一个输入，与 B 无关。':'两个一位输入，一共 4 种组合。'}</p>`;
}

export function mountSimulator(lesson, onSample, onReset) {
  let state={a:0,b:0,sel:0,kind:'AND'}, timer=null, autoIndex=0;
  const plot=document.querySelector('#circuit-diagram');
  const status=document.querySelector('#circuit-status');
  function values(){
    const {a,b,sel,kind}=state;
    if(lesson.id===1)return {a,b,y_and:gate('AND',a,b),y_xor:gate('XOR',a,b),y_not:gate('NOT',a)};
    if(lesson.id===2)return {a,...(kind==='NOT'?{}:{b}),y:gate(kind,a,b)};
    return {a,b,sel,y:mux(a,b,sel)};
  }
  function update(record=true){
    const {a,b,sel,kind}=state;
    document.querySelectorAll('[data-input]').forEach(button=>{
      const value=state[button.dataset.input];
      button.setAttribute('aria-pressed',String(Boolean(value)));
      button.querySelector('b').textContent=value;
    });
    plot.innerHTML=lesson.id===1?parallelDiagram(a,b):lesson.id===2?gateDiagram(kind,a,b):muxDiagram(a,b,sel);
    status.innerHTML=lesson.id===1?'三条支路 <strong>持续、并行</strong> 工作':lesson.id===2?`<strong>${kind}</strong> / 当前输出 Y = <strong>${gate(kind,a,b)}</strong>`:`当前选择 <strong>${sel?'B':'A'}</strong> / 输出 Y = <strong>${mux(a,b,sel)}</strong>`;
    if(lesson.id===2) document.querySelector('#input-group-b').hidden=kind==='NOT';
    const truth=document.querySelector('#truth-container');
    if(truth) truth.innerHTML=truthTable(kind,a,b,sel,lesson.id);
    if(lesson.id===1) resetCpu();
    if(record)onSample(values());
  }
  function stop(){clearInterval(timer);timer=null;document.querySelector('#auto-run').textContent='自动遍历';}
  document.querySelectorAll('[data-input]').forEach(button=>button.addEventListener('click',()=>{stop();state[button.dataset.input]^=1;update();}));
  document.querySelectorAll('[data-gate]').forEach(button=>button.addEventListener('click',()=>{
    stop();state.kind=button.dataset.gate;
    document.querySelectorAll('[data-gate]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});
    onReset();update();
  }));
  document.querySelector('#sim-reset').addEventListener('click',()=>{stop();state.a=0;state.b=0;state.sel=0;onReset();update();});
  document.querySelector('#auto-run').addEventListener('click',()=>{
    if(timer){stop();return;}
    autoIndex=0; document.querySelector('#auto-run').textContent='暂停遍历';
    const count=lesson.id===3?8:lesson.id===2&&state.kind==='NOT'?2:4;
    function tick(){
      state.a=state.kind==='NOT'&&lesson.id===2?autoIndex%2:(autoIndex>>1)&1;
      state.b=autoIndex&1;state.sel=(autoIndex>>2)&1;update();autoIndex++;
      if(autoIndex>=count)stop();
    }
    timer=setInterval(tick,850);tick();
  });
  let cpuStep=0;
  function resetCpu(){
    cpuStep=0;const rows=document.querySelector('#cpu-rows');if(!rows)return;
    rows.innerHTML=['AND','XOR','NOT'].map((k,i)=>`<div class="cpu-row" data-cpu="${i}"><span>0${i+1}</span><span>${k}</span><b>等待</b></div>`).join('');
    document.querySelector('#cpu-note').textContent='固定当前输入，点击一次完成一个任务。改变输入会从第一步重新开始。';
    const btn=document.querySelector('#cpu-step');if(btn)btn.disabled=false;
  }
  document.querySelector('#cpu-step')?.addEventListener('click',()=>{
    if(cpuStep>=3)return;
    const kind=['AND','XOR','NOT'][cpuStep];const row=document.querySelector(`[data-cpu="${cpuStep}"]`);
    row.classList.add('done');row.querySelector('b').textContent=gate(kind,state.a,state.b);cpuStep++;
    document.querySelector('#cpu-note').textContent=cpuStep===3?'三个任务分三步完成。上方 FPGA 的三条支路始终同时存在。这个示意不代表 CPU 与 FPGA 的真实性能。':`已完成 ${cpuStep} / 3 个任务；下一次点击继续。`;
    document.querySelector('#cpu-step').disabled=cpuStep===3;
  });
  document.querySelector('#cpu-reset')?.addEventListener('click',resetCpu);
  update();
  return ()=>{clearInterval(timer);};
}

export function binaryMarkup(){
  return `<div class="binary-row">${[8,4,2,1].map((weight,i)=>`<div class="bit-group"><small>位权 ${weight}</small><button data-bit="${i}" aria-label="切换位权 ${weight} 的二进制位" aria-pressed="false">0</button></div>`).join('')}<span class="binary-equals">=</span><div><small style="font-size:10px;color:var(--muted)">十进制</small><div class="binary-result" id="binary-result">0</div></div></div><div class="binary-formula" id="binary-formula">0×8 + 0×4 + 0×2 + 0×1 = 0</div>`;
}
export function mountBinary(){
  const bits=[0,0,0,0];
  document.querySelectorAll('[data-bit]').forEach(button=>button.addEventListener('click',()=>{
    const i=Number(button.dataset.bit);bits[i]^=1;button.textContent=bits[i];button.setAttribute('aria-pressed',String(Boolean(bits[i])));
    const n=bitsToNumber(bits);document.querySelector('#binary-result').textContent=n;
    document.querySelector('#binary-formula').textContent=bits.map((v,i)=>`${v}×${[8,4,2,1][i]}`).join(' + ')+` = ${n}`;
  }));
}

export function flowDiagram(){
  const box=(x,y,w,title,sub,fill='#f0f5e8')=>`<rect x="${x}" y="${y}" width="${w}" height="70" rx="9" fill="${fill}" stroke="#c4d5b7"/><text x="${x+w/2}" y="${y+29}" text-anchor="middle" font-size="14" fill="#24553b">${title}</text><text x="${x+w/2}" y="${y+50}" text-anchor="middle" font-size="10" fill="#5e7653">${sub}</text>`;
  return `<figure class="diagram"><svg viewBox="0 0 790 265" role="img" aria-label="两条工具路线：Verilog 和测试台通过 XSim 生成仿真波形；Verilog 通过综合、实现、比特流配置 FPGA。" style="width:100%;height:auto"><defs><marker id="flow-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="#7b976c"/></marker></defs><g font-family="var(--sans)">
  <text x="18" y="23" font-size="11" fill="#146c57">本版先走这条路：在电脑上验证</text>
  ${box(18,45,150,'Verilog + 测试台','描述电路 + 提供输入')}${box(260,45,155,'XSim 仿真','计算逻辑行为')}${box(510,45,245,'输出波形与自检结果','对照预测，检查对不对')}
  <path d="M168 80H252M415 80H502" stroke="#7b976c" stroke-width="2" marker-end="url(#flow-arrow)"/>
  <text x="18" y="159" font-size="11" fill="#687b5e">后续路线：配置真实硬件</text>
  ${box(18,180,130,'Verilog','可综合的电路描述','#f7f8f3')}${box(198,180,160,'综合 + 实现','映射资源、布局布线','#f7f8f3')}${box(408,180,140,'比特流','器件的配置文件','#f7f8f3')}${box(598,180,157,'FPGA','配置后运行电路','#f7f8f3')}
  <path d="M148 215H190M358 215H400M548 215H590" stroke="#7b976c" stroke-width="2" marker-end="url(#flow-arrow)"/>
  </g></svg><figcaption>仿真与硬件实现是两条相关的工具路线，仿真无需开发板。手机上可左右滑动图示。</figcaption></figure>`;
}

export function muxGatesDiagram(){
  return `<figure class="diagram"><svg viewBox="0 0 650 235" role="img" aria-label="Y 等于 A 与非 SEL 的结果，或 B 与 SEL 的结果。两个与门加一个非门和一个或门组成二选一选择器。" style="width:100%;height:auto"><g fill="none" stroke="#6f8c60" stroke-width="2"><path d="M45 55H190M45 155H190M45 205H100V175H190M100 175V105H125M156 105H170V82H190M300 68H400V100H445M300 165H400V135H445M545 117H605"/><path d="M125 94L125 115L146 105Z" fill="#eef4e5"/><circle cx="151" cy="105" r="4" fill="white"/><rect x="190" y="35" width="110" height="65" rx="10" fill="#eef4e5"/><rect x="190" y="132" width="110" height="65" rx="10" fill="#eef4e5"/><rect x="445" y="85" width="100" height="65" rx="10" fill="#eef4e5"/></g><g font-family="var(--mono)" font-size="13" fill="#355b29"><text x="24" y="59">A</text><text x="24" y="159">B</text><text x="22" y="210">SEL</text><text x="245" y="73" text-anchor="middle">AND</text><text x="245" y="171" text-anchor="middle">AND</text><text x="495" y="124" text-anchor="middle">OR</text><text x="610" y="122">Y</text><text x="140" y="90" font-size="10">~SEL</text></g></svg><figcaption>逻辑等价示意：Y = (A &amp; ~SEL) | (B &amp; SEL)，对应二值输入。手机上可左右滑动图示。</figcaption></figure>`;
}
