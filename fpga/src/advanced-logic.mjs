// 二值教学模型；状态初始化表示已完成复位，不模拟上电未知态和亚稳态。
function integer(value,min,max,label){if(!Number.isInteger(value)||value<min||value>max)throw new RangeError(`${label} 应在 ${min}..${max}`);return value;}
export function add4(a,b){integer(a,0,15,'A');integer(b,0,15,'B');const sum=a+b;return {sum,low_sum:sum&15,carry:sum>>4};}
export function initialState(id){
  integer(id,4,10,'课号');
  return {clk:0,rst:1,a:0,b:1,d:5,en:1,q:0,count:0,wrap:0,valid_in:1,stage_sum:0,valid_s1:0,y:0,valid_out:0,tick:1,state:0,level:8,breath_en:0,phase:0,auto_duty:0,up:1,half:4,led:0};
}
export function setInput(id,state,key,value){
  const limits={a:[0,15],b:[0,15],d:[0,15],level:[0,16],half:[1,8],rst:[0,1],en:[0,1],valid_in:[0,1],tick:[0,1],breath_en:[0,1]};
  if(!limits[key])throw new RangeError(`未知输入：${key}`);
  integer(value,...limits[key],key);
  // H 是综合时的参数；网页改变该参数，相当于重新开始这个教学实验。
  return {...state,[key]:value,...(key==='half'?{count:0,led:0,clk:0}:{})};
}
export function clock(id,state,next){
  integer(next,0,1,'CLK');const s={...state,clk:next};
  if(id===4||state.clk!==0||next!==1)return s;
  if(s.rst){
    if(id===5)s.q=0;
    if(id===6){s.count=0;s.wrap=0;}
    if(id===7){s.stage_sum=0;s.valid_s1=0;s.y=0;s.valid_out=0;}
    if(id===8)s.state=0;
    if(id===9){s.phase=0;s.auto_duty=0;s.up=1;}
    if(id===10){s.count=0;s.led=0;}
    return s;
  }
  switch(id){
    case 5:if(s.en)s.q=s.d;break;
    case 6:s.wrap=s.en&&state.count===15?1:0;if(s.en)s.count=(state.count+1)&15;break;
    case 7:s.stage_sum=s.a+s.b;s.valid_s1=s.valid_in;s.y=state.stage_sum*2;s.valid_out=state.valid_s1;break;
    case 8:if(![0,1,2].includes(state.state))s.state=0;else if(s.tick)s.state=state.state===0?1:state.state===1?2:0;break;
    case 9:
      s.phase=(state.phase+1)&15;
      if(state.phase===15&&s.breath_en){
        s.auto_duty=state.auto_duty+(state.up?1:-1);
        if(s.auto_duty===16)s.up=0;if(s.auto_duty===0)s.up=1;
      }
      break;
    case 10:if(state.count===s.half-1){s.count=0;s.led=1-state.led;}else s.count=state.count+1;break;
    default:throw new RangeError(`未知时序课号：${id}`);
  }
  return s;
}
export function cycle(id,state){return clock(id,clock(id,clock(id,state,0),1),0);}
export function signals(id,s){
  const base={clk:s.clk,rst:s.rst};
  switch(id){
    case 4:return {a:s.a,b:s.b,...add4(s.a,s.b)};
    case 5:return {...base,en:s.en,d:s.d,q:s.q};
    case 6:return {...base,en:s.en,count:s.count,wrap:s.wrap};
    case 7:return {...base,a:s.a,b:s.b,valid_in:s.valid_in,stage_sum:s.stage_sum,valid_s1:s.valid_s1,y:s.y,valid_out:s.valid_out};
    case 8:return {...base,tick:s.tick,state:s.state,red:Number(s.state===0),green:Number(s.state===1),yellow:Number(s.state===2)};
    case 9:{const duty=s.breath_en?s.auto_duty:s.level;return {...base,level:s.level,breath_en:s.breath_en,phase:s.phase,duty,pwm:Number(!s.rst&&s.phase<duty)};}
    case 10:return {...base,count:s.count,led:s.led};
    default:throw new RangeError(`未知课号：${id}`);
  }
}
export function signalWidths(id,state={half:4}){return {4:{a:4,b:4,sum:5,low_sum:4},5:{d:4,q:4},6:{count:4},7:{a:4,b:4,stage_sum:5,y:6},8:{state:2},9:{level:5,phase:4,duty:5},10:{count:Math.max(1,Math.ceil(Math.log2(state.half)))}}[id]||{};}
