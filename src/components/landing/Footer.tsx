import Link from 'next/link';
import Logo from '@/components/ui/Logo';

const columns = [
  {
    heading: 'Product',
    links: [
      { label: 'Browse Topics', href: '/topics' },
      { label: 'AI Explain', href: '/explain' },
      { label: 'Submit an Approach', href: '/topics' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy', href: '/privacy' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface/30">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          {/* Brand blurb */}
          <div className="col-span-2">
            <Logo size={34} />
            <p className="text-sm text-text-muted leading-relaxed mt-4 max-w-xs">
              A focused, no-noise way to study JEE Advanced Mathematics — multiple
              approaches, common traps, and step-by-step explanations.
            </p>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.heading}>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-text-dim mb-4">
                {col.heading}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-text-muted hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-dim">
            © {new Date().getFullYear()} JEE Math Pro. Built for aspirants.
          </p>
          <p className="text-xs text-text-dim">
            Not affiliated with the IITs or the JEE examination board.
          </p>
        </div>
      </div>
    </footer>
  );
}
