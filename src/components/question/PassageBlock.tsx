'use client';

import SolutionRichContent from '@/components/question/SolutionRichContent';

/**
 * Shared paragraph / passage stem (text only — no workbook scan on question page).
 */
export default function PassageBlock({
  title = 'Paragraph',
  passage,
  className = '',
}: {
  title?: string;
  passage: string;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-violet-500/25 bg-gradient-to-br from-violet-500/10 to-indigo-500/5 px-4 py-4 ${className}`}
    >
      <p className="text-[11px] font-bold uppercase tracking-widest text-violet-300 mb-2">
        {title}
      </p>
      <div className="text-sm leading-relaxed text-text-muted">
        <SolutionRichContent text={passage} />
      </div>
    </div>
  );
}
