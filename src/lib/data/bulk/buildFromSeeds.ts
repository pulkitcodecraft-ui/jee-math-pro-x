import type { QuestionPassage } from '@/types/passage';
import type { Approach } from '@/types/approach';
import type { Question } from '@/types/question';
import { enrichApproachContent, enrichMathText } from '@/lib/data/mathLatex';
import type {
  BulkPassageSeed,
  BulkQuestionSeed,
  TopicBulkPack,
} from './types';

const DEFAULT_DATE = new Date('2026-06-20');

export interface BuiltTopicBulk {
  questions: Question[];
  approaches: Approach[];
  passages: QuestionPassage[];
}

function assertQuestionSeed(seed: BulkQuestionSeed, label: string): void {
  if (!seed.id?.trim()) throw new Error(`${label}: missing id`);
  if (!seed.statement?.trim()) throw new Error(`${label}: missing statement`);
  if (!seed.subtopicId?.trim()) throw new Error(`${label}: missing subtopicId`);
  if (!seed.difficulty) throw new Error(`${label}: missing difficulty`);
  if (!seed.approaches?.length) throw new Error(`${label}: needs at least one approach`);
}

function pushQuestion(
  seed: BulkQuestionSeed,
  topicId: string,
  questions: Question[],
  approaches: Approach[],
  seenQuestionIds: Set<string>,
  seenApproachIds: Set<string>
): void {
  const label = `Question ${seed.id}`;
  assertQuestionSeed(seed, label);

  if (seenQuestionIds.has(seed.id)) {
    throw new Error(`Duplicate question id: ${seed.id}`);
  }
  seenQuestionIds.add(seed.id);

  const approachIds: string[] = [];

  seed.approaches.forEach((a, aIndex) => {
    const approachId = a.id?.trim() || `${seed.id}-a${aIndex + 1}`;
    if (seenApproachIds.has(approachId)) {
      throw new Error(`Duplicate approach id: ${approachId}`);
    }
    seenApproachIds.add(approachId);
    approachIds.push(approachId);

    approaches.push({
      id: approachId,
      questionId: seed.id,
      label: a.label,
      content: enrichApproachContent(a.content),
      status: 'official',
      submittedBy: 'admin',
      imageUrl: a.imageUrl,
      images: a.images,
      createdAt: DEFAULT_DATE,
      updatedAt: DEFAULT_DATE,
    });
  });

  questions.push({
    id: seed.id,
    topicId,
    subtopicId: seed.subtopicId,
    difficulty: seed.difficulty,
    format: seed.format ?? (seed.passageId ? 'paragraph-mcq' : undefined),
    statement: enrichMathText(seed.statement),
    passageId: seed.passageId,
    passageOrder: seed.passageOrder,
    passageLabel: seed.passageLabel,
    options: seed.options,
    correctOption: seed.correctOption,
    correctOptions: seed.correctOptions,
    correctAnswer: seed.correctAnswer,
    images: seed.images,
    approaches: approachIds,
    commonMistakes: seed.commonMistakes ?? [],
    commonTraps: seed.commonTraps ?? [],
    createdAt: DEFAULT_DATE,
    updatedAt: DEFAULT_DATE,
  });
}

function buildPassage(
  passageSeed: BulkPassageSeed,
  topicId: string,
  index: number,
  questions: Question[],
  approaches: Approach[],
  passages: QuestionPassage[],
  seenPassageIds: Set<string>,
  seenQuestionIds: Set<string>,
  seenApproachIds: Set<string>
): void {
  const label = `Passage ${passageSeed.id ?? index}`;
  if (!passageSeed.id?.trim()) throw new Error(`${label}: missing id`);
  if (!passageSeed.passage?.trim()) throw new Error(`${label}: missing passage`);
  if (!passageSeed.subtopicId?.trim()) throw new Error(`${label}: missing subtopicId`);
  if (!passageSeed.difficulty) throw new Error(`${label}: missing difficulty`);
  if (!passageSeed.questions?.length) throw new Error(`${label}: needs questions[]`);

  if (seenPassageIds.has(passageSeed.id)) {
    throw new Error(`Duplicate passage id: ${passageSeed.id}`);
  }
  seenPassageIds.add(passageSeed.id);

  passages.push({
    id: passageSeed.id,
    topicId,
    title: passageSeed.title ?? 'Paragraph',
    passage: enrichMathText(passageSeed.passage),
    subtopicId: passageSeed.subtopicId,
    difficulty: passageSeed.difficulty,
    images: passageSeed.images,
  });

  passageSeed.questions.forEach((sub, subIndex) => {
    const order = sub.passageOrder ?? subIndex + 1;
    const fullSeed: BulkQuestionSeed = {
      ...sub,
      subtopicId: sub.subtopicId ?? passageSeed.subtopicId,
      difficulty: sub.difficulty ?? passageSeed.difficulty,
      format: sub.format ?? 'paragraph-mcq',
      passageId: passageSeed.id,
      passageOrder: order,
      passageLabel: sub.passageLabel ?? String(order),
      approaches: sub.approaches,
      id: sub.id,
      statement: sub.statement,
    };
    pushQuestion(
      fullSeed,
      topicId,
      questions,
      approaches,
      seenQuestionIds,
      seenApproachIds
    );
  });
}

/**
 * Converts a topic bulk JSON pack into Question + Approach + Passage arrays.
 */
export function buildTopicBulk(pack: TopicBulkPack): BuiltTopicBulk {
  const topicId = pack.topicId?.trim();
  if (!topicId) throw new Error('Bulk pack missing topicId');

  const questions: Question[] = [];
  const approaches: Approach[] = [];
  const passages: QuestionPassage[] = [];
  const seenQuestionIds = new Set<string>();
  const seenApproachIds = new Set<string>();
  const seenPassageIds = new Set<string>();

  pack.questions?.forEach((seed) => {
    pushQuestion(
      seed,
      topicId,
      questions,
      approaches,
      seenQuestionIds,
      seenApproachIds
    );
  });

  pack.passages?.forEach((p, index) => {
    buildPassage(
      p,
      topicId,
      index,
      questions,
      approaches,
      passages,
      seenPassageIds,
      seenQuestionIds,
      seenApproachIds
    );
  });

  return { questions, approaches, passages };
}

/** Validate a pack without building (for CLI script). */
export function validateTopicBulk(pack: TopicBulkPack): string[] {
  const errors: string[] = [];
  try {
    buildTopicBulk(pack);
  } catch (e) {
    errors.push(e instanceof Error ? e.message : String(e));
  }
  return errors;
}
