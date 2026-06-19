/**
 * Type definitions for the AI client abstraction layer.
 *
 * These types define the contracts for the mocked AI functions.
 * When a real AI API is integrated later, only the function bodies
 * in aiClient.ts need to change — the types and UI stay the same.
 */

export interface SearchResult {
  /** The matched topic name */
  topic: string;
  /** The matched subtopic name, if any */
  subtopic: string | null;
  /** Suggested difficulty level */
  difficultyLevel: 'easy' | 'medium' | 'hard' | 'advanced' | null;
  /** A list of clickable option labels for the user */
  suggestedOptions: string[];
}

export interface ExplanationStep {
  /** Step number (1-indexed) */
  stepNumber: number;
  /** Title/summary of this step */
  title: string;
  /** Detailed explanation of this step */
  content: string;
}

export interface ExplanationResult {
  /** The original question that was explained */
  question: string;
  /** Ordered list of explanation steps */
  steps: ExplanationStep[];
  /** Optional summary/takeaway */
  summary?: string;
}
