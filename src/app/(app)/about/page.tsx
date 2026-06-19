import type { Metadata } from 'next';
import Link from 'next/link';
import { getPlatformStats } from '@/lib/data/mockData';

export const metadata: Metadata = {
  title: 'About — JEE Math Pro',
  description:
    'What JEE Math Pro is, who it is for, and how it helps JEE Advanced Mathematics aspirants learn smarter.',
};

export default function AboutPage() {
  const stats = getPlatformStats();

  return (
    <div className="max-w-3xl mx-auto px-6 py-14">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-light text-xs font-medium text-primary-light mb-5">
        About the platform
      </div>
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
        Learn JEE Math the <span className="gradient-text">smart way</span>
      </h1>
      <p className="text-text-muted leading-relaxed mt-5">
        JEE Math Pro is a focused study companion for JEE Advanced Mathematics.
        Instead of dumping endless problem sets on you, it shows{' '}
        <span className="text-foreground">multiple solution approaches</span> for
        each question, calls out the{' '}
        <span className="text-foreground">common mistakes and traps</span> setters
        rely on, and offers{' '}
        <span className="text-foreground">step-by-step explanations</span> when you
        get stuck.
      </p>

      <div className="grid grid-cols-3 gap-4 my-10">
        {[
          { value: stats.topicCount, label: 'Core topics' },
          { value: stats.subtopicCount, label: 'Subtopics' },
          { value: stats.questionCount, label: 'Worked questions' },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl bg-surface border border-border p-5 text-center">
            <div className="text-2xl font-bold gradient-text-primary">{s.value}</div>
            <div className="text-xs text-text-dim mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <h2 className="text-lg font-semibold mt-10 mb-3">Who it&apos;s for</h2>
      <p className="text-text-muted leading-relaxed">
        Students preparing for JEE Advanced who want to understand the{' '}
        <span className="text-foreground">why</span> behind a solution, not just
        memorise steps. Everything is free to browse — no login required to start.
      </p>

      <h2 className="text-lg font-semibold mt-10 mb-3">An honest note</h2>
      <p className="text-text-muted leading-relaxed">
        This is an early, growing library — we&apos;d rather show you a small set of
        carefully worked problems than inflate the numbers. The AI search and
        explanation tools currently run on a built-in demo engine; the interface is
        designed so a live AI model can be connected without changing how you use it.
      </p>

      <div className="mt-12 flex flex-wrap gap-3">
        <Link
          href="/topics"
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-light text-white text-sm font-medium hover:shadow-lg hover:shadow-primary/25 transition-all"
        >
          Browse topics
        </Link>
        <Link
          href="/contact"
          className="px-6 py-3 rounded-xl text-text-muted text-sm font-medium border border-border hover:border-border-light hover:text-foreground transition-all"
        >
          Get in touch
        </Link>
      </div>
    </div>
  );
}
