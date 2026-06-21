/**
 * Parses structured key_insight / common_mistake strings from the solver.
 * The model emits labeled lines (PUNCHLINE, WHY, EXAM SAVE, TRAP, FIX).
 * Falls back to treating the whole string as body text for older cached responses.
 */

export interface ParsedKeyInsight {
  punchline: string | null;
  why: string | null;
  examSave: string | null;
  /** Full text when no labels were found */
  fallback: string | null;
}

export interface ParsedCommonMistake {
  trap: string | null;
  fix: string | null;
  fallback: string | null;
}

type FieldKey = 'punchline' | 'why' | 'examSave' | 'trap' | 'fix';

const FIELD_PATTERNS: Record<FieldKey, RegExp> = {
  punchline: /^PUNCHLINE\s*:\s*/i,
  why: /^WHY\s*:\s*/i,
  examSave: /^EXAM\s*SAVE\s*:\s*/i,
  trap: /^TRAP\s*:\s*/i,
  fix: /^FIX\s*:\s*/i,
};

function parseLabeledText(
  text: string,
  fields: FieldKey[]
): { values: Partial<Record<FieldKey, string>>; hasLabels: boolean } {
  const values: Partial<Record<FieldKey, string>> = {};
  let hasLabels = false;
  const trimmed = text.trim();
  if (!trimmed) return { values, hasLabels };

  let current: FieldKey | null = null;
  const buffers: Partial<Record<FieldKey, string[]>> = {};

  for (const line of trimmed.split('\n')) {
    let matched = false;
    for (const field of fields) {
      const match = line.match(FIELD_PATTERNS[field]);
      if (match) {
        current = field;
        matched = true;
        hasLabels = true;
        const rest = line.slice(match[0].length).trim();
        if (rest) {
          buffers[field] = buffers[field] ?? [];
          buffers[field]!.push(rest);
        }
        break;
      }
    }
    if (!matched && current) {
      buffers[current] = buffers[current] ?? [];
      buffers[current]!.push(line);
    }
  }

  for (const field of fields) {
    const joined = buffers[field]?.join('\n').trim();
    if (joined) values[field] = joined;
  }

  return { values, hasLabels };
}

export function parseKeyInsight(text: string): ParsedKeyInsight {
  const { values, hasLabels } = parseLabeledText(text, ['punchline', 'why', 'examSave']);
  if (!hasLabels) {
    return {
      punchline: null,
      why: null,
      examSave: null,
      fallback: text.trim() || null,
    };
  }
  return {
    punchline: values.punchline ?? null,
    why: values.why ?? null,
    examSave: values.examSave ?? null,
    fallback: null,
  };
}

export function parseCommonMistake(text: string): ParsedCommonMistake {
  const { values, hasLabels } = parseLabeledText(text, ['trap', 'fix']);
  if (!hasLabels) {
    return {
      trap: null,
      fix: null,
      fallback: text.trim() || null,
    };
  }
  return {
    trap: values.trap ?? null,
    fix: values.fix ?? null,
    fallback: null,
  };
}

/** Formats parsed insight for markdown export / copy. */
export function formatKeyInsightForExport(text: string): string {
  const p = parseKeyInsight(text);
  if (p.fallback) return p.fallback;
  const lines: string[] = [];
  if (p.punchline) lines.push(`**Punchline:** ${p.punchline}`);
  if (p.why) lines.push(`**Why:** ${p.why}`);
  if (p.examSave) lines.push(`**Exam save:** ${p.examSave}`);
  return lines.join('\n');
}

export function formatMistakeForExport(text: string): string {
  const p = parseCommonMistake(text);
  if (p.fallback) return p.fallback;
  const lines: string[] = [];
  if (p.trap) lines.push(`**Trap:** ${p.trap}`);
  if (p.fix) lines.push(`**Fix:** ${p.fix}`);
  return lines.join('\n');
}
