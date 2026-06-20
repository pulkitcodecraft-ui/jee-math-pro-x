'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import Logo from '@/components/ui/Logo';

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
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  async function handleSignOut() {
    setMenuOpen(false);
    setMobileMenuOpen(false);
    await signOut();
    router.replace('/');
  }

  return (
    <nav
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass py-3 shadow-lg shadow-black/20'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Logo size={38} />

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <a
            href="#features"
            className="text-sm text-text-muted hover:text-foreground transition-colors duration-200"
          >
            Features
          </a>
          <a
            href="#topics"
            className="text-sm text-text-muted hover:text-foreground transition-colors duration-200"
          >
            Topics
          </a>
          <a
            href="#how-it-works"
            className="text-sm text-text-muted hover:text-foreground transition-colors duration-200"
          >
            How It Works
          </a>
        </div>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {loading ? (
            <div className="w-9 h-9 rounded-full bg-surface-light animate-pulse" />
          ) : isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-surface-light transition-colors"
              >
                <span className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-sm font-bold">
                  {initial}
                </span>
                <svg className={`w-3.5 h-3.5 text-text-dim transition-transform ${menuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    <Link href="/topics" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm text-text-muted hover:text-foreground hover:bg-surface-light transition-colors">
                      Topics
                    </Link>
                    <Link href="/history" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm text-text-muted hover:text-foreground hover:bg-surface-light transition-colors">
                      History
                    </Link>
                    <Link href="/profile" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm text-text-muted hover:text-foreground hover:bg-surface-light transition-colors">
                      Profile
                    </Link>
                    {profile?.role === 'admin' && (
                      <Link href="/admin" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm text-accent hover:bg-surface-light transition-colors">
                        Admin Dashboard
                      </Link>
                    )}
                    <button onClick={handleSignOut} className="block w-full text-left px-4 py-2 text-sm text-text-muted hover:text-red-400 hover:bg-surface-light transition-colors">
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
                id="navbar-login"
                className="px-4 py-2 text-sm text-text-muted hover:text-foreground transition-colors duration-200"
              >
                Log in
              </Link>
              <Link
                href="/topics"
                id="navbar-start"
                className="px-5 py-2.5 text-sm font-medium rounded-xl bg-gradient-to-r from-primary to-primary-light text-white hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 hover:-translate-y-0.5"
              >
                Start Learning
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          id="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Toggle menu"
        >
          <span
            className={`w-5 h-0.5 bg-foreground transition-all duration-300 ${
              mobileMenuOpen ? 'rotate-45 translate-y-2' : ''
            }`}
          />
          <span
            className={`w-5 h-0.5 bg-foreground transition-all duration-300 ${
              mobileMenuOpen ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`w-5 h-0.5 bg-foreground transition-all duration-300 ${
              mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
            }`}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          mobileMenuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="glass-light mx-4 mt-3 rounded-2xl p-5 flex flex-col gap-4">
          <a
            href="#features"
            className="text-sm text-text-muted hover:text-foreground transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            Features
          </a>
          <a
            href="#topics"
            className="text-sm text-text-muted hover:text-foreground transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            Topics
          </a>
          <a
            href="#how-it-works"
            className="text-sm text-text-muted hover:text-foreground transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            How It Works
          </a>
          <hr className="border-border" />
          {isLoggedIn ? (
            <>
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-bold">
                  {initial}
                </span>
                <span className="text-xs text-text-dim truncate">{firebaseUser?.email}</span>
              </div>
              <Link href="/history" className="text-sm text-text-muted hover:text-foreground transition-colors" onClick={() => setMobileMenuOpen(false)}>
                History
              </Link>
              <Link href="/profile" className="text-sm text-text-muted hover:text-foreground transition-colors" onClick={() => setMobileMenuOpen(false)}>
                Profile
              </Link>
              <Link
                href="/topics"
                className="px-5 py-2.5 text-sm font-medium rounded-xl bg-gradient-to-r from-primary to-primary-light text-white text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Continue Learning
              </Link>
              <button onClick={handleSignOut} className="text-sm text-left text-text-muted hover:text-red-400 transition-colors">
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-text-muted hover:text-foreground transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Log in
              </Link>
              <Link
                href="/topics"
                className="px-5 py-2.5 text-sm font-medium rounded-xl bg-gradient-to-r from-primary to-primary-light text-white text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Start Learning
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
