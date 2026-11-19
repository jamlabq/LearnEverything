import test from 'node:test';
import assert from 'node:assert/strict';
import {gate, mux, bitsToNumber} from '../src/logic.mjs';

test('四组输入的逻辑门输出与真值表一致', () => {
  const truth = [[0,0,0,0,0,1], [0,1,0,1,1,1], [1,0,0,1,1,0], [1,1,1,1,0,0]];
  for (const [a,b,and,or,xor,not] of truth) {
    for (const [kind,want] of Object.entries({AND:and,OR:or,XOR:xor,NOT:not}))
      assert.equal(gate(kind,a,b), want, `${kind}(${a},${b})`);
  }
});
test('选择器的全部八组输入', () => {
  const rows = [[0,0,0,0],[0,1,0,0],[1,0,0,1],[1,1,0,1],[0,0,1,0],[0,1,1,1],[1,0,1,0],[1,1,1,1]];
  for (const [a,b,s,want] of rows) assert.equal(mux(a,b,s),want);
});
test('四位数覆盖 0 到 15，最高位在前', () => {
  for(let n=0;n<16;n++) assert.equal(bitsToNumber(n.toString(2).padStart(4,'0').split('').map(Number)), n);
});
test('拒绝误拼的门名称与非二值信号', () => {
  assert.throws(()=>gate('BAD',0,0));
  assert.throws(()=>gate('AND',2,0));
  assert.throws(()=>mux(0,0,2));
  assert.throws(()=>bitsToNumber([1,2,0]));
});
