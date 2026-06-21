/**
 * Gemini-powered JEE math solver.
 *
 * Uses Firebase AI Logic (the `firebase/ai` module) to call the Gemini
 * Developer API directly from the client. No API key is added here — it
 * reuses the existing Firebase app configuration.
 *
 * The model is asked to solve the question itself (optionally cross-checking
 * a student-provided solution) and to return ALL reasonable solving methods
 * as structured JSON matching `SolveResult`.
 */

import {
  getGenerativeModel,
  Schema,
  ThinkingLevel,
} from 'firebase/ai';
import { getVertexAI, FLASH_MODEL } from './vertex';
import type { SolveResult } from './types';

/**
 * Current GA flash model (verified against ai.google.dev changelog, mid-2026).
 * Gemini 3.5 Flash supports thinking *levels* (high/low), which we set to
 * "high" because these are exam-level reasoning problems.
 */
const MODEL_NAME = FLASH_MODEL;

const SYSTEM_INSTRUCTION = `You are an expert JEE (IIT-JEE / JEE Advanced) mathematics mentor.

You will receive a QUESTION, and optionally a SOLUTION the student already has (for cross-checking only — ignore it if absent, and never just repeat it instead of solving yourself).

Solve the question completely yourself. If the question can reasonably be solved by more than one standard method (e.g. algebraic vs graphical, substitution vs elimination, direct vs calculus-based), explain ALL reasonable methods as separate entries — not just one. If genuinely only one sensible method exists, return a single method.

For each method:
- Break it into clear, focused steps (one idea per step).
- In explanation: show the math/work for THIS step only — complete enough that a student never has to guess the next line.
- State which method is fastest/safest under exam time pressure (best_for).

Mark the single best method for exam conditions via recommended_method_index.

Use LaTeX for ALL mathematical notation: inline as \\( ... \\), display/block as \\[ ... \\].

── KEY INSIGHT (required for EVERY step) ──
Fill key_insight using EXACTLY these labeled lines (keep the labels verbatim):

PUNCHLINE: One crisp "aha" line — the single idea that makes this step click (max ~15 words).
WHY: 1–2 pinpoint sentences on why this step is mathematically valid. No repetition of the explanation.
EXAM SAVE: One concrete JEE time-saving trick for this step (omit the entire EXAM SAVE line only if there is genuinely no shortcut).

── COMMON MISTAKE (when a real trap exists at this step) ──
Set common_mistake to null only when there is no meaningful trap. Otherwise use EXACTLY:

TRAP: What students typically do wrong here — be specific to this step.
FIX: One actionable sentence — the correct habit, check, or rewrite rule.

Rules for insight/mistake fields:
- Never copy the explanation verbatim.
- Be pinpoint and time-saving — student should get full value without re-reading the step.
- Use LaTeX in all fields.
- Every step MUST have a non-empty key_insight.

Return ONLY valid JSON matching the given schema. No markdown fences, no commentary, no text outside the JSON.`;

const responseSchema = Schema.object({
  properties: {
    topic: Schema.string(),
    difficulty: Schema.enumString({ enum: ['Easy', 'Medium', 'Hard'] }),
    methods: Schema.array({
      items: Schema.object({
        properties: {
          method_name: Schema.string(),
          best_for: Schema.string(),
          steps: Schema.array({
            items: Schema.object({
              properties: {
                step_number: Schema.integer(),
                title: Schema.string(),
                explanation: Schema.string(),
                key_insight: Schema.string(),
                common_mistake: Schema.string({ nullable: true }),
              },
              optionalProperties: ['common_mistake'],
            }),
          }),
          final_answer: Schema.string(),
        },
      }),
    }),
    recommended_method_index: Schema.integer(),
    exam_tip: Schema.string({ nullable: true }),
  },
  optionalProperties: ['exam_tip'],
});

let cachedModel: ReturnType<typeof getGenerativeModel> | null = null;

function getModel() {
  if (cachedModel) return cachedModel;
  const ai = getVertexAI();
  cachedModel = getGenerativeModel(ai, {
    model: MODEL_NAME,
    systemInstruction: SYSTEM_INSTRUCTION,
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema,
      thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
    },
  });
  return cachedModel;
}

