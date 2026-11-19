import {lessons, labInstructions} from './content.js';
import {labData} from './lab-data.js';
import {escapeHtml,simulatorMarkup,mountSimulator,binaryMarkup,mountBinary,flowDiagram,muxGatesDiagram} from './simulators.js';
import {manualWave,renderWave,sliceWave} from './waveform.js';
import {practiceMarkup,practiceSupport,mountPractice} from './practice-simulators.js';
import {mountPracticeConcept} from './practice-diagrams.js';
import {advancedMarkup,advancedSupport,mountAdvanced,mountAdvancedConcept} from './advanced-simulators.js';

const main=document.querySelector('#main');
let currentLesson=1,currentTab='experiment',cleanup=()=>{},samples=[],manualWidths={},waveMode='manual',toastTimer;
let progress={};
try{progress=JSON.parse(localStorage.getItem('fpga-visible-progress')||'{}');if(!progress||Array.isArray(progress)||typeof progress!=='object')progress={};}catch{progress={};}
const answers={};
const tabs=[['experiment','动手实验'],['concepts','原理图解'],['code','Verilog 与仿真'],['quiz','课后挑战']];
const lesson=()=>lessons[currentLesson-1];
function toast(message){const el=document.querySelector('#toast');el.textContent=message;el.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.hidden=true,2500);}
function updateProgress(){
  const count=lessons.filter(l=>progress[l.id]).length;
  document.querySelector('#progress-label').textContent=`${count} / ${lessons.length}`;
  document.querySelector('#progress-bar').style.width=`${count/lessons.length*100}%`;
  document.querySelector('#lesson-nav').innerHTML=lessons.map(l=>`${l.id===1?'<div class="nav-group">基础篇 · 看懂电路</div>':l.id===11?'<div class="nav-group">实践篇 · 搭建系统</div>':''}<a href="#lesson-${l.id}" class="lesson-link ${l.id===currentLesson?'active':''}" ${l.id===currentLesson?'aria-current="page"':''}><span class="lesson-number">${String(l.id).padStart(2,'0')}</span><span>${l.title}</span><span class="check">${progress[l.id]?'✓':l.id===currentLesson?'↗':''}</span></a>`).join('');
}
function saveProgress(){try{localStorage.setItem('fpga-visible-progress',JSON.stringify(progress));return true;}catch{toast('浏览器未允许存储，学习记录仅在本次页面中保留。');return false;}}
function supportMarkup(l){
  if(l.id>=11)return practiceSupport(l)+practiceExercises(l);
  if(l.id>=4)return advancedSupport(l);
  if(l.id===1)return `<div class="two-col"><article class="card"><div class="section-label">ONE INPUT, MULTIPLE CIRCUITS</div><h3>观察一下，想一想</h3><p>三个输出共用输入 A、B，但遵守不同的规则。现在先不用记住符号：<strong>试着找到让每盏灯亮起的条件。</strong></p><ul><li>AND：两者都为 1 才亮。</li><li>XOR：两者不同时亮。</li><li>NOT：与 A 相反，不看 B。</li></ul><p>下一课会逐个拆开这些规则。</p></article><article class="card"><div class="section-label">SEQUENTIAL / TEACHING MODEL</div><h3>对比：一次只做一个任务</h3><div id="cpu-rows" class="cpu-rows"></div><p id="cpu-note" class="cpu-note"></p><div class="cpu-controls"><button class="secondary-btn" id="cpu-step">顺序示意：下一步 →</button><button class="text-button" id="cpu-reset">重新开始</button></div></article></div>`;
  return `<div class="two-col"><article class="card"><div class="section-label">${l.id===2?'TRUTH TABLE':'SELECTION RULE'}</div><h3>${l.id===2?'每一种输入，都有一个结果':'选择的是一路数据'}</h3><div id="truth-container"></div></article><article class="card"><div class="section-label">${l.id===2?'A NUMBER IN FOUR BITS':'DATA ≠ CONTROL'}</div><h3>${l.id===2?'四根线，能表示多少？':'控制线本身，不是输出值'}</h3>${l.id===2?`<p>从左到右，位权分别是 8、4、2、1。点亮一位，就把它的权重加进来。</p><div class="binary">${binaryMarkup()}</div>`:'<p>SEL=1 的意思是<strong>选择 B</strong>，并不意味着输出一定是 1。如果 B=0，那么 Y 就是 0。</p><p>选择器只转送数据，不会记住数据。本课没有时钟，输入变化就会影响当前的组合逻辑结果。</p><div class="callout"><code>Y = SEL ? B : A</code><p>SEL=1 选冒号前的 B；SEL=0 选冒号后的 A。</p></div>'}</article></div>`;
}
function practiceExercises(l){
 return `<article class="card"><div class="section-label">BUILD IT YOURSELF</div><h3>分三步，把例子变成自己的电路</h3><p>这些练习需要修改源码并补充自检；课后选择题只帮助检查概念。</p><div class="practice-exercises">${l.practice.map((p,i)=>`<section><span class="exercise-number">0${i+1}</span><h4>${p.title}</h4><p>${p.task}</p><details><summary>一点提示</summary><p>${p.hint}</p></details><div class="exercise-acceptance"><b>验收：</b>${p.acceptance}</div></section>`).join('')}</div></article>`;
}
function interfaceMarkup(l){
 return l.interface?`<article class="card"><div class="section-label">MODULE INTERFACE</div><h3>先读懂模块的输入和输出</h3><div class="table-scroll"><table class="explain-table"><tbody>${l.interface.map(p=>`<tr><td>${escapeHtml(p.name)}</td><td>${p.meaning}</td></tr>`).join('')}</tbody></table></div></article>`:'';
}
function experimentMarkup(l){
  return `<div class="panel-intro"><h2>${l.experiment}</h2><p>${l.prompt}</p></div>${l.id>=11?practiceMarkup(l):l.id>=4?advancedMarkup(l):simulatorMarkup(l)}
  <div class="observation"><span class="number">↗</span><div><b>试一试 </b>${l.observation}</div></div>
  <section class="wave-section" aria-label="信号波形"><div class="wave-heading"><h3>看见信号的变化<span class="source-badge" id="wave-badge">INTERACTIVE</span></h3><div class="wave-options" aria-label="波形来源"><button class="wave-choice active" data-wave="manual" aria-pressed="true">手动操作记录</button><button class="wave-choice" data-wave="xsim" aria-pressed="false">XSim 实测波形</button></div></div><div class="wave-window" id="wave-window-wrap" hidden><label>显示片段 <select id="wave-window" aria-label="仿真波形显示片段"><option value="focus">推荐观察片段</option><option value="first">开头一段</option><option value="last">最后一段</option><option value="all">完整记录</option></select></label><span>总线内显示十进制值；X/Z 表示未知/高阻。</span></div><div class="wave-plot" id="wave-plot"></div><p class="wave-note" id="wave-note"></p></section>
  ${supportMarkup(l)}<div class="summary-strip">${l.takeaway.map(([en,title,desc])=>`<div class="summary-item"><small>${en}</small><h4>${title}</h4><p>${desc}</p></div>`).join('')}</div>`;
}
function highlightCode(code){
  return code.trimEnd().split('\n').map((line,i)=>{
    const [normal,...comments]=line.split('//');
    const rendered=escapeHtml(normal).replace(/\b(module|endmodule|input|output|wire|reg|assign|always|posedge|if|else|begin|end|parameter|localparam|case|endcase|default)\b/g,'<span class="keyword">$1</span>');
    return `<span class="line"><span class="lineno">${String(i+1).padStart(2,'0')}</span>${rendered}${comments.length?`<span class="comment">//${escapeHtml(comments.join('//'))}</span>`:''}</span>`;
  }).join('');
}
function codeMarkup(l){
  const data=labData[l.lab];
  return `<div class="reading">${interfaceMarkup(l)}<article class="card"><div class="section-label">READ THE CIRCUIT / VERILOG</div><h3>从模块接口，读懂电路实现</h3><p>这份源码包含本课电路的完整实现。先看输入和输出，再看中间的连接关系。你可以下载、修改，再交给 Vivado 仿真。</p><div class="code-block"><div class="code-heading"><span>labs/${l.lab}/design.v</span><button id="copy-design">复制源码</button></div><pre><code>${highlightCode(data.design)}</code></pre></div><table class="explain-table"><tbody><tr><td>&#96;timescale 1ns/1ps</td><td>仿真时间单位为 1 ns，精度为 1 ps。这是仿真设置，不是给电路添加时钟或延迟。</td></tr>${l.codeNotes.map(([part,explanation])=>`<tr><td>${escapeHtml(part)}</td><td>${explanation}</td></tr>`).join('')}</tbody></table><details><summary>展开自检测试台 tb.sv</summary><p>测试台只供仿真：它按计划改变输入、等待一段时间，并检查输出。它不会作为本课的电路下载到芯片。</p><div class="code-block"><div class="code-heading"><span>tb.sv · SystemVerilog</span><button id="copy-tb">复制测试台</button></div><pre>${escapeHtml(data.testbench)}</pre></div></details></article>${labInstructions(l)}</div>`;
}
function quizMarkup(l){
  const previous=answers[l.id]||{};
  return `<div class="panel-intro"><h2>用三个问题，检查你的直觉</h2><p>先预测，再回到电路验证。</p></div><p class="quiz-summary">答错也没关系，每题都可以重新选择。答对全部问题后，就可以完成本课。</p>
  ${l.quizzes.map((q,i)=>`<article class="quiz-card"><div class="quiz-num">QUESTION 0${i+1} / 03</div><h3>${q.q}</h3><div class="answers">${q.answers.map((text,j)=>`<button class="answer ${previous[i]===j?(j===q.correct?'correct':'wrong'):''}" data-question="${i}" data-answer="${j}" aria-pressed="${previous[i]===j}"><span>${String.fromCharCode(65+j)}</span>${text}</button>`).join('')}</div><div id="feedback-${i}" aria-live="polite">${previous[i]!==undefined?feedbackMarkup(q,previous[i]):''}</div></article>`).join('')}
  <div class="completion"><div><h3 style="font-size:15px">${progress[l.id]?'这一课，已经点亮。':'把理解，留在你的学习足迹里。'}</h3><p id="completion-status">${progress[l.id]?'可以随时回来重新实验。':'答对 3 道题后，点击完成本课。'}</p></div><button class="primary-btn" id="complete-lesson" ${canComplete(l)?'':'disabled'}>${progress[l.id]?'已完成 ✓':'完成本课 ✓'}</button></div>`;
}
const canComplete=l=>l.quizzes.every((q,i)=>answers[l.id]?.[i]===q.correct);
const feedbackMarkup=(q,answer)=>`<p class="quiz-feedback ${answer===q.correct?'':'wrong'}"><b>${answer===q.correct?'理解正确。':'再想一想。'}</b> ${q.explanation}</p>`;
function updateWave(){
  if(currentTab!=='experiment')return;
  const actual=waveMode==='xsim';
  let data=actual?labData[lesson().lab].wave:manualWave(samples,manualWidths);
  const windowControl=document.querySelector('#wave-window-wrap');
  windowControl.hidden=!actual||data.duration<=160;
  if(actual&&data.duration>160){
    const choice=document.querySelector('#wave-window').value;
    let start=0;const span=lesson().id>=19?640:160;
    if(choice==='last'||choice==='focus'&&lesson().id===6)start=Math.max(0,data.duration-span);
    if(choice==='focus'&&lesson().id===9)start=data.signals.level.find(([,v])=>v==='8')?.[0]||0;
    if(choice!=='all')data=sliceWave(data,start,Math.min(start+span,data.duration));
  }
  renderWave(document.querySelector('#wave-plot'),data,actual);
  document.querySelector('#wave-badge').textContent=actual?'XSIM 2022.2':'INTERACTIVE';
  document.querySelector('#wave-note').textContent=(actual?'来源：本机 XSim 2022.2 的真实 VCD；横轴为 ns，固定记录不随网页开关变化。'+(labData[lesson().lab].excerpt||'')+(lesson().waveNote||'每组输入保持 10 ns。第二课的真实记录同时显示全部四种门。'):`横轴是操作序号，不是物理时间。记录最近 ${lesson().id>=11?512:64} 次操作；时序课分别记录上升沿和下降沿，只有上升沿更新状态。多位总线显示十进制值。初始值表示已经复位，不代表芯片上电状态。`)+' 窄屏可在波形区域内左右滑动。';
}
function bindQuiz(l){
  document.querySelectorAll('[data-question]').forEach(button=>button.addEventListener('click',()=>{
    const i=Number(button.dataset.question),choice=Number(button.dataset.answer),q=l.quizzes[i];
    answers[l.id]??={};answers[l.id][i]=choice;
    document.querySelectorAll(`[data-question="${i}"]`).forEach(b=>{b.classList.remove('correct','wrong');b.setAttribute('aria-pressed',String(b===button));});
    button.classList.add(choice===q.correct?'correct':'wrong');
    document.querySelector(`#feedback-${i}`).innerHTML=feedbackMarkup(q,choice);
    const count=l.quizzes.filter((q,index)=>answers[l.id][index]===q.correct).length;
    document.querySelector('#completion-status').textContent=`已答对 ${count} / 3 题${count===3?'，可以完成本课。':'，继续试一试。'}`;
    document.querySelector('#complete-lesson').disabled=!canComplete(l);
  }));
  document.querySelector('#complete-lesson').addEventListener('click',()=>{if(!canComplete(l))return;progress[l.id]=true;saveProgress();updateProgress();const b=document.querySelector('#complete-lesson');b.textContent='已完成 ✓';toast(`第 ${l.id} 课已完成${l.id<lessons.length?'，可以继续下一课。':'，全部课程学完了，试着独立完成改写练习！'}`);});
}
async function copy(text){
  try{await navigator.clipboard.writeText(text);toast('已复制，可以粘贴到编辑器或终端。');}
  catch{
    const area=document.createElement('textarea');area.value=text;area.style.position='fixed';area.style.opacity='0';document.body.append(area);area.select();const ok=document.execCommand('copy');area.remove();toast(ok?'已复制。':'复制未成功，请选中代码手动复制。');
  }
}
function render(){
  cleanup();cleanup=()=>{};
  const l=lesson();
  document.title=`${l.title} · 电路之间`;
  document.querySelector('#crumb').textContent=l.title;
  updateProgress();
  main.innerHTML=`<div class="eyebrow">A HANDS-ON GUIDE TO FPGA / LESSON ${String(l.id).padStart(2,'0')}</div><div class="hero"><div><h1>${l.title}<span style="color:#98a88c;font-weight:400">，</span><br>${l.subtitle}</h1><p class="description">${l.description}</p><div class="lesson-meta"><span>${l.duration}</span><span>零基础友好</span><span>交互 + 真实仿真</span></div></div><span class="hero-tag">动手，让概念发生</span></div>
  <div class="tabs" role="tablist" aria-label="本课内容">${tabs.map(([id,title],i)=>`<button class="tab ${id===currentTab?'active':''}" role="tab" id="tab-${id}" aria-selected="${id===currentTab}" aria-controls="lesson-panel" tabindex="${id===currentTab?'0':'-1'}" data-tab="${id}"><small>0${i+1}</small>${title}</button>`).join('')}</div>
  <section id="lesson-panel" role="tabpanel" aria-labelledby="tab-${currentTab}">${currentTab==='experiment'?experimentMarkup(l):currentTab==='concepts'?`<div class="reading">${l.reading}</div>`:currentTab==='code'?codeMarkup(l):quizMarkup(l)}</section>
  <div class="lesson-footer">${l.id>1?`<a href="#lesson-${l.id-1}">← 上一课：${lessons[l.id-2].title}</a>`:'<span>每次只理解一个小电路。</span>'}${l.id<lessons.length?`<a href="#lesson-${l.id+1}">下一课：${lessons[l.id].title} →</a>`:'<span>完成入门路线，继续独立修改和验证</span>'}</div>`;
  document.querySelectorAll('[data-tab]').forEach(button=>{
    button.addEventListener('click',()=>{currentTab=button.dataset.tab;render();document.querySelector(`[data-tab="${currentTab}"]`).focus({preventScroll:true});});
    button.addEventListener('keydown',event=>{
      if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();
      const index=tabs.findIndex(([id])=>id===currentTab);
      currentTab=tabs[event.key==='Home'?0:event.key==='End'?3:(index+(event.key==='ArrowRight'?1:3))%4][0];render();document.querySelector(`[data-tab="${currentTab}"]`).focus({preventScroll:true});
    });
  });
  if(currentTab==='experiment'){
    samples=[];manualWidths={};waveMode='manual';
    cleanup=(l.id>=11?mountPractice:l.id>=4?mountAdvanced:mountSimulator)(l,(values,widths,refresh=true)=>{manualWidths=widths||{};samples.push(values);if(samples.length>(l.id>=11?512:64))samples.shift();if(refresh)updateWave();},()=>{samples=[];});
    document.querySelector('#wave-window').addEventListener('change',updateWave);
    mountBinary();
    document.querySelectorAll('[data-wave]').forEach(button=>button.addEventListener('click',()=>{
      waveMode=button.dataset.wave;document.querySelectorAll('[data-wave]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});updateWave();
    }));
  }else if(currentTab==='concepts'){
    if(l.id>=11)mountPracticeConcept(l);
    else if(l.id>=4)mountAdvancedConcept(l);
    if(l.id===1)document.querySelector('#flow-diagram').innerHTML=flowDiagram();
    if(l.id===2){document.querySelector('#binary-reading').innerHTML=`<div class="binary">${binaryMarkup()}</div>`;mountBinary();}
    if(l.id===3)document.querySelector('#mux-gates-diagram').innerHTML=muxGatesDiagram();
  }else if(currentTab==='code'){
    document.querySelector('#copy-design').addEventListener('click',()=>copy(labData[l.lab].design));
    document.querySelector('#copy-tb').addEventListener('click',()=>copy(labData[l.lab].testbench));
    document.querySelectorAll('.copy-btn').forEach(button=>button.addEventListener('click',()=>copy(button.dataset.copy)));
  }else bindQuiz(l);
}
function navigate(){
  const match=location.hash.match(/^#lesson-(\d+)$/);const selected=match?Number(match[1]):1;currentLesson=selected>=1&&selected<=lessons.length?selected:1;currentTab='experiment';
  document.querySelector('#sidebar').classList.remove('open');document.querySelector('#menu-toggle').setAttribute('aria-expanded','false');render();window.scrollTo(0,0);
}
window.addEventListener('hashchange',navigate);
document.querySelector('#menu-toggle').addEventListener('click',()=>{const open=document.querySelector('#sidebar').classList.toggle('open');document.querySelector('#menu-toggle').setAttribute('aria-expanded',String(open));});
document.addEventListener('click',event=>{if(!event.target.closest('#sidebar')&&!event.target.closest('#menu-toggle')){document.querySelector('#sidebar').classList.remove('open');document.querySelector('#menu-toggle').setAttribute('aria-expanded','false');}});
document.addEventListener('keydown',event=>{if(event.key==='Escape'){document.querySelector('#sidebar').classList.remove('open');document.querySelector('#menu-toggle').setAttribute('aria-expanded','false');}});
document.querySelector('#reset-progress').addEventListener('click',()=>{progress={};for(const key of Object.keys(answers))delete answers[key];saveProgress();render();toast('学习记录已重置。');});
navigate();
