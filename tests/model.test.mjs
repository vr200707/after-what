import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

let model;
try { model = await import('../site/assets/model.js'); } catch {}

const fixture = {
  entries: [
    {id:'a',title:'智能人',status:'confirmed',blocks:[{type:'paragraph',text:'无法停止理解感情'}],claims:[{text:'保留欲望',status:'confirmed'}],questionIds:['q1'],tags:[]},
    {id:'b',title:'太阳',status:'tentative',blocks:[],claims:[{text:'来源尚不明确',status:'tentative'}],questionIds:[],tags:[]},
    {id:'c',title:'以后呢',status:'open',definitionState:'undefined',blocks:[],claims:[],questionIds:[],tags:[]}
  ],
  questions:[{id:'q1',text:'神经机制会削弱欲望吗？',categoryIds:['science','smart-humans'],relatedEntryIds:['a'],status:'open'}]
};

test('statistics reflect changed source data, without counting an undefined tag twice',()=>{
  assert.equal(typeof model?.computeStats,'function','computed statistics not implemented');
  assert.deepEqual(model.computeStats(fixture),{entries:{confirmed:1,tentative:1,open:1},claims:{confirmed:1,tentative:1,open:0},questions:1});
  const updated=structuredClone(fixture); updated.entries[1].status='confirmed';
  assert.equal(model.computeStats(updated).entries.confirmed,2);
});
test('search matches linked questions, trims whitespace, and has a real no-result state',()=>{
  assert.equal(typeof model?.searchEntries,'function','search not implemented');
  assert.deepEqual(model.searchEntries(fixture,' 神经机制 ').map(e=>e.id),['a']);
  assert.equal(model.searchEntries(fixture,' ').length,3);
  assert.equal(model.searchEntries(fixture,'不存在的关键词').length,0);
});
test('question category and text filters apply together',()=>{
  assert.equal(typeof model?.filterQuestions,'function','question filters not implemented');
  assert.equal(model.filterQuestions(fixture.questions,{query:'欲望',category:'science'}).length,1);
  assert.equal(model.filterQuestions(fixture.questions,{query:'欲望',category:'society'}).length,0);
});
test('actual story keeps the renamed project, five stages, undefined concept and valid references',async()=>{
  const data=JSON.parse(await readFile(new URL('../site/data/story.json',import.meta.url),'utf8'));
  assert.equal(data.project.title,'以后呢');
  assert.equal(data.entries.filter(e=>e.type==='timeline').length,5);
  assert.equal(data.entries.find(e=>e.id==='after-what').definitionState,'undefined');
  const entryIds=new Set(data.entries.map(e=>e.id));
  const questionIds=new Set(data.questions.map(q=>q.id));
  assert.equal(entryIds.size,data.entries.length);
  assert.equal(questionIds.size,data.questions.length);
  for (const e of data.entries) {
    assert.ok(['confirmed','tentative','open'].includes(e.status));
    for (const q of e.questionIds) assert.ok(questionIds.has(q),`${e.id} references missing question ${q}`);
  }
  for (const q of data.questions) for (const id of q.relatedEntryIds) assert.ok(entryIds.has(id));
  assert.ok(data.questions.some(q=>q.kind==='tension'));
});
