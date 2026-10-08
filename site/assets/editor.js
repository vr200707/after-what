export const DRAFT_KEY = 'after-what.question-draft.v1';

function withQuestions(data, questions) {
  const result = structuredClone(data);
  const categories = new Set(data.categories.map(c => c.id));
  const allowedEntries = new Set(data.entries.filter(e => e.showQuestions !== false && e.type !== 'undefined').map(e => e.id));
  const ids = new Set();
  for (const q of questions) {
    if (typeof q.id !== 'string' || !/^[a-zA-Z0-9-]+$/.test(q.id) || ids.has(q.id)) throw new Error('问题编号无效或重复。');
    ids.add(q.id);
    if (typeof q.text !== 'string' || !q.text.trim() || q.text.length > 2000) throw new Error('请填写问题内容，最多 2000 字。');
    if (!Array.isArray(q.categoryIds) || !q.categoryIds.length || q.categoryIds.some(id => !categories.has(id))) throw new Error('请至少选择一个有效分类。');
    if (!Array.isArray(q.relatedEntryIds) || q.relatedEntryIds.some(id => !allowedEntries.has(id))) throw new Error('问题关联条目无效；待定义部分不关联问题。');
    if (!['open','confirmed','tentative'].includes(q.status)) throw new Error('问题状态无效。');
  }
  result.questions = structuredClone(questions);
  for (const e of result.entries) e.questionIds = result.questions.filter(q => q.relatedEntryIds.includes(e.id)).map(q => q.id);
  return result;
}

export function upsertQuestion(data, input, id = null) {
  const existing = id ? data.questions.find(q => q.id === id) : null;
  if (id && !existing) throw new Error('这个问题已不存在，请重新打开编辑。');
  const q = { ...(existing || {}), id: existing?.id || `local-${crypto.randomUUID()}`, text: input.text.trim(),
    categoryIds: [...new Set(input.categoryIds)], relatedEntryIds: [...new Set(input.relatedEntryIds)],
    status: existing?.status || 'open', kind: existing?.kind || 'question' };
  if (existing && existing.text !== q.text && q.source) { q.originalSource = q.source; delete q.source; }
  q.editedLocally = true;
  const questions = id ? data.questions.map(item => item.id === id ? q : item) : [...data.questions, q];
  return withQuestions(data, questions);
}

export function removeQuestion(data, id) {
  if (!data.questions.some(q => q.id === id)) throw new Error('这个问题已不存在。');
  return withQuestions(data, data.questions.filter(q => q.id !== id));
}

export function saveDraft(storage, baseSignature, data) {
  storage.setItem(DRAFT_KEY, JSON.stringify({ version: 1, baseSignature, savedAt: new Date().toISOString(), questions: data.questions }));
}

export function loadDraft(base, storage) {
  try {
    const raw = storage.getItem(DRAFT_KEY);
    if (!raw) return { data: structuredClone(base), hasDraft: false, stale: false };
    const draft = JSON.parse(raw);
    if (draft.version !== 1 || !Array.isArray(draft.questions)) throw new Error('草稿格式无效。');
    return { data: withQuestions(base, draft.questions), hasDraft: true,
      stale: draft.baseSignature !== JSON.stringify(base.questions), savedAt: draft.savedAt };
  } catch (error) {
    return { data: structuredClone(base), hasDraft: false, stale: false, error: error.message };
  }
}

export function exportStory(data) { return JSON.stringify(withQuestions(data, data.questions), null, 2) + '\n'; }
