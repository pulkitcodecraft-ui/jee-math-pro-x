'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';

export default function CTASection() {
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
      { threshold: 0.1 }
    );
    const elements = sectionRef.current?.querySelectorAll('.animate-on-load');
    elements?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-28 relative">
      <div className="max-w-4xl mx-auto px-6">
        <div className="relative rounded-3xl overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-surface to-accent/10" />
          <div className="absolute inset-0 bg-surface/60 backdrop-blur-sm" />
          <div className="absolute top-0 right-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent-secondary/10 rounded-full blur-3xl" />

          {/* Content */}
          <div className="relative z-10 p-10 sm:p-14 text-center">
            <h2 className="animate-on-load text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Ready to start <span className="gradient-text">cracking JEE Math</span>?
            </h2>
            <p className="animate-on-load delay-100 text-text-muted max-w-lg mx-auto mb-8">
              Learn smarter, not harder — explore multiple approaches and spot the
              traps before the exam does. No sign-up required to start.
            </p>
            <div className="animate-on-load delay-200 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/topics" id="cta-start-learning"
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-primary to-primary-light text-white font-semibold hover:shadow-xl hover:shadow-primary/25 transition-all duration-300 hover:-translate-y-1">
                Start Learning — It&apos;s Free
              </Link>
              <Link href="/login" id="cta-create-account"
                className="px-8 py-4 rounded-2xl text-text-muted font-medium border border-border hover:border-border-light hover:text-foreground transition-all duration-300">
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
