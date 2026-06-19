import type { Metadata } from 'next';
import ExplainTool from './ExplainTool';

export const metadata: Metadata = {
  title: 'AI Explain — JEE Math Pro',
  description:
    'Paste a JEE Advanced Mathematics question and its solution to get an AI-powered step-by-step explanation.',
};

export default function ExplainPage() {
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
          Stuck on why a solution works? Paste the question and the solution, and get a clear,
          structured breakdown of each step and the key insight behind it.
        </p>
      </div>

      <ExplainTool />
    </div>
  );
}
