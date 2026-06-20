/**
 * Shared Firebase AI Logic (Vertex AI) setup.
 *
 * Both the multi-method solver and the multimodal file extractor use this so
 * there is a single source of truth for the backend, location, and model.
 *
 * Vertex AI bills against the Google Cloud project (covered by GCP credits).
 * Gemini 3.x/3.5 models are served from the `global` location — regional
 * endpoints like us-central1 return 404 for these models.
 */

import { getAI, VertexAIBackend, type AI } from 'firebase/ai';
import { app } from '@/lib/firebase';

export const VERTEX_LOCATION = 'global';
export const FLASH_MODEL = 'gemini-3.5-flash';

let cachedAI: AI | null = null;

export function getVertexAI(): AI {
  if (!cachedAI) {
    cachedAI = getAI(app, { backend: new VertexAIBackend(VERTEX_LOCATION) });
  }
  return cachedAI;
}
