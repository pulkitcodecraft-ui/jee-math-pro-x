'use client';

import SolutionText from './SolutionText';

/**
 * Renders a question stem with KaTeX on list/cards. Clamps long stems so MCQ
 * LaTeX doesn't flood the topic page — full math on the detail page.
 */
export default function QuestionStatementPreview({
  text,
  clamp = 3,
  variant = 'card',
  className = '',
}: {
  text: string;
  clamp?: number;
  /** `card` = bordered box on topic list; `plain` = minimal for sidebars */
  variant?: 'card' | 'plain';
  className?: string;
}) {
  const clampClass =
    clamp === 2 ? 'line-clamp-2' : clamp === 3 ? 'line-clamp-3' : 'line-clamp-4';

  const isCard = variant === 'card';

  return (
    <div
      className={
        isCard
          ? `relative rounded-xl border border-border/60 bg-surface-light/40 px-3.5 py-2.5 ${className}`
          : `relative ${className}`
      }
    >
      <div
        className={`text-sm text-text-muted leading-relaxed ${clampClass} overflow-hidden [&_.katex]:text-[0.95em]`}
      >
        <SolutionText text={text} />
      </div>
      {isCard && (
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-6 rounded-b-xl bg-gradient-to-t from-surface-light/90 to-transparent"
          aria-hidden
        />
      )}
    </div>
  );
}
