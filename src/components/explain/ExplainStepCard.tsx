'use client';

import MathText from '@/components/ui/MathText';
import type { SolveStep } from '@/lib/ai/types';
import { CommonMistakeCard, KeyInsightCard } from './StepInsightCards';

/**
 * One solving step in AI Explain — timeline rail, explanation body,
 * and premium insight / mistake cards grouped together.
 */
export default function ExplainStepCard({
  step,
  index,
  isLast,
}: {
  step: SolveStep;
  index: number;
  isLast: boolean;
}) {
  const hasExtras = step.key_insight || step.common_mistake;

  return (
    <div
      className="relative flex gap-3 opacity-0 animate-fade-in-up"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      {/* Timeline */}
      <div className="flex flex-col items-center shrink-0 pt-0.5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold bg-primary/15 border border-primary/25 text-primary-light ring-4 ring-surface">
          {step.step_number}
        </span>
        {!isLast && (
          <span className="w-px flex-1 my-1.5 min-h-[16px] bg-gradient-to-b from-primary/30 via-border-light to-transparent" />
        )}
      </div>

      {/* Step body + insight group */}
      <div className="flex-1 min-w-0 mb-3">
        <div
          className={`rounded-xl border border-border bg-surface-light/60 overflow-hidden hover:border-border-light transition-colors ${
            hasExtras ? 'rounded-b-none border-b-0' : ''
          }`}
        >
          <div className="px-3.5 sm:px-4 pt-3.5 pb-1">
            <h3 className="text-[13px] font-semibold text-foreground tracking-tight">
              {step.title}
            </h3>
          </div>
          <div className="px-3.5 sm:px-4 pb-3.5 text-sm text-text-muted leading-relaxed overflow-x-auto">
            <MathText text={step.explanation} />
          </div>
        </div>

        {hasExtras && (
          <div className="rounded-b-xl border border-border border-t-0 overflow-hidden bg-surface-light/30">
            {step.key_insight && (
              <KeyInsightCard
                text={step.key_insight}
                embedded
                hasMistakeBelow={!!step.common_mistake}
              />
            )}
            {step.common_mistake && (
              <CommonMistakeCard text={step.common_mistake} embedded />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
