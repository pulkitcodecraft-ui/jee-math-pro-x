import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  mockTopics,
  mockQuestions,
  getQuestionById,
  getTopicById,
  getApproachesByQuestion,
  getPassageById,
} from '@/lib/data/mockData';
import QuestionContent from './QuestionContent';
import FigureImage from '@/components/question/FigureImage';
import McqOptions from '@/components/question/McqOptions';
import SolutionText from '@/components/question/SolutionText';
import PassageBlock from '@/components/question/PassageBlock';

interface QuestionPageProps {
  params: Promise<{ topicId: string; questionId: string }>;
}

export async function generateMetadata({ params }: QuestionPageProps): Promise<Metadata> {
  const { questionId } = await params;
  const question = getQuestionById(questionId);
  if (!question) return { title: 'Question Not Found' };
  return {
    title: `Question — JEE Math Pro`,
    description: question.statement.slice(0, 160),
  };
}

export function generateStaticParams() {
  return mockQuestions.map((q) => ({
    topicId: q.topicId,
    questionId: q.id,
  }));
}

export default async function QuestionPage({ params }: QuestionPageProps) {
  const { topicId, questionId } = await params;
  const topic = getTopicById(topicId);
  const question = getQuestionById(questionId);

  if (!topic || !question || question.topicId !== topicId) {
    notFound();
  }

  // Official/mock approaches are rendered here. Approved community approaches
  // are fetched and shown client-side by QuestionContent in their own section.
  const approaches = getApproachesByQuestion(questionId);
  const passage = question.passageId ? getPassageById(question.passageId) : undefined;

  // Find the question index within the topic
  const topicQuestions = mockQuestions.filter((q) => q.topicId === topicId);
  const questionIndex = topicQuestions.findIndex((q) => q.id === questionId);
  const displayLabel = question.passageLabel
    ? `Paragraph · Q${question.passageLabel}`
    : `Question ${questionIndex + 1}`;

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-text-dim mb-6 flex-wrap">
        <Link href="/topics" className="hover:text-text-muted transition-colors">
          Topics
        </Link>
        <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <Link href={`/topics/${topicId}`} className="hover:text-text-muted transition-colors">
          {topic.name}
        </Link>
        <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-text-muted">{displayLabel}</span>
      </nav>

      {/* Question Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          <span className="text-xs font-mono text-text-dim">{displayLabel}</span>
          <span className={`px-2.5 py-1 text-[11px] font-medium rounded-md border ${
            question.difficulty === 'easy' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
            question.difficulty === 'medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
            question.difficulty === 'hard' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
            'bg-purple-500/10 text-purple-400 border-purple-500/20'
          }`}>
            {question.difficulty}
          </span>
          <span className="px-2.5 py-1 text-[11px] font-medium rounded-md bg-surface-light border border-border text-text-dim">
            {question.subtopicId}
          </span>
          <span className="px-2.5 py-1 text-[11px] font-medium rounded-md bg-primary/10 border border-primary/20 text-primary-light">
            {approaches.length} approaches
          </span>
          {(question.format === 'mcq' || question.format === 'paragraph-mcq' || question.options) && (
            <span className="px-2.5 py-1 text-[11px] font-medium rounded-md bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              {question.format === 'paragraph-mcq' ? 'Paragraph MCQ' : 'MCQ'}
            </span>
          )}
        </div>

        {/* Question statement */}
        <div className="rounded-2xl bg-surface border border-border p-6 space-y-5">
          {passage && (
            <PassageBlock
              title={passage.title ?? 'Paragraph'}
              passage={passage.passage}
            />
          )}
          <h1 className="text-lg font-semibold leading-relaxed text-foreground">
            {question.passageLabel && (
              <span className="text-violet-300 font-bold mr-2">{question.passageLabel}.</span>
            )}
            <SolutionText text={question.statement} />
          </h1>

          <McqOptions question={question} />

          {/* Question figure(s) / diagram(s) — e.g. SRG Bank PDF crop */}
          {question.images && question.images.length > 0 && (
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {question.images.map((src, i) => (
                <FigureImage
                  key={`${src}-${i}`}
                  src={src}
                  alt={`Question figure ${i + 1}`}
                  invert
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <QuestionContent
        question={question}
        approaches={approaches}
      />
    </div>
  );
}
