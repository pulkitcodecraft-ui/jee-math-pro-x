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

const SYSTEM_INSTRUCTION = `You are a friendly JEE Math tutor. Explain in Hinglish (Hindi + English mix). Keep responses 3-5 lines. Label steps as [Step 1][Step 2] etc. If a diagram is provided, describe it first then connect to solution. Be encouraging and friendly.`;

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
