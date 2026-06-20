'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Topic } from '@/types/topic';
import type { Question } from '@/types/question';
import type { QuestionPassage } from '@/types/passage';
import QuestionStatementPreview from '@/components/question/QuestionStatementPreview';
import PassageBlock from '@/components/question/PassageBlock';
import { buildQuestionListEntries } from '@/lib/data/questionList';

interface TopicTabsProps {
  topic: Topic;
  questions: Question[];
  passages: QuestionPassage[];
}

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'questions', label: 'Practice Questions' },
  { id: 'pyq', label: 'Previous Year Questions' },
  { id: 'resources', label: 'Resources' },
];

const difficultyColors: Record<string, string> = {
  easy: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  hard: 'bg-red-500/10 text-red-400 border-red-500/20',
  advanced: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
};

export default function TopicTabs({ topic, questions, passages }: TopicTabsProps) {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div>
      {/* Tab buttons */}
      <div className="flex gap-1 border-b border-border mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-all duration-200 border-b-2 -mb-[1px] ${
              activeTab === tab.id
                ? 'text-primary-light border-primary-light'
                : 'text-text-dim border-transparent hover:text-text-muted hover:border-border-light'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="min-h-[400px]">
        {activeTab === 'overview' && (
          <OverviewTab topic={topic} questions={questions} />
        )}
        {activeTab === 'questions' && (
          <QuestionsTab topic={topic} questions={questions} passages={passages} />
        )}
        {activeTab === 'pyq' && <PYQTab topic={topic} />}
        {activeTab === 'resources' && <ResourcesTab topic={topic} />}
      </div>
    </div>
  );
}

