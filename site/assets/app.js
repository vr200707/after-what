import { computeStats, searchEntries, filterQuestions } from './model.js';

const $ = selector => document.querySelector(selector);
const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let data;
let activeCategory = 'all';
let previousFocus;
const typeLabels = {timeline:'时间阶段',scene:'关键场景',concept:'核心概念',society:'社会设想',undefined:'待定义概念'};
const dialog = $('#detail-dialog');

function statusBadge(entry) {
  const s = data.statusDefinitions[entry.status];
  const label = entry.sourceStatus === '已确定方向' ? '已确定方向' : s.zh;
  return `<span class="status status-${entry.status}">${escape(label)} <span>${escape(s.en)}</span></span>`;
}

function renderBlocks(blocks) {
  return blocks.map(b => {
    if (b.type === 'list') return `<div class="content-list"><h4>${escape(b.title)}</h4><ul>${b.items.map(v=>`<li>${escape(v)}</li>`).join('')}</ul></div>`;
    if (b.type === 'flow') return `<div class="flow-block"><h4>${escape(b.title)}</h4><ol class="flow">${b.items.map(v=>`<li>${escape(v)}</li>`).join('')}</ol></div>`;
    if (b.type === 'emphasis') return `<p class="content-emphasis">${escape(b.text)}</p>`;
    return `<p>${escape(b.text)}</p>`;
  }).join('');
}

function openEntry(id, {updateHash = false} = {}) {
  const entry = data.entries.find(e => e.id === id);
  if (!entry) return;
  previousFocus = document.activeElement;
  const questions = data.questions.filter(q => entry.questionIds.includes(q.id));
  $('#detail-content').innerHTML = `<div class="detail-heading"><span class="section-label">${escape(typeLabels[entry.type])} / ${escape(entry.titleEn)}</span><h2 id="detail-title">${escape(entry.title)}</h2><div class="detail-badges">${statusBadge(entry)}${entry.definitionState === 'undefined' ? '<span class="undefined-label">UNDEFINED / 待定义</span>' : ''}</div>${entry.sourceStatus ? `<p class="source-state">原文状态：${escape(entry.sourceStatus)}</p>` : ''}</div>
    <section class="detail-section"><h3>背景设定 <span>Background</span></h3><p>${escape(entry.background)}</p></section>
    ${entry.claims.length ? `<section class="detail-section"><h3>当前设定陈述 <span>Claims</span></h3><ul class="claim-list">${entry.claims.map(c=>`<li>${statusBadge(c)}<p>${escape(c.text)}</p>${c.qualification?`<small>${escape(c.qualification)}</small>`:''}</li>`).join('')}</ul></section>` : '<p class="unconfirmed-note">本条目没有单独标记的已确定设定陈述。</p>'}
    ${entry.blocks.length ? `<section class="detail-section"><h3>内容记录 <span>Notes</span></h3>${renderBlocks(entry.blocks)}</section>` : ''}
    ${entry.note ? `<p class="unconfirmed-note">${escape(entry.note)}</p>` : ''}
    <section class="detail-section"><h3>待讨论问题 <span>Open questions · ${questions.length}</span></h3>${questions.length ? `<ul class="detail-questions">${questions.map(q=>`<li>${q.kind==='tension'?'<span class="tension-label">逻辑张力</span>':''}<p>${escape(q.text)}</p></li>`).join('')}</ul>` : '<p>此条目目前没有列入讨论清单的问题。</p>'}</section>
    ${questions.length ? `<button class="outline-button" data-question-source="${escape(id)}">跳到问题清单中的首个相关问题</button>` : ''}`;
  if (!dialog.open) dialog.showModal();
  $('#close-dialog').focus();
  if (updateHash) history.replaceState(null, '', `#record-${id}`);
}

function closeDetail() { dialog.close(); }
$('#close-dialog').addEventListener('click', closeDetail);
dialog.addEventListener('click', event => { if (event.target === dialog) { const r=dialog.getBoundingClientRect(); if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom) closeDetail(); } });
dialog.addEventListener('close',()=>{ if(location.hash.startsWith('#record-')) history.replaceState(null,'',location.pathname+location.search); previousFocus?.focus(); });

function renderStats() {
  const stats=computeStats(data);
  $('#stats').innerHTML = `<span class="stat-caption">内容条目</span>${Object.entries(stats.entries).map(([status,count])=>`<div class="stat-item"><strong>${String(count).padStart(2,'0')}</strong>${statusBadge({status})}</div>`).join('')}`;
  $('#question-total').textContent = `${stats.questions} 个开放问题`;
  $('#footer-stats').textContent = `${data.entries.length} 个内容条目 · ${stats.questions} 个开放问题`;
  $('#stats').title = `统计 ${data.entries.length} 个内容条目；设定陈述：已确定 ${stats.claims.confirmed}，暂定 ${stats.claims.tentative}，待讨论 ${stats.claims.open}。不代表故事完成百分比。`;
}

