'use client';

import Link from 'next/link';
import Reveal from '@/components/ui/Reveal';
import { mockTopics, getQuestionsByTopic } from '@/lib/data/mockData';

const topicStyles: Record<string, { icon: string; color: string }> = {
  functions: { icon: 'ƒ(x)', color: 'from-indigo-500 to-purple-500' },
  probability: { icon: 'P(A)', color: 'from-emerald-500 to-teal-500' },
  'coordinate-geometry': { icon: '(x,y)', color: 'from-amber-500 to-orange-500' },
};

const topics = mockTopics.map((t) => ({
  id: t.id,
  name: t.name,
  subtopicCount: t.subtopics.length,
  questionCount: getQuestionsByTopic(t.id).length,
  icon: topicStyles[t.id]?.icon ?? '∑',
  color: topicStyles[t.id]?.color ?? 'from-primary to-accent',
}));

export default function TopicsPreview() {
  return (
    <section id="topics" className="py-28 relative bg-surface/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <Reveal direction="up">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent-secondary mb-3">Browse Topics</p>
          </Reveal>
          <Reveal direction="up" delay={80}>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Start with our <span className="gradient-text">core topics</span>
            </h2>
          </Reveal>
          <Reveal direction="up" delay={160}>
            <p className="text-text-muted mt-4 max-w-xl mx-auto">
              Carefully worked problems across Functions, Probability, and Coordinate
              Geometry — with more topics on the way.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {topics.map((topic, index) => (
            <Reveal
              key={topic.id}
              as={Link}
              href={`/topics/${topic.id}`}
              id={`topic-preview-${index}`}
              direction="up"
              delay={index * 110}
              className="glow-card group relative rounded-2xl p-5 bg-surface border border-border hover:border-border-light transition-all duration-300 hover:-translate-y-1.5 flex items-start gap-4"
            >
              <div className={`relative z-10 shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${topic.color} flex items-center justify-center text-white text-sm font-mono font-bold shadow-lg transition-transform duration-300 group-hover:scale-110`}>
                {topic.icon}
              </div>
              <div className="relative z-10 flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-foreground group-hover:text-primary-light transition-colors">{topic.name}</h3>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-xs text-text-dim">{topic.subtopicCount} subtopics</span>
                  <span className="w-1 h-1 rounded-full bg-border-light" />
                  <span className="text-xs text-text-dim">{topic.questionCount} questions</span>
                </div>
              </div>
              <svg className="relative z-10 w-4 h-4 text-text-dim group-hover:text-primary-light transition-all duration-300 group-hover:translate-x-1 shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Reveal>
          ))}
        </div>

        <Reveal direction="up" delay={200} className="text-center mt-10">
          <Link href="/topics" id="view-all-topics" className="inline-flex items-center gap-2 text-sm text-primary-light hover:text-accent transition-colors font-medium">
            View all topics
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
