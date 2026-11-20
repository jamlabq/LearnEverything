import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {assignmentInitial,hardwareClock,buttonInitial,buttonClock} from '../src/programmer-logic.mjs';
const source=await readFile(new URL('../src/workshop-data.js',import.meta.url),'utf8');
const {workshopData}=await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
for(const name of ['old_values','button_counter'])test(`${name}: interactive state matches actual XSim at every exported event`,()=>{
 const {wave}=workshopData[name],events=new Map(),values={};
 for(const [key,points] of Object.entries(wave.signals))for(const [time,value] of points){
  if(!events.has(time))events.set(time,[]);
  events.get(time).push([key,value]);
 }
 let s=name==='old_values'?assignmentInitial():buttonInitial(),ready=false,comparisons=0;
 for(const [time,changes] of [...events].sort((a,b)=>a[0]-b[0])){
  for(const [key,value] of changes)values[key]=value;
  const clk=Number(values.clk),rst=Number(values.rst),resetEdge=s.clk===0&&clk===1&&rst===1;
  if(resetEdge)ready=true;
  if(name==='old_values')s=resetEdge?{...assignmentInitial(),clk}:hardwareClock(s,clk);
  else s=buttonClock({...s,raw:Number(values.raw),rst},clk);
  if(!ready)continue;
  const keys=name==='old_values'?['a','b']:['meta','sync','previous','stable','press','bounce_count','level_count','edge_count','clean_count'];
  for(const key of keys){assert.equal(values[key],String(s[key]),`${name} ${time}ns ${key}`);comparisons++;}
 }
 assert.ok(comparisons>20);console.log(`${name}: ${comparisons} actual signal values agree`);
});
