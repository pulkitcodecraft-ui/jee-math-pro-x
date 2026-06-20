'use client';

import MathText from '@/components/ui/MathText';
import { isAnswerStep, type TutorStep } from '@/lib/ai/parseSteps';

/**
 * A single step in a tutor solution, rendered as a premium card with a
 * numbered badge on a vertical timeline. The final "Answer" step gets a
 * highlighted, primary-accented treatment.
 */
export default function StepCard({
  step,
  index,
  isLast,
}: {
  step: TutorStep;
  index: number;
  isLast: boolean;
}) {
  const isAnswer = isAnswerStep(step);

  return (
    <div
      className="relative flex gap-3 opacity-0 animate-fade-in-up"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      {/* Timeline rail */}
      <div className="flex flex-col items-center shrink-0">
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ring-4 ring-surface
            ${
              isAnswer
                ? 'bg-gradient-to-br from-primary to-primary-light text-white shadow-lg shadow-primary/30'
                : 'bg-surface-lighter border border-border-light text-primary-light'
            }`}
        >
          {isAnswer ? <CheckIcon /> : step.number}
        </span>
        {!isLast && <span className="w-px flex-1 my-1 bg-gradient-to-b from-border-light to-transparent" />}
      </div>

      {/* Card */}
      <div
        className={`flex-1 mb-2.5 rounded-xl border overflow-hidden transition-colors
          ${
            isAnswer
              ? 'border-primary/40 bg-primary/[0.07] shadow-lg shadow-primary/5'
              : 'border-border bg-surface-light'
          }`}
      >
        <div
          className={`px-3.5 pt-2.5 pb-1 text-[13px] font-semibold tracking-tight
            ${isAnswer ? 'text-primary-light' : 'text-foreground'}`}
        >
          <MathText text={step.title} />
        </div>
        {step.body && (
          <div className="px-3.5 pb-3 pt-0.5 text-[13px] leading-relaxed text-text-muted">
            <MathText text={step.body} />
          </div>
        )}
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 6 9 17l-5-5" />
    </svg>
  );
}