function renderTimeline() {
  const timeline=data.entries.filter(e=>e.type==='timeline').sort((a,b)=>a.order-b.order);
  $('#timeline-nodes').innerHTML=timeline.map(e=>`<button class="timeline-node" data-entry="${e.id}" aria-label="查看${escape(e.title)}的设定与问题"><div class="node-top"><span class="node-number">${String(e.order).padStart(2,'0')}</span>${statusBadge(e)}</div><div class="timeline-rail"><span></span></div><h3>${escape(e.title)}</h3><span class="node-en">${escape(e.titleEn)}</span><p>${escape(e.background)}</p><span class="node-bottom">${e.questionIds.length} 个待讨论问题<span>查看详情</span></span></button>`).join('');
}

function renderContent() {
  const scene=data.entries.find(e=>e.id==='dog-bone');
  $('#scene-card').innerHTML=`<article class="scene-card"><div class="scene-caption"><span class="section-label">${escape(scene.titleEn)}</span><h3>${escape(scene.title)}</h3><span class="scene-status">状态未指定 / Unassigned</span><p>${escape(scene.note)}</p><button class="outline-button" data-entry="${scene.id}">查看完整场景记录</button></div><div class="scene-script"><p>${escape(scene.background)}</p>${renderBlocks(scene.blocks)}</div></article>`;
  const smart=data.entries.find(e=>e.id==='smart-humans');
  const desire=data.entries.find(e=>e.id==='desire');
  const optimal=data.entries.find(e=>e.id==='optimal');
  $('#concept-cards').innerHTML=`<article class="concept-card smart-card"><div class="card-heading"><span class="section-label">Smart humans</span>${statusBadge(smart)}</div><h3>${escape(smart.title)}</h3><p>${escape(smart.summary)}</p><div class="trait-list">${escape(smart.claims[1].text)}</div><p class="card-note">${escape(smart.summaryNote)}</p><button class="text-button" data-entry="smart-humans">查看核心设定</button></article>
    <article id="desire" class="concept-card desire-card section-anchor"><div class="card-heading"><span class="section-label">Desire</span>${statusBadge(desire)}</div><h3>${escape(desire.title)}</h3><p>${escape(desire.background)}</p><div class="desire-types">${desire.blocks.filter(b=>b.type==='list').map(b=>`<div><h4>${escape(b.title.replace('可能存在 · ',''))}</h4><p>${b.items.map(escape).join(' / ')}</p></div>`).join('')}</div><small>以上类别仅为可能存在。</small><p class="desire-question">${escape(data.project.keyQuestion)}</p><button class="text-button" data-entry="desire">查看欲望与权力的思考</button></article>
    <article class="concept-card logic-card"><div class="card-heading"><span class="section-label">Philosophy / Logic</span>${statusBadge(optimal)}</div><h3>${escape(optimal.title)}</h3><p>${escape(optimal.blocks[0].text)}</p>${renderBlocks(optimal.blocks.filter(b=>b.type==='flow'))}<p class="card-note">${escape(optimal.summaryNote)}</p><button class="text-button" data-entry="optimal">查看最优解讨论</button></article>`;
  $('#society-cards').innerHTML=data.entries.filter(e=>e.type==='society').map(e=>`<article class="society-card"><div class="card-heading"><span class="section-label">${escape(e.titleEn)}</span>${statusBadge(e)}</div><h3>${escape(e.title)}</h3><p>${escape(e.background)}</p>${renderBlocks(e.blocks)}<button class="outline-button" data-entry="${e.id}">查看设想与 ${e.questionIds.length} 个问题</button></article>`).join('');
  const undefinedEntry=data.entries.find(e=>e.type==='undefined');
  $('#undefined-card').innerHTML=`<article class="undefined-card"><div><span class="undefined-label">UNDEFINED / 待定义</span><h2>${escape(undefinedEntry.title)}<span>？</span></h2><p>${escape(undefinedEntry.background)}</p></div></article>`;

}

