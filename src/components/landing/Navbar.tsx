'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import Logo from '@/components/ui/Logo';

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Topics', href: '#topics' },
  { label: 'How It Works', href: '#how-it-works' },
];

export default function Navbar() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { firebaseUser, profile, loading, isConfigured, signOut } = useAuth();
  const isLoggedIn = isConfigured && !!firebaseUser;
  const name = profile?.displayName || firebaseUser?.displayName || 'Student';
  const initial = name.charAt(0).toUpperCase();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  async function handleSignOut() {
    setMenuOpen(false);
    setMobileMenuOpen(false);
    await signOut();
    router.replace('/');
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'py-3 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-border/60'
          : 'py-5 bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between gap-4">
        {/* Logo */}
        <Logo size={34} className="shrink-0" />

        {/* Center nav pill (AI Fiesta bounded buttons) */}
        <nav
          className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center rounded-full border border-border/80 bg-surface/50 backdrop-blur-md px-1.5 py-1.5 shadow-lg shadow-black/20"
          aria-label="Main navigation"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-5 py-2 text-sm font-medium text-text-muted hover:text-foreground hover:bg-surface-lighter transition-colors duration-300"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right actions */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          {loading ? (
            <div className="w-9 h-9 rounded-full bg-surface-light animate-pulse" />
          ) : isLoggedIn ? (
            <UserMenu
              name={name}
              email={firebaseUser?.email}
              initial={initial}
              isAdmin={profile?.role === 'admin'}
              menuOpen={menuOpen}
              onToggle={() => setMenuOpen((o) => !o)}
              onClose={() => setMenuOpen(false)}
              onSignOut={handleSignOut}
            />
          ) : (
            <>
              <Link
                href="/login"
                id="navbar-login"
                className="px-4 py-2 text-sm font-medium text-text-muted hover:text-foreground transition-colors duration-200"
              >
                Log in
              </Link>
              {/* Primary CTA — dark pill with glowing gradient border, AI Fiesta style */}
              <Link href="/topics" id="navbar-start" className="glow-border rounded-full">
                <span className="group relative flex items-center gap-2 rounded-full bg-[#0b0b14] px-5 py-2.5 text-sm font-semibold text-foreground transition-colors duration-300 hover:bg-surface-light">
                  Start Learning
                  <svg
                    className="w-4 h-4 text-primary-light transition-transform duration-300 group-hover:translate-x-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          id="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen((o) => !o)}
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl border border-border bg-surface-light/80 text-foreground hover:border-primary/40 transition-colors"
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu — premium dropdown with glow boundary */}
      <div
        className={`md:hidden px-4 transition-all duration-300 overflow-hidden ${
          mobileMenuOpen ? 'max-h-[85vh] opacity-100 mt-3' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="glow-border rounded-2xl">
          <div className="rounded-2xl bg-[#0b0b14]/95 backdrop-blur-xl border border-border/50 overflow-hidden">
            <div className="p-5 flex flex-col gap-1">
              <nav className="flex flex-col gap-1 rounded-xl border border-border bg-surface/50 p-1.5 mb-3">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="rounded-lg px-4 py-2.5 text-sm font-medium text-text-muted hover:text-foreground hover:bg-surface-lighter transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
              </nav>

              {isLoggedIn ? (
                <>
                  <div className="flex items-center gap-3 px-2 py-2 mb-2">
                    <span className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-sm font-bold">
                      {initial}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{name}</p>
                      <p className="text-xs text-text-dim truncate">{firebaseUser?.email}</p>
                    </div>
                  </div>
                  <Link
                    href="/history"
                    className="px-4 py-2.5 text-sm text-text-muted hover:text-foreground rounded-lg hover:bg-surface-lighter transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    History
                  </Link>
                  <Link
                    href="/profile"
                    className="px-4 py-2.5 text-sm text-text-muted hover:text-foreground rounded-lg hover:bg-surface-lighter transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    href="/topics"
                    className="mt-2 px-5 py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-primary to-primary-light text-white text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Continue Learning
                  </Link>
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
                    className="px-4 py-2.5 text-sm font-medium text-text-muted hover:text-foreground rounded-lg hover:bg-surface-lighter transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Log in
                  </Link>
                  <Link
                    href="/topics"
                    className="mt-2 px-5 py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-primary to-primary-light text-white text-center shadow-lg shadow-primary/20"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Start Learning
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function UserMenu({
  name,
  email,
  initial,
  isAdmin,
  menuOpen,
  onToggle,
  onClose,
  onSignOut,
}: {
  name: string;
  email?: string | null;
  initial: string;
  isAdmin?: boolean;
  menuOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  onSignOut: () => void;
}) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full border border-border bg-surface/60 hover:bg-surface-lighter hover:border-primary/30 transition-all duration-300"
      >
        <span className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-sm font-bold shadow-md shadow-primary/20">
          {initial}
        </span>
        <svg
          className={`w-3.5 h-3.5 text-text-dim transition-transform duration-300 ${menuOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {menuOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={onClose} />
          <div className="absolute right-0 mt-2 w-56 z-20 rounded-2xl border border-border bg-[#0b0b14]/95 backdrop-blur-xl shadow-2xl shadow-black/50 py-2 animate-fade-in overflow-hidden">
            <div className="px-4 py-3 border-b border-border">
              <p className="text-sm font-medium truncate">{name}</p>
              <p className="text-xs text-text-dim truncate">{email}</p>
            </div>
            <Link
              href="/topics"
              onClick={onClose}
              className="block px-4 py-2.5 text-sm text-text-muted hover:text-foreground hover:bg-surface-light transition-colors"
            >
              Topics
            </Link>
            <Link
              href="/history"
              onClick={onClose}
              className="block px-4 py-2.5 text-sm text-text-muted hover:text-foreground hover:bg-surface-light transition-colors"
            >
              History
            </Link>
            <Link
              href="/profile"
              onClick={onClose}
              className="block px-4 py-2.5 text-sm text-text-muted hover:text-foreground hover:bg-surface-light transition-colors"
            >
              Profile
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                onClick={onClose}
                className="block px-4 py-2.5 text-sm text-accent hover:bg-surface-light transition-colors"
              >
                Admin Dashboard
              </Link>
            )}
            <div className="my-1 border-t border-border" />
            <button
              onClick={onSignOut}
              className="block w-full text-left px-4 py-2.5 text-sm text-text-muted hover:text-red-400 hover:bg-surface-light transition-colors"
            >
              Sign out
            </button>
          </div>
        </>
      )}
    </div>
  );
}
