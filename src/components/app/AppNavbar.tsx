'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
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

  // History is only relevant (and accessible) once signed in.
  const links = isLoggedIn ? [...navLinks, { href: '/history', label: 'History' }] : navLinks;

  async function handleSignOut() {
    setMenuOpen(false);
    setMobileOpen(false);
    await signOut();
    router.replace('/');
  }

  return (
    <nav className="sticky top-0 z-50 glass border-b border-border">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Logo size={32} />

        {/* Desktop Nav Links */}
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

        {/* Right side */}
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

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2"
          aria-label="Toggle menu"
        >
          <div className="flex flex-col gap-1">
            <span className={`w-5 h-0.5 bg-foreground transition-all ${mobileOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
            <span className={`w-5 h-0.5 bg-foreground transition-all ${mobileOpen ? 'opacity-0' : ''}`} />
            <span className={`w-5 h-0.5 bg-foreground transition-all ${mobileOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border px-6 py-4 flex flex-col gap-3 bg-surface">
          {links.map((link) => (
            <Link key={link.href} href={link.href}
              className={`text-sm ${pathname.startsWith(link.href) ? 'text-primary-light' : 'text-text-muted'}`}
              onClick={() => setMobileOpen(false)}>
              {link.label}
            </Link>
          ))}
          <hr className="border-border" />
          {isLoggedIn ? (
            <>
              <div className="text-xs text-text-dim">{firebaseUser?.email}</div>
              <Link href="/profile" className="text-sm text-text-muted" onClick={() => setMobileOpen(false)}>Profile</Link>
              {profile?.role === 'admin' && (
                <Link href="/admin" className="text-sm text-accent" onClick={() => setMobileOpen(false)}>Admin Dashboard</Link>
              )}
              <button onClick={handleSignOut} className="text-sm text-left text-text-muted hover:text-red-400">Sign out</button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm text-text-muted" onClick={() => setMobileOpen(false)}>Log in</Link>
              <Link href="/login?mode=signup" className="text-sm text-primary-light" onClick={() => setMobileOpen(false)}>Sign up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
