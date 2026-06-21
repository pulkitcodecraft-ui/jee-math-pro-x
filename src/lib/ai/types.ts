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

/* ──────────────────────────────────────────────────────────────────────────
 * Gemini-powered multi-method solver (used by the /explain page).
 * The shape mirrors the JSON response schema sent to the model.
 * ──────────────────────────────────────────────────────────────────────── */

export type SolveDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface SolveStep {
  /** 1-indexed step number within a method */
  step_number: number;
  /** Short title of the step */
  title: string;
  /** Detailed explanation; LaTeX inline as \( ... \), display as \[ ... \] */
  explanation: string;
  /** The "why this works" insight — structured with PUNCHLINE / WHY / EXAM SAVE labels */
  key_insight: string;
  /** Trap + fix for this step (TRAP / FIX labels), or null if none */
  common_mistake: string | null;
}

export interface SolveMethod {
  /** e.g. "Direct Substitution", "Graphical Approach" */
  method_name: string;
  /** e.g. "Fastest for MCQs", "Best for building intuition" */
  best_for: string;
  /** Ordered solving steps for this method */
  steps: SolveStep[];
  /** The final answer, in LaTeX */
  final_answer: string;
}

export interface SolveResult {
  /** Detected topic of the question */
  topic: string;
  /** Difficulty estimate */
  difficulty: SolveDifficulty;
  /** One entry per reasonable solving method */
  methods: SolveMethod[];
  /** Index into `methods` of the best method under exam conditions */
  recommended_method_index: number;
  /** Optional exam-strategy tip, or null */
  exam_tip: string | null;
}
