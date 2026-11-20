import { resources, videos, articles, topics } from './resources.js';
import { route, journey, concepts } from './guide.js';

const $ = (selector) => document.querySelector(selector);
const escape = (value) => String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const resourceById = new Map(resources.map((resource) => [resource.id, resource]));
const topicNames = new Map(topics);
const storageKey = 'wlan-guide-v1';
const filters = { type: 'all', query: '', topic: 'all', language: 'all', collection: 'all' };
let state = readState();
let toastTimer;

function icon(name) {
  const paths = {
    video: '<rect x="3" y="4" width="18" height="16" rx="3"/><path d="m10 8 6 4-6 4z"/>',
    article: '<path d="M12 6C9 3 5 3 2 4v15c4-1 7-1 10 2 3-3 6-3 10-2V4c-3-1-7-1-10 2v15"/>',
    save: '<path d="M6 3h12v18l-6-4-6 4z"/>',
    done: '<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
  };
  return `<svg viewBox="0 0 24 24" aria-hidden="true">${paths[name]}</svg>`;
}

function readState() {
  const empty = { saved: [], done: [] };
  try {
    const parsed = JSON.parse(localStorage.getItem(storageKey));
    if (!parsed || parsed.version !== 1) return empty;
    return Object.fromEntries(['saved', 'done'].map((key) => [key,
      Array.isArray(parsed[key]) ? [...new Set(parsed[key].filter((id) => typeof id === 'string' && resourceById.has(id)))] : [],
    ]));
  } catch {
    return empty;
  }
}

function persist() {
  try {
    localStorage.setItem(storageKey, JSON.stringify({ version: 1, ...state }));
    $('#storage-notice').hidden = true;
  } catch {
    $('#storage-notice').hidden = false;
  }
}

function resourceLink(id, label) {
  const item = resourceById.get(id);
  return `<a href="#resource-${id}">${escape(label || item.title)} <span aria-hidden="true">↗</span></a>`;
}

function renderRoute() {
  $('#route-list').innerHTML = route.map((step, index) => `
    <article class="route-step">
      <span class="route-number">${String(index + 1).padStart(2, '0')}</span>
      <div class="route-copy"><h3>${escape(step.title)}</h3><span>${escape(step.subtitle)}</span><p>${escape(step.text)}</p></div>
      <div class="route-materials">
        <div><span class="material-label">先看</span>${resourceLink(step.video)}</div>
        <div><span class="material-label">再读</span><span class="reading-links">${step.readings.map((id) => resourceLink(id)).join('')}</span></div>
        <details class="route-check"><summary>走完这一步，试着解释</summary><p>${escape(step.checkpoint)}</p></details>
      </div>
    </article>`).join('');
}

function renderJourney(index = 0) {
  const step = journey[index];
  $('#journey-steps').innerHTML = journey.map((item, i) => `
    <button type="button" class="journey-step" data-step="${i}" aria-pressed="${i === index}" aria-controls="journey-detail">
      <span>STEP 0${i + 1}</span><strong>${escape(item.name)}</strong><small>${escape(item.shape)}</small>
    </button>`).join('');
  $('#journey-detail').innerHTML = `<div><span class="owner">${escape(step.owner)}</span><h3>${escape(step.shape)}</h3><p>${escape(step.text)}</p></div>
    <div class="journey-boundary"><strong>在这里，分清一个边界</strong><p>${escape(step.detail)}</p>${resourceLink(step.resource, '打开对应的文字选读')}</div>`;
}

function renderConcepts() {
  $('#concept-list').innerHTML = concepts.map(([name, category, description, id], index) => `
    <details class="concept-item" id="concept-${index + 1}"><summary><span>${escape(name)}</span></summary><span class="concept-category">${escape(category)}</span><p>${escape(description)}</p>${resourceLink(id, '继续阅读')}</details>`).join('');
}

