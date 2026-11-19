import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {initialState,setInput,clock,signals} from '../src/advanced-logic.mjs';
const source=await readFile(new URL('../src/lab-data.js',import.meta.url),'utf8');
const {labData}=await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
const inputNames={4:['a','b'],5:['rst','en','d'],6:['rst','en'],7:['rst','a','b','valid_in'],8:['rst','tick'],9:['rst','level','breath_en'],10:['rst']};
const outputNames={4:['sum','low_sum','carry'],5:['q'],6:['count','wrap'],7:['stage_sum','valid_s1','y','valid_out'],8:['state','red','green','yellow'],9:['phase','duty','pwm','auto_duty','up'],10:['count','led']};
for(const [lab,{wave}] of Object.entries(labData)){
  const id=Number(lab.slice(0,2));
  if(id<4)continue;
  test(`${lab}: 网页模型逐事件对照真实 XSim VCD`,()=>{
    let s=initialState(id),ready=id===4,comparisons=0;
    let fast={...initialState(10),half:1};
    const at=(key,t)=>wave.signals[key]?.filter(([time])=>time<=t).at(-1)?.[1];
    const times=[...new Set(Object.values(wave.signals).flatMap(points=>points.map(([t])=>t)))].sort((a,b)=>a-b);
    for(const t of times){
      for(const key of inputNames[id]){
        const value=Number(at(key,t));
        assert.ok(Number.isFinite(value),`${lab} ${t}ns input ${key}`);
        s=setInput(id,s,key,key==='level'?Math.min(value,16):value);
      }
      if(id>=5){
        // 第8课测试台显式 force/release 编码3，模拟状态寄存器故障。
        if(id===8&&at('state',t)==='3')s={...s,state:3};
        const next=Number(at('clk',t));
        if(s.rst&&s.clk===0&&next===1)ready=true;
        s=clock(id,s,next);
        if(id===10){fast=setInput(10,fast,'rst',s.rst);fast=clock(10,fast,next);}
      }
      if(!ready)continue;
      const want={...signals(id,s),auto_duty:s.auto_duty,up:s.up};
      for(const key of outputNames[id]){
        assert.equal(Number(at(key,t)),want[key],`${lab} ${t}ns ${key}`);comparisons++;
      }
      if(id===10){
        assert.equal(Number(at('led_fast',t)),fast.led,`${t}ns H=1 LED`);
        assert.equal(Number(at('count_fast',t)),fast.count,`${t}ns H=1 COUNT`);comparisons+=2;
      }
    }
    assert.ok(comparisons>10);
    console.log(`${lab}: ${comparisons} 个实际波形值一致`);
  });
}
