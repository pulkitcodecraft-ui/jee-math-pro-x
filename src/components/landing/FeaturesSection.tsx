'use client';

import Reveal from '@/components/ui/Reveal';

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    title: 'AI-Powered Search',
    description:
      'Type what you\'re struggling with in plain English. Our AI understands your query and guides you to the right topic, subtopic, and difficulty level.',
    accent: 'from-primary to-primary-light',
    glow: 'group-hover:shadow-primary/20',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    title: 'Multiple Approaches',
    description:
      'Every question comes with 2-3 different solution approaches. Learn the textbook method, the shortcut, and the smartest trick — all side by side.',
    accent: 'from-accent to-purple-400',
    glow: 'group-hover:shadow-accent/20',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.999L13.732 4.002c-.77-1.333-2.694-1.333-3.464 0L3.34 16.002c-.77 1.332.192 2.999 1.732 2.999z" />
      </svg>
    ),
    title: 'Common Mistakes & Traps',
    description:
      'Know exactly where students go wrong. We highlight the most common mistakes and subtle traps that JEE setters love to use.',
    accent: 'from-red-400 to-orange-400',
    glow: 'group-hover:shadow-red-400/20',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'Step-by-Step AI Explanations',
    description:
      'Paste any question and solution — our AI breaks it down into clear, numbered steps so you understand the "why" behind every move.',
    accent: 'from-accent-secondary to-teal-400',
    glow: 'group-hover:shadow-accent-secondary/20',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: 'Community Approaches',
    description:
      'Submit your own unique solution approach. After admin review, the best community solutions get featured alongside official ones.',
    accent: 'from-blue-400 to-cyan-400',
    glow: 'group-hover:shadow-blue-400/20',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'PYQ Coverage',
    description:
      'Previous Year Questions mapped to every topic and subtopic. Practice with real JEE Advanced questions with detailed breakdowns.',
    accent: 'from-amber-400 to-yellow-400',
    glow: 'group-hover:shadow-amber-400/20',
  },
];

const colDirection = ['left', 'up', 'right'] as const;

export default function FeaturesSection() {
  return (
    <section id="features" className="section-padding relative">
      {/* Background accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <Reveal direction="up">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary-light mb-3">
              Why JEE Math Pro?
            </p>
          </Reveal>
          <Reveal direction="up" delay={80}>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Everything you need to{' '}
              <span className="gradient-text">crack JEE Math</span>
            </h2>
          </Reveal>
          <Reveal direction="up" delay={160}>
            <p className="text-text-muted mt-4 max-w-xl mx-auto">
              A focused toolkit for JEE Advanced Mathematics — here&apos;s what makes
              it different.
            </p>
          </Reveal>
        </div>

        {/* Feature cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, index) => (
            <Reveal
              key={feature.title}
              id={`feature-card-${index}`}
              direction={colDirection[index % 3]}
              delay={(index % 3) * 90 + Math.floor(index / 3) * 60}
              className={`glow-card group relative rounded-2xl p-6 bg-surface border border-border hover:border-border-light transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl ${feature.glow}`}
            >
              {/* Icon */}
              <div
                className={`relative z-10 w-11 h-11 rounded-xl bg-gradient-to-br ${feature.accent} flex items-center justify-center text-white mb-4 shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3`}
              >
                {feature.icon}
              </div>

              {/* Content */}
              <h3 className="relative z-10 text-base font-semibold mb-2 text-foreground">
                {feature.title}
              </h3>
              <p className="relative z-10 text-sm text-text-muted leading-relaxed">
                {feature.description}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
