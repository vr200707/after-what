import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { Window } from 'happy-dom';

// Offline DOM execution: no browser navigation or network access.
const window = new Window({url:'https://offline.invalid/after-what/',settings:{disableJavaScriptFileLoading:true,disableCSSFileLoading:true}});
const html=await readFile(new URL('../site/index.html',import.meta.url),'utf8');
const story=JSON.parse(await readFile(new URL('../site/data/story.json',import.meta.url),'utf8'));
window.document.write(html);
globalThis.window=window;
globalThis.document=window.document;
globalThis.location=window.location;
globalThis.history=window.history;
globalThis.fetch=async()=>({ok:true,json:async()=>structuredClone(story)});
await import('../site/assets/app.js');
await new Promise(resolve=>setImmediate(resolve));
const $=selector=>window.document.querySelector(selector);

test('board renders all five timeline stages and the renamed undefined record',()=>{
  assert.equal($('#board').hidden,false);
  assert.equal($('#error').hidden,true);
  assert.equal(window.document.querySelectorAll('.timeline-node').length,5);
  assert.match($('#undefined-card').textContent,/以后呢/);
  assert.match($('#undefined-card').textContent,/UNDEFINED/);
  assert.doesNotMatch($('#board').textContent,/云端故土/);
  assert.equal(window.document.querySelectorAll('.question-row').length,story.questions.length);
});

test('every record button opens its own detail and close returns focus',()=>{
  const buttons=[...window.document.querySelectorAll('[data-entry]')];
  assert.ok(buttons.length>20);
  for(const button of buttons){
    const entry=story.entries.find(e=>e.id===button.dataset.entry);
    assert.ok(entry,`missing entry for button ${button.textContent}`);
    button.focus();button.click();
    assert.equal($('#detail-dialog').open,true);
    assert.equal($('#detail-title').textContent,entry.title);
    $('#close-dialog').click();
    assert.equal($('#detail-dialog').open,false);
    assert.equal(window.document.activeElement,button);
  }
});

test('global search displays actual related records, empty state and clears',()=>{
  $('#global-search').value='欲望';
  $('#global-search').dispatchEvent(new window.Event('input'));
  assert.equal($('#search-results').hidden,false);
  assert.ok(window.document.querySelectorAll('.search-entry').length>=2);
  $('#global-search').value='xyz-no-such-record';
  $('#global-search').dispatchEvent(new window.Event('input'));
  assert.match($('#search-list').textContent,/没有找到相关内容/);
  $('#clear-search').click();
  assert.equal($('#search-results').hidden,true);
  assert.equal($('#global-search').value,'');
});

test('category, kind and text filters compose and reset restores all questions',()=>{
  $('[data-category="science"]').click();
  assert.ok([...window.document.querySelectorAll('.question-row')].every(row=>row.textContent.includes('科学')));
  $('#question-kind').value='tension';
  $('#question-kind').dispatchEvent(new window.Event('change'));
  assert.ok(window.document.querySelectorAll('.question-row').length>0);
  assert.ok([...window.document.querySelectorAll('.question-row')].every(row=>row.textContent.includes('逻辑张力')));
  $('#question-search').value='no matching question';
  $('#question-search').dispatchEvent(new window.Event('input'));
  assert.match($('#question-list').textContent,/没有匹配的问题/);
  $('#reset-filters').click();
  assert.equal(window.document.querySelectorAll('.question-row').length,story.questions.length);
});

test('renamed concept opens from a shareable record anchor',()=>{
  window.location.hash='#record-after-what';
  window.dispatchEvent(new window.Event('hashchange'));
  assert.equal($('#detail-dialog').open,true);
  assert.equal($('#detail-title').textContent,'以后呢');
  assert.match($('#detail-content').textContent,/待定义/);
  $('#close-dialog').click();
});
