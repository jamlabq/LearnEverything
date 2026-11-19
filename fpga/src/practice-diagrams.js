import {escapeHtml as esc} from './simulators.js';
import {practiceInitial,practiceSignals} from './practice-logic.mjs';
const text=(x,y,value,cls='')=>`<text x="${x}" y="${y}" class="${cls}">${esc(String(value))}</text>`;
const box=(x,y,w,h,title,sub='',active=false)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" class="practice-box ${active?'selected':''}"/>${text(x+12,y+27,title,'block-title')}${text(x+12,y+49,sub,'tiny')}`;
const arrow=(x,y,endX,endY)=>`<path d="M${x} ${y}H${endX}V${endY}" class="practice-wire" marker-end="url(#practice-arrow)"/>`;
const bitCells=(value,x,y,width=8,current=-1)=>Array.from({length:width},(_,i)=>{const bit=(value>>(width-i-1))&1;return `<rect x="${x+i*50}" y="${y}" width="42" height="42" rx="5" class="practice-bit ${bit?'high':''} ${current===width-i-1?'current':''}"/>${text(x+15+i*50,y+27,bit)}${text(x+17+i*50,y+60,width-i-1,'tiny')}`;}).join('');
const readable=v=>v===null||v==='x'?'X':String(v);
export function practiceDiagram(id,s){
 const o=practiceSignals(id,s);let b='';
 if(id===11){
  const choice=s.rst?'复位 0':s.load?'装入 D':s.add_en?'旧 Q + 1':s.sub_en?'旧 Q − 1':'保持旧 Q';
  b=text(20,28,'变量保存 + 条件优先级：决定下一拍保存什么','tiny');
  ['0','D = '+s.d,'Q + 1','Q − 1','旧 Q'].forEach((name,i)=>b+=box(20,45+i*49,120,40,name,'',choice===['复位 0','装入 D','旧 Q + 1','旧 Q − 1','保持旧 Q'][i]));
  b+=arrow(145,150,230,150)+box(235,105,160,80,'优先选择',choice,true)+arrow(395,145,445,145)+box(450,105,125,80,'Q = '+s.q,'8 位寄存器',true)+arrow(575,145,610,145)+text(600,225,'≥ 10 ? '+o.ge10,'tiny')+text(260,250,'RST > LOAD > ADD_EN > SUB_EN > 保持','tiny');
 }else if(id===12){
  const ops=['A+B','A−B','A AND B','A OR B','A XOR B','A << 1','A >> 1','A < B'];
  b=text(20,28,'case 选择运算；组合路径没有时钟，也不保存历史','tiny');
  b+=box(20,55,140,75,'A = '+s.a,'8 位无符号')+box(20,165,140,75,'B = '+s.b,'8 位无符号');
  ops.forEach((name,i)=>b+=box(210+(i%2)*140,42+Math.floor(i/2)*56,130,45,name,'',s.op===i));
  b+=arrow(160,92,200,92)+arrow(160,202,200,202)+arrow(480,145,525,145)+box(530,102,135,90,'Y = '+o.y,`C=${o.carry} · Z=${o.zero}`,true);
 }else if(id===13){
  b=text(20,28,'同一道题：统计一个字节里有多少个 1','tiny')+bitCells(s.data,25,48)+box(470,48,190,70,'并行结果 = '+o.parallel_count,'for 展开为组合逻辑',true);
  b+=text(24,160,'开始时锁存输入；下面每个忙边沿只处理旧 WORK[0]','tiny')+box(25,185,190,75,'WORK = '+s.work,'逐拍右移 / 只读一位',Boolean(s.busy))+arrow(215,222,255,222)+box(260,185,185,75,'累计 = '+s.partial,'已处理 '+s.steps+' / 8 拍',Boolean(s.busy))+arrow(445,222,480,222)+box(485,185,175,75,'RESULT = '+s.result,'BUSY='+s.busy+' · DONE='+s.done,Boolean(s.done));
 }else if(id===14){
  b=text(20,28,'模块实例像接好的电路；不是函数先后调用','tiny')+box(35,80,225,100,'timer 实例','PHASE = '+s.phase+' / 3',true)+arrow(260,130,405,130)+text(280,100,'TICK = '+o.tick,'block-title')+box(410,80,225,100,'counter 实例','COUNT = '+s.count,true)+text(45,232,'同一上升沿：counter 使用边沿前的 TICK；timer 保存新 PHASE','tiny')+text(45,264,'EN='+s.en+' · 同一 CLK 连接两个子模块，EN=0 时暂停','tiny');
 }else if(id===15){
  b=text(20,28,'两级同步 + 连续三个不同样本确认；同步器不等于消抖器','tiny')+box(20,90,115,80,'RAW = '+s.raw,'外部按钮')+arrow(135,130,160,130)+box(165,90,120,80,'META = '+s.meta,'第一级')+arrow(285,130,310,130)+box(315,90,120,80,'SYNC = '+s.sync,'第二级')+arrow(435,130,460,130)+box(465,90,195,80,'STABLE = '+s.stable,'PRESS = '+s.press,Boolean(s.press));
  b+=text(70,215,'已累计不同样本：'+s.bounce_count+' / 3','block-title')+text(70,253,'所有阶段同时取旧值；按住只产生一个 PRESS 脉冲','tiny');
 }else if(id===16){
  b=text(20,28,'八个触发器排成一列；EN=1 时向高位移动','tiny')+text(22,85,'旧 bit7 从这里移出','tiny')+bitCells(s.q,130,110)+text(550,85,'SERIAL_IN = '+s.serial_in,'tiny')+arrow(625,105,545,131)+arrow(125,131,45,131)+text(35,200,'当前 SERIAL_OUT = '+o.serial_out,'tiny')+text(35,237,'Q = '+s.q+' / 0x'+s.q.toString(16).padStart(2,'0').toUpperCase()+' · 1 的个数 = '+o.ones,'block-title')+text(35,273,'LOAD='+s.load+' 优先装入 '+s.parallel_in+'；否则 EN='+s.en+' 时移位','tiny');
 }else if(id===17){
  b=text(20,28,'4 × 8 位存储：未写位置为 X；复位不擦除存储内容','tiny');
  s.mem.forEach((v,i)=>b+=box(25,50+i*53,235,44,`地址 ${i}    ${readable(v)}`,'',i===s.addr));
  b+=box(310,60,160,75,'ADDR = '+s.addr,'WE='+s.we+' · RE='+s.re)+text(310,185,'WDATA = '+s.wdata,'block-title')+arrow(475,98,515,98)+box(520,60,145,95,'RDATA = '+readable(s.rdata),'RVALID = '+s.rvalid,true)+text(310,230,'读写同地址：本拍读旧值','tiny')+text(310,260,'下次读取才得到刚写入的值','tiny');
 }else if(id===18){
  b=text(20,28,'队列容量 4：按接受请求更新，先入先出','tiny');
  s.mem.forEach((v,i)=>b+=box(22+i*164,70,150,78,'槽 '+i+'：'+readable(v),`${s.rptr===i?'←读指针 ':''}${s.wptr===i?'←写指针':''}`,s.count>0&&((i-s.rptr+4)%4)<s.count));
  b+=box(25,180,190,75,'COUNT = '+s.count,'EMPTY='+o.empty+' · FULL='+o.full)+box(245,180,195,75,'HEAD = '+readable(o.head),'上次弹出 DOUT = '+s.dout)+box(470,180,190,75,'本沿前的接受条件','PUSH='+o.accepted_push+' · POP='+o.accepted_pop,true);
 }else if(id===19){
  b=text(20,28,'UART 8N1：起始位 + 8 个低位优先数据位 + 停止位','tiny');
  const data=s.busy?(s.frame>>1)&255:s.data,values=[0,...Array.from({length:8},(_,i)=>(data>>i)&1),1];
  values.forEach((v,i)=>{const x=18+i*66,active=s.busy&&s.bit_index===i;b+=`<rect x="${x}" y="68" width="59" height="75" rx="6" class="practice-bit ${v?'high':''} ${active?'current':''}"/>`+text(x+23,99,v)+text(x+9,126,i===0?'START':i===9?'STOP':'D'+(i-1),'tiny');});
  b+=box(25,190,185,75,'TX = '+o.tx,'空闲为高',Boolean(o.tx))+box(245,190,190,75,'位内计数 = '+s.baud_count,'每位保持 4 拍',Boolean(s.busy))+box(470,190,190,75,'BUSY = '+s.busy,'DONE = '+s.done,Boolean(s.done));
 }else{
  b=text(20,28,'综合项目：电脑送来的串行字节 → 缓冲 → 原样发回','tiny')+box(15,85,125,90,'RX = '+s.rx,'两级同步输入')+arrow(140,130,160,130)+box(165,85,150,90,'UART RX','收到 '+s.receiver.data,Boolean(s.receiver.valid))+arrow(315,130,335,130)+box(340,85,150,90,'FIFO 4 字节','排队 '+s.fifo.count,Boolean(s.fifo.count))+arrow(490,130,510,130)+box(515,85,150,90,'UART TX','TX='+o.tx+' · BUSY='+o.tx_busy,Boolean(o.tx_busy));
  b+=text(28,223,'接收阶段：'+['等待起始','确认起始位','采样数据位','检查停止位'][s.receiver.state]+' · 位号 '+s.receiver.bit,'tiny')+text(28,262,'OVERFLOW='+s.overflow+' · FRAMING_ERROR='+o.framing_error+' · 共用主时钟，串口线不传时钟','tiny');
 }
 const summary=Object.entries(o).filter(([k])=>!['clk','rst','m0','m1','m2','m3','frame'].includes(k)).map(([k,v])=>`${k}=${v}`).join('，');
 return `<svg class="circuit practice-svg" viewBox="0 0 690 300" role="img" aria-label="${esc(summary)}"><defs><marker id="practice-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10Z" fill="#c3d797"/></marker></defs>${b}</svg>`;
}
export function mountPracticeConcept(l){
 const target=document.querySelector(`[data-practice-diagram="${l.id}"]`);if(!target)return;
 const state={...practiceInitial(l.id),rst:0};
 target.innerHTML=`<figure class="diagram practice-concept"><div>${practiceDiagram(l.id,state)}</div><figcaption>电路结构示意；切到“动手实验”观察每拍的实际数值。窄屏可以在图中左右滑动。</figcaption></figure>`;
}
