import type { Metadata } from 'next';
import ExplainTool from './ExplainTool';

export const metadata: Metadata = {
  title: 'AI Explain — JEE Math Pro',
  description:
    'Paste a JEE Advanced Mathematics question and its solution to get an AI-powered step-by-step explanation.',
};

export default async function ExplainPage({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string; history?: string; q?: string; autosolve?: string }>;
}) {
  const { topic, history, q, autosolve } = await searchParams;
  const initialTopic = typeof topic === 'string' && topic.trim() ? topic.trim() : null;
  const initialHistoryId = typeof history === 'string' && history.trim() ? history.trim() : null;
  const initialQuestion = typeof q === 'string' && q.trim() ? q.trim() : null;
  const autoSolve = autosolve === '1' || autosolve === 'true';

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Page header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-light text-xs font-medium text-primary-light mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-secondary animate-pulse" />
          AI-powered
        </div>
        <h1 className="text-3xl font-bold tracking-tight">
          Step-by-Step <span className="gradient-text">Explainer</span>
        </h1>
        <p className="text-text-muted mt-2 text-sm max-w-2xl">
          Stuck on a problem? Just paste the question — the AI solves it for you, showing multiple
          approaches with clear, step-by-step reasoning and the key insight behind each one.
          Optionally paste your own solution to cross-check it.
        </p>
      </div>

      <ExplainTool
        initialTopic={initialTopic}
        initialHistoryId={initialHistoryId}
        initialQuestion={initialQuestion}
        autoSolve={autoSolve}
      />
    </div>
  );
}
