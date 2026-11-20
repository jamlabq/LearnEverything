import { lessons, stages, steps, availability, extras, checkpoints, schedules, REVIEW_DATE } from './data.mjs';
import { legacyLessons } from './legacy.mjs';
import { LEGACY_STORAGE_KEY, STORAGE_KEY, TOTAL, STEP_COUNT, readProgress, readStoredProgress, fieldKey, completion, lessonProgress, nextLesson, setStep } from './progress.mjs';

const $ = selector => document.querySelector(selector);
const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const number = id => String(id).padStart(2, '0');
const paths = {
  briefcase: '<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V4h8v3M3 12c6 3 12 3 18 0M10 13h4"/>',
  message: '<path d="M21 11a8 8 0 0 1-8 8H8l-5 3 1.5-6A8 8 0 1 1 21 11Z"/><path d="M8 10h8M8 14h5"/>',
  globe: '<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18M5 7h14M5 17h14"/>',
  screen: '<rect x="3" y="6" width="18" height="14" rx="2"/><path d="m8 2 4 4 4-4M9 11l5 3-5 3z"/>',
  headphones: '<path d="M4 13v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="12" width="4" height="8" rx="2"/><rect x="17" y="12" width="4" height="8" rx="2"/>',
  search: '<circle cx="10" cy="10" r="6.5"/><path d="m15 15 5 5"/>',
  wave: '<path d="M3 10v4M7 6v12M12 3v18M17 7v10M21 10v4"/>',
  bookmark: '<path d="M6 3h12v18l-6-4-6 4Z"/>',
  download: '<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',
  arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
};
const icon = name => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.bookmark}</svg>`;
const stageFor = lesson => stages.find(stage => stage.id === lesson.stage);

let state;
let storageAvailable = true;
const pendingWrites = new Map();
try { state = readStoredProgress(localStorage); }
catch { state = readProgress(null); storageAvailable = false; }
const filters = { stage: 'all', search: '', status: 'all', topic: 'all', platform: 'all', transcript: 'all' };
const dialog = $('#lesson-dialog');
let currentLesson = null;
let returnHash = '#curriculum';
let opener = null;
let toastTimer;

function storageWarning() {
  $('#storage-warning').hidden = storageAvailable;
  $('#storage-warning').textContent = storageAvailable ? '' : '当前浏览器未能完整保存学习记录。本次修改仍可使用，请在离开前导出记录；未保存的内容在刷新后可能丢失。';
  const noteStatus = $('#note-save-status');
  if (noteStatus) noteStatus.textContent = storageAvailable ? '自动保存在当前浏览器' : '暂未保存 · 离开前请导出';
}

function persist(id, field, value) {
  pendingWrites.set(fieldKey(id, field), { id, field, value });
  // Retain and retry each failed field. A successful small checkbox write does
  // not mean a larger note that hit the storage quota was saved successfully.
  for (const [key, pending] of pendingWrites) {
    try {
      localStorage.setItem(key, JSON.stringify(pending.value));
      pendingWrites.delete(key);
    } catch { /* Keep the local draft available for the next save or export. */ }
  }
  storageAvailable = pendingWrites.size === 0;
  storageWarning();
}

function notify(message) {
  clearTimeout(toastTimer);
  $('#toast').textContent = message;
  $('#toast').hidden = false;
  toastTimer = setTimeout(() => { $('#toast').hidden = true; }, 4500);
}

function renderRoadmap() {
  $('#roadmap').innerHTML = stages.map(stage => {
    const group = lessons.filter(lesson => lesson.stage === stage.id);
    const completed = group.filter(lesson => completion(state, lesson.id) === STEP_COUNT).length;
    return `<button class="stage-card" data-stage="${stage.id}" aria-label="筛选${stage.short}，第 ${stage.range} 篇">
      <span class="stage-top"><span>${icon(stage.icon)}<span class="stage-number">STAGE ${stage.number}</span></span><span class="stage-range">${stage.range}</span></span>
      <h3>${stage.title}</h3><p>${stage.description}</p><span class="stage-bottom"><span>${group.length} 个单元 · 已完成 ${completed}</span><span aria-hidden="true">↗</span></span>
    </button>`;
  }).join('');
}

function renderFilters() {
  $('#stage-filters').innerHTML = [{ id: 'all', short: '全部' }, ...stages].map(stage => {
    const count = stage.id === 'all' ? TOTAL : lessons.filter(lesson => lesson.stage === stage.id).length;
    const active = filters.stage === stage.id;
    return `<button class="filter-button${active ? ' active' : ''}" data-stage="${stage.id}" aria-pressed="${active}">${stage.short} <span>${count}</span></button>`;
  }).join('');
}

function matchingLessons() {
  const query = filters.search.trim().toLocaleLowerCase();
  return lessons.filter(lesson => {
    if (filters.stage !== 'all' && lesson.stage !== filters.stage) return false;
    if (filters.topic !== 'all' && lesson.topic !== filters.topic) return false;
    if (filters.platform !== 'all' && !lesson.resources.some(r => r.platform === filters.platform && r.kind === 'video')) return false;
    if (filters.transcript === 'reviewed' && !['official', 'manual'].includes(lesson.transcript)) return false;
    if (filters.transcript === 'auto' && lesson.transcript !== 'auto') return false;
    const done = completion(state, lesson.id);
    if (filters.status === 'new' && done !== 0) return false;
    if (filters.status === 'started' && (done === 0 || done === STEP_COUNT)) return false;
    if (filters.status === 'done' && done !== STEP_COUNT) return false;
    const text = [lesson.title, lesson.cn, lesson.topic, lesson.source, lesson.speaker, lesson.focus, lesson.type, lesson.date, stageFor(lesson).short, lesson.id, number(lesson.id)].join(' ').toLocaleLowerCase();
    return !query || query.split(/\s+/).every(word => text.includes(word));
  });
}

function renderLessons() {
  const filtered = matchingLessons();
  $('#results-count').textContent = `显示 ${filtered.length} / ${TOTAL} 个训练单元${filters.stage === 'all' ? '' : ' · ' + stages.find(stage => stage.id === filters.stage).short}`;
  $('#empty-state').hidden = filtered.length > 0;
  $('#lesson-grid').innerHTML = filtered.map(lesson => {
    const done = completion(state, lesson.id);
    const status = availability[lesson.availability];
    const statusLabel = done === STEP_COUNT ? '已完成' : done > 0 ? `已练 ${done} / 5 步` : '尚未开始';
    const learned = lessonProgress(state, lesson.id);
    return `<article class="lesson-card${done === STEP_COUNT ? ' is-complete' : ''}" data-stage="${lesson.stage}" data-lesson-card="${lesson.id}">
      <div class="card-top"><span class="card-source"><span class="source-icon">${icon(stageFor(lesson).icon)}</span>${escape(lesson.source)}</span><span class="card-number">${number(lesson.id)} / ${TOTAL}</span></div>
      <h3 class="card-title"><a href="#lesson-${lesson.id}" data-lesson="${lesson.id}">${escape(lesson.title)}</a></h3><p class="card-cn">${escape(lesson.cn)}</p>
      <div class="card-meta"><span>${escape(lesson.duration)}</span><span>${escape(lesson.type)}</span><span>${escape(lesson.topic)}</span>${lesson.date ? `<span>${lesson.date}</span>` : ''}</div>
      <div class="platform-badges">${[...new Set(lesson.resources.filter(r => r.kind === 'video').map(r => r.platform))].map(platform => `<span>${platform === 'bilibili' ? 'B 站直达 · 已试播' : 'YouTube 直达'}</span>`).join('')}</div>
      <p class="card-focus">${escape(lesson.focus)}</p>
      <div class="card-bottom"><span class="card-availability${lesson.availability !== 'text' ? ' pending' : ''}">${status.short}</span><a class="card-link" data-lesson="${lesson.id}" href="#lesson-${lesson.id}">${done === STEP_COUNT ? '再次练习' : done ? '继续练习' : '开始这一篇'} <span aria-hidden="true">↗</span></a></div>
      <div class="card-completion${done === STEP_COUNT ? ' complete' : ''}" aria-label="${statusLabel}">${learned.steps.map(checked => `<span class="mini-step${checked ? ' checked' : ''}" aria-hidden="true"></span>`).join('')}<span>${statusLabel}</span></div>
    </article>`;
  }).join('');
}

function updateProgress() {
  const finished = lessons.filter(lesson => completion(state, lesson.id) === STEP_COUNT).length;
  const started = lessons.filter(lesson => completion(state, lesson.id) > 0 && completion(state, lesson.id) < STEP_COUNT).length;
  const next = nextLesson(state);
  $('#completed-count').textContent = finished;
  $('#overall-progress').value = finished;
  $('#overall-progress').textContent = `${finished} / ${TOTAL}`;
  $('#progress-percent').textContent = `${Math.round(finished / TOTAL * 100)}%`;
  $('#progress-hint').textContent = finished === TOTAL ? '第一轮已完成。用陌生材料试试，再决定下一轮目标。' : started ? `${started} 篇正在学习 · 五步完成后计入进度。` : '每篇完成五步训练后，计入学习进度。';
  $('#hero-start').innerHTML = next === null ? '去做迁移验收 <span aria-hidden="true">↗</span>' : `${finished || started ? '继续第' : '从第'} ${number(next)} 篇${finished || started ? '' : '开始'} <span aria-hidden="true">↗</span>`;
  $('#continue-learning').innerHTML = `${next === null ? '去做验收' : started || finished ? '继续学习' : '开始学习'} <span aria-hidden="true">→</span>`;
  renderRoadmap();
  renderCheckpoints();
}

function renderCheckpoints() {
  $('#checkpoint-list').innerHTML = checkpoints.map(checkpoint => {
    const ready = lessons.filter(lesson => lesson.id <= checkpoint.after).every(lesson => completion(state, lesson.id) === STEP_COUNT);
    return `<article class="checkpoint"><div class="checkpoint-top"><span>CHECKPOINT ${number(checkpoint.after / 5)} · 第 ${checkpoint.after} 篇后</span>${ready ? '<span class="checkpoint-ready">可以验收 ✓</span>' : ''}</div><h3>${checkpoint.title}</h3><p>${checkpoint.task}</p></article>`;
  }).join('');
}

function renderMethod() {
  $('#method-steps').innerHTML = steps.map((step, index) => `<details class="method-step"${index === 0 ? ' open' : ''}><summary><span class="step-num">${number(index + 1)}</span><b>${step.title}</b><span class="step-en">${step.en}</span><span class="step-expand" aria-hidden="true">＋</span></summary><div class="method-body"><p>${step.text}</p><p class="method-tip">${step.tip}</p></div></details>`).join('');
  renderSchedule(40);
}

function renderSchedule(minutes) {
  const labels = ['回听昨天练过的片段', '盲听 / 针对性精听', '模仿与录音对比', '脱稿复述 / 对话迁移'];
  $('#daily-schedule').innerHTML = schedules[minutes].map((time, index) => `<div class="schedule-row"><span>${labels[index]}</span><span>${time} min</span></div>`).join('');
  document.querySelectorAll('[data-minutes]').forEach(button => {
    const active = Number(button.dataset.minutes) === minutes;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
}

function renderExtras() {
  $('#extra-resources').innerHTML = extras.map(resource => `<article class="extra-resource"><span class="extra-id">＋ ${number(resource.original)}</span><div><h3><a href="${escape(resource.url)}" target="_blank" rel="noopener noreferrer">${escape(resource.title)} <span aria-hidden="true">↗</span></a></h3><p>${escape(resource.source)} · ${escape(resource.reason)}</p></div><span class="extra-status">${escape(resource.status)}</span></article>`).join('');
}

function renderDialog(id) {
  const lesson = lessons.find(item => item.id === id);
  if (!lesson) return;
  currentLesson = id;
  const status = availability[lesson.availability];
  const progress = lessonProgress(state, id);
  $('#dialog-counter').textContent = `${stageFor(lesson).en} / ${number(id)} OF ${TOTAL}`;
  $('#dialog-content').innerHTML = `
    <div class="detail-source">${icon(stageFor(lesson).icon)} ${escape(lesson.source)}${lesson.speaker ? ' · ' + escape(lesson.speaker) : ''}</div>
    <h2 id="dialog-title" tabindex="-1">${escape(lesson.title)}</h2><p class="detail-cn">${escape(lesson.cn)}</p>
    <div class="detail-meta"><span>${escape(lesson.duration)}</span><span>${escape(lesson.type)}</span><span>${escape(lesson.topic)}</span><span>${escape(lesson.accent)}</span>${lesson.date ? `<span>节目日期 ${lesson.date}</span>` : ''}</div>
    <div class="detail-goal"><b>这一篇，练什么</b>${escape(lesson.focus)}</div>
    <section class="detail-resources" aria-label="本课学习资源"><div class="resource-label"><span>打开学习资源</span><span class="detail-status${lesson.availability === 'text' ? '' : ' pending'}">${status.label}</span></div><div class="resource-links">${lesson.resources.map(resource => `<div class="resource-item"><a href="${escape(resource.url)}" target="_blank" rel="noopener noreferrer">${escape(resource.label)} <span aria-hidden="true">↗</span><span class="sr-only">（新标签页）</span></a><small>${escape(resource.note)}</small></div>`).join('')}</div><p class="resource-caveat">${status.note}</p><p class="learning-note">${escape(lesson.learningNote)}</p><details class="search-fallback"><summary>需要找其他版本？</summary><a href="https://search.bilibili.com/all?keyword=${encodeURIComponent((lesson.speaker || '') + ' ' + lesson.title)}" target="_blank" rel="noopener noreferrer">B 站按标题检索 ↗</a><p>检索入口，不是已验证的视频；先核对讲者、内容、时长与字幕。</p></details></section>
    ${lesson.flow ? `<section class="guided-flow"><span>视频怎么用 / 现成教学流程</span><p>${escape(lesson.flow)}</p></section>` : ''}
    <h3 class="detail-section-title">这一篇的五步训练 <small>五步完成，才算学完一篇</small></h3>
    <div class="detail-checklist">${steps.map((step, index) => `<label class="task-step"><input type="checkbox" data-step="${index}"${progress.steps[index] ? ' checked' : ''}><span><b>${number(index + 1)} · ${step.title}</b><small>${step.done}</small></span></label>`).join('')}</div>
    <section class="output-task"><h3>把这篇，变成你的对话。</h3><p>${escape(lesson.task)}</p><div class="question-title">临场追问 / 请搭档换顺序、换问法</div><ol class="questions">${lesson.questions.map(question => `<li lang="en">${escape(question)}</li>`).join('')}</ol></section>
    <section class="phrase-box"><h3>把表达带进自己的情境<small>以下是自编练习句型，非原文摘录；理解用途后，换成自己的内容。</small></h3>${lesson.phrases.map(phrase => `<p class="phrase" lang="en">${escape(phrase)}</p>`).join('')}</section>
    <label for="lesson-notes" class="note-label">我的表达与复盘 <span id="note-save-status"></span></label>
    <textarea id="lesson-notes" maxlength="6000" placeholder="记下 5 个想带走的表达、你的例句，以及复述时最容易卡住的地方。&#10;&#10;下一次，我想试着说……"></textarea><p class="notes-tip">最多 6000 字符。可在页面底部导出全部学习记录。</p>`;
  $('#lesson-notes').value = progress.notes;
  $('#previous-lesson').disabled = id === 1;
  $('#next-lesson').disabled = id === TOTAL;
  updateDialogProgress();
  storageWarning();
}

function updateDialogProgress() {
  if (!currentLesson) return;
  const done = completion(state, currentLesson);
  $('#dialog-progress').textContent = done === STEP_COUNT ? '五步完成 ✓' : `${done} / 5 步已练习`;
}

function openLesson(id, replace = false) {
  if (!lessons.some(lesson => lesson.id === id)) return;
  if (!dialog.open) {
    opener = document.activeElement;
    if (!/^#lesson-/.test(location.hash)) returnHash = location.hash || '#curriculum';
  }
  const hash = `#lesson-${id}`;
  if (location.hash !== hash) history[replace ? 'replaceState' : 'pushState'](null, '', hash);
  renderDialog(id);
  if (!dialog.open) dialog.showModal();
  dialog.scrollTop = 0;
  $('#dialog-title').focus({ preventScroll: true });
}

