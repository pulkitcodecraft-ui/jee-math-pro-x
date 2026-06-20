/**
 * Parses official solution text (mockData / Firestore) into scannable blocks:
 * setup → key insight → numbered steps → final answer.
 *
 * ── Authoring format (bulk upload friendly) ──
 *
 *   Key insight: one-line trick (optional, for smartest methods)
 *
 *   1. **Step title:** explanation and inline $LaTeX$
 *   2. **Next step:**
 *   $$block\\;equation$$
 *   3. **Another step:** working...
 *
 *   Answer: final value (or $LaTeX$)
 *
 *   Inline images anywhere in a step:
 *     ![diagram](/questions/topic/step2.png)
 *     [image:/questions/topic/scan.png invert]
 *
 * Prose-only solutions (no `1.` lines) are auto-split into numbered steps
 * by paragraph breaks so every topic gets the premium step-card UI.
 */

import { parseSteps, isAnswerStep, type TutorStep } from '@/lib/ai/parseSteps';
import { stripSolutionImageMarkers } from '@/lib/solution/solutionImages';

export type SolutionBlockKind = 'intro' | 'insight' | 'step' | 'answer' | 'text';

export interface SolutionBlock {
  kind: SolutionBlockKind;
  number?: number;
  title: string;
  body: string;
}

const ANSWER_TAIL =
  /(?:^|\n)\s*(?:\*\*)?Answer:?\*\*:?\s*([\s\S]+)$/i;

const NUMBERED_STEP = /^\d+\.\s/m;

function stripAnswerTail(text: string): { body: string; answer?: string } {
  const match = text.match(ANSWER_TAIL);
  if (!match || match.index === undefined) return { body: text };
  const body = text.slice(0, match.index).trim();
  const answer = match[1].trim();
  return { body, answer };
}

function tutorStepsToBlocks(steps: TutorStep[]): SolutionBlock[] {
  return steps.map((s) => {
    let kind: SolutionBlockKind = 'step';
    if (isAnswerStep(s)) kind = 'answer';
    else if (/insight/i.test(s.title)) kind = 'insight';
    else if (s.title === 'Overview') kind = 'intro';
    else if (s.number === 0) kind = 'intro';

    return {
      kind,
      number: s.number > 0 && s.number < 900 ? s.number : undefined,
      title: s.title,
      body: s.body,
    };
  });
}

function parseNumberedSteps(text: string): SolutionBlock[] {
  const blocks: SolutionBlock[] = [];
  const lines = text.split('\n');
  let introLines: string[] = [];
  let i = 0;

  while (i < lines.length && !/^\d+\.\s/.test(lines[i])) {
    introLines.push(lines[i]);
    i++;
  }

  const intro = introLines.join('\n').trim();
  if (intro) {
    const { body, answer } = stripAnswerTail(intro);
    if (body) blocks.push({ kind: 'intro', title: 'Setup', body });
    if (answer) blocks.push({ kind: 'answer', title: 'Final answer', body: answer });
  }

  while (i < lines.length) {
    const line = lines[i];
    const stepMatch = line.match(/^(\d+)\.\s+(?:\*\*(.+?)\*\*:?\s*)?(.*)$/);
    if (!stepMatch) {
      i++;
      continue;
    }

    const num = parseInt(stepMatch[1], 10);
    const title = stepMatch[2]?.trim() || `Step ${num}`;
    const chunk: string[] = [stepMatch[3] ?? ''];
    i++;

    while (i < lines.length && !/^\d+\.\s/.test(lines[i])) {
      chunk.push(lines[i]);
      i++;
    }

    const raw = chunk.join('\n').trim();
    const { body, answer } = stripAnswerTail(raw);

    if (body) {
      blocks.push({ kind: 'step', number: num, title, body });
    }
    if (answer) {
      blocks.push({ kind: 'answer', title: 'Final answer', body: answer });
    }
  }

  return blocks;
}

function parseInsightLead(text: string): { insight?: string; rest: string } {
  const match = text.match(
    /^(?:\*\*)?(?:Key\s+)?Insight:?\*\*:?\s*([\s\S]*?)(?=\n\n|\n\d+\.\s|$)/i
  );
  if (!match) return { rest: text };
  const rest = text.slice(match[0].length).trim();
  return { insight: match[1].trim(), rest };
}

