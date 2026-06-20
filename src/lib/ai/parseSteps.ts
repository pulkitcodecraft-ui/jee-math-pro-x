/**
 * Turns a tutor reply into structured steps so the UI can render each one as
 * its own card.
 *
 * The model is instructed (see explainSolution.ts) to format step-by-step
 * solutions as `STEP N: <title>` blocks, but older / free-text replies use
 * `[Step N]` inline labels or no labels at all. This parser handles all three
 * gracefully and never drops content: anything that doesn't match a step
 * pattern falls back to a single "Solution" card.
 */

export interface TutorStep {
  number: number;
  title: string;
  body: string;
}

// `STEP 1: Title` ... up to the next `STEP n:` or end of string.
const STEP_LINE = /STEP\s+(\d+)\s*[:.\-]\s*(.*?)\n([\s\S]*?)(?=STEP\s+\d+\s*[:.\-]|$)/gi;

// Inline `[Step 1]` / `[Answer]` markers used by the legacy prompt.
const BRACKET_MARK = /\[\s*(step\s*\d+|answer|final\s*answer)\s*\]/gi;

function fromStepLines(raw: string): TutorStep[] {
  const steps: TutorStep[] = [];
  let match: RegExpExecArray | null;
  STEP_LINE.lastIndex = 0;
  while ((match = STEP_LINE.exec(raw)) !== null) {
    steps.push({
      number: parseInt(match[1], 10),
      title: match[2].trim() || `Step ${match[1]}`,
      body: match[3].trim(),
    });
  }
  return steps;
}

function fromBracketMarks(raw: string): TutorStep[] {
  const steps: TutorStep[] = [];
  const marks = [...raw.matchAll(BRACKET_MARK)];
  if (marks.length === 0) return steps;

  // Capture any text before the first marker as an intro step.
  const intro = raw.slice(0, marks[0].index).trim();
  if (intro) steps.push({ number: 0, title: 'Overview', body: intro });

  marks.forEach((m, i) => {
    const label = m[1].replace(/\s+/g, ' ').trim();
    const start = (m.index ?? 0) + m[0].length;
    const end = i + 1 < marks.length ? marks[i + 1].index : raw.length;
    const body = raw.slice(start, end).trim();
    const isAnswer = /answer/i.test(label);
    const title = isAnswer
      ? 'Answer'
      : label.replace(/step\s*/i, 'Step ');
    steps.push({ number: isAnswer ? 999 : i + 1, title, body });
  });

  return steps;
}

export function parseSteps(raw: string): TutorStep[] {
  const text = (raw ?? '').trim();
  if (!text) return [];

  const stepLine = fromStepLines(text);
  if (stepLine.length > 0) return stepLine;

  const bracket = fromBracketMarks(text);
  if (bracket.length > 0) return bracket;

  // Nothing matched — keep the whole reply visible as one card.
  return [{ number: 1, title: 'Solution', body: text }];
}

/** True when a step holds the final answer (gets the highlighted card style). */
export function isAnswerStep(step: TutorStep): boolean {
  return /answer/i.test(step.title);
}