function closeLesson() {
  if (dialog.open) dialog.close();
}

function restoreFocus() {
  if (opener?.isConnected) opener.focus({ preventScroll: true });
  else ($(`[data-lesson="${currentLesson}"]`) || $('#continue-learning')).focus({ preventScroll: true });
}

function route() {
  const match = /^#lesson-(\d+)$/.exec(location.hash);
  if (match && lessons.some(lesson => lesson.id === Number(match[1]))) openLesson(Number(match[1]), true);
  else {
    if (/^#lesson-/.test(location.hash)) {
      history.replaceState(null, '', '#curriculum');
      notify('没有找到这一篇，请从课程列表选择。');
    }
    closeLesson();
  }
}

function chooseStage(stage, scroll = false) {
  filters.stage = stage;
  renderFilters();
  renderLessons();
  // Replaced filter buttons should retain a keyboard focus target.
  $(`#stage-filters [data-stage="${stage}"]`).focus({ preventScroll: true });
  if (scroll) $('.library-toolbar').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function startNext() {
  const next = nextLesson(state);
  if (next) openLesson(next);
  else location.hash = '#checkpoints';
}

function exportProgress() {
  const finished = lessons.filter(lesson => completion(state, lesson.id) === STEP_COUNT).length;
  const lines = ['# 把英语用起来 · 学习记录', '', `导出时间：${new Date().toLocaleString('zh-CN')}`, `完成进度：${finished} / ${TOTAL} 篇`, '', '此文件是可阅读的学习记录备份；页面不提供自动导入。', '资料审阅：' + REVIEW_DATE, ''];
  for (const lesson of lessons) {
    const progress = lessonProgress(state, lesson.id);
    lines.push(`## ${number(lesson.id)}. ${lesson.title}`, '', lesson.cn, '', `来源：${lesson.source} · ${availability[lesson.availability].label}`, ...lesson.resources.map(resource => `- ${resource.label}：${resource.url}`), '', ...steps.map((step, index) => `- [${progress.steps[index] ? 'x' : ' '}] ${step.title}`), '', `输出任务：${lesson.task}`, '', '### 我的笔记', '', progress.notes || '（尚未记录）', '');
  }
  const url = URL.createObjectURL(new Blob(['\uFEFF' + lines.join('\n')], { type: 'text/markdown;charset=utf-8' }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `english-learning-${new Date().toISOString().slice(0, 10)}.md`;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  notify('已导出学习记录，包含进度、资源链接与个人笔记。');
}


function exportLegacy() {
  try {
    const old = readStoredProgress(localStorage, LEGACY_STORAGE_KEY, legacyLessons.length);
    const lines = ['# 英语旧版 30 篇 · 学习记录存档', '', '旧版课程已重编；以下记录对应旧标题，未套用到新版课程。', ''];
    for (const lesson of legacyLessons) {
      const progress = lessonProgress(old, lesson.id);
      if (!progress.steps.some(Boolean) && !progress.notes) continue;
      lines.push(`## ${number(lesson.id)}. ${lesson.title}`, '', ...steps.map((step, index) => `- [${progress.steps[index] ? 'x' : ' '}] ${step.title}`), '', progress.notes || '（无笔记）', '');
    }
    const url = URL.createObjectURL(new Blob(['\uFEFF' + lines.join('\n')], { type: 'text/markdown;charset=utf-8' }));
    const anchor = document.createElement('a');
    anchor.href = url; anchor.download = 'english-learning-v1-archive.md'; anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch { notify('暂时无法读取旧记录，请检查浏览器存储权限。'); }
}
try {
  const old = readStoredProgress(localStorage, LEGACY_STORAGE_KEY, legacyLessons.length);
  $('#legacy-notice').hidden = !Object.values(old.lessons).some(p => p.notes || p.steps.some(Boolean));
} catch { /* The normal storage warning covers unavailable storage. */ }
$('#export-legacy').addEventListener('click', exportLegacy);

document.querySelectorAll('[data-icon]').forEach(element => { element.innerHTML = icon(element.dataset.icon); });
$('#topic-filter').innerHTML += [...new Set(lessons.map(lesson => lesson.topic))].map(topic => `<option value="${escape(topic)}">${escape(topic)}</option>`).join('');
renderFilters();
renderLessons();
renderMethod();
renderExtras();
updateProgress();
storageWarning();

document.addEventListener('click', event => {
  const lessonLink = event.target.closest('a[data-lesson]');
  if (lessonLink && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) {
    event.preventDefault();
    openLesson(Number(lessonLink.dataset.lesson));
    return;
  }
  const stageButton = event.target.closest('button[data-stage]');
  if (stageButton) chooseStage(stageButton.dataset.stage, stageButton.classList.contains('stage-card'));
  const timeButton = event.target.closest('button[data-minutes]');
  if (timeButton) renderSchedule(Number(timeButton.dataset.minutes));
});

$('#search').addEventListener('input', event => { filters.search = event.target.value; renderLessons(); });
for (const name of ['topic', 'platform', 'transcript']) {
  $(`#${name}-filter`).addEventListener('change', event => { filters[name] = event.target.value; renderLessons(); });
}
$('#status-filter').addEventListener('change', event => { filters.status = event.target.value; renderLessons(); });
$('#reset-filters').addEventListener('click', () => {
  Object.assign(filters, { stage: 'all', search: '', status: 'all', topic: 'all', platform: 'all', transcript: 'all' });
  for (const name of ['topic', 'platform', 'transcript']) $(`#${name}-filter`).value = 'all';
  $('#search').value = '';
  $('#status-filter').value = 'all';
  renderFilters(); renderLessons();
  $('#search').focus();
});
$('#hero-start').addEventListener('click', startNext);
$('#continue-learning').addEventListener('click', startNext);
$('#dialog-close').addEventListener('click', closeLesson);
$('#previous-lesson').addEventListener('click', () => openLesson(currentLesson - 1, true));
$('#next-lesson').addEventListener('click', () => openLesson(currentLesson + 1, true));
$('#export-progress').addEventListener('click', exportProgress);
dialog.addEventListener('close', () => {
  if (/^#lesson-\d+$/.test(location.hash)) history.replaceState(null, '', returnHash);
  restoreFocus();
});
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeLesson();
});
dialog.addEventListener('change', event => {
  if (!event.target.matches('input[data-step]')) return;
  setStep(state, currentLesson, Number(event.target.dataset.step), event.target.checked);
  persist(currentLesson, `step-${event.target.dataset.step}`, event.target.checked);
  updateDialogProgress();
  updateProgress();
  renderLessons();
});
dialog.addEventListener('input', event => {
  if (event.target.id !== 'lesson-notes') return;
  state.lessons[currentLesson] ??= lessonProgress(state, currentLesson);
  state.lessons[currentLesson].notes = event.target.value;
  persist(currentLesson, 'notes', event.target.value);
});
window.addEventListener('hashchange', route);
window.addEventListener('storage', event => {
  if (event.key !== null && event.key !== STORAGE_KEY && !event.key.startsWith(`${STORAGE_KEY}:`)) return;
  // Storage events can be queued: read current values, never an old event snapshot.
  // A remote change must not replace text while the learner is typing.
  const notes = $('#lesson-notes');
  const editingNotes = dialog.open && notes === document.activeElement;
  let fresh;
  try { fresh = readStoredProgress(localStorage); } catch { return; }
  for (const { id, field, value } of pendingWrites.values()) {
    if (field === 'notes') {
      fresh.lessons[id] ??= lessonProgress(fresh, id);
      fresh.lessons[id].notes = value;
    } else setStep(fresh, id, Number(field.slice(5)), value);
  }
  if (editingNotes) {
    fresh.lessons[currentLesson] ??= lessonProgress(fresh, currentLesson);
    fresh.lessons[currentLesson].notes = notes.value;
  }
  state = fresh;
  renderLessons(); updateProgress();
  if (dialog.open && currentLesson) {
    const progress = lessonProgress(state, currentLesson);
    dialog.querySelectorAll('input[data-step]').forEach(input => { input.checked = progress.steps[Number(input.dataset.step)]; });
    if (!editingNotes) notes.value = progress.notes;
    updateDialogProgress();
  }
});
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      document.querySelectorAll('nav a').forEach(anchor => anchor.classList.toggle('nav-active', anchor.hash === `#${entry.target.id}`));
    });
  }, { rootMargin: '-10% 0px -65% 0px' });
  document.querySelectorAll('#curriculum, #method, #checkpoints, #resources').forEach(section => observer.observe(section));
}
route();