function inferStepTitle(paragraph: string, index: number): string {
  const stripped = stripSolutionImageMarkers(paragraph).trim();
  const firstLine = stripped.split('\n')[0].trim();

  const boldOnly = firstLine.match(/^\*\*(.+?)\*\*:?\s*$/);
  if (boldOnly) return boldOnly[1].trim();

  if (index === 0) {
    if (firstLine.length <= 72) {
      return firstLine.replace(/\.$/, '') || 'Setup';
    }
    return 'Setup';
  }

  if (/discriminant|^d\s*=/i.test(stripped)) return 'Discriminant';
  if (/^set\s+d\s*=/i.test(stripped)) return 'Solve';
  if (/^but\s/i.test(stripped)) return 'Reject invalid cases';
  if (/^check/i.test(stripped)) return 'Verify';

  if (firstLine.length <= 56 && !/[=⟹⇒]/.test(firstLine)) {
    return firstLine.replace(/:$/, '').replace(/\.$/, '');
  }

  return `Step ${index + 1}`;
}

function formatParagraphAsStep(num: number, paragraph: string): string {
  const trimmed = paragraph.trim();

  const boldLead = trimmed.match(/^\*\*(.+?)\*\*:?\s*([\s\S]*)$/);
  if (boldLead) {
    const title = boldLead[1].trim();
    const rest = boldLead[2].trim();
    return rest ? `${num}. **${title}:** ${rest}` : `${num}. **${title}:**`;
  }

  const lines = trimmed.split('\n');
  const first = lines[0].trim();
  const colonTitle = first.match(/^(.{4,72}):\s*$/);
  if (colonTitle && lines.length > 1) {
    return `${num}. **${colonTitle[1].trim()}:**\n${lines.slice(1).join('\n')}`.trim();
  }

  const title = inferStepTitle(trimmed, num - 1);
  return `${num}. **${title}:**\n${trimmed}`;
}

/**
 * Turn paragraph-style solution prose into numbered steps so OfficialSolution
 * always renders step cards (unless already numbered or a single short blob).
 */
export function normalizeSolutionStructure(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return trimmed;
  if (NUMBERED_STEP.test(trimmed)) return trimmed;

  const { insight, rest } = parseInsightLead(trimmed);
  const work = rest || trimmed;
  const { body, answer } = stripAnswerTail(work);

  const paragraphs = body
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  if (paragraphs.length <= 1) {
    const single = paragraphs[0] ?? '';
    const listSplit = single.split(/\n(?=[-*]\s)/);
    if (listSplit.length > 1) {
      const steps = listSplit.map((p, i) => formatParagraphAsStep(i + 1, p));
      let out = steps.join('\n\n');
      if (answer) out += `\n\nAnswer: ${answer}`;
      if (insight) return `Key insight: ${insight}\n\n${out}`;
      return out;
    }
    return trimmed;
  }

  const steps = paragraphs.map((p, i) => formatParagraphAsStep(i + 1, p));
  let out = steps.join('\n\n');
  if (answer) out += `\n\nAnswer: ${answer}`;
  if (insight) return `Key insight: ${insight}\n\n${out}`;
  return out;
}

export function parseOfficialSolution(raw: string): SolutionBlock[] {
  const normalized = normalizeSolutionStructure((raw ?? '').trim());
  if (!normalized) return [];

  const stepParsed = parseSteps(normalized);
  if (
    stepParsed.length > 1 ||
    (stepParsed.length === 1 && stepParsed[0].title !== 'Solution')
  ) {
    return tutorStepsToBlocks(stepParsed);
  }

  const { insight, rest: afterInsight } = parseInsightLead(normalized);
  const blocks: SolutionBlock[] = [];

  if (insight) {
    blocks.push({ kind: 'insight', title: 'Key insight', body: insight });
  }

  const work = afterInsight || normalized;

  if (NUMBERED_STEP.test(work)) {
    blocks.push(...parseNumberedSteps(work));
  } else {
    const { body, answer } = stripAnswerTail(work);
    if (body) blocks.push({ kind: 'text', title: 'Solution', body });
    if (answer) blocks.push({ kind: 'answer', title: 'Final answer', body: answer });
  }

  if (blocks.length === 0) {
    blocks.push({ kind: 'text', title: 'Solution', body: normalized });
  }

  return blocks;
}
