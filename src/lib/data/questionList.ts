import type { QuestionPassage } from '@/types/passage';
import type { Question } from '@/types/question';

export type QuestionListEntry =
  | { kind: 'standalone'; question: Question }
  | { kind: 'passage'; passage: QuestionPassage; questions: Question[] };

/**
 * Groups topic questions into standalone cards + passage blocks for the list UI.
 */
export function buildQuestionListEntries(
  questions: Question[],
  passages: QuestionPassage[]
): QuestionListEntry[] {
  const passageMap = new Map(passages.map((p) => [p.id, p]));
  const usedPassageIds = new Set<string>();
  const entries: QuestionListEntry[] = [];

  for (const q of questions) {
    if (!q.passageId) {
      entries.push({ kind: 'standalone', question: q });
      continue;
    }
    if (usedPassageIds.has(q.passageId)) continue;
    usedPassageIds.add(q.passageId);
    const passage = passageMap.get(q.passageId);
    if (!passage) {
      entries.push({ kind: 'standalone', question: q });
      continue;
    }
    const group = questions
      .filter((x) => x.passageId === q.passageId)
      .sort((a, b) => (a.passageOrder ?? 0) - (b.passageOrder ?? 0));
    entries.push({ kind: 'passage', passage, questions: group });
  }

  return entries;
}
