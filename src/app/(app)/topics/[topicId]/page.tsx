import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { mockTopics, getQuestionsByTopic } from '@/lib/data/mockData';
import TopicTabs from './TopicTabs';

interface TopicPageProps {
  params: Promise<{ topicId: string }>;
}

export async function generateMetadata({ params }: TopicPageProps): Promise<Metadata> {
  const { topicId } = await params;
  const topic = mockTopics.find((t) => t.id === topicId);
  if (!topic) return { title: 'Topic Not Found' };
  return {
    title: `${topic.name} — JEE Math Pro`,
    description: topic.description,
  };
}

export function generateStaticParams() {
  return mockTopics.map((topic) => ({ topicId: topic.id }));
}

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

export default async function TopicPage({ params }: TopicPageProps) {
  const { topicId } = await params;
  const topic = mockTopics.find((t) => t.id === topicId);

  if (!topic) {
    notFound();
  }

  const questions = getQuestionsByTopic(topicId);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-text-dim mb-6">
        <Link href="/topics" className="hover:text-text-muted transition-colors">
          Topics
        </Link>
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-text-muted">{topic.name}</span>
      </nav>

      {/* Topic Header */}
      <div className="flex items-start gap-5 mb-8">
        <div
          className={`shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${
            topicColors[topic.id] || 'from-primary to-accent'
          } flex items-center justify-center text-white font-mono font-bold text-lg shadow-lg`}
        >
          {topicIcons[topic.id] || '∑'}
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{topic.name}</h1>
          <p className="text-sm text-text-muted mt-1 max-w-2xl leading-relaxed">
            {topic.description}
          </p>
          <div className="flex items-center gap-4 mt-3 text-xs text-text-dim">
            <span>{topic.subtopics.length} subtopics</span>
            <span className="w-1 h-1 rounded-full bg-border-light" />
            <span>{questions.length} questions</span>
            <span className="w-1 h-1 rounded-full bg-border-light" />
            <span className="capitalize">{topic.subject}</span>
          </div>
        </div>
      </div>

      {/* Subtopics pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        {topic.subtopics.map((sub) => (
          <span
            key={sub}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-surface-light border border-border text-text-muted hover:border-border-light hover:text-foreground transition-colors cursor-default"
          >
            {sub}
          </span>
        ))}
      </div>

      {/* Tabbed content */}
      <TopicTabs topic={topic} questions={questions} />
    </div>
  );
}
