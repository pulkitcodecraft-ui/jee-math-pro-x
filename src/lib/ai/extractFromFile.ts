/**
 * Multimodal OCR / problem extraction via Vertex AI (Gemini vision).
 *
 * Sends an uploaded image or PDF to Gemini as inline data and asks it to
 * pull out the math question (and a handwritten solution, if present),
 * preserving notation as LaTeX. Used by the "Extract & Fill" action.
 */

import { getGenerativeModel, Schema } from 'firebase/ai';
import { getVertexAI, FLASH_MODEL } from './vertex';

export interface ExtractedProblem {
  question: string;
  solution: string;
}

const EXTRACTION_PROMPT =
  'Extract the math question and solution (if present) from this file. ' +
  'Return the question text and solution text separately. If no solution is ' +
  'shown, return an empty string for solution. Preserve mathematical notation ' +
  'as LaTeX where appropriate (inline as \\( ... \\), display as \\[ ... \\]). ' +
  'Return ONLY valid JSON matching the schema — no markdown fences or commentary.';

const responseSchema = Schema.object({
  properties: {
    question: Schema.string(),
    solution: Schema.string(),
  },
});

let cachedModel: ReturnType<typeof getGenerativeModel> | null = null;

function getExtractionModel() {
  if (cachedModel) return cachedModel;
  cachedModel = getGenerativeModel(getVertexAI(), {
    model: FLASH_MODEL,
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema,
    },
  });
  return cachedModel;
}

/** Read a File as a base64 string (without the data: prefix). */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== 'string') {
        reject(new Error('Could not read file.'));
        return;
      }
      // result is "data:<mime>;base64,<data>" — strip the prefix.
      const comma = result.indexOf(',');
      resolve(comma >= 0 ? result.slice(comma + 1) : result);
    };
    reader.onerror = () => reject(reader.error ?? new Error('Could not read file.'));
    reader.readAsDataURL(file);
  });
}

/**
 * Extract a question (and optional solution) from an image/PDF file.
 * Throws on failure so callers can show an error state.
 */
export async function extractFromFile(file: File): Promise<ExtractedProblem> {
  const base64 = await fileToBase64(file);
  const model = getExtractionModel();

  const result = await model.generateContent([
    { text: EXTRACTION_PROMPT },
    { inlineData: { mimeType: file.type, data: base64 } },
  ]);

  const text = result.response.text();
  const parsed = JSON.parse(text) as Partial<ExtractedProblem>;
  return {
    question: typeof parsed.question === 'string' ? parsed.question : '',
    solution: typeof parsed.solution === 'string' ? parsed.solution : '',
  };
}
