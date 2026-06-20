/**
 * Friendly Hinglish "AI Tutor" explainer.
 *
 * Reuses the existing Firebase Vertex AI setup (getVertexAI from vertex.ts) and
 * follows the same multimodal pattern as extractFromFile.ts: when an image is
 * present we send [{ text }, { inlineData }], otherwise plain text.
 *
 * Note on the model: the spec mentioned "gemini-2.5-flash (same as codebase)",
 * but the codebase's shared model constant is FLASH_MODEL ('gemini-3.5-flash').
 * We reuse FLASH_MODEL so this stays consistent with solveQuestion.ts /
 * extractFromFile.ts and works against the model actually enabled on the project.
 */

import { getGenerativeModel } from 'firebase/ai';
import { getVertexAI, FLASH_MODEL } from './vertex';

const SYSTEM_INSTRUCTION = `You are a friendly JEE Math tutor. Explain in Hinglish (Hindi + English mix). Be encouraging and friendly. If a diagram is provided, describe it first then connect to the solution.

MATH FORMATTING (very important — the UI renders LaTeX):
- ALWAYS wrap every mathematical expression in LaTeX delimiters.
  Inline math: $...$  (e.g. "probability is $\\frac{4}{7}$").
  Standalone equations: $$...$$ on their own line.
- Use \\frac{a}{b} for fractions, ^{...} for exponents, _{...} for subscripts,
  \\sqrt{...} for roots, \\binom{n}{k} for combinations.
- NEVER write a fraction as a/b in plain text — always use \\frac.
- NEVER write an exponent like a^2 outside math delimiters — wrap it as $a^2$.

STEP STRUCTURE (the UI renders each step as its own card):
Format a step-by-step solution as numbered steps using EXACTLY this format:

STEP 1: <short title>
<one-idea explanation in Hinglish>
$$<key equation for this step, if any>$$

STEP 2: <short title>
...

Keep each step focused on ONE idea (each step 1-2 short lines). Put the final
numeric/symbolic result in its own last step titled exactly "Answer".
For a quick conversational follow-up (not a full solution), you may answer in
2-3 plain Hinglish lines without the STEP format, still wrapping any math in $...$.`;

let cachedModel: ReturnType<typeof getGenerativeModel> | null = null;

function getExplainModel() {
  if (cachedModel) return cachedModel;
  cachedModel = getGenerativeModel(getVertexAI(), {
    model: FLASH_MODEL,
    systemInstruction: SYSTEM_INSTRUCTION,
  });
  return cachedModel;
}

/** A single prior turn in the tutor conversation, for follow-up context. */
export interface ExplainTurn {
  role: 'tutor' | 'student';
  text: string;
}

function buildPrompt(
  questionText: string,
  solutionText: string,
  hasImage: boolean,
  userMessage?: string,
  history?: ExplainTurn[]
): string {
  let prompt = `QUESTION:\n${questionText.trim()}`;

  if (solutionText && solutionText.trim().length > 0) {
    prompt += `\n\nSOLUTION:\n${solutionText.trim()}`;
  }

  if (hasImage) {
    prompt += `\n\nA diagram/image is attached — describe it briefly first, then connect it to the solution.`;
  }

  if (history && history.length > 0) {
    const convo = history
      .map((t) => `${t.role === 'tutor' ? 'Tutor' : 'Student'}: ${t.text}`)
      .join('\n');
    prompt += `\n\nCONVERSATION SO FAR:\n${convo}`;
  }

  if (userMessage && userMessage.trim().length > 0) {
    prompt += `\n\nThe student now asks: "${userMessage.trim()}". Answer this specifically and briefly in Hinglish.`;
  } else {
    prompt += `\n\nExplain this solution step by step in friendly Hinglish.`;
  }

  return prompt;
}

/**
 * Explain a solution in friendly Hinglish.
 *
 * @param questionText   The math question being explained.
 * @param solutionText   The worked solution to explain.
 * @param imageBase64     Optional base64 image data (no data: prefix).
 * @param imageMimeType   Optional mime type for the image.
 * @param userMessage     Optional follow-up question from the student.
 * @param history         Optional prior conversation turns for context.
 * @returns The tutor's reply as a plain text string.
 */
export async function explainSolution(
  questionText: string,
  solutionText: string,
  imageBase64?: string,
  imageMimeType?: string,
  userMessage?: string,
  history?: ExplainTurn[]
): Promise<string> {
  const model = getExplainModel();
  const hasImage = Boolean(imageBase64 && imageMimeType);
  const prompt = buildPrompt(questionText, solutionText, hasImage, userMessage, history);

  const result = hasImage
    ? await model.generateContent([
        { text: prompt },
        { inlineData: { mimeType: imageMimeType as string, data: imageBase64 as string } },
      ])
    : await model.generateContent(prompt);

  return result.response.text().trim();
}
