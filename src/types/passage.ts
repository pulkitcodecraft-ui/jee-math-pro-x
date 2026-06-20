import type { Difficulty } from '@/types/question';

/**
 * Shared stem for JEE "Paragraph" / "Passage" type blocks.
 * Multiple questions link via `passageId` on Question.
 */
export interface QuestionPassage {
  id: string;
  topicId: string;
  title?: string;
  passage: string;
  subtopicId: string;
  difficulty: Difficulty;
  /** Workbook / diagram scans for the paragraph stem */
  images?: string[];
}
