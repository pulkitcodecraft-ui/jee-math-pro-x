/**
 * Bulk question packs per topic. Add a folder `topics/<slug>/questions.json`
 * and register it here.
 */
import { buildTopicBulk } from '@/lib/data/bulk/buildFromSeeds';
import type { Approach } from '@/types/approach';
import type { QuestionPassage } from '@/types/passage';
import type { Question } from '@/types/question';
import parabolaPack from './parabola/questions.json';
import trigonometryPack from './trigonometry/questions.json';
import quadraticEquationPack from './quadratic-equation/questions.json';
import sequenceAndSeriesPack from './sequence-and-series/questions.json';
import binomialTheoremPack from './binomial-theorem/questions.json';
import type { TopicBulkPack } from '@/lib/data/bulk/types';

const packs: TopicBulkPack[] = [
  parabolaPack as TopicBulkPack,
  trigonometryPack as TopicBulkPack,
  quadraticEquationPack as TopicBulkPack,
  sequenceAndSeriesPack as TopicBulkPack,
  binomialTheoremPack as TopicBulkPack,
];

function flattenBuilt(): {
  questions: Question[];
  approaches: Approach[];
  passages: QuestionPassage[];
} {
  const questions: Question[] = [];
  const approaches: Approach[] = [];
  const passages: QuestionPassage[] = [];

  for (const pack of packs) {
    const built = buildTopicBulk(pack);
    questions.push(...built.questions);
    approaches.push(...built.approaches);
    passages.push(...built.passages);
  }

  return { questions, approaches, passages };
}

const built = flattenBuilt();

export const topicBulkQuestions: Question[] = built.questions;
export const topicBulkApproaches: Approach[] = built.approaches;
export const topicBulkPassages: QuestionPassage[] = built.passages;

export function getPassageById(id: string): QuestionPassage | undefined {
  return topicBulkPassages.find((p) => p.id === id);
}

export function getPassagesByTopic(topicId: string): QuestionPassage[] {
  return topicBulkPassages.filter((p) => p.topicId === topicId);
}