function renderCard(item) {
  const saved = state.saved.includes(item.id);
  const done = state.done.includes(item.id);
  return `<article id="resource-${item.id}" class="resource-card" data-kind="${item.type}" tabindex="-1">
    <div class="resource-topline"><span class="resource-type">${icon(item.type)} ${item.type === 'video' ? '视频 / 系列' : '文字 / 选读'}</span><div class="resource-meta">${item.core ? '<span class="core-badge">核心推荐</span>' : ''}<span>${item.language === 'zh' ? '中文' : '英文'}</span></div></div>
    <h3 class="resource-title">${escape(item.title)}</h3>${item.subtitle ? `<p class="resource-subtitle">${escape(item.subtitle)}</p>` : ''}
    <p class="resource-author">${escape(item.author)}</p>
    <p class="resource-description">${escape(item.description)}</p>
    <div class="topic-tags">${item.topics.map((topic) => `<span>${escape(topicNames.get(topic))}</span>`).join('')}</div>
    <div class="resource-links">${item.links.map((link) => `<a href="${escape(link.url)}" target="_blank" rel="noopener noreferrer" data-search="${Boolean(link.search)}">${escape(link.label)} <span aria-hidden="true">${link.search ? '⌕' : '↗'}</span><span class="sr-only">（新标签页）</span></a>`).join('')}</div>
    <details class="resource-details"><summary>${item.type === 'video' ? '观看重点与配套阅读' : '阅读指引与配套视频'}</summary><div class="reading-guide">
      <dl><dt>${item.type === 'video' ? '重点看什么' : '只读这些部分'}</dt><dd>${escape(item.focus)}</dd><dt>可以在哪里停下</dt><dd>${escape(item.stop)}</dd></dl>
      <p class="check-question">检查理解：${escape(item.question)}</p><p class="resource-note">来源说明 · ${escape(item.note)}</p>
      <div class="paired-link">搭配${item.type === 'video' ? '文字' : '视频'}：${resourceLink(item.related)}</div>
    </div></details>
    <div class="resource-actions"><button type="button" data-action="save" data-id="${item.id}" aria-pressed="${saved}" aria-label="${saved ? '取消收藏' : '收藏'}：${escape(item.title)}">${icon('save')}${saved ? '已收藏' : '收藏资料'}</button><button type="button" data-action="done" data-id="${item.id}" aria-pressed="${done}" aria-label="${done ? '取消已学标记' : '标记已学'}：${escape(item.title)}">${icon('done')}${done ? '已经学过' : '标记已学'}</button></div>
  </article>`;
}

function matches(item) {
  const terms = filters.query.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
  const text = [item.title, item.subtitle, item.author, item.description, item.focus, item.stop, item.question, item.note,
    ...item.topics.map((topic) => topicNames.get(topic))].join(' ').toLocaleLowerCase();
  return (filters.type === 'all' || filters.type === item.type)
    && (filters.topic === 'all' || item.topics.includes(filters.topic))
    && (filters.language === 'all' || filters.language === item.language)
    && (filters.collection !== 'core' || item.core)
    && (filters.collection !== 'saved' || state.saved.includes(item.id))
    && (filters.collection !== 'done' || state.done.includes(item.id))
    && (filters.collection !== 'new' || !state.done.includes(item.id))
    && terms.every((term) => text.includes(term));
}

function renderResources() {
  const openIds = [...document.querySelectorAll('.resource-card details[open]')].map((el) => el.closest('article').id);
  const items = resources.filter(matches);
  $('#resource-list').innerHTML = items.map(renderCard).join('');
  for (const id of openIds) {
    const details = document.getElementById(id)?.querySelector('details');
    if (details) details.open = true;
  }
  $('#empty-state').hidden = items.length !== 0;
  $('#result-count').textContent = `显示 ${items.length} / ${resources.length} 份资料${filters.collection === 'core' ? ' · 核心推荐' : ''}`;
  $('#done-count').textContent = state.done.length;
  $('#learning-progress').value = state.done.length;
  document.querySelectorAll('[data-type]').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.type === filters.type)));
}

function resetFilters() {
  Object.assign(filters, { type: 'all', query: '', topic: 'all', language: 'all', collection: 'all' });
  $('#search').value = '';
  for (const key of ['topic', 'language', 'collection']) $(`#${key}`).value = 'all';
  renderResources();
}

