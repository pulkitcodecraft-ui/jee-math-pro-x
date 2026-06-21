'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { syllabus } from '@/lib/data/syllabus';
import { topicNameToSlug } from '@/lib/data/mockData';
import CategoryMotif from '@/components/topics/CategoryMotif';

export default function TopicsBrowser() {
  const [query, setQuery] = useState('');

  const normalized = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    if (!normalized) return syllabus;
    return syllabus
      .map((cat) => ({
        ...cat,
        topics: cat.topics.filter((t) => t.toLowerCase().includes(normalized)),
      }))
      .filter((cat) => cat.topics.length > 0);
  }, [normalized]);

  const totalMatches = filtered.reduce((sum, c) => sum + c.topics.length, 0);

  return (
    <div>
      {/* Search / filter */}
      <div className="relative mb-10">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim pointer-events-none"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 18a7 7 0 110-14 7 7 0 010 14z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search topics… e.g. parabola, integration"
          aria-label="Search topics"
          className="w-full rounded-2xl bg-surface border border-border pl-11 pr-10 py-3.5
                     text-sm text-foreground placeholder:text-text-dim
                     focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20
                     transition-all"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center
                       text-text-dim hover:text-foreground hover:bg-surface-lighter transition-colors
                       focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* No results */}
      {filtered.length === 0 && (
        <div className="rounded-2xl bg-surface border border-dashed border-border p-12 text-center">
          <p className="text-sm text-text-muted font-medium">No topics match &quot;{query}&quot;</p>
          <p className="text-xs text-text-dim mt-1">Try a different keyword.</p>
        </div>
      )}

      {/* Category sections */}
      <div className="space-y-12">
        {filtered.map((cat) => (
          <section key={cat.id} aria-labelledby={`cat-${cat.id}`}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 text-primary-light flex items-center justify-center shrink-0">
                <CategoryMotif id={cat.id} className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <h2 id={`cat-${cat.id}`} className="text-lg font-semibold text-foreground flex items-center gap-2.5">
                  {cat.name}
                  <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-surface-lighter border border-border text-[11px] font-medium text-text-muted">
                    {cat.topics.length}
                  </span>
                </h2>
                <p className="text-xs text-text-dim mt-0.5">{cat.blurb}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cat.topics.map((topic) => {
                const slug = topicNameToSlug[topic];
                const href = slug
                  ? `/topics/${slug}`
                  : `/explain?topic=${encodeURIComponent(topic)}`;
                return (
                <Link
                  key={topic}
                  href={href}
                  className="group flex items-center gap-3 rounded-2xl p-4 bg-surface border border-border
                             hover:border-primary/40 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/5
                             transition-all duration-200
                             focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary/40"
                >
                  <span className="w-9 h-9 rounded-lg bg-surface-lighter text-text-muted group-hover:text-primary-light group-hover:bg-primary/10 flex items-center justify-center shrink-0 transition-colors">
                    <CategoryMotif id={cat.id} className="w-5 h-5" />
                  </span>
                  <span className="flex-1 min-w-0 text-sm font-medium text-foreground group-hover:text-primary-light transition-colors">
                    {topic}
                  </span>
                  <svg
                    className="w-4 h-4 text-text-dim opacity-60 sm:opacity-0 sm:-translate-x-1 sm:group-hover:opacity-100 sm:group-hover:translate-x-0 transition-all shrink-0 touch-visible"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {/* Live result count for screen readers */}
      <p className="sr-only" role="status" aria-live="polite">
        {totalMatches} topics shown
      </p>
    </div>
  );
}
