// 时序教学模型：读旧状态、同步更新。RAM 未写位置保留 null，并显示为 X。
const integer=(n,min,max,label)=>{if(!Number.isInteger(n)||n<min||n>max)throw new RangeError(`${label}: ${min}…${max}`);return n;};
const ones=n=>{let result=0;for(let i=0;i<8;i++)result+=(n>>i)&1;return result;};
const txInit=()=>({busy:0,done:0,bit_index:0,baud_count:0,frame:1023});
const fifoInit=()=>({mem:Array(4).fill(null),wptr:0,rptr:0,count:0,dout:0});
const rxInit=()=>({meta:1,sync:1,state:0,timer:0,bit:0,shift:0,data:0,valid:0,error:0});
const txValue=s=>s.busy?(s.frame>>s.bit_index)&1:1;
const fifoFlags=(s,push,pop,rst)=>{const accepted_pop=Number(Boolean(pop&&!rst&&s.count));return {head:s.count?s.mem[s.rptr]:0,full:Number(s.count===4),empty:Number(s.count===0),accepted_pop,accepted_push:Number(Boolean(push&&!rst&&(s.count<4||accepted_pop)))};};
function txStep(s,rst,start,data){
 if(rst)return txInit();const n={...s,done:0};
 if(!s.busy){if(start)Object.assign(n,{frame:(1<<9)|(data<<1),busy:1,bit_index:0,baud_count:0});}
 else if(s.baud_count===3){n.baud_count=0;if(s.bit_index===9){n.busy=0;n.done=1;}else n.bit_index++;}
 else n.baud_count++;
 return n;
}
function fifoStep(s,rst,push,pop,din){
 if(rst)return {...fifoInit(),mem:[...s.mem]};
 const f=fifoFlags(s,push,pop,rst),n={...s,mem:[...s.mem]};
 if(f.accepted_pop){n.dout=f.head;n.rptr=(s.rptr+1)&3;}
 if(f.accepted_push){n.mem[s.wptr]=din;n.wptr=(s.wptr+1)&3;}
 n.count=s.count+f.accepted_push-f.accepted_pop;return n;
}
function rxStep(s,rst,rx){
 if(rst)return rxInit();const n={...s,meta:rx,sync:s.meta,valid:0,error:0};
 switch(s.state){
  case 0:if(s.sync===0){n.state=1;n.timer=0;}break;
  case 1:if(s.timer===1){n.timer=0;if(s.sync===0){n.state=2;n.bit=0;}else n.state=0;}else n.timer++;break;
  case 2:if(s.timer===3){n.timer=0;n.shift=(s.shift&~(1<<s.bit))|(s.sync<<s.bit);if(s.bit===7)n.state=3;else n.bit++;}else n.timer++;break;
  case 3:if(s.timer===3){n.timer=0;n.state=0;if(s.sync){n.data=s.shift;n.valid=1;}else n.error=1;}else n.timer++;break;
  default:n.state=0;n.timer=0;
 }
 return n;
}
const specs={
 11:{load:[0,1],add_en:[0,1],sub_en:[0,1],d:[0,255]},12:{a:[0,255],b:[0,255],op:[0,7]},
 13:{start:[0,1],data:[0,255]},14:{en:[0,1]},15:{raw:[0,1]},
 16:{load:[0,1],en:[0,1],serial_in:[0,1],parallel_in:[0,255]},17:{we:[0,1],re:[0,1],addr:[0,3],wdata:[0,255]},
 18:{push:[0,1],pop:[0,1],din:[0,255]},19:{start:[0,1],data:[0,255]},20:{rx:[0,1]}
};
export function practiceInitial(id){
 integer(id,11,20,'课号');const s={clk:0,rst:1};
 switch(id){
  case 11:return {...s,load:0,add_en:0,sub_en:0,d:10,q:0};
  case 12:return {...s,a:9,b:3,op:0};
  case 13:return {...s,start:0,data:0xa5,busy:0,done:0,result:0,work:0,partial:0,steps:0};
  case 14:return {...s,en:1,phase:0,count:0};
  case 15:return {...s,raw:0,meta:0,sync:0,stable:0,press:0,bounce_count:0};
  case 16:return {...s,load:0,en:1,serial_in:0,parallel_in:0xa5,q:0};
  case 17:return {...s,we:0,re:0,addr:0,wdata:42,rdata:0,rvalid:0,mem:Array(4).fill(null)};
  case 18:return {...s,push:0,pop:0,din:65,...fifoInit()};
  case 19:return {...s,start:0,data:0xa5,...txInit()};
  case 20:return {...s,rx:1,receiver:rxInit(),fifo:fifoInit(),transmitter:txInit(),overflow:0};
 }
}
export function practiceInput(id,s,key,value){
 integer(id,11,20,'课号');const limits=key==='rst'&&id!==12?[0,1]:specs[id][key];
 if(!limits)throw new RangeError(`本课没有输入 ${key}`);integer(value,...limits,key);return {...s,[key]:value};
}
export function practiceClock(id,s,next){
 integer(next,0,1,'CLK');if(id===12||s.clk!==0||next!==1)return {...s,clk:next};
 let n={...s,clk:next};
 if(s.rst){
  const fresh=practiceInitial(id);
  const registers={11:['q'],13:['busy','done','result','work','partial','steps'],14:['phase','count'],15:['meta','sync','stable','press','bounce_count'],16:['q'],17:['rdata','rvalid'],18:['wptr','rptr','count','dout'],19:['busy','done','bit_index','baud_count','frame'],20:['receiver','transmitter','overflow']};
  for(const key of registers[id])n[key]=fresh[key];
  if(id===20)n.fifo=fifoStep(s.fifo,1,0,0,0);return n;
 }
 switch(id){
  case 11:if(s.load)n.q=s.d;else if(s.add_en)n.q=(s.q+1)&255;else if(s.sub_en)n.q=(s.q-1)&255;break;
  case 13:
   n.done=0;
   if(!s.busy){if(s.start)Object.assign(n,{busy:1,work:s.data,partial:0,steps:0});}
   else{n.partial=s.partial+(s.work&1);n.work=s.work>>1;n.steps=s.steps+1;if(s.steps===7){n.result=n.partial;n.busy=0;n.done=1;}}break;
  case 14:if(s.en){n.phase=(s.phase+1)&3;if(s.phase===3)n.count=(s.count+1)&15;}break;
  case 15:
   n.meta=s.raw;n.sync=s.meta;n.press=0;
   if(s.sync===s.stable)n.bounce_count=0;
   else if(s.bounce_count===2){n.stable=s.sync;n.press=s.sync;n.bounce_count=0;}else n.bounce_count++;break;
  case 16:if(s.load)n.q=s.parallel_in;else if(s.en)n.q=((s.q<<1)|s.serial_in)&255;break;
  case 17:
   n.mem=[...s.mem];n.rvalid=s.re;
   if(s.re)n.rdata=s.mem[s.addr];if(s.we)n.mem[s.addr]=s.wdata;break;
  case 18:n={...n,...fifoStep(s,0,s.push,s.pop,s.din),clk:next};break;
  case 19:n={...n,...txStep(s,0,s.start,s.data),clk:next};break;
  case 20:{
   const pop=Number(!s.transmitter.busy&&s.fifo.count>0),f=fifoFlags(s.fifo,s.receiver.valid,pop,0);
   n.receiver=rxStep(s.receiver,0,s.rx);
   n.fifo=fifoStep(s.fifo,0,s.receiver.valid,pop,s.receiver.data);
   n.transmitter=txStep(s.transmitter,0,pop,f.head);
   if(s.receiver.valid&&!f.accepted_push)n.overflow=1;break;
  }
 }
 return n;
}
export const practiceCycle=(id,s)=>practiceClock(id,practiceClock(id,practiceClock(id,s,0),1),0);
export function practiceSignals(id,s){
 const base={clk:s.clk,rst:s.rst};
 const x=v=>v===null?'x':v;
 switch(id){
  case 11:return {...base,load:s.load,add_en:s.add_en,sub_en:s.sub_en,d:s.d,q:s.q,ge10:Number(s.q>=10)};
  case 12:{let y=0,carry=0;switch(s.op){case 0:y=(s.a+s.b)&255;carry=Number(s.a+s.b>255);break;case 1:y=(s.a-s.b)&255;carry=Number(s.a<s.b);break;case 2:y=s.a&s.b;break;case 3:y=s.a|s.b;break;case 4:y=s.a^s.b;break;case 5:y=(s.a<<1)&255;carry=s.a>>7;break;case 6:y=s.a>>1;carry=s.a&1;break;case 7:y=Number(s.a<s.b);}
   return {a:s.a,b:s.b,op:s.op,y,carry,zero:Number(y===0)};}
  case 13:return {...base,start:s.start,data:s.data,parallel_count:ones(s.data),busy:s.busy,done:s.done,result:s.result,work:s.work,partial:s.partial,steps:s.steps};
  case 14:return {...base,en:s.en,phase:s.phase,tick:Number(!s.rst&&s.en&&s.phase===3),count:s.count};
  case 15:return {...base,raw:s.raw,meta:s.meta,sync:s.sync,stable:s.stable,press:s.press,bounce_count:s.bounce_count};
  case 16:return {...base,load:s.load,en:s.en,serial_in:s.serial_in,parallel_in:s.parallel_in,q:s.q,serial_out:s.q>>7,ones:ones(s.q)};
  case 17:return {...base,we:s.we,re:s.re,addr:s.addr,wdata:s.wdata,rdata:x(s.rdata),rvalid:s.rvalid,m0:x(s.mem[0]),m1:x(s.mem[1]),m2:x(s.mem[2]),m3:x(s.mem[3])};
  case 18:return {...base,push:s.push,pop:s.pop,din:s.din,dout:s.dout,count:s.count,wptr:s.wptr,rptr:s.rptr,...fifoFlags(s,s.push,s.pop,s.rst)};
  case 19:return {...base,start:s.start,data:s.data,busy:s.busy,done:s.done,bit_index:s.bit_index,baud_count:s.baud_count,frame:s.frame,tx:txValue(s)};
  case 20:return {...base,rx:s.rx,tx:txValue(s.transmitter),tx_busy:s.transmitter.busy,rx_valid:s.receiver.valid,rx_data:s.receiver.data,queued:s.fifo.count,overflow:s.overflow,framing_error:s.receiver.error};
  default:throw new RangeError('未知实践课号');
 }
}
export function practiceWidths(id){return {
 11:{d:8,q:8},12:{a:8,b:8,op:3,y:8},13:{data:8,parallel_count:4,result:4,work:8,partial:4,steps:4},14:{phase:2,count:4},15:{bounce_count:2},
 16:{parallel_in:8,q:8,ones:4},17:{addr:2,wdata:8,rdata:8,m0:8,m1:8,m2:8,m3:8},18:{din:8,head:8,dout:8,count:3,wptr:2,rptr:2},19:{data:8,bit_index:4,baud_count:2,frame:10},20:{rx_data:8,queued:3}
}[id]||{};}
