/**
 * Barrel export for AI client.
 * Import from '@/lib/ai' for clean access.
 */

export { interpretSearchQuery, explainSolution } from './aiClient';
export { solveQuestion } from './solveQuestion';
export type { SolveOptions } from './solveQuestion';
export type {
  SearchResult,
  ExplanationResult,
  ExplanationStep,
  SolveResult,
  SolveMethod,
  SolveStep,
  SolveDifficulty,
} from './types';
