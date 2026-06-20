/**
 * Smart homepage-search intent classifier.
 *
 * A fast, lightweight Gemini Flash call (via the shared Vertex AI setup) that
 * decides whether a raw search input is a TOPIC_SEARCH (browse/learn a topic)
 * or a DOUBT_SOLVE (an actual problem to solve), normalises/auto-corrects the
 * text, and reports a confidence score.
 *
 * Deliberately kept lean for speed: NO `thinkingLevel` (this is just intent
 * detection, not the heavy reasoning that the Doubt Solver does), and a tiny
 * JSON schema. Works in English, Hindi, Hinglish, and with typos.
 */

import { getGenerativeModel, Schema } from 'firebase/ai';
import { getVertexAI, FLASH_MODEL } from './vertex';

export type SearchIntent = 'TOPIC_SEARCH' | 'DOUBT_SOLVE';

export interface SearchClassification {
  intent: SearchIntent;
  normalized_query: string;
  confidence: number;
}

const SYSTEM_INSTRUCTION = `You are an intent classifier for a JEE math platform. Given a user's raw search input (which may be in English, Hindi, Hinglish, or contain typos/grammar errors), classify it as one of:
- TOPIC_SEARCH: they want to browse/learn a topic (e.g. "probability", "functions ka chapter", "integration", "trigonometry seekhni hai").
- DOUBT_SOLVE: they have a specific question/problem to solve (e.g. contains an actual math expression or equation, "how to solve", "is sawaal ka answer", a "?", or problem-like phrasing such as "find the value of...", "solve x^2-5x+6=0").

Also correct and normalize the input text:
- For TOPIC_SEARCH, normalized_query should be the clean topic name (e.g. "probabilty" -> "Probability").
- For DOUBT_SOLVE, normalized_query should be the cleaned, well-formed problem statement (fix typos/grammar, keep the math intact).

confidence is a number from 0 to 1 reflecting how sure you are of the intent. Use a low value (< 0.6) when the input is genuinely ambiguous.

Respond ONLY with valid JSON matching the schema. No markdown fences, no commentary.`;

const responseSchema = Schema.object({
  properties: {
    intent: Schema.enumString({ enum: ['TOPIC_SEARCH', 'DOUBT_SOLVE'] }),
    normalized_query: Schema.string(),
    confidence: Schema.number(),
  },
});

let cachedModel: ReturnType<typeof getGenerativeModel> | null = null;

function getClassifierModel() {
  if (cachedModel) return cachedModel;
  cachedModel = getGenerativeModel(getVertexAI(), {
    model: FLASH_MODEL,
    systemInstruction: SYSTEM_INSTRUCTION,
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema,
    },
  });
  return cachedModel;
}

/**
 * Classify a raw search query into an intent + normalized text + confidence.
 * Throws on failure so the caller can apply its own fallback (treat as topic).
 */
export async function classifySearch(raw: string): Promise<SearchClassification> {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { intent: 'TOPIC_SEARCH', normalized_query: '', confidence: 1 };
  }

  const model = getClassifierModel();
  const result = await model.generateContent(`User search input: "${trimmed}"`);
  const data = JSON.parse(result.response.text()) as Partial<SearchClassification>;

  const intent: SearchIntent = data.intent === 'DOUBT_SOLVE' ? 'DOUBT_SOLVE' : 'TOPIC_SEARCH';
  const normalized_query =
    typeof data.normalized_query === 'string' && data.normalized_query.trim()
      ? data.normalized_query.trim()
      : trimmed;
  const confidence =
    typeof data.confidence === 'number' && data.confidence >= 0 && data.confidence <= 1
      ? data.confidence
      : 0.5;

  return { intent, normalized_query, confidence };
}
