'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { interpretSearchQuery } from '@/lib/ai/aiClient';
import type { SearchResult } from '@/lib/ai/types';

/**
 * Maps the topic name returned by the AI client to a URL slug.
 * When a real AI API is plugged in, this map stays the same —
 * just ensure the AI returns one of these topic names.
 */
const topicSlugMap: Record<string, string> = {
  Functions: 'functions',
  Probability: 'probability',
  'Coordinate Geometry': 'coordinate-geometry',
};

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleSearch = useCallback(async () => {
    const trimmed = query.trim();
    if (!trimmed) return;

    setLoading(true);
    setResult(null);
    setHasSearched(true);

    try {
      const res = await interpretSearchQuery(trimmed);
      setResult(res);
    } finally {
      setLoading(false);
    }
  }, [query]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleSearch();
    if (e.key === 'Escape') {
      setQuery('');
      setResult(null);
      setHasSearched(false);
    }
  }

  function handleOptionClick(option: string) {
    if (!result) return;

    const topicSlug = topicSlugMap[result.topic];

    if (topicSlug) {
      // Option is a subtopic of a known topic — go to that topic page
      router.push(`/topics/${topicSlug}`);
    } else {
      // General fallback: the options themselves are topic names
      const fallbackSlug = topicSlugMap[option];
      router.push(fallbackSlug ? `/topics/${fallbackSlug}` : '/topics');
    }
  }

  function handleClear() {
    setQuery('');
    setResult(null);
    setHasSearched(false);
    inputRef.current?.focus();
  }

  const topicSlug = result ? topicSlugMap[result.topic] : undefined;

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* ── Search input row ── */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          {/* Search icon */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-dim">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder='Try "Functions", "Probability", "I need help with Circles"…'
            className="w-full pl-12 pr-10 py-4 rounded-2xl bg-surface border border-border
                       focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20
                       text-foreground placeholder:text-text-dim text-sm transition-all"
          />

          {/* Clear button */}
          {query && (
            <button
              onClick={handleClear}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-text-dim hover:text-text-muted transition-colors rounded-md"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Search button */}
        <button
          onClick={handleSearch}
          disabled={!query.trim() || loading}
          className="shrink-0 px-6 py-4 rounded-2xl bg-gradient-to-r from-primary to-primary-light
                     text-white font-medium text-sm
                     disabled:opacity-50 disabled:cursor-not-allowed
                     hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5
                     disabled:hover:translate-y-0 disabled:hover:shadow-none
                     transition-all duration-200"
        >
          {loading ? (
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          ) : (
            'Search'
          )}
        </button>
      </div>

      {/* ── Loading skeleton ── */}
      {loading && (
        <div className="mt-4 rounded-2xl glass border border-primary/20 p-5 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary/40 animate-pulse" />
            <div className="h-4 w-40 rounded-md bg-surface-lighter animate-pulse" />
          </div>
          <div className="flex flex-wrap gap-2">
            {[120, 90, 110, 80, 100].map((w) => (
              <div
                key={w}
                className="h-9 rounded-xl bg-surface-lighter animate-pulse"
                style={{ width: w }}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Results panel ── */}
      {!loading && result && (
        <div className="mt-4 rounded-2xl glass border border-primary/20 p-5 animate-fade-in-up">
          {/* Header */}
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-accent-secondary" />
            <span className="text-sm font-medium text-foreground">
              {topicSlug ? (
                <>
                  Showing results for{' '}
                  <span className="gradient-text-primary font-semibold">{result.topic}</span>
                </>
              ) : (
                <>We couldn&apos;t match that exactly — try one of our topics</>
              )}
            </span>
            {result.difficultyLevel && (
              <span className="ml-auto px-2 py-0.5 text-xs rounded-md bg-primary/10 text-primary-light border border-primary/20 capitalize">
                {result.difficultyLevel}
              </span>
            )}
          </div>

          <p className="text-xs text-text-dim mb-3 ml-4">
            {topicSlug ? 'Select a subtopic to explore:' : 'Pick a topic to start exploring:'}
          </p>

          {/* Clickable option pills */}
          <div className="flex flex-wrap gap-2">
            {result.suggestedOptions.map((option) => (
              <button
                key={option}
                onClick={() => handleOptionClick(option)}
                className="group flex items-center gap-2 px-4 py-2 rounded-xl
                           bg-surface-light border border-border
                           hover:border-primary/40 hover:bg-primary/10
                           text-sm text-text-muted hover:text-primary-light
                           transition-all duration-200"
              >
                {option}
                <svg
                  className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity"
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
              </button>
            ))}
          </div>

          {/* View-all link when a specific topic was matched */}
          {topicSlug && (
            <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
              <span className="text-xs text-text-dim">
                Not what you&apos;re looking for?{' '}
              </span>
              <button
                onClick={() => router.push(`/topics/${topicSlug}`)}
                className="text-xs text-primary-light hover:text-primary transition-colors flex items-center gap-1"
              >
                View all {result.topic} topics
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── No-match state (searched but result is empty suggestedOptions) ── */}
      {!loading && hasSearched && result && result.suggestedOptions.length === 0 && (
        <div className="mt-4 p-4 rounded-xl bg-surface border border-border text-sm text-text-muted text-center">
          No matching topics found. Try searching for "Functions", "Probability", or "Coordinate Geometry".
        </div>
      )}
    </div>
  );
}
