'use client';

import { useState } from 'react';
import { explainSolution } from '@/lib/ai/aiClient';
import type { ExplanationResult } from '@/lib/ai/types';

const sampleQuestion =
  'Find the domain of f(x) = √(log₂(log₃(log₅(x² - 1)))). Express your answer in interval notation.';
const sampleSolution =
  'For √(log_a(x)) we need log_a(x) ≥ 0, i.e. x ≥ 1. Applying recursively from the outside in: log₂(?) ≥ 0 ⟹ ? ≥ 1, so log₃(?) ≥ 1 ⟹ ? ≥ 3, so log₅(?) ≥ 3 ⟹ ? ≥ 125, so x² - 1 ≥ 125 ⟹ x² ≥ 126. Domain: |x| ≥ √126.';

export default function ExplainTool() {
  const [question, setQuestion] = useState('');
  const [solution, setSolution] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ExplanationResult | null>(null);

  const canSubmit = question.trim().length > 0 && solution.trim().length > 0 && !loading;

  async function handleExplain() {
    if (!canSubmit) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await explainSolution(question.trim(), solution.trim());
      setResult(res);
    } finally {
      setLoading(false);
    }
  }

  function handleSample() {
    setQuestion(sampleQuestion);
    setSolution(sampleSolution);
    setResult(null);
  }

  function handleClear() {
    setQuestion('');
    setSolution('');
    setResult(null);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* ── Input panel ── */}
      <div className="space-y-5">
        <div className="rounded-2xl bg-surface border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <label htmlFor="explain-question" className="text-sm font-semibold text-foreground">
              Question
            </label>
            <button
              onClick={handleSample}
              className="text-xs text-primary-light hover:text-primary transition-colors"
            >
              Load sample
            </button>
          </div>
          <textarea
            id="explain-question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={5}
            placeholder="Paste the math question / problem statement here…"
            className="w-full resize-y rounded-xl bg-background border border-border
                       focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20
                       text-sm text-foreground placeholder:text-text-dim p-3 transition-all leading-relaxed"
          />
        </div>

        <div className="rounded-2xl bg-surface border border-border p-5">
          <label htmlFor="explain-solution" className="block text-sm font-semibold text-foreground mb-4">
            Solution
          </label>
          <textarea
            id="explain-solution"
            value={solution}
            onChange={(e) => setSolution(e.target.value)}
            rows={8}
            placeholder="Paste the solution you want broken down step by step…"
            className="w-full resize-y rounded-xl bg-background border border-border
                       focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20
                       text-sm text-foreground placeholder:text-text-dim p-3 transition-all leading-relaxed"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExplain}
            disabled={!canSubmit}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl
                       bg-gradient-to-r from-primary to-primary-light text-white font-medium text-sm
                       disabled:opacity-50 disabled:cursor-not-allowed
                       hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5
                       disabled:hover:translate-y-0 disabled:hover:shadow-none
                       transition-all duration-200"
          >
            {loading ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Explaining…
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Explain Step by Step
              </>
            )}
          </button>
          {(question || solution) && (
            <button
              onClick={handleClear}
              className="px-5 py-3.5 rounded-2xl text-text-muted text-sm border border-border
                         hover:border-border-light hover:text-foreground transition-all"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* ── Output panel ── */}
      <div className="lg:sticky lg:top-20 lg:self-start">
        {/* Empty state */}
        {!loading && !result && (
          <div className="rounded-2xl bg-surface border border-dashed border-border p-10 text-center h-full flex flex-col items-center justify-center min-h-[300px]">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <svg className="w-7 h-7 text-primary-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <p className="text-sm text-text-muted font-medium">Your step-by-step breakdown appears here</p>
            <p className="text-xs text-text-dim mt-1 max-w-xs">
              Enter a question and its solution, then click &quot;Explain Step by Step&quot;.
            </p>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="rounded-2xl glass border border-primary/20 p-6 space-y-4">
            <div className="h-5 w-48 rounded-md bg-surface-lighter animate-pulse" />
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-surface-lighter animate-pulse shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 rounded bg-surface-lighter animate-pulse" />
                  <div className="h-3 w-full rounded bg-surface-lighter animate-pulse" />
                  <div className="h-3 w-4/5 rounded bg-surface-lighter animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Result */}
        {!loading && result && (
          <div className="rounded-2xl glass border border-primary/20 p-6 animate-fade-in-up">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <h2 className="text-base font-bold">Step-by-Step Explanation</h2>
            </div>

            {/* Steps */}
            <div className="space-y-4">
              {result.steps.map((step) => (
                <div key={step.stepNumber} className="flex gap-3">
                  <div className="shrink-0 w-8 h-8 rounded-lg bg-primary/15 border border-primary/20 flex items-center justify-center">
                    <span className="text-xs font-bold text-primary-light">{step.stepNumber}</span>
                  </div>
                  <div className="flex-1 pb-1">
                    <h3 className="text-sm font-semibold text-foreground mb-1">{step.title}</h3>
                    <p className="text-sm text-text-muted leading-relaxed">{step.content}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            {result.summary && (
              <div className="mt-5 pt-5 border-t border-border">
                <div className="rounded-xl bg-accent-secondary/5 border border-accent-secondary/20 p-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <svg className="w-4 h-4 text-accent-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-xs font-bold uppercase tracking-wide text-accent-secondary">Key Takeaway</span>
                  </div>
                  <p className="text-sm text-text-muted leading-relaxed">{result.summary}</p>
                </div>
              </div>
            )}

            {/* Mocked notice */}
            <p className="mt-4 text-[11px] text-text-dim text-center">
              This explanation is currently AI-simulated (demo mode).
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
