import Link from 'next/link';
import type { Metadata } from 'next';
import { mockTopics, getQuestionsByTopic } from '@/lib/data/mockData';

export const metadata: Metadata = {
  title: 'Topics — JEE Math Pro',
  description:
    'Browse all JEE Advanced Mathematics topics. Explore functions, probability, coordinate geometry, and more.',
};

const topicColors: Record<string, string> = {
  functions: 'from-indigo-500 to-purple-500',
  probability: 'from-emerald-500 to-teal-500',
  'coordinate-geometry': 'from-amber-500 to-orange-500',
};

const topicIcons: Record<string, string> = {
  functions: 'ƒ(x)',
  probability: 'P(A)',
  'coordinate-geometry': '(x,y)',
};

export default function TopicsPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Page header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight">
          Mathematics <span className="gradient-text">Topics</span>
        </h1>
        <p className="text-text-muted mt-2 text-sm">
          Select a topic to explore theory, questions, approaches, and common
          mistakes.
        </p>
      </div>

      {/* Topics grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {mockTopics.map((topic) => (
          <Link
            key={topic.id}
            href={`/topics/${topic.id}`}
            id={`topic-card-${topic.id}`}
            className="group rounded-2xl p-6 bg-surface border border-border hover:border-border-light transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5"
          >
            {/* Icon */}
            <div
              className={`w-14 h-14 rounded-xl bg-gradient-to-br ${
                topicColors[topic.id] || 'from-primary to-accent'
              } flex items-center justify-center text-white font-mono font-bold text-base shadow-lg mb-4`}
            >
              {topicIcons[topic.id] || '∑'}
            </div>

            {/* Title */}
            <h2 className="text-lg font-semibold text-foreground group-hover:text-primary-light transition-colors mb-1">
              {topic.name}
            </h2>

            {/* Description */}
            <p className="text-sm text-text-muted leading-relaxed line-clamp-2 mb-4">
              {topic.description}
            </p>

            {/* Stats */}
            <div className="flex items-center gap-4 text-xs text-text-dim">
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                </svg>
                {topic.subtopics.length} subtopics
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {(() => {
                  const count = getQuestionsByTopic(topic.id).length;
                  return `${count} ${count === 1 ? 'question' : 'questions'}`;
                })()}
              </span>
            </div>

            {/* Arrow */}
            <div className="mt-4 flex items-center gap-1 text-xs text-primary-light opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-0 group-hover:translate-x-1">
              Explore topic
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
