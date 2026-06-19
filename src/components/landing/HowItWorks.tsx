'use client';

import { useEffect, useRef } from 'react';

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
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up');
            entry.target.classList.remove('animate-on-load');
          }
        });
      },
      { threshold: 0.05 }
    );
    const elements = sectionRef.current?.querySelectorAll('.animate-on-load');
    elements?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="how-it-works" className="py-28 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[1px] bg-gradient-to-r from-transparent via-accent-secondary/30 to-transparent" />

      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="animate-on-load text-xs font-semibold uppercase tracking-widest text-accent mb-3">How It Works</p>
          <h2 className="animate-on-load delay-100 text-3xl sm:text-4xl font-bold tracking-tight">
            Four steps to <span className="gradient-text">mastery</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {steps.map((item, index) => (
            <div key={item.step} id={`how-step-${index}`}
              className={`animate-on-load delay-${(index + 1) * 100} group relative rounded-2xl p-6 bg-surface border border-border hover:border-border-light transition-all duration-300 hover:-translate-y-1`}>
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-12 h-12 rounded-xl bg-surface-lighter flex items-center justify-center text-primary-light group-hover:bg-primary/10 transition-colors">
                  {item.icon}
                </div>
                <div>
                  <span className="text-xs font-mono text-text-dim">Step {item.step}</span>
                  <h3 className="text-base font-semibold mt-0.5 text-foreground">{item.title}</h3>
                  <p className="text-sm text-text-muted mt-2 leading-relaxed">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
