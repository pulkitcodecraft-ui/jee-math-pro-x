/**
 * Firestore data model for Questions.
 *
 * Each question is tied to a topic and subtopic, has a difficulty level,
 * and references approaches by ID. Common mistakes and traps are stored
 * as string arrays for flexibility.
 */

export type Difficulty = 'easy' | 'medium' | 'hard' | 'advanced';

export interface Question {
  id: string;
  topicId: string;
  subtopicId: string;
  difficulty: Difficulty;
  statement: string;
  /** Array of Approach document IDs */
  approaches: string[];
  commonMistakes: string[];
  commonTraps: string[];
  createdAt: Date;
  updatedAt: Date;
}
