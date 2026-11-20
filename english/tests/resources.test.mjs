import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { lessons, stages, extras } from '../data.mjs';
const evidence = JSON.parse(readFileSync(new URL('../resource-checks.json', import.meta.url)));

test('25 genuine long originals have diverse topics, free source links and distinct lessons', () => {
  assert.equal(lessons.length, 45);
  assert.equal(new Set(lessons.map(l => l.key)).size, lessons.length);
  const long = lessons.filter(l => l.stage === 'deep');
  assert.equal(long.length, 25);
  assert.ok(long.every(l => l.format === 'original' && l.seconds >= 18 * 60 && l.seconds <= 25 * 60));
  assert.ok(new Set(long.map(l => l.topic)).size >= 10);
  assert.equal(long.filter(l => l.type === '双人播客').length, 4);
  assert.equal(long.filter(l => l.type === '新闻专题').length, 3);
  assert.ok(lessons.filter(l => l.stage === 'screen').every(l => l.format === 'guided' && l.flow));
  assert.deepEqual(lessons.map(l => l.id), Array.from({length:45},(_,i)=>i+1));
  assert.ok(lessons.every(l => stages.some(s => s.id === l.stage)));
});

test('every core lesson has a specific video with recorded evidence; search URLs never masquerade as sources', () => {
  for (const lesson of lessons) {
    assert.ok(lesson.resources.some(r => r.kind === 'video'), lesson.title);
    for (const resource of lesson.resources) {
      const url = new URL(resource.url);
      assert.equal(url.protocol, 'https:');
      assert.ok(!url.pathname.includes('search'), resource.url);
      if (resource.check === 'chapters') continue;
      const check = evidence.checks.find(e => e.url === resource.url);
      assert.ok(check, resource.url);
      if (resource.check === 'playback') {
        assert.ok(check.playback.time > 1 && check.playback.ready >= 3 && !check.playback.paused);
      }
      if (resource.platform === 'youtube') assert.equal(check.playerStatus, 'OK');
      if (resource.platform === 'ted') assert.ok(check.transcriptParagraphs > 0);
    }
    if (lesson.transcript === 'auto') assert.equal(lesson.availability, 'auto');
  }
  assert.equal(extras.length, 4);
});
