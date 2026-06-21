/**
 * Firestore data model for Questions.
 *
 * Each question is tied to a topic and subtopic, has a difficulty level,
 * and references approaches by ID. Common mistakes and traps are stored
 * as string arrays for flexibility.
 */

export type Difficulty = 'easy' | 'medium' | 'hard' | 'advanced';

/** MCQ option label — matches SRG / JEE workbook style (A–D). */
export type McqOption = 'A' | 'B' | 'C' | 'D';

export type QuestionFormat = 'subjective' | 'mcq' | 'paragraph-mcq' | 'numerical';

export interface Question {
  id: string;
  topicId: string;
  subtopicId: string;
  difficulty: Difficulty;
  /** subjective = worked problem; mcq = four options; paragraph-mcq = MCQ under a shared passage */
  format?: QuestionFormat;
  statement: string;
  /** Links to a QuestionPassage — passage text is shown above this question */
  passageId?: string;
  /** Order within the passage block (1, 2, …) */
  passageOrder?: number;
  /** Workbook label shown in lists, e.g. "5" or "Q5" */
  passageLabel?: string;
  /** Optional figure(s)/diagram(s) for the question (Firebase Storage URLs or /public paths). */
  images?: string[];
  /**
   * MCQ options (A–D). Use Unicode for math, e.g. a², log₂x.
   * For full-page PDF crops, put the scan in `images` and keep options empty.
   */
  options?: Partial<Record<McqOption, string>>;
  /** Correct option for single-correct MCQs — shown as "Ans. (B)" style on the question page. */
  correctOption?: McqOption;
  /** Multiple correct options (e.g. workbook "Ans. (A, B, C)"). Takes precedence over correctOption when set. */
  correctOptions?: McqOption[];
  /** Numeric / integer answer for numerical-type questions */
  correctAnswer?: string;
  approaches: string[];
  commonMistakes: string[];
  commonTraps: string[];
  createdAt: Date;
  updatedAt: Date;
}