function renderQuestions() {
  const query=$('#question-search').value;
  const filtered=filterQuestions(data.questions,{query,category:activeCategory});
  $('#category-filters').innerHTML=[{id:'all',zh:'全部',en:'All'},...data.categories.filter(c=>data.questions.some(q=>q.categoryIds.includes(c.id)))].map(c=>`<button class="filter-chip ${c.id===activeCategory?'active':''}" data-category="${c.id}" aria-pressed="${c.id===activeCategory}">${escape(c.zh)}<span>${escape(c.en)}</span></button>`).join('');
  $('#question-count').textContent=`显示 ${filtered.length} / ${data.questions.length} 个问题`;
  $('#reset-filters').hidden=activeCategory==='all'&&!query;
  $('#question-list').innerHTML=filtered.length?filtered.map(q=>`<article class="question-row" id="${q.id}"><div class="question-text">${q.kind==='tension'?'<span class="tension-label">逻辑张力 / Tension</span>':''}<p>${escape(q.text)}</p><div class="question-categories">${q.categoryIds.map(id=>{const c=data.categories.find(c=>c.id===id);return `<span>${escape(c?.zh||id)}</span>`;}).join('')}</div></div><div class="question-sources">${q.relatedEntryIds.map(id=>{const e=data.entries.find(e=>e.id===id);return `<button data-entry="${id}" class="source-link">${escape(e.title)}</button>`;}).join('')||'<span class="narrative-source">叙事待定</span>'}<span class="open-word">待讨论</span></div></article>`).join(''):'<div class="empty-state"><h3>没有匹配的问题</h3><p>试试其他关键词，或重置筛选。</p></div>';
}

function renderSearch() {
  const query=$('#global-search').value.trim();
  $('#search-results').hidden=!query;
  if(!query)return;
  const entries=searchEntries(data,query);
  const questions=filterQuestions(data.questions,{query});
  $('#search-list').innerHTML=`<p class="search-summary">${entries.length} 个相关条目 · ${questions.length} 个相关问题</p>${entries.length?`<div class="search-entry-grid">${entries.map(e=>`<button data-entry="${e.id}" class="search-entry"><span>${escape(typeLabels[e.type])}</span><strong>${escape(e.title)}</strong>${statusBadge(e)}</button>`).join('')}</div>`:''}${questions.length?`<ul class="search-question-list">${questions.map(q=>`<li><span>${escape(q.text)}</span>${q.relatedEntryIds[0]?`<button class="text-button" data-entry="${q.relatedEntryIds[0]}">查看来源</button>`:''}</li>`).join('')}</ul>`:''}${!entries.length&&!questions.length?'<div class="empty-state"><h3>没有找到相关内容</h3><p>试试“欲望”“太阳”或“理性”。</p></div>':''}`;
}

document.addEventListener('click',event=>{
  const entryButton=event.target.closest('[data-entry]');
  if(entryButton&&data)openEntry(entryButton.dataset.entry,{updateHash:true});
  const categoryButton=event.target.closest('[data-category]');
  if(categoryButton){activeCategory=categoryButton.dataset.category;renderQuestions();$('#category-filters').querySelector(`[data-category="${activeCategory}"]`)?.focus();}
  const sourceButton=event.target.closest('[data-question-source]');
  if(sourceButton){const entry=data.entries.find(e=>e.id===sourceButton.dataset.questionSource);closeDetail();activeCategory='all';$('#question-search').value='';renderQuestions();history.replaceState(null,'','#questions');const first=entry.questionIds[0];(first?$(`#${first}`):$('#questions'))?.scrollIntoView({block:'start'});}
});
$('#global-search').addEventListener('input',renderSearch);
$('#clear-search').addEventListener('click',()=>{$('#global-search').value='';renderSearch();$('#global-search').focus();});
$('#question-search').addEventListener('input',renderQuestions);
$('#reset-filters').addEventListener('click',()=>{activeCategory='all';$('#question-search').value='';renderQuestions();});
$('#retry').addEventListener('click',()=>location.reload());
document.addEventListener('keydown',event=>{if(event.key==='/'&&!dialog.open&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)){event.preventDefault();$('#global-search').focus();}});
window.addEventListener('hashchange',()=>{if(data&&location.hash.startsWith('#record-'))openEntry(location.hash.slice(8));});

async function initialize() {
  try {
    const response=await fetch(new URL('../data/story.json',import.meta.url));
    if(!response.ok)throw new Error(`Story data HTTP ${response.status}`);
    data=await response.json();
    document.title=`${data.project.title} · 故事开发面板`;
    $('#core-statement').textContent=data.project.coreStatement;
    $('#core-description').textContent=data.project.coreDescription;
    $('#key-question').textContent=data.project.keyQuestion;
    $('#direction-summary').textContent=data.project.directionSummary;
    $('#direction-note').textContent=data.project.directionNote;
    renderStats();renderTimeline();renderContent();renderQuestions();
    $('#loading').hidden=true;$('#board').hidden=false;
    if(location.hash.startsWith('#record-'))openEntry(location.hash.slice(8));
    else if(location.hash)document.getElementById(location.hash.slice(1))?.scrollIntoView();
  } catch(error) { console.error(error);$('#loading').hidden=true;$('#error').hidden=false; }
}
initialize();
