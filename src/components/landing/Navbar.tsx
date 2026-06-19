'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Logo from '@/components/ui/Logo';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
          <Link
            href="/login"
            className="text-sm text-text-muted hover:text-foreground transition-colors"
          >
            Log in
          </Link>
          <Link
            href="/topics"
            className="px-5 py-2.5 text-sm font-medium rounded-xl bg-gradient-to-r from-primary to-primary-light text-white text-center"
          >
            Start Learning
          </Link>
        </div>
      </div>
    </nav>
  );
}
