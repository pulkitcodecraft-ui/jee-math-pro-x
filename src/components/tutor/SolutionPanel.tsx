'use client';

import { useMemo } from 'react';
import { parseSteps } from '@/lib/ai/parseSteps';
import MathText from '@/components/ui/MathText';
import StepCard from './StepCard';

/**
 * Renders a raw tutor reply as a sequence of step cards. If the reply has a
 * single unstructured "Solution" step we fall back to a plain MathText render
 * (no card chrome) so short conversational follow-ups stay lightweight.
 */
export default function SolutionPanel({ rawResponse }: { rawResponse: string }) {
  const steps = useMemo(() => parseSteps(rawResponse), [rawResponse]);

  const isSingleBlob =
    steps.length === 1 && (steps[0].title === 'Solution' || steps[0].title === 'Overview');

  if (isSingleBlob) {
    return (
      <div className="rounded-2xl rounded-tl-sm bg-surface-light border border-border px-3.5 py-2.5 text-sm text-text-muted leading-relaxed max-w-full overflow-x-auto">
        <MathText text={steps[0].body} />
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {steps.map((step, i) => (
        <StepCard
          key={`${step.number}-${i}`}
          step={step}
          index={i}
          isLast={i === steps.length - 1}
        />
      ))}
    </div>
  );
}
