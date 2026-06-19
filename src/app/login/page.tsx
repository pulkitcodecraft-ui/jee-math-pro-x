'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth, friendlyAuthError } from '@/lib/auth';
import Logo from '@/components/ui/Logo';

type Mode = 'login' | 'signup';

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn, signUp, signInWithGoogle, firebaseUser, loading, isConfigured } = useAuth();

  const [mode, setMode] = useState<Mode>(
    searchParams.get('mode') === 'signup' ? 'signup' : 'login'
  );
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const redirectTo = searchParams.get('next') || '/topics';

  // Already-logged-in users shouldn't see the login page
  useEffect(() => {
    if (!loading && firebaseUser) {
      router.replace(redirectTo);
    }
  }, [loading, firebaseUser, router, redirectTo]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (mode === 'signup') {
        await signUp(email.trim(), password, displayName.trim());
      } else {
        await signIn(email.trim(), password);
      }
      router.replace(redirectTo);
    } catch (err) {
      setError(friendlyAuthError(err));
    } finally {
      setSubmitting(false);
    }
  }

  function switchMode(next: Mode) {
    setMode(next);
    setError(null);
  }

  return (
    <main className="min-h-screen flex flex-col">
      {/* Minimal top bar */}
      <header className="px-6 py-5">
        <Logo size={32} />
      </header>

      {/* Centered card */}
      <div className="flex-1 flex items-center justify-center px-6 py-10 relative overflow-hidden">
        {/* Background orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-glow delay-700" />
        </div>

        <div className="relative z-10 w-full max-w-md">
          <div className="rounded-2xl glass border border-border p-8">
            {/* Heading */}
            <h1 className="text-2xl font-bold tracking-tight mb-1">
              {mode === 'login' ? 'Welcome back' : 'Create your account'}
            </h1>
            <p className="text-sm text-text-muted mb-6">
              {mode === 'login'
                ? 'Log in to submit approaches and track your progress.'
                : 'Sign up to join the community — it only takes a moment.'}
            </p>

            {/* Mode toggle */}
            <div className="flex p-1 rounded-xl bg-surface border border-border mb-6">
              <button
                type="button"
                onClick={() => switchMode('login')}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                  mode === 'login'
                    ? 'bg-primary/15 text-primary-light'
                    : 'text-text-muted hover:text-foreground'
                }`}
              >
                Log in
              </button>
              <button
                type="button"
                onClick={() => switchMode('signup')}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                  mode === 'signup'
                    ? 'bg-primary/15 text-primary-light'
                    : 'text-text-muted hover:text-foreground'
                }`}
              >
                Sign up
              </button>
            </div>

            {/* Not-configured notice */}
            {!isConfigured && (
              <div className="mb-5 rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 text-xs text-amber-300 leading-relaxed">
                Firebase keys aren&apos;t set yet. Add them to{' '}
                <code className="font-mono">.env.local</code> (see{' '}
                <code className="font-mono">.env.local.example</code>) to enable
                real sign in.
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="mb-5 rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-300 leading-relaxed">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div>
                  <label htmlFor="displayName" className="block text-xs font-medium text-text-muted mb-1.5">
                    Display name
                  </label>
                  <input
                    id="displayName"
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Aditya Verma"
                    className="w-full px-4 py-3 rounded-xl bg-surface border border-border
                               focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20
                               text-sm text-foreground placeholder:text-text-dim transition-all"
                  />
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-xs font-medium text-text-muted mb-1.5">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-surface border border-border
                             focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20
                             text-sm text-foreground placeholder:text-text-dim transition-all"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-xs font-medium text-text-muted mb-1.5">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  minLength={6}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === 'signup' ? 'At least 6 characters' : '••••••••'}
                  className="w-full px-4 py-3 rounded-xl bg-surface border border-border
                             focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20
                             text-sm text-foreground placeholder:text-text-dim transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl
                           bg-gradient-to-r from-primary to-primary-light text-white font-medium text-sm
                           disabled:opacity-50 disabled:cursor-not-allowed
                           hover:shadow-lg hover:shadow-primary/25 transition-all duration-200"
              >
                {submitting ? (
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : mode === 'login' ? (
                  'Log in'
                ) : (
                  'Create account'
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-2">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-text-dim">or</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Google sign-in */}
            <button
              type="button"
              onClick={async () => {
                setError(null);
                setSubmitting(true);
                try {
                  await signInWithGoogle();
                  // Don't redirect manually — the useEffect watching firebaseUser
                  // will fire once onAuthStateChanged updates, and redirect then.
                } catch (err) {
                  setError(friendlyAuthError(err));
                  setSubmitting(false);
                }
              }}
              disabled={submitting}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl
                         bg-surface border border-border hover:border-border-light
                         text-sm font-medium text-foreground
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all duration-200"
            >
              {/* Google SVG logo */}
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            {/* Switch prompt */}
            <p className="text-xs text-text-dim text-center mt-6">
              {mode === 'login' ? (
                <>
                  Don&apos;t have an account?{' '}
                  <button onClick={() => switchMode('signup')} className="text-primary-light hover:text-primary transition-colors">
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button onClick={() => switchMode('login')} className="text-primary-light hover:text-primary transition-colors">
                    Log in
                  </button>
                </>
              )}
            </p>
          </div>

          {/* Back to browsing */}
          <p className="text-center mt-6">
            <Link href="/topics" className="text-xs text-text-dim hover:text-text-muted transition-colors">
              ← Continue browsing without an account
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
