'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import Logo from '@/components/ui/Logo';

const navLinks = [
  { href: '/topics', label: 'Topics' },
  { href: '/explain', label: 'AI Explain' },
];

export default function AppNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { firebaseUser, profile, loading, isConfigured, signOut } = useAuth();

  const isLoggedIn = isConfigured && !!firebaseUser;
  const name = profile?.displayName || firebaseUser?.displayName || 'Student';
  const initial = name.charAt(0).toUpperCase();

  const links = isLoggedIn ? [...navLinks, { href: '/history', label: 'History' }] : navLinks;

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  async function handleSignOut() {
    setMenuOpen(false);
    setMobileOpen(false);
    await signOut();
    router.replace('/');
  }

  return (
    <nav className="sticky top-0 z-50 glass border-b border-border pt-safe">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
        <Logo size={32} />

        <div className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm transition-colors duration-200 ${
                pathname.startsWith(link.href)
                  ? 'text-primary-light font-medium'
                  : 'text-text-muted hover:text-foreground'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {loading ? (
            <div className="w-8 h-8 rounded-full bg-surface-light animate-pulse" />
          ) : isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-surface-light transition-colors"
              >
                <span className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-bold">
                  {initial}
                </span>
                <svg
                  className={`w-3.5 h-3.5 text-text-dim transition-transform ${menuOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 mt-2 w-52 z-20 rounded-xl glass border border-border shadow-xl py-2 animate-fade-in">
                    <div className="px-4 py-2 border-b border-border">
                      <p className="text-sm font-medium truncate">{name}</p>
                      <p className="text-xs text-text-dim truncate">{firebaseUser?.email}</p>
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-text-muted hover:text-foreground hover:bg-surface-light transition-colors"
                    >
                      Profile
                    </Link>
                    {profile?.role === 'admin' && (
                      <Link
                        href="/admin"
                        onClick={() => setMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-accent hover:bg-surface-light transition-colors"
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-sm text-text-muted hover:text-red-400 hover:bg-surface-light transition-colors"
                    >
                      Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 text-sm text-text-muted hover:text-foreground transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/login?mode=signup"
                className="px-4 py-2 text-sm font-medium rounded-lg bg-primary/10 text-primary-light hover:bg-primary/20 transition-colors"
              >
                Sign up
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setMobileOpen((o) => !o)}
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl border border-border bg-surface-light/80 text-foreground hover:border-primary/40 transition-colors"
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu — premium drawer */}
      <div
        className={`md:hidden px-3 sm:px-4 transition-all duration-300 overflow-hidden ${
          mobileOpen ? 'max-h-[85vh] opacity-100 mt-2' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="glow-border rounded-2xl">
          <div className="rounded-2xl bg-[#0b0b14]/95 backdrop-blur-xl border border-border/50 overflow-hidden">
            <div className="p-4 flex flex-col gap-1">
              <nav className="flex flex-col gap-1 rounded-xl border border-border bg-surface/50 p-1.5 mb-2">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                      pathname.startsWith(link.href)
                        ? 'text-primary-light bg-primary/10'
                        : 'text-text-muted hover:text-foreground hover:bg-surface-lighter'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {isLoggedIn ? (
                <>
                  <div className="flex items-center gap-3 px-2 py-2 mb-1">
                    <span className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-sm font-bold">
                      {initial}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{name}</p>
                      <p className="text-xs text-text-dim truncate">{firebaseUser?.email}</p>
                    </div>
                  </div>
                  <Link
                    href="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="px-4 py-2.5 text-sm text-text-muted hover:text-foreground rounded-lg hover:bg-surface-lighter transition-colors"
                  >
                    Profile
                  </Link>
                  {profile?.role === 'admin' && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileOpen(false)}
                      className="px-4 py-2.5 text-sm text-accent rounded-lg hover:bg-surface-lighter transition-colors"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleSignOut}
                    className="mt-1 px-4 py-2.5 text-sm text-left text-text-muted hover:text-red-400 rounded-lg transition-colors"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="px-4 py-2.5 text-sm font-medium text-text-muted hover:text-foreground rounded-lg hover:bg-surface-lighter transition-colors"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/login?mode=signup"
                    onClick={() => setMobileOpen(false)}
                    className="mt-2 px-5 py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-primary to-primary-light text-white text-center shadow-lg shadow-primary/20"
                  >
                    Sign up free
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
