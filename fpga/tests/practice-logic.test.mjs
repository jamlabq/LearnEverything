import test from 'node:test';
import assert from 'node:assert/strict';
import {practiceInitial as init,practiceInput as input,practiceClock as clock,practiceSignals as out,practiceCycle as cycle} from '../src/practice-logic.mjs';
const active=id=>input(id,init(id),'rst',0);
const set=(id,s,values)=>Object.entries(values).reduce((state,[k,v])=>input(id,state,k,v),s);
const cycles=(id,s,n)=>{for(let i=0;i<n;i++)s=cycle(id,s);return s;};

test('variables: priority, modulo arithmetic and conditional flag; half cycles hold',()=>{
 let s=set(11,active(11),{d:255,load:1,add_en:1,sub_en:1});s=cycle(11,s);assert.equal(out(11,s).q,255);
 s=input(11,s,'load',0);s=cycle(11,s);assert.equal(out(11,s).q,0);
 s=input(11,s,'add_en',0);s=cycle(11,s);assert.equal(out(11,s).q,255);
 s=set(11,s,{load:1,d:10});s=clock(11,s,1);assert.equal(out(11,s).ge10,1);
 s=input(11,s,'d',1);s=clock(11,s,0);assert.equal(out(11,s).q,10);
 s=input(11,s,'rst',1);assert.equal(out(11,s).q,10);s=cycle(11,s);assert.equal(out(11,s).q,0);
});
test('ALU: all8 operations exhaustive bytes, explicit borrow/shift and zero',()=>{
 for(let op=0;op<8;op++)for(let a=0;a<256;a++)for(let b=0;b<256;b++){
  const s=set(12,init(12),{a,b,op}),v=out(12,s);
  const value=[(a+b)&255,(a-b)&255,a&b,a|b,a^b,(a<<1)&255,a>>1,Number(a<b)][op];
  const carry=[Number(a+b>255),Number(a<b),0,0,0,a>>7,a&1,0][op];
  assert.deepEqual([v.y,v.carry,v.zero],[value,carry,Number(value===0)]);
 }
});
test('popcount: snapshot, busy rejects start, exactly eight work edges, done pulse',()=>{
 for(let data=0;data<256;data++){
  let s=set(13,active(13),{data,start:1});s=cycle(13,s);assert.equal(out(13,s).busy,1);
  s=input(13,s,'data',data^255);
  for(let i=1;i<=8;i++){s=cycle(13,s);assert.equal(out(13,s).busy,Number(i<8));assert.equal(out(13,s).done,Number(i===8));}
  assert.equal(out(13,s).result,data.toString(2).replaceAll('0','').length);
  s=input(13,s,'start',0);s=cycle(13,s);assert.equal(out(13,s).done,0);
 }
});
test('modules: counter consumes old tick, pause holds phase',()=>{
 let s=active(14);s=input(14,s,'en',1);s=cycles(14,s,3);assert.equal(out(14,s).phase,3);assert.equal(out(14,s).tick,1);assert.equal(out(14,s).count,0);
 s=input(14,s,'en',0);s=cycle(14,s);assert.equal(out(14,s).phase,3);assert.equal(out(14,s).tick,0);
 s=input(14,s,'en',1);s=cycle(14,s);assert.equal(out(14,s).phase,0);assert.equal(out(14,s).count,1);
});
test('debounce: two synchronizer stages + three different stable samples, one press only',()=>{
 let s=input(15,active(15),'raw',1);s=cycles(15,s,2);assert.equal(out(15,s).sync,1);assert.equal(out(15,s).stable,0);
 s=cycles(15,s,2);assert.equal(out(15,s).stable,0);s=cycle(15,s);assert.equal(out(15,s).stable,1);assert.equal(out(15,s).press,1);
 s=cycle(15,s);assert.equal(out(15,s).press,0);s=input(15,s,'raw',0);s=cycles(15,s,5);assert.equal(out(15,s).stable,0);assert.equal(out(15,s).press,0);
});
test('shift: eight bits rebuild byte, load priority and outgoing old MSB',()=>{
 let s=set(16,active(16),{en:1});
 for(const bit of '10100101'){s=input(16,s,'serial_in',Number(bit));s=cycle(16,s);}
 assert.equal(out(16,s).q,0xa5);assert.equal(out(16,s).ones,4);assert.equal(out(16,s).serial_out,1);
 s=set(16,s,{load:1,parallel_in:0x12});s=cycle(16,s);assert.equal(out(16,s).q,0x12);
 s=set(16,s,{load:0,en:0,serial_in:1});s=cycle(16,s);assert.equal(out(16,s).q,0x12);
});
test('memory: unknown unwritten, synchronous read-first collision and reset preserves memory',()=>{
 let s=set(17,active(17),{addr:2,re:1});s=cycle(17,s);assert.equal(out(17,s).rdata,'x');assert.equal(out(17,s).rvalid,1);
 s=set(17,s,{we:1,wdata:42,re:0});s=cycle(17,s);
 s=set(17,s,{re:1,wdata:99});s=cycle(17,s);assert.equal(out(17,s).rdata,42);
 s=input(17,s,'we',0);s=cycle(17,s);assert.equal(out(17,s).rdata,99);
 s=input(17,s,'rst',1);s=cycle(17,s);assert.equal(out(17,s).rdata,0);
 s=input(17,s,'rst',0);s=cycle(17,s);assert.equal(out(17,s).rdata,99);
});
test('FIFO: empty/full simultaneous policy, wrap-around order, random scoreboard',()=>{
 let s=set(18,active(18),{push:1,pop:1,din:1});assert.equal(out(18,s).accepted_pop,0);s=cycle(18,s);assert.equal(out(18,s).count,1);
 s=input(18,s,'pop',0);for(let n=2;n<=4;n++){s=input(18,s,'din',n);s=cycle(18,s);}
 assert.equal(out(18,s).full,1);s=input(18,s,'din',9);s=cycle(18,s);assert.equal(out(18,s).head,1);
 s=input(18,s,'pop',1);s=cycle(18,s);assert.equal(out(18,s).dout,1);assert.equal(out(18,s).count,4);
 s=input(18,s,'push',0);for(const n of [2,3,4,9]){s=cycle(18,s);assert.equal(out(18,s).dout,n);}assert.equal(out(18,s).empty,1);
 let queue=[],seed=234;
 for(let n=0;n<1000;n++){
  seed=(Math.imul(seed,1664525)+1013904223)>>>0;
  const push=(seed>>8)&1,pop=(seed>>9)&1,din=seed&255;
  s=set(18,s,{push,pop,din});const wantPop=pop&&queue.length>0,wantPush=push&&(queue.length<4||wantPop);
  const old=wantPop?queue.shift():null;if(wantPush)queue.push(din);
  s=cycle(18,s);assert.equal(out(18,s).count,queue.length);assert.equal(out(18,s).head,queue[0]||0);if(wantPop)assert.equal(out(18,s).dout,old);
 }
});
test('UART TX: 8N1 LSB-first exactly40 clocks, busy ignores input and done pulses',()=>{
 for(const data of [0,0xa5,255]){
  let s=set(19,active(19),{data,start:1});s=cycle(19,s);
  const bits=[0,...Array.from({length:8},(_,i)=>(data>>i)&1),1];
  for(let n=0;n<40;n++){
   assert.equal(out(19,s).tx,bits[Math.floor(n/4)]);assert.equal(out(19,s).busy,1);
   s=input(19,s,'data',0x66);s=cycle(19,s);
  }
  assert.equal(out(19,s).done,1);assert.equal(out(19,s).busy,0);assert.equal(out(19,s).tx,1);
  s=input(19,s,'start',0);s=cycle(19,s);assert.equal(out(19,s).done,0);
 }
});
test('UART project: serial byte loop with sync delay, bad stop and reset recovery',()=>{
 let s=active(20),history=[],received=[];
 const tick=()=>{history.push(out(20,s).tx);s=cycle(20,s);if(out(20,s).rx_valid)received.push(out(20,s).rx_data);};
 for(const data of [0,0xa5,255]){
  for(const bit of [0,...Array.from({length:8},(_,i)=>(data>>i)&1),1]){s=input(20,s,'rx',bit);for(let i=0;i<4;i++)tick();}
 }
 s=input(20,s,'rx',1);for(let i=0;i<100;i++)tick();
 assert.deepEqual(received,[0,0xa5,255]);
 const decoded=[];let pos=0;
 while(pos<history.length){
  if(history[pos]===1){pos++;continue;}
  assert.equal(history[pos+38],1);let data=0;for(let i=0;i<8;i++)data|=history[pos+6+4*i]<<i;decoded.push(data);pos+=40;
 }
 assert.deepEqual(decoded,[0,0xa5,255]);
 // Stop low is rejected, with a visible one-cycle framing error.
 s=input(20,s,'rst',1);s=cycle(20,s);s=input(20,s,'rst',0);let error=0;
 for(const bit of [0,1,0,1,0,1,0,1,0,0]){s=input(20,s,'rx',bit);for(let i=0;i<4;i++){s=cycle(20,s);error+=out(20,s).framing_error;}}
 s=input(20,s,'rx',1);for(let i=0;i<10;i++){s=cycle(20,s);error+=out(20,s).framing_error;}
 assert.equal(error,1);assert.equal(out(20,s).queued,0);
});
test('input contracts reject invalid numbers, unsupported ports and bad clocks',()=>{
 assert.throws(()=>input(12,init(12),'a',256));assert.throws(()=>input(18,init(18),'count',3));assert.throws(()=>clock(11,init(11),2));assert.throws(()=>init(21));
});
test('FIFO and UART preserve clock level; repeated high levels cannot trigger another edge',()=>{
 for(const id of [18,19]){
  let s=set(id,active(id),id===18?{push:1,din:42}:{start:1,data:165});
  s=clock(id,s,1);assert.equal(s.clk,1);
  const before=out(id,s);s=clock(id,s,1);assert.deepEqual(out(id,s),before);
  s=clock(id,s,0);assert.equal(s.clk,0);
 }
});