function buildPrompt(question: string, solution?: string, topicContext?: string): string {
  let prompt = `QUESTION:\n${question.trim()}`;
  if (solution && solution.trim().length > 0) {
    prompt +=
      `\n\nSOLUTION (for verification only — solve it yourself and use this only ` +
      `to cross-check; do not just echo it, and correct it if it is wrong):\n${solution.trim()}`;
  }
  if (topicContext && topicContext.trim().length > 0) {
    prompt += `\n\nTopic context: ${topicContext.trim()} — calibrate difficulty and method choice accordingly.`;
  }
  return prompt;
}

/* ── In-memory + localStorage cache, keyed on a hash of the question ─────── */

const CACHE_PREFIX = 'jee-solve:v2:';
const memoryCache = new Map<string, SolveResult>();

/** Small, fast, non-cryptographic string hash (djb2). */
function hashQuestion(question: string, solution?: string): string {
  const input = `${question.trim()}|${(solution ?? '').trim()}`;
  let h = 5381;
  for (let i = 0; i < input.length; i++) {
    h = (h * 33) ^ input.charCodeAt(i);
  }
  return (h >>> 0).toString(36);
}

function readCache(key: string): SolveResult | null {
  if (memoryCache.has(key)) return memoryCache.get(key)!;
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SolveResult;
    memoryCache.set(key, parsed);
    return parsed;
  } catch {
    return null;
  }
}

function writeCache(key: string, value: SolveResult): void {
  memoryCache.set(key, value);
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(value));
  } catch {
    /* storage full / unavailable — in-memory cache still works */
  }
}

/* ── Validation of the parsed model output ───────────────────────────────── */

function isValidSolveResult(data: unknown): data is SolveResult {
  if (!data || typeof data !== 'object') return false;
  const d = data as Record<string, unknown>;
  if (typeof d.topic !== 'string') return false;
  if (!Array.isArray(d.methods) || d.methods.length === 0) return false;
  if (typeof d.recommended_method_index !== 'number') return false;
  return d.methods.every((m) => {
    const method = m as Record<string, unknown>;
    return (
      typeof method.method_name === 'string' &&
      Array.isArray(method.steps) &&
      typeof method.final_answer === 'string'
    );
  });
}

export interface SolveOptions {
  /** Bypass the cache and force a fresh model call (used by "Regenerate"). */
  forceRefresh?: boolean;
  /** Active syllabus topic, appended as extra context to anchor the model. */
  topicContext?: string;
}

/**
 * Solves a JEE math question with Gemini, returning structured multi-method
 * output. Retries once if the first response isn't valid JSON, then throws.
 */
export async function solveQuestion(
  question: string,
  solution?: string,
  options: SolveOptions = {}
): Promise<SolveResult> {
  const trimmedQuestion = question.trim();
  if (!trimmedQuestion) {
    throw new Error('A question is required.');
  }

  const cacheKey = hashQuestion(trimmedQuestion, `${solution ?? ''}|${options.topicContext ?? ''}`);
  if (!options.forceRefresh) {
    const cached = readCache(cacheKey);
    if (cached) return cached;
  }

  const model = getModel();
  const basePrompt = buildPrompt(trimmedQuestion, solution, options.topicContext);

  let lastError: unknown = null;

  for (let attempt = 0; attempt < 2; attempt++) {
    const prompt =
      attempt === 0
        ? basePrompt
        : `${basePrompt}\n\nYour last response was invalid JSON — return ONLY valid JSON matching the schema.`;

    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const data = JSON.parse(text);
      if (!isValidSolveResult(data)) {
        throw new Error('Response did not match the expected schema.');
      }
      // Clamp the recommended index into valid range defensively.
      if (
        data.recommended_method_index < 0 ||
        data.recommended_method_index >= data.methods.length
      ) {
        data.recommended_method_index = 0;
      }
      writeCache(cacheKey, data);
      return data;
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error('Failed to solve the question.');
}
