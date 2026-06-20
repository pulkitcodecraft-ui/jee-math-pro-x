import type { Difficulty, McqOption, QuestionFormat } from '@/types/question';

/** One official solution attached to a bulk question. */
export interface BulkApproachSeed {
  id?: string;
  label: string;
  content: string;
  imageUrl?: string;
  images?: string[];
}

/**
 * One question entry in a topic bulk JSON file (`topics/<slug>/questions.json`).
 */
export interface BulkQuestionSeed {
  id: string;
  subtopicId: string;
  difficulty: Difficulty;
  format?: QuestionFormat;
  statement: string;
  options?: Partial<Record<McqOption, string>>;
  correctOption?: McqOption;
  correctOptions?: McqOption[];
  images?: string[];
  commonMistakes?: string[];
  commonTraps?: string[];
  approaches: BulkApproachSeed[];
  /** Set automatically when nested under a passage */
  passageId?: string;
  passageOrder?: number;
  passageLabel?: string;
}

/**
 * Paragraph / passage block — shared stem + multiple linked MCQs (JEE workbook style).
 */
export interface BulkPassageSeed {
  id: string;
  title?: string;
  passage: string;
  subtopicId: string;
  difficulty: Difficulty;
  images?: string[];
  questions: Array<
    Omit<BulkQuestionSeed, 'subtopicId' | 'difficulty'> &
      Partial<Pick<BulkQuestionSeed, 'subtopicId' | 'difficulty'>>
  >;
}

export interface TopicBulkPack {
  topicId: string;
  /** Standalone questions */
  questions?: BulkQuestionSeed[];
  /** Paragraph-type groups */
  passages?: BulkPassageSeed[];
}
