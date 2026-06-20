'use client';

import Link from 'next/link';
import SearchBar from '@/components/search/SearchBar';
import Reveal from '@/components/ui/Reveal';
import { getPlatformStats } from '@/lib/data/mockData';

export default function HeroSection() {
  const stats = getPlatformStats();

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Drifting gradient orbs */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/15 rounded-full blur-3xl animate-aurora" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/15 rounded-full blur-3xl animate-aurora" style={{ animationDelay: '-6s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-secondary/[0.06] rounded-full blur-3xl animate-aurora" style={{ animationDelay: '-12s' }} />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(99,102,241,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.3) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            maskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, #000 30%, transparent 75%)',
            WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, #000 30%, transparent 75%)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Badge */}
        <Reveal direction="down" delay={0}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-light text-xs font-medium text-primary-light mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-secondary animate-pulse" />
            Built for JEE Advanced aspirants
          </div>
        </Reveal>

        {/* Headline */}
        <Reveal direction="up" delay={80}>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight mb-6">
            Master Mathematics
            <br />
            <span className="gradient-text animate-gradient">the Smart Way</span>
          </h1>
        </Reveal>

        {/* Subheadline */}
        <Reveal direction="up" delay={160}>
          <p className="text-lg sm:text-xl text-text-muted max-w-2xl mx-auto mb-8 leading-relaxed">
            Find the right resources, explore multiple solution approaches, learn
            from common mistakes, and get AI-powered explanations — all in one
            place.
          </p>
        </Reveal>

        {/* AI Search Bar — wrapped in a soft glow frame */}
        <Reveal direction="scale" delay={240}>
          <div className="group relative w-full max-w-2xl mx-auto mb-8">
            <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-primary/50 via-accent/40 to-accent-secondary/40 opacity-40 blur-lg group-focus-within:opacity-80 transition-opacity duration-500" />
            <div className="relative">
              <SearchBar />
            </div>
          </div>
        </Reveal>

        {/* Secondary CTAs */}
        <Reveal direction="up" delay={320}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/topics"
              id="hero-start-learning"
              className="group relative px-8 py-3.5 rounded-2xl bg-gradient-to-r from-primary to-primary-light text-white font-semibold text-sm hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Browse All Topics
                <svg
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.2s_ease-in-out]" />
            </Link>

            <a
              href="#features"
              id="hero-explore-features"
              className="px-8 py-3.5 rounded-2xl text-text-muted font-medium text-sm border border-border hover:border-primary/40 hover:text-foreground hover:bg-surface-light/50 transition-all duration-300 hover:-translate-y-0.5"
            >
              Explore Features
            </a>
          </div>
        </Reveal>

        {/* Stats — real, derived from the content library */}
        <Reveal direction="up" delay={420}>
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
            {[
              { value: stats.topicCount, label: 'Core Topics' },
              { value: stats.subtopicCount, label: 'Subtopics' },
              { value: stats.questionCount, label: 'Worked Questions' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold gradient-text-primary">
                  {stat.value}
                </div>
                <div className="text-xs text-text-dim mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-fade-in delay-700">
        <div className="flex flex-col items-center gap-2 text-text-dim">
          <span className="text-xs">Scroll to explore</span>
          <div className="w-5 h-8 rounded-full border border-border-light flex justify-center pt-1.5">
            <div className="w-1 h-2 rounded-full bg-primary-light animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
}
