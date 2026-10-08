const emptyCounts = () => ({ confirmed: 0, tentative: 0, open: 0 });

export function computeStats(data) {
  const entries = emptyCounts();
  const claims = emptyCounts();
  for (const entry of data.entries) {
    entries[entry.status]++;
    for (const claim of entry.claims || []) claims[claim.status]++;
  }
  return { entries, claims, questions: new Set(data.questions.filter(q => q.status === 'open').map(q => q.id)).size };
}

export function searchEntries(data, query) {
  const term = query.trim().toLocaleLowerCase();
  if (!term) return data.entries;
  return data.entries.filter(entry => {
    const linkedQuestions = data.questions.filter(q => entry.questionIds.includes(q.id));
    const searchable = [entry.title, entry.titleEn, entry.background, ...(entry.tags || []),
      ...entry.blocks.flatMap(b => [b.text || '', b.title || '', ...(b.items || [])]),
      ...(entry.claims || []).flatMap(c => [c.text, c.qualification || '']),
      ...linkedQuestions.map(q => q.text)].join(' ').toLocaleLowerCase();
    return searchable.includes(term);
  });
}

export function filterQuestions(questions, { query = '', category = 'all', kind = 'all' } = {}) {
  const term = query.trim().toLocaleLowerCase();
  return questions.filter(q => (category === 'all' || q.categoryIds.includes(category)) &&
    (kind === 'all' || q.kind === kind) && q.text.toLocaleLowerCase().includes(term));
}
