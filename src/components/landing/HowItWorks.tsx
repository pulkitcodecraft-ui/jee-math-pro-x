'use client';

import Reveal from '@/components/ui/Reveal';

const steps = [
  {
    step: '01',
    title: 'Search Your Topic',
    description: 'Type what you\'re struggling with — our AI finds the exact topic, subtopic, and resources for you.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    step: '02',
    title: 'Explore Approaches',
    description: 'See multiple solution methods per question. Pick the one that clicks with your way of thinking.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h7" />
      </svg>
    ),
  },
  {
    step: '03',
    title: 'Learn From Mistakes',
    description: 'Every question highlights common mistakes and traps. Know what NOT to do before the exam.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    step: '04',
    title: 'Get AI Explanations',
    description: 'Paste any solution and get a detailed step-by-step breakdown. Understand the "why", not just the "how".',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="section-padding relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[1px] bg-gradient-to-r from-transparent via-accent-secondary/30 to-transparent" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <Reveal direction="up">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">How It Works</p>
          </Reveal>
          <Reveal direction="up" delay={80}>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Four steps to <span className="gradient-text">mastery</span>
            </h2>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {steps.map((item, index) => (
            <Reveal
              key={item.step}
              id={`how-step-${index}`}
              direction={index % 2 === 0 ? 'left' : 'right'}
              delay={(index % 2) * 80}
              className="glow-card group relative rounded-2xl p-6 bg-surface border border-border hover:border-border-light transition-all duration-300 hover:-translate-y-1.5 overflow-hidden"
            >
              {/* Oversized ghost number */}
              <span className="pointer-events-none absolute -top-4 -right-2 text-7xl font-extrabold text-border/40 select-none transition-colors duration-300 group-hover:text-primary/15">
                {item.step}
              </span>
              <div className="relative z-10 flex items-start gap-4">
                <div className="shrink-0 w-12 h-12 rounded-xl bg-surface-lighter flex items-center justify-center text-primary-light group-hover:bg-primary/15 group-hover:scale-110 transition-all duration-300">
                  {item.icon}
                </div>
                <div>
                  <span className="text-xs font-mono text-text-dim">Step {item.step}</span>
                  <h3 className="text-base font-semibold mt-0.5 text-foreground">{item.title}</h3>
                  <p className="text-sm text-text-muted mt-2 leading-relaxed">{item.description}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