function revealResource(hash) {
  if (!hash.startsWith('#resource-')) return;
  const id = hash.slice('#resource-'.length);
  if (!resourceById.has(id)) {
    showToast('没有找到这份资料，可以在资料库中搜索。');
    return;
  }
  if (!matches(resourceById.get(id))) resetFilters();
  const card = document.getElementById(`resource-${id}`);
  card.querySelector('details').open = true;
  card.focus({ preventScroll: true });
  card.scrollIntoView({ block: 'start' });
}

function showToast(text) {
  clearTimeout(toastTimer);
  $('#toast').textContent = text;
  $('#toast').hidden = false;
  toastTimer = setTimeout(() => { $('#toast').hidden = true; }, 3500);
}

renderRoute();
renderJourney();
renderConcepts();
$('#topic').insertAdjacentHTML('beforeend', topics.map(([id, label]) => `<option value="${id}">${escape(label)}</option>`).join(''));
for (const [selector, count] of [['#video-total', videos.length], ['#article-total', articles.length], ['#total-count', resources.length], ['#all-tab-count', resources.length], ['#video-tab-count', videos.length], ['#article-tab-count', articles.length]]) $(selector).textContent = count;
$('#learning-progress').max = resources.length;
renderResources();

$('#search').addEventListener('input', (event) => { filters.query = event.target.value; renderResources(); });
for (const key of ['topic', 'language', 'collection']) {
  $(`#${key}`).addEventListener('change', (event) => { filters[key] = event.target.value; renderResources(); });
}
document.querySelectorAll('[data-type]').forEach((button) => button.addEventListener('click', () => {
  filters.type = button.dataset.type;
  renderResources();
}));
for (const selector of ['#clear-all', '#reset-filters']) $(selector).addEventListener('click', () => {
  resetFilters();
  $('#search').focus({ preventScroll: true });
});
$('#show-core').addEventListener('click', () => {
  resetFilters();
  filters.collection = 'core';
  $('#collection').value = 'core';
  renderResources();
  location.hash = 'library';
});
$('#resource-list').addEventListener('click', (event) => {
  const button = event.target.closest('[data-action]');
  if (!button) return;
  const { id, action } = button.dataset;
  const key = action === 'save' ? 'saved' : 'done';
  state[key] = state[key].includes(id) ? state[key].filter((value) => value !== id) : [...state[key], id];
  persist();
  renderResources();
  const replacement = document.querySelector(`[data-id="${id}"][data-action="${action}"]`);
  if (replacement) replacement.focus({ preventScroll: true });
  else {
    $('#result-count').tabIndex = -1;
    $('#result-count').focus({ preventScroll: true });
  }
});
$('#journey-steps').addEventListener('click', (event) => {
  const button = event.target.closest('[data-step]');
  if (!button) return;
  const index = Number(button.dataset.step);
  renderJourney(index);
  document.querySelector(`[data-step="${index}"]`).focus({ preventScroll: true });
});
document.addEventListener('click', (event) => {
  const anchor = event.target.closest('a[href^="#resource-"]');
  if (!anchor || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
  const hash = anchor.getAttribute('href');
  event.preventDefault();
  if (location.hash === hash) revealResource(hash);
  else location.hash = hash;
});
window.addEventListener('hashchange', () => revealResource(location.hash));
window.addEventListener('storage', (event) => {
  if (event.key === storageKey || event.key === null) { state = readState(); renderResources(); }
});
revealResource(location.hash);

if ('IntersectionObserver' in window) {
  const sectionOrder = ['top', 'route', 'journey', 'library', 'concepts'];
  const visibleSections = new Set();
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => entry.isIntersecting ? visibleSections.add(entry.target.id) : visibleSections.delete(entry.target.id));
    const active = sectionOrder.find((id) => visibleSections.has(id));
    if (!active) return;
    document.querySelectorAll('.side-nav a').forEach((anchor) => {
      const selected = anchor.hash === `#${active}`;
      anchor.classList.toggle('active', selected);
      if (selected) anchor.setAttribute('aria-current', 'location');
      else anchor.removeAttribute('aria-current');
    });
  }, { rootMargin: '-10% 0px -55% 0px' });
  sectionOrder.forEach((id) => observer.observe(document.getElementById(id)));
}
