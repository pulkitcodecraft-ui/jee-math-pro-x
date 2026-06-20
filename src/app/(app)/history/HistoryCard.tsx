'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { HistoryItem } from '@/types/history';

const difficultyStyles: Record<string, string> = {
  Easy: 'bg-accent-secondary/10 text-accent-secondary border-accent-secondary/30',
  Medium: 'bg-amber-400/10 text-amber-300 border-amber-400/30',
  Hard: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
};

function formatDate(d: Date): string {
  return d.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function HistoryCard({
  item,
  onDelete,
  deleting,
}: {
  item: HistoryItem;
  onDelete: (item: HistoryItem) => void;
  deleting: boolean;
}) {
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="group relative rounded-2xl bg-surface border border-border hover:border-primary/40 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/5">
      <Link
        href={`/explain?history=${encodeURIComponent(item.id)}`}
        className="block p-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-2xl"
      >
        {/* Tags */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {item.topic && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/25 text-[11px] font-medium text-primary-light">
              {item.topic}
            </span>
          )}
          {item.difficulty && (
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full border text-[11px] font-medium ${
                difficultyStyles[item.difficulty] ?? difficultyStyles.Medium
              }`}
            >
              {item.difficulty}
            </span>
          )}
          {item.attachment && (
            <span className="inline-flex items-center gap-1 text-[11px] text-text-dim" title="Has an attached file">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
              File
            </span>
          )}
        </div>

        {/* Question snippet */}
        <p className="text-sm text-foreground leading-relaxed line-clamp-3 pr-8">{item.question}</p>

        {/* Footer */}
        <div className="mt-3 flex items-center gap-3 text-xs text-text-dim">
          <span>{formatDate(item.createdAt)}</span>
          {item.method && (
            <span className="truncate">· {item.method}</span>
          )}
        </div>
      </Link>

      {/* Delete control */}
      <div className="absolute top-4 right-4">
        {confirming ? (
          <div className="flex items-center gap-1">
            <button
              onClick={() => onDelete(item)}
              disabled={deleting}
              className="px-2 py-1 rounded-md bg-rose-500/15 border border-rose-500/30 text-[11px] text-rose-300 hover:bg-rose-500/25 transition-colors disabled:opacity-50"
            >
              {deleting ? 'Deleting…' : 'Delete'}
            </button>
            <button
              onClick={() => setConfirming(false)}
              disabled={deleting}
              className="px-2 py-1 rounded-md border border-border text-[11px] text-text-muted hover:text-foreground transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirming(true)}
            aria-label="Delete from history"
            className="w-7 h-7 rounded-lg flex items-center justify-center text-text-dim opacity-0 group-hover:opacity-100 focus:opacity-100 hover:text-rose-400 hover:bg-rose-500/10 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
