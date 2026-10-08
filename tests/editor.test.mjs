import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
let editor;
try { editor=await import('../site/assets/editor.js'); } catch {}
const base=JSON.parse(await readFile(new URL('../site/data/story.json',import.meta.url),'utf8'));

test('editing and deleting questions updates timeline backlinks without changing story claims',()=>{
  assert.equal(typeof editor?.upsertQuestion,'function','question editing is not implemented');
  const before=structuredClone(base);
  const added=editor.upsertQuestion(base,{text:' 新的讨论问题？ ',categoryIds:['science'],relatedEntryIds:['knowledge']});
  const question=added.questions.at(-1);
  assert.equal(question.text,'新的讨论问题？');
  assert.ok(added.entries.find(e=>e.id==='knowledge').questionIds.includes(question.id));
  const edited=editor.upsertQuestion(added,{text:'修改后的问题？',categoryIds:['philosophy'],relatedEntryIds:['optimal']},question.id);
  assert.equal(edited.questions.length,base.questions.length+1);
  assert.equal(edited.entries.find(e=>e.id==='knowledge').questionIds.length,0);
  const deleted=editor.removeQuestion(edited,question.id);
  assert.equal(deleted.questions.length,base.questions.length);
  assert.ok(deleted.entries.every(e=>!e.questionIds.includes(question.id)));
  assert.deepEqual(base,before);
  assert.deepEqual(deleted.entries.map(e=>e.claims),base.entries.map(e=>e.claims));
});
test('empty text and question links to the fully undefined stage are rejected',()=>{
  assert.equal(typeof editor?.upsertQuestion,'function','validation is not implemented');
  assert.throws(()=>editor.upsertQuestion(base,{text:' ',categoryIds:['science'],relatedEntryIds:[]}));
  assert.throws(()=>editor.upsertQuestion(base,{text:'测试',categoryIds:['science'],relatedEntryIds:['cloud-homeland']}));
});
test('browser draft reload and export preserve edits and keep published changes distinct',()=>{
  assert.equal(typeof editor?.saveDraft,'function','draft persistence is not implemented');
  const memory=new Map();
  const storage={getItem:key=>memory.get(key)||null,setItem:(key,value)=>memory.set(key,value),removeItem:key=>memory.delete(key)};
  const changed=editor.removeQuestion(base,base.questions[0].id);
  editor.saveDraft(storage,JSON.stringify(base.questions),changed);
  const restored=editor.loadDraft(base,storage);
  assert.equal(restored.hasDraft,true);
  assert.equal(restored.data.questions.length,base.questions.length-1);
  assert.equal(restored.stale,false);
  const published=structuredClone(base);published.questions[0].text='公开版的新内容';
  assert.equal(editor.loadDraft(published,storage).stale,true);
  const exported=JSON.parse(editor.exportStory(restored.data));
  assert.equal(exported.questions.length,base.questions.length-1);
  assert.equal(exported.entries.find(e=>e.id==='cloud-homeland').questionIds.length,0);
  storage.setItem(editor.DRAFT_KEY,'not valid JSON');
  const invalid=editor.loadDraft(base,storage);
  assert.ok(invalid.error);
  assert.equal(invalid.data.questions.length,base.questions.length);
});
