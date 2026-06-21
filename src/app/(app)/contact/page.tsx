import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact — JEE Math Pro',
  description: 'Reach the JEE Math Pro team with questions, feedback, or content suggestions.',
};

const channels = [
  {
    label: 'Email',
    value: 'hello@jeemathpro.app',
    href: 'mailto:hello@jeemathpro.app',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    ),
  },
  {
    label: 'Feedback & content suggestions',
    value: 'feedback@jeemathpro.app',
    href: 'mailto:feedback@jeemathpro.app',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
    ),
  },
];

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-light text-xs font-medium text-accent-secondary mb-5">
        Contact
      </div>
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
        We&apos;d love to <span className="gradient-text">hear from you</span>
      </h1>
      <p className="text-text-muted leading-relaxed mt-5">
        Found an error in a solution? Have a question type you&apos;d like covered?
        Want to contribute? Reach out — student feedback directly shapes what we
        build next.
      </p>

      <div className="space-y-4 mt-10">
        {channels.map((c) => (
          <a
            key={c.label}
            href={c.href}
            className="flex items-center gap-4 rounded-2xl bg-surface border border-border hover:border-border-light p-5 transition-colors group"
          >
            <span className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center text-primary-light shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {c.icon}
              </svg>
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground">{c.label}</p>
              <p className="text-sm text-text-muted group-hover:text-primary-light transition-colors truncate">
                {c.value}
              </p>
            </div>
          </a>
        ))}
      </div>

      <p className="text-xs text-text-dim mt-8 leading-relaxed">
        These are demo contact addresses for this project. Replace them with your
        real support channels before going live.
      </p>
    </div>
  );
}
