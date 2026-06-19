'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';

export default function ProfilePage() {
  const router = useRouter();
  const { firebaseUser, profile, loading, isConfigured, signOut } = useAuth();

  // Protect the route — bounce logged-out users to login
  useEffect(() => {
    if (!loading && isConfigured && !firebaseUser) {
      router.replace('/login?next=/profile');
    }
  }, [loading, isConfigured, firebaseUser, router]);

  async function handleSignOut() {
    await signOut();
    router.replace('/');
  }

  // Loading state
  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16 flex items-center justify-center">
        <svg className="w-6 h-6 animate-spin text-primary-light" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  // Not configured — explain why auth is unavailable
  if (!isConfigured) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16 text-center">
        <div className="inline-flex w-14 h-14 rounded-2xl bg-amber-500/10 items-center justify-center mb-4">
          <svg className="w-7 h-7 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.999L13.732 4.002c-.77-1.333-2.694-1.333-3.464 0L3.34 16.002c-.77 1.332.192 2.999 1.732 2.999z" />
          </svg>
        </div>
        <h1 className="text-xl font-bold mb-2">Authentication not configured</h1>
        <p className="text-sm text-text-muted max-w-md mx-auto">
          Add your Firebase keys to <code className="font-mono">.env.local</code> (see{' '}
          <code className="font-mono">.env.local.example</code>) to enable accounts and profiles.
        </p>
        <Link href="/topics" className="inline-block mt-6 text-sm text-primary-light hover:text-primary transition-colors">
          ← Back to topics
        </Link>
      </div>
    );
  }

  // Redirect in progress
  if (!firebaseUser) {
    return <div className="max-w-2xl mx-auto px-6 py-16" />;
  }

  const name = profile?.displayName || firebaseUser.displayName || 'Student';
  const email = profile?.email || firebaseUser.email || '';
  const role = profile?.role || 'student';
  const initial = name.charAt(0).toUpperCase();

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold tracking-tight mb-8">
        Your <span className="gradient-text">Profile</span>
      </h1>

      {/* Profile card */}
      <div className="rounded-2xl bg-surface border border-border p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            {initial}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">{name}</h2>
              <span
                className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded-md border ${
                  role === 'admin'
                    ? 'bg-accent/15 text-accent border-accent/30'
                    : 'bg-primary/10 text-primary-light border-primary/20'
                }`}
              >
                {role}
              </span>
            </div>
            <p className="text-sm text-text-muted mt-0.5">{email}</p>
          </div>
        </div>

        {/* Details */}
        <div className="mt-6 pt-6 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Detail label="Display name" value={name} />
          <Detail label="Email" value={email} />
          <Detail label="Account type" value={role === 'admin' ? 'Administrator' : 'Student'} />
          <Detail
            label="Member since"
            value={profile?.createdAt ? profile.createdAt.toLocaleDateString() : '—'}
          />
        </div>

        {/* Admin shortcut */}
        {role === 'admin' && (
          <Link
            href="/admin"
            className="mt-6 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent/10 border border-accent/20 text-sm font-medium text-accent hover:bg-accent/20 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Open Admin Dashboard
          </Link>
        )}
      </div>

      {/* Sign out */}
      <button
        onClick={handleSignOut}
        className="mt-6 px-5 py-2.5 rounded-xl text-sm font-medium border border-border text-text-muted hover:text-foreground hover:border-border-light transition-all"
      >
        Sign out
      </button>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wide text-text-dim mb-1">{label}</p>
      <p className="text-sm text-foreground break-words">{value}</p>
    </div>
  );
}
