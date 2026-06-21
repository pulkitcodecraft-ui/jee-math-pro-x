import Link from 'next/link';
import Logo from '@/components/ui/Logo';

const links = [
  { label: 'Topics', href: '/topics' },
  { label: 'AI Explain', href: '/explain' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Privacy', href: '/privacy' },
];

export default function AppFooter() {
  return (
    <footer className="border-t border-border bg-surface/30 mt-10 sm:mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Logo size={28} />

        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs text-text-muted hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <p className="text-xs text-text-dim">
          © {new Date().getFullYear()} JEE Math Pro
        </p>
      </div>
    </footer>
  );
}