// ===== Overview Tab =====
function OverviewTab({ topic, questions }: { topic: Topic; questions: Question[] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Theory section */}
      <div className="lg:col-span-2 space-y-6">
        <section className="rounded-2xl bg-surface border border-border p-6">
          <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-primary-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Theory & Notes
          </h3>
          <div className="text-sm text-text-muted leading-relaxed space-y-3">
            <p>
              {topic.name} is one of the most important topics in JEE Advanced Mathematics.
              Understanding the fundamental concepts thoroughly is essential for solving
              both straightforward and tricky problems.
            </p>
            <p>
              Key areas to focus on include: {topic.subtopics.slice(0, 4).join(', ')},
              and more. Each subtopic builds on the previous one, so mastering them
              in order is recommended.
            </p>
            <div className="mt-4 p-4 rounded-xl bg-surface-light border border-border">
              <p className="text-xs text-text-dim italic">
                📝 Detailed theory notes will be added here. For now, focus on the
                practice questions and approaches below.
              </p>
            </div>
          </div>
        </section>

        {/* Common Mistakes */}
        <section className="rounded-2xl bg-surface border border-border p-6">
          <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.999L13.732 4.002c-.77-1.333-2.694-1.333-3.464 0L3.34 16.002c-.77 1.332.192 2.999 1.732 2.999z" />
            </svg>
            Common Mistakes
          </h3>
          <ul className="space-y-2">
            {questions.flatMap((q) => q.commonMistakes.slice(0, 2)).slice(0, 5).map((mistake, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-text-muted">
                <span className="shrink-0 w-5 h-5 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center text-xs mt-0.5">✗</span>
                {mistake}
              </li>
            ))}
          </ul>
        </section>

        {/* Common Traps */}
        <section className="rounded-2xl bg-surface border border-border p-6">
          <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Common Traps
          </h3>
          <ul className="space-y-2">
            {questions.flatMap((q) => q.commonTraps).slice(0, 4).map((trap, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-text-muted">
                <span className="shrink-0 w-5 h-5 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center text-xs mt-0.5">⚡</span>
                {trap}
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Sidebar */}
      <div className="space-y-5">
        {/* Quick stats */}
        <div className="rounded-2xl bg-surface border border-border p-5">
          <h4 className="text-sm font-semibold mb-4">Quick Stats</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-text-dim">Subtopics</span>
              <span className="font-medium text-foreground">{topic.subtopics.length}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-text-dim">Questions</span>
              <span className="font-medium text-foreground">{questions.length}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-text-dim">Approaches</span>
              <span className="font-medium text-foreground">
                {questions.reduce((sum, q) => sum + q.approaches.length, 0)}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-text-dim">Subject</span>
              <span className="font-medium text-primary-light">{topic.subject}</span>
            </div>
          </div>
        </div>

        {/* Recent questions shortcut */}
        <div className="rounded-2xl bg-surface border border-border p-5">
          <h4 className="text-sm font-semibold mb-3">Recent Questions</h4>
          <div className="space-y-2">
            {questions.slice(0, 3).map((q) => (
              <Link
                key={q.id}
                href={`/topics/${topic.id}/questions/${q.id}`}
                className="block p-3 rounded-xl bg-surface-light border border-border hover:border-border-light transition-colors group"
              >
                <QuestionStatementPreview text={q.statement} clamp={2} variant="plain" className="mb-2" />
                <div className="flex items-center gap-2 mt-2">
                  <span className={`px-2 py-0.5 text-[10px] font-medium rounded-md border ${difficultyColors[q.difficulty]}`}>
                    {q.difficulty}
                  </span>
                  <span className="text-[10px] text-text-dim">{q.subtopicId}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== Questions Tab =====
function QuestionsTab({
  topic,
  questions,
  passages,
}: {
  topic: Topic;
  questions: Question[];
  passages: QuestionPassage[];
}) {
  const entries = buildQuestionListEntries(questions, passages);

  return (
    <div className="space-y-4">
      {entries.length === 0 ? (
        <div className="text-center py-16 text-text-dim">
          <p>No questions available yet for this topic.</p>
        </div>
      ) : (
        entries.map((entry, entryIndex) => {
          if (entry.kind === 'standalone') {
            return (
              <StandaloneQuestionCard
                key={entry.question.id}
                topic={topic}
                question={entry.question}
                index={entryIndex + 1}
              />
            );
          }

          return (
            <div
              key={entry.passage.id}
              className="rounded-2xl border border-violet-500/20 bg-surface overflow-hidden"
            >
              <div className="p-5 border-b border-border/60">
                <PassageBlock
                  title={entry.passage.title ?? 'Paragraph'}
                  passage={entry.passage.passage}
                />
              </div>
              <div className="p-4 space-y-3 bg-surface-light/20">
                {entry.questions.map((q) => (
                  <Link
                    key={q.id}
                    href={`/topics/${topic.id}/questions/${q.id}`}
                    className="group block rounded-xl border border-border bg-surface p-4 hover:border-violet-500/30 hover:shadow-lg hover:shadow-violet-500/5 transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center flex-wrap gap-2 mb-2">
                          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-violet-500/15 text-[11px] font-bold text-violet-300">
                            {q.passageLabel ?? q.passageOrder}
                          </span>
                          <span className="px-2 py-0.5 text-[10px] font-medium rounded-md border bg-violet-500/10 text-violet-300 border-violet-500/20">
                            Paragraph MCQ
                          </span>
                          <span className={`px-2 py-0.5 text-[10px] font-medium rounded-md border ${difficultyColors[q.difficulty]}`}>
                            {q.difficulty}
                          </span>
                        </div>
                        <QuestionStatementPreview text={q.statement} variant="plain" clamp={3} />
                      </div>
                      <span className="shrink-0 text-text-dim group-hover:text-violet-300 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

function StandaloneQuestionCard({
  topic,
  question: q,
  index,
}: {
  topic: Topic;
  question: Question;
  index: number;
}) {
  return (
    <Link
      key={q.id}
      href={`/topics/${topic.id}/questions/${q.id}`}
      id={`question-${q.id}`}
      className="group block rounded-2xl border border-border bg-surface p-5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200 hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center flex-wrap gap-2 mb-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/15 text-[11px] font-bold text-primary-light">
              {index}
            </span>
            <span className={`px-2 py-0.5 text-[10px] font-medium rounded-md border ${difficultyColors[q.difficulty]}`}>
              {q.difficulty}
            </span>
            {(q.format === 'mcq' || q.format === 'paragraph-mcq' || q.options) && (
              <span className="px-2 py-0.5 text-[10px] font-medium rounded-md border bg-cyan-500/10 text-cyan-400 border-cyan-500/20">
                {q.correctOptions && q.correctOptions.length > 1 ? 'MCQ (multi)' : 'MCQ'}
              </span>
            )}
            <span className="text-[10px] text-text-dim">{q.subtopicId}</span>
          </div>

          <QuestionStatementPreview
            text={q.statement}
            className="group-hover:border-border-light transition-colors"
          />

          <div className="flex items-center flex-wrap gap-3 mt-3 text-xs text-text-dim">
            <span className="inline-flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-primary-light/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              {q.approaches.length} approaches
            </span>
            <span>{q.commonMistakes.length} mistakes</span>
            <span>{q.commonTraps.length} traps</span>
          </div>
        </div>

        <span className="shrink-0 flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface-light text-text-dim group-hover:border-primary/40 group-hover:text-primary-light group-hover:bg-primary/10 transition-all mt-1">
          <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </Link>
  );
}

// ===== PYQ Tab =====
function PYQTab({ topic }: { topic: Topic }) {
  return (
    <div className="rounded-2xl bg-surface border border-border p-8 text-center">
      <div className="w-14 h-14 rounded-2xl bg-surface-light flex items-center justify-center mx-auto mb-4">
        <svg className="w-7 h-7 text-text-dim" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h3 className="text-base font-semibold mb-2">Previous Year Questions</h3>
      <p className="text-sm text-text-muted max-w-md mx-auto">
        Previous year JEE Advanced questions for {topic.name} will be curated and added here.
        Each PYQ will include the year, the question, and multiple solution approaches.
      </p>
      <div className="mt-6 flex flex-wrap gap-2 justify-center">
        {['2024', '2023', '2022', '2021', '2020'].map((year) => (
          <span key={year} className="px-3 py-1.5 text-xs rounded-lg bg-surface-light border border-border text-text-dim">
            JEE {year}
          </span>
        ))}
      </div>
    </div>
  );
}

// ===== Resources Tab =====
function ResourcesTab({ topic }: { topic: Topic }) {
  const resources = [
    { type: 'Video Lectures', icon: '🎥', desc: 'Curated video explanations for each subtopic', count: '12 videos' },
    { type: 'Practice Sheets', icon: '📄', desc: 'Downloadable problem sets with solutions', count: '5 sheets' },
    { type: 'Formula Sheets', icon: '📐', desc: 'Quick reference formulas and identities', count: '3 sheets' },
    { type: 'Reference Books', icon: '📚', desc: 'Recommended books and chapters', count: '4 books' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {resources.map((res) => (
        <div key={res.type} className="rounded-2xl bg-surface border border-border p-5 hover:border-border-light transition-colors">
          <div className="flex items-start gap-3">
            <span className="text-2xl">{res.icon}</span>
            <div>
              <h4 className="text-sm font-semibold">{res.type}</h4>
              <p className="text-xs text-text-muted mt-1">{res.desc}</p>
              <span className="text-[10px] text-text-dim mt-2 inline-block">{res.count} — Coming soon</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
