const bit=v=>{if(v!==0&&v!==1)throw new RangeError('信号应为 0 或 1');return v;};
export function assignmentInitial(a=1,b=2){
 for(const n of [a,b])if(!Number.isInteger(n)||n<0||n>15)throw new RangeError('初值应为 0…15 的整数');
 return {a,b,pc:0,clk:0};
}
export function softwareStep(s){
 if(s.pc===0)return {...s,a:s.b,pc:1};
 if(s.pc===1)return {...s,b:s.a,pc:2};
 return {...s};
}
export function hardwareClock(s,clk){
 bit(clk);return s.clk===0&&clk===1?{...s,clk,a:s.b,b:s.a}:{...s,clk};
}
export function buttonInitial(){return {clk:0,rst:0,raw:0,meta:0,sync:0,previous:0,stable:0,press:0,bounce_count:0,level_count:0,edge_count:0,clean_count:0};}
export function buttonClock(s,clk){
 bit(clk);bit(s.raw);bit(s.rst);const n={...s,clk};
 if(s.clk!==0||clk!==1)return n;
 if(s.rst)return {...buttonInitial(),clk,raw:s.raw,rst:s.rst};
 n.meta=s.raw;n.sync=s.meta;n.previous=s.sync;n.press=0;
 if(s.sync===s.stable)n.bounce_count=0;
 else if(s.bounce_count===2){n.stable=s.sync;n.press=s.sync;n.bounce_count=0;}
 else n.bounce_count=s.bounce_count+1;
 if(s.sync)n.level_count=(s.level_count+1)&15;
 if(s.sync&&!s.previous)n.edge_count=(s.edge_count+1)&15;
 if(s.press)n.clean_count=(s.clean_count+1)&15;
 return n;
}
