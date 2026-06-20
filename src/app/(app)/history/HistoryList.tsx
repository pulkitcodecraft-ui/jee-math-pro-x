'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { getHistory, deleteHistory } from '@/lib/firebase/historyService';
import type { HistoryItem } from '@/types/history';
import HistoryCard from './HistoryCard';

type Status = 'loading' | 'ready' | 'error';

export default function HistoryList() {
  const { firebaseUser, isConfigured, loading: authLoading } = useAuth();
  const isLoggedIn = isConfigured && !!firebaseUser;

  const [items, setItems] = useState<HistoryItem[]>([]);
  const [status, setStatus] = useState<Status>('loading');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!firebaseUser) return;
    setStatus('loading');
    try {
      const data = await getHistory(firebaseUser.uid);
      setItems(data);
      setStatus('ready');
    } catch (err) {
      console.error('[History] load failed:', err);
      setStatus('error');
    }
  }, [firebaseUser]);

  useEffect(() => {
    if (authLoading) return;
    if (isLoggedIn) {
      load();
    } else {
      setStatus('ready');
    }
  }, [authLoading, isLoggedIn, load]);

  async function handleDelete(item: HistoryItem) {
    if (!firebaseUser) return;
    setDeletingId(item.id);
    try {
      await deleteHistory(firebaseUser.uid, item);
      setItems((prev) => prev.filter((i) => i.id !== item.id));
    } catch (err) {
      console.error('[History] delete failed:', err);
    } finally {
      setDeletingId(null);
    }
  }

  // Resolving auth
  if (authLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="rounded-2xl bg-surface border border-border p-5 space-y-3">
            <div className="h-5 w-24 rounded-full bg-surface-lighter animate-pulse" />
            <div className="h-3 w-full rounded bg-surface-lighter animate-pulse" />
            <div className="h-3 w-4/5 rounded bg-surface-lighter animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  // Logged out
  if (!isLoggedIn) {
    return (
      <div className="rounded-2xl bg-surface border border-dashed border-border p-12 text-center">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-primary-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-sm text-foreground font-medium mb-1">Sign in to see your history</p>
        <p className="text-xs text-text-muted max-w-sm mx-auto mb-5">
          Your solved questions are saved to your account so you can revisit or re-run them anytime.
        </p>
        <Link
          href="/login?next=/history"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary/10 border border-primary/20 text-sm font-medium text-primary-light hover:bg-primary/20 transition-colors"
        >
          Log in
        </Link>
      </div>
    );
  }

  // Loading data
  if (status === 'loading') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="rounded-2xl bg-surface border border-border p-5 space-y-3">
            <div className="h-5 w-24 rounded-full bg-surface-lighter animate-pulse" />
            <div className="h-3 w-full rounded bg-surface-lighter animate-pulse" />
            <div className="h-3 w-4/5 rounded bg-surface-lighter animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  // Error
  if (status === 'error') {
    return (
      <div className="rounded-2xl bg-surface border border-rose-500/30 p-10 text-center">
        <p className="text-sm text-foreground font-medium mb-1">Couldn’t load your history</p>
        <p className="text-xs text-text-muted mb-5">Please check your connection and try again.</p>
        <button
          onClick={load}
          className="px-5 py-2.5 rounded-xl bg-primary/15 border border-primary/30 text-sm text-primary-light hover:bg-primary/25 transition-all"
        >
          Retry
        </button>
      </div>
    );
  }

  // Empty
  if (items.length === 0) {
    return (
      <div className="rounded-2xl bg-surface border border-dashed border-border p-12 text-center">
        <p className="text-sm text-text-muted font-medium mb-1">No history yet</p>
        <p className="text-xs text-text-dim max-w-sm mx-auto mb-5">
          Solve a question in AI Explain and it’ll be saved here automatically.
        </p>
        <Link
          href="/explain"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary/10 border border-primary/20 text-sm font-medium text-primary-light hover:bg-primary/20 transition-colors"
        >
          Go to AI Explain
        </Link>
      </div>
    );
  }

  // List
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {items.map((item) => (
        <HistoryCard
          key={item.id}
          item={item}
          onDelete={handleDelete}
          deleting={deletingId === item.id}
        />
      ))}
    </div>
  );
}
