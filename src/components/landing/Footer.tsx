import Link from 'next/link';
import Logo from '@/components/ui/Logo';
import Reveal from '@/components/ui/Reveal';

const navButtons = [
  { label: 'Topics', href: '/topics' },
  { label: 'AI Explain', href: '/explain' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

const socials = [
  {
    label: 'X (Twitter)',
    href: 'https://x.com',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: 'YouTube',
    href: 'https://youtube.com',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12z" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden px-4 sm:px-6 pb-10 pt-10">
      <div className="max-w-6xl mx-auto">
        <Reveal direction="up">
          {/* The boundary — a rounded card with an animated glowing gradient border */}
          <div className="glow-border rounded-[28px]">
            <div className="relative rounded-[28px] bg-[#0b0b14]/90 backdrop-blur-xl overflow-hidden">
              {/* Inner ambient glow */}
              <div className="pointer-events-none absolute -top-28 left-1/2 -translate-x-1/2 w-[700px] h-56 bg-primary/15 blur-3xl rounded-full" />
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.04]"
                style={{
                  backgroundImage:
                    'linear-gradient(rgba(99,102,241,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.4) 1px, transparent 1px)',
                  backgroundSize: '46px 46px',
                  maskImage: 'radial-gradient(ellipse 80% 70% at 50% 0%, #000 25%, transparent 70%)',
                  WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 50% 0%, #000 25%, transparent 70%)',
                }}
              />

              <div className="relative z-10 px-6 sm:px-12 pt-14">
                {/* CTA heading */}
                <div className="flex flex-col items-center text-center gap-5">
                  <Logo size={42} />
                  <h2 className="text-2xl sm:text-4xl font-bold tracking-tight max-w-2xl leading-tight">
                    Ready to start <span className="gradient-text">cracking JEE Math?</span>
                  </h2>
                  <p className="text-sm text-text-muted max-w-md leading-relaxed">
                    Multiple approaches, common traps, and step-by-step AI explanations —
                    all in one focused place. No sign-up required to start.
                  </p>

                  {/* The four buttons in a bordered pill */}
                  <nav className="mt-2 inline-flex flex-wrap items-center justify-center gap-1 rounded-full border border-border bg-surface/80 p-1.5 shadow-lg shadow-black/30">
                    {navButtons.map((btn) => (
                      <Link
                        key={btn.label}
                        href={btn.href}
                        className="rounded-full px-5 py-2 text-sm font-medium text-text-muted hover:text-foreground hover:bg-surface-lighter transition-colors duration-300"
                      >
                        {btn.label}
                      </Link>
                    ))}
                  </nav>

                  {/* Primary CTA */}
                  <Link
                    href="/topics"
                    className="group mt-1 inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-primary to-primary-light text-white font-semibold text-sm hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:-translate-y-1 overflow-hidden relative"
                  >
                    <span className="relative z-10">Get Started Now</span>
                    <svg className="relative z-10 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.2s_ease-in-out]" />
                  </Link>

                  {/* Socials */}
                  <div className="flex items-center gap-3 mt-3">
                    {socials.map((s) => (
                      <a
                        key={s.label}
                        href={s.href}
                        aria-label={s.label}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 rounded-xl bg-surface-light border border-border flex items-center justify-center text-text-dim hover:text-foreground hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-300"
                      >
                        {s.icon}
                      </a>
                    ))}
                  </div>
                </div>

                {/* Boundary line, then bottom bar */}
                <div className="mt-12 border-t border-border" />
                <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <p className="text-xs text-text-dim">
                    © {new Date().getFullYear()} JEE Math Pro. All rights reserved.
                  </p>
                  <div className="flex items-center gap-5">
                    <Link href="/privacy" className="text-xs text-text-dim hover:text-foreground transition-colors">
                      Privacy Policy
                    </Link>
                    <Link href="/contact" className="text-xs text-text-dim hover:text-foreground transition-colors">
                      Contact
                    </Link>
                    <span className="text-xs text-text-dim">Not affiliated with the IITs.</span>
                  </div>
                </div>
              </div>

              {/* Giant gradient wordmark, clipped by the boundary */}
              <div className="relative select-none pointer-events-none">
                <h2 className="gradient-text text-center font-extrabold tracking-tighter leading-none translate-y-[20%] text-[20vw] sm:text-[16vw] lg:text-[10rem] opacity-[0.12]">
                  JEE MATH PRO
                </h2>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </footer>
  );
}
