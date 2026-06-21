'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import {
  getPendingApproaches,
  reviewApproach,
} from '@/lib/firebase/approachService';
import type { Approach } from '@/types/approach';
import SolutionText from '@/components/question/SolutionText';

export default function AdminDashboard() {
  const router = useRouter();
  const { firebaseUser, profile, loading } = useAuth();
  const [approaches, setApproaches] = useState<Approach[]>([]);
  const [fetching, setFetching] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [done, setDone] = useState<Record<string, 'approved' | 'rejected'>>({});

  const isAdmin = profile?.role === 'admin';

  const fetchPending = useCallback(async () => {
    setFetching(true);
    try {
      const data = await getPendingApproaches();
      setApproaches(data);
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    if (!loading && (!firebaseUser || !isAdmin)) {
      router.replace('/');
    }
  }, [loading, firebaseUser, isAdmin, router]);

  useEffect(() => {
    if (loading || !isAdmin) return;
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) void fetchPending();
    });
    return () => {
      cancelled = true;
    };
  }, [loading, isAdmin, fetchPending]);

  async function handleReview(id: string, decision: 'approved' | 'rejected') {
    setActionId(id);
    try {
      await reviewApproach(id, decision);
      setDone((prev) => ({ ...prev, [id]: decision }));
    } finally {
      setActionId(null);
    }
  }

  // Auth loading
  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <svg className="w-6 h-6 animate-spin text-primary-light" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  // Not admin
  if (!isAdmin) return null;

  const pending = approaches.filter((a) => !done[a.id]);
  const reviewed = approaches.filter((a) => done[a.id]);

  return (
    <div className="space-y-8">
      {/* Stats bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {[
          { label: 'Pending review', value: pending.length, color: 'text-amber-400' },
          { label: 'Approved today', value: Object.values(done).filter((v) => v === 'approved').length, color: 'text-accent-secondary' },
          { label: 'Rejected today', value: Object.values(done).filter((v) => v === 'rejected').length, color: 'text-red-400' },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl bg-surface border border-border p-4 text-center">
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-text-dim mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Pending list */}
      <div>
        <h2 className="text-base font-semibold mb-4 flex items-center gap-2">
          Pending Submissions
          {fetching && (
            <svg className="w-4 h-4 animate-spin text-text-dim" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          )}
        </h2>

        {!fetching && pending.length === 0 && (
          <div className="rounded-2xl bg-surface border border-dashed border-border p-10 text-center">
            <p className="text-sm text-text-muted">No pending submissions — all caught up!</p>
          </div>
        )}

        <div className="space-y-4">
          {pending.map((approach) => (
            <PendingCard
              key={approach.id}
              approach={approach}
              deciding={actionId === approach.id}
              onApprove={() => handleReview(approach.id, 'approved')}
              onReject={() => handleReview(approach.id, 'rejected')}
            />
          ))}
        </div>
      </div>

      {/* Reviewed this session */}
      {reviewed.length > 0 && (
        <div>
          <h2 className="text-base font-semibold mb-4 text-text-muted">Reviewed this session</h2>
          <div className="space-y-3">
            {reviewed.map((approach) => (
              <div
                key={approach.id}
                className={`rounded-xl border px-4 py-3 flex items-center gap-3 ${
                  done[approach.id] === 'approved'
                    ? 'bg-accent-secondary/5 border-accent-secondary/20'
                    : 'bg-red-500/5 border-red-500/10'
                }`}
              >
                <span className={`text-xs font-bold uppercase ${done[approach.id] === 'approved' ? 'text-accent-secondary' : 'text-red-400'}`}>
                  {done[approach.id]}
                </span>
                <span className="text-sm text-text-muted flex-1 truncate">{approach.label}</span>
                <span className="text-xs text-text-dim truncate max-w-[160px]">
                  Q: {approach.questionId}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function PendingCard({
  approach,
  deciding,
  onApprove,
  onReject,
}: {
  approach: Approach;
  deciding: boolean;
  onApprove: () => void;
  onReject: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-2xl bg-surface border border-border overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-4 p-4 sm:p-5">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-sm font-semibold text-foreground">{approach.label}</span>
            <span className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20">
              pending
            </span>
          </div>
          <p className="text-xs text-text-dim">
            Question ID: <span className="font-mono">{approach.questionId}</span>
            {' · '}
            By: <span className="font-mono">{approach.submittedBy}</span>
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
          <button
            onClick={onApprove}
            disabled={deciding}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent-secondary/10 border border-accent-secondary/20 text-xs font-medium text-accent-secondary hover:bg-accent-secondary/20 disabled:opacity-50 transition-colors"
          >
            {deciding ? (
              <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
            Approve
          </button>
          <button
            onClick={onReject}
            disabled={deciding}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-xs font-medium text-red-400 hover:bg-red-500/20 disabled:opacity-50 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Reject
          </button>
        </div>
      </div>

      {/* Content preview toggle */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full px-5 pb-3 text-left text-xs text-primary-light hover:text-primary transition-colors flex items-center gap-1"
      >
        {expanded ? 'Hide' : 'Preview'} content
        <svg className={`w-3 h-3 transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {expanded && (
        <div className="px-5 pb-5 border-t border-border pt-4 space-y-3 max-w-full overflow-x-auto">
          <div className="text-sm text-text-muted leading-relaxed">
            <SolutionText text={approach.content} />
          </div>
          {approach.imageUrl && (
            <div className="rounded-xl overflow-hidden border border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={approach.imageUrl} alt="Approach image" className="max-h-80 w-full object-contain bg-surface-light" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
