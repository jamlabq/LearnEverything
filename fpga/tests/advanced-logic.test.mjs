import test from 'node:test';
import assert from 'node:assert/strict';
import {add4,initialState,setInput,clock,cycle,signals,signalWidths} from '../src/advanced-logic.mjs';
const active=id=>setInput(id,initialState(id),'rst',0);

test('四位加法全部256组，保留进位与截断结果',()=>{
  for(let a=0;a<16;a++)for(let b=0;b<16;b++){
    const out=add4(a,b);assert.equal(out.sum,a+b);assert.equal(out.low_sum,(a+b)%16);assert.equal(out.carry,a+b>=16?1:0);
  }
});
test('寄存器只在上升沿更新，使能保持，复位优先',()=>{
  let s=active(5);s=setInput(5,s,'d',11);assert.equal(s.q,0);
  s=clock(5,s,1);assert.equal(s.q,11);
  s=setInput(5,s,'d',3);s=clock(5,s,1);assert.equal(s.q,11);
  s=clock(5,s,0);assert.equal(s.q,11);
  s=setInput(5,s,'en',0);s=cycle(5,s);assert.equal(s.q,11);
  s=setInput(5,s,'rst',1);assert.equal(s.q,11);s=cycle(5,s);assert.equal(s.q,0);
});
test('计数器回卷脉冲与停用时清除',()=>{
  let s=active(6);for(let i=0;i<16;i++)s=cycle(6,s);
  assert.equal(s.count,0);assert.equal(s.wrap,1);
  s=setInput(6,s,'en',0);s=cycle(6,s);assert.equal(s.count,0);assert.equal(s.wrap,0);
});
test('流水线第二沿输出首组输入，气泡与数据一起走',()=>{
  let s=active(7);s=setInput(7,s,'a',1);s=setInput(7,s,'b',2);s=cycle(7,s);
  assert.deepEqual([s.stage_sum,s.y,s.valid_s1,s.valid_out],[3,0,1,0]);
  s=setInput(7,s,'a',4);s=setInput(7,s,'b',5);s=cycle(7,s);
  assert.deepEqual([s.stage_sum,s.y,s.valid_out],[9,6,1]);
  s=setInput(7,s,'valid_in',0);s=cycle(7,s);assert.equal(s.y,18);assert.equal(s.valid_out,1);
  s=setInput(7,s,'valid_in',1);s=cycle(7,s);assert.equal(s.valid_out,0);
  s=cycle(7,s);assert.equal(s.valid_out,1);
});
test('FSM时钟使能保持，RED GREEN YELLOW循环和复位',()=>{
  let s=active(8);assert.equal(signals(8,s).red,1);
  s=cycle(8,s);assert.equal(s.state,1);assert.equal(signals(8,s).green,1);
  s=setInput(8,s,'tick',0);s=cycle(8,s);assert.equal(s.state,1);
  s=setInput(8,s,'tick',1);s=cycle(8,s);assert.equal(s.state,2);
  s=cycle(8,s);assert.equal(s.state,0);
  s=setInput(8,s,'rst',1);s=cycle(8,s);assert.equal(s.state,0);
  for(const tick of [0,1]){
    const recovered=cycle(8,{...active(8),state:3,tick});
    assert.equal(recovered.state,0);assert.equal(signals(8,recovered).red,1);
  }
});
test('PWM静态占空比0..16每帧高电平数准确',()=>{
  for(let level=0;level<=16;level++){
    let s=setInput(9,active(9),'level',level),high=0;
    for(let i=0;i<16;i++){high+=signals(9,s).pwm;s=cycle(9,s);}
    assert.equal(high,level,`duty=${level}`);
  }
});
test('PWM自动包络每帧只变一次，并到达0%与100%',()=>{
  let s=setInput(9,active(9),'breath_en',1);
  for(let frame=1;frame<=32;frame++){
    const old=s.auto_duty;
    for(let i=0;i<15;i++)s=cycle(9,s);
    assert.equal(s.auto_duty,old);s=cycle(9,s);
    assert.equal(s.auto_duty,frame<=16?frame:32-frame);
  }
  s=setInput(9,s,'rst',1);assert.equal(signals(9,s).pwm,0);
});
test('板级分频器H=4与H=1，且仅有效边沿翻转',()=>{
  for(const half of [1,4,8]){
    let s=setInput(10,active(10),'half',half);
    assert.equal(signalWidths(10,s).count,Math.max(1,Math.ceil(Math.log2(half))));
    for(let i=1;i<=half*4;i++){s=cycle(10,s);assert.equal(s.led,Math.floor(i/half)%2);}
  }
});
test('输入范围检查与非法时钟值',()=>{
  assert.throws(()=>add4(16,1));assert.throws(()=>clock(5,active(5),2));
  assert.throws(()=>setInput(9,active(9),'level',17));assert.throws(()=>setInput(10,active(10),'half',0));
});
