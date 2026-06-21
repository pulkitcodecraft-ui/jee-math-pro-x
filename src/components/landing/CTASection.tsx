'use client';

import Link from 'next/link';
import Reveal from '@/components/ui/Reveal';

export default function CTASection() {
  return (
    <section className="section-padding relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <Reveal direction="scale">
          <div className="relative rounded-3xl overflow-hidden">
            {/* Animated gradient backdrop */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/25 via-surface to-accent/15 animate-gradient" />
            <div className="absolute inset-0 bg-surface/60 backdrop-blur-sm" />
            <div className="absolute top-0 right-0 w-72 h-72 bg-primary/15 rounded-full blur-3xl animate-aurora" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent-secondary/15 rounded-full blur-3xl animate-aurora" style={{ animationDelay: '-8s' }} />

            {/* Thin gradient ring */}
            <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/10" />

            {/* Content */}
            <div className="relative z-10 p-10 sm:p-14 text-center">
              <Reveal direction="up">
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
                  Ready to start <span className="gradient-text">cracking JEE Math</span>?
                </h2>
              </Reveal>
              <Reveal direction="up" delay={100}>
                <p className="text-text-muted max-w-lg mx-auto mb-8">
                  Learn smarter, not harder — explore multiple approaches and spot the
                  traps before the exam does. No sign-up required to start.
                </p>
              </Reveal>
              <Reveal direction="up" delay={200}>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    href="/topics"
                    id="cta-start-learning"
                    className="group relative px-8 py-4 rounded-2xl bg-gradient-to-r from-primary to-primary-light text-white font-semibold hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                  >
                    <span className="relative z-10">Start Learning — It&apos;s Free</span>
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.2s_ease-in-out]" />
                  </Link>
                  <Link
                    href="/login"
                    id="cta-create-account"
                    className="px-8 py-4 rounded-2xl text-text-muted font-medium border border-border hover:border-primary/40 hover:text-foreground hover:bg-surface-light/50 transition-all duration-300"
                  >
                    Create Account
                  </Link>
                </div>
              </Reveal>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
