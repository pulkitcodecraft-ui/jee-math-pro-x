'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import SearchBar from '@/components/search/SearchBar';
import { getPlatformStats } from '@/lib/data/mockData';

export default function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const stats = getPlatformStats();

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

    const elements = heroRef.current?.querySelectorAll('.animate-on-load');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Large gradient orbs */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-glow delay-700" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-dark/5 rounded-full blur-3xl" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(99,102,241,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.3) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Badge */}
        <div className="animate-on-load inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-light text-xs font-medium text-primary-light mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-secondary animate-pulse" />
          Built for JEE Advanced aspirants
        </div>

        {/* Headline */}
        <h1 className="animate-on-load delay-100 text-4xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight mb-6">
          Master Mathematics
          <br />
          <span className="gradient-text">the Smart Way</span>
        </h1>

        {/* Subheadline */}
        <p className="animate-on-load delay-200 text-lg sm:text-xl text-text-muted max-w-2xl mx-auto mb-8 leading-relaxed">
          Find the right resources, explore multiple solution approaches, learn
          from common mistakes, and get AI-powered explanations — all in one
          place.
        </p>

        {/* AI Search Bar — Phase 4 */}
        <div className="animate-on-load delay-300 w-full max-w-2xl mx-auto mb-8">
          <SearchBar />
        </div>

        {/* Secondary CTAs */}
        <div className="animate-on-load delay-400 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/topics"
            id="hero-start-learning"
            className="group relative px-8 py-3.5 rounded-2xl bg-gradient-to-r from-primary to-primary-light text-white font-semibold text-sm hover:shadow-xl hover:shadow-primary/25 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              Browse All Topics
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </span>
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-[shimmer_1.5s_ease-in-out]" />
          </Link>

          <a
            href="#features"
            id="hero-explore-features"
            className="px-8 py-3.5 rounded-2xl text-text-muted font-medium text-sm border border-border hover:border-border-light hover:text-foreground transition-all duration-300 hover:-translate-y-0.5"
          >
            Explore Features
          </a>
        </div>

        {/* Stats — real, derived from the content library */}
        <div className="animate-on-load delay-500 mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
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
