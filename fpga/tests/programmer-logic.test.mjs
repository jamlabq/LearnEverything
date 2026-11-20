import test from 'node:test';
import assert from 'node:assert/strict';
import {courseStages,learningOrder,neighbors} from '../src/learning-path.mjs';
import {assignmentInitial,softwareStep,hardwareClock,buttonInitial,buttonClock} from '../src/programmer-logic.mjs';

test('learning path preserves every stable lesson ID and introduces dependencies first',()=>{
 assert.equal(courseStages.length,4);
 assert.deepEqual([...learningOrder].sort((a,b)=>a-b),Array.from({length:20},(_,i)=>i+1));
 for(const [a,b] of [[5,11],[11,7],[14,7],[6,15],[15,20],[19,20],[20,10]])assert.ok(learningOrder.indexOf(a)<learningOrder.indexOf(b));
 assert.deepEqual(neighbors(5),{previous:4,next:11});
 assert.deepEqual(neighbors(10),{previous:20,next:null});
});
test('C statements consume updated variables; a completed run stays completed',()=>{
 const initial=assignmentInitial(1,2),one=softwareStep(initial),two=softwareStep(one);
 assert.deepEqual([one.a,one.b,one.pc],[2,2,1]);
 assert.deepEqual([two.a,two.b,two.pc],[2,2,2]);
 assert.deepEqual(softwareStep(two),two);
 assert.deepEqual(initial,assignmentInitial(1,2));
});
test('registers read old values together only on rising edges',()=>{
 const initial=assignmentInitial(1,2),one=hardwareClock(initial,1);
 assert.deepEqual([one.a,one.b],[2,1]);
 assert.deepEqual(hardwareClock(one,1),one);
 const low=hardwareClock(one,0);assert.deepEqual([low.a,low.b],[2,1]);
 assert.deepEqual([hardwareClock(low,1).a,hardwareClock(low,1).b],[1,2]);
 assert.throws(()=>assignmentInitial(16,1),RangeError);
});
const cycle=(s,raw=s.raw,rst=0)=>buttonClock(buttonClock({...s,raw,rst},1),0);
const drive=(s,raw,n)=>{for(let i=0;i<n;i++)s=cycle(s,raw);return s;};
test('held level counts repeatedly; edge and debounced event count once',()=>{
 let s=drive(buttonInitial(),1,12);s=drive(s,0,12);
 assert.deepEqual([s.level_count,s.edge_count,s.clean_count],[12,1,1]);
 assert.deepEqual([s.stable,s.press],[0,0]);
});
test('bouncing edges create extra edge counts but only one confirmed press',()=>{
 let s=buttonInitial();for(const raw of [1,0,1,0])s=cycle(s,raw);
 s=drive(s,1,12);s=drive(s,0,12);
 assert.deepEqual([s.edge_count,s.clean_count],[3,1]);
});
test('two-sample pulse is filtered, reset flushes state and no edge means no update',()=>{
 let s=drive(buttonInitial(),1,2);s=drive(s,0,10);
 assert.deepEqual([s.edge_count,s.clean_count],[1,0]);
 const atHigh=buttonClock({...s,raw:1},1);
 assert.deepEqual(buttonClock(atHigh,1),atHigh);
 s=cycle(s,1,1);
 for(const key of ['meta','sync','previous','stable','press','bounce_count','level_count','edge_count','clean_count'])assert.equal(s[key],0,key);
});
