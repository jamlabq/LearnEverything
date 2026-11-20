import test from 'node:test';
import assert from 'node:assert/strict';
import { readProgress, readStoredProgress, LEGACY_STORAGE_KEY, STORAGE_KEY, TOTAL, completion, nextLesson, setStep } from '../progress.mjs';

test('missing and malformed saved progress do not break the course', () => {
  for (const value of [null, '', '{broken', 'null', '[]', '{"version":99,"lessons":{}}']) {
    assert.deepEqual(readProgress(value), { version: 1, lessons: {} });
  }
});

test('only real completed steps count; unknown lessons and excessive notes are ignored', () => {
  const state = readProgress(JSON.stringify({ version: 1, lessons: {
    1: { steps: [true, false, 'true', 1, true, true], notes: 'abc' },
    2: { steps: [true, true, true, true, true], notes: 'x'.repeat(9000) },
    46: { steps: [true, true, true, true, true] },
    bad: { steps: [true] }
  } }));
  assert.equal(completion(state, 1), 2);
  assert.equal(completion(state, 2), 5);
  assert.equal(state.lessons[2].notes.length, 6000);
  assert.deepEqual(Object.keys(state.lessons), ['1', '2']);
});

test('completion can be reversed without losing the learner’s notes', () => {
  const state = readProgress(JSON.stringify({ version: 1, lessons: { 1: { steps: [], notes: 'My example' } } }));
  for (let i = 0; i < 5; i++) setStep(state, 1, i, true);
  assert.equal(completion(state, 1), 5);
  setStep(state, 1, 4, false);
  assert.equal(completion(state, 1), 4);
  assert.equal(state.lessons[1].notes, 'My example');
});

test('continue learning prefers an unfinished started lesson, then the first new one', () => {
  const state = readProgress(null);
  assert.equal(nextLesson(state), 1);
  setStep(state, 12, 0, true);
  assert.equal(nextLesson(state), 12);
  for (let id = 1; id <= TOTAL; id++) for (let step = 0; step < 5; step++) setStep(state, id, step, true);
  assert.equal(nextLesson(state), null);
  setStep(state, 25, 4, false);
  assert.equal(nextLesson(state), 25);
});


test('revised lessons never inherit unrelated v1 notes and old fields remain readable', () => {
  const saved = new Map([
    [LEGACY_STORAGE_KEY, JSON.stringify({version:1,lessons:{1:{notes:'old meeting notes',steps:[true]}}})],
    [`${LEGACY_STORAGE_KEY}:1:notes`, JSON.stringify('latest old meeting notes')],
    [`${LEGACY_STORAGE_KEY}:30:step-4`, 'true'],
    [`${STORAGE_KEY}:45:notes`, JSON.stringify('new pronunciation notes')],
  ]);
  const storage = {getItem: key => saved.get(key) ?? null};
  const before = [...saved];
  const current = readStoredProgress(storage);
  assert.equal(current.lessons[1], undefined);
  assert.equal(current.lessons[45].notes, 'new pronunciation notes');
  const legacy = readStoredProgress(storage, LEGACY_STORAGE_KEY, 30);
  assert.equal(legacy.lessons[1].notes, 'latest old meeting notes');
  assert.equal(legacy.lessons[30].steps[4], true);
  assert.deepEqual([...saved], before);
});
