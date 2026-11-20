import { lessons } from './data.mjs';
export const LEGACY_STORAGE_KEY = 'learneverything-english-v1';
export const STORAGE_KEY = 'learneverything-english-v2';
export const TOTAL = lessons.length;
export const STEP_COUNT = 5;

export function readProgress(raw, total = TOTAL) {
  const clean = { version: 1, lessons: {} };
  try {
    const saved = JSON.parse(raw);
    if (saved?.version !== 1 || !saved.lessons || typeof saved.lessons !== 'object') return clean;
    for (let id = 1; id <= total; id++) {
      const entry = saved.lessons[id];
      if (!entry || typeof entry !== 'object') continue;
      clean.lessons[id] = {
        steps: Array.from({ length: STEP_COUNT }, (_, i) => entry.steps?.[i] === true),
        notes: typeof entry.notes === 'string' ? entry.notes.slice(0, 6000) : '',
      };
    }
  } catch { /* A corrupt or unavailable record must not prevent studying. */ }
  return clean;
}

export function lessonProgress(state, id) {
  return state.lessons[id] ?? { steps: Array(STEP_COUNT).fill(false), notes: '' };
}

// Each field has its own atomic storage key. Updating a note must not overwrite
// another tab's lesson, checkbox, or newer snapshot of the course.
export function fieldKey(id, field, key = STORAGE_KEY) {
  return `${key}:${id}:${field}`;
}

export function readStoredProgress(storage, key = STORAGE_KEY, total = TOTAL) {
  const state = readProgress(storage.getItem(key), total);
  for (let id = 1; id <= total; id++) {
    for (const field of ['notes', ...Array.from({ length: STEP_COUNT }, (_, i) => `step-${i}`)]) {
      const raw = storage.getItem(fieldKey(id, field, key));
      if (raw === null) continue;
      let value;
      try { value = JSON.parse(raw); } catch { continue; }
      if (field === 'notes' && typeof value === 'string') {
        state.lessons[id] ??= lessonProgress(state, id);
        state.lessons[id].notes = value.slice(0, 6000);
      } else if (field.startsWith('step-') && typeof value === 'boolean') {
        setStep(state, id, Number(field.slice(5)), value);
      }
    }
  }
  return state;
}

export function completion(state, id) {
  return lessonProgress(state, id).steps.filter(Boolean).length;
}

export function setStep(state, id, index, checked) {
  if (!Number.isInteger(id) || id < 1 || id > TOTAL || !Number.isInteger(index) || index < 0 || index >= STEP_COUNT) return;
  state.lessons[id] ??= lessonProgress(state, id);
  state.lessons[id].steps[index] = checked === true;
}

export function nextLesson(state) {
  const ids = Array.from({ length: TOTAL }, (_, i) => i + 1);
  return ids.find(id => completion(state, id) > 0 && completion(state, id) < STEP_COUNT)
    ?? ids.find(id => completion(state, id) === 0) ?? null;
}
