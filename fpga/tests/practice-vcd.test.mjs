import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {practiceInitial,practiceInput,practiceClock,practiceSignals} from '../src/practice-logic.mjs';
const source=await readFile(new URL('../src/lab-data.js',import.meta.url),'utf8');
const {labData}=await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
const inputs={11:['rst','load','add_en','sub_en','d'],12:['a','b','op'],13:['rst','start','data'],14:['rst','en'],15:['rst','raw'],16:['rst','load','en','serial_in','parallel_in'],17:['rst','we','re','addr','wdata'],18:['rst','push','pop','din'],19:['rst','start','data'],20:['rst','rx']};
const normalize=v=>/^[x]+$/i.test(String(v))?'x':String(v);
for(const [lab,{wave}] of Object.entries(labData)){
 const id=Number(lab.slice(0,2));if(id<11)continue;
 test(`${lab}: practice model vs actual XSim, every exported event`,()=>{
  let s=practiceInitial(id),ready=id===12,comparisons=0;const values={};
  const events=new Map();
  for(const [key,points] of Object.entries(wave.signals))for(const [t,v] of points){if(!events.has(t))events.set(t,[]);events.get(t).push([key,v]);}
  for(const [t,changes] of [...events].sort((a,b)=>a[0]-b[0])){
   for(const [key,v] of changes)values[key]=v;
   for(const key of inputs[id])s=practiceInput(id,s,key,Number(values[key]));
   if(id!==12){const clk=Number(values.clk);if(s.rst&&s.clk===0&&clk===1)ready=true;s=practiceClock(id,s,clk);}
   if(!ready)continue;
   const expected=practiceSignals(id,s);
   for(const [key,v] of Object.entries(expected)){
    if(values[key]===undefined)continue;
    assert.equal(normalize(values[key]),normalize(v),`${lab} ${t}ns ${key}`);comparisons++;
   }
  }
  assert.ok(comparisons>20);console.log(`${lab}: ${comparisons} actual signal values agree`);
 });
}
