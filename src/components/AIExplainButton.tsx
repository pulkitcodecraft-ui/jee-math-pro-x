'use client';

/**
 * "Samjhao AI se" — small button pinned to the bottom-right of a solution card.
 * Clicking it opens the AIExplainPanel (the Hinglish AI Tutor chat).
 *
 * The parent solution card must be `position: relative` for the absolute
 * placement to anchor correctly.
 */

import { useState } from 'react';
import AIExplainPanel from './AIExplainPanel';

interface AIExplainButtonProps {
  questionText: string;
  solutionText: string;
  imageUrl?: string;
}

export default function AIExplainButton({
  questionText,
  solutionText,
  imageUrl,
}: AIExplainButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="absolute bottom-4 right-4 z-10 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                   bg-gradient-to-r from-primary to-primary-light text-white text-xs font-medium
                   shadow-lg shadow-primary/25 hover:-translate-y-0.5 hover:shadow-primary/40
                   transition-all duration-200"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        Samjhao AI se
      </button>

      <AIExplainPanel
        open={open}
        onClose={() => setOpen(false)}
        questionText={questionText}
        solutionText={solutionText}
        imageUrl={imageUrl}
      />
    </>
  );
}
