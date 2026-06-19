import Link from 'next/link';

interface LogoProps {
  /** Pixel size of the square mark. Defaults to 36. */
  size?: number;
  /** Show the "JEE Math Pro" wordmark beside the mark. Defaults to true. */
  showWordmark?: boolean;
  /** Wrap in a Link to "/". Defaults to true. */
  href?: string | null;
  className?: string;
}

/**
 * The brand mark: a gradient tile with a stylised function curve f(x) and
 * axis ticks — math-native, and a step up from a raw "π" glyph.
 */
export function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <span
      className="relative inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-primary via-primary-light to-accent shadow-lg shadow-primary/25 ring-1 ring-white/10"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 32 32"
        fill="none"
        className="text-white"
        style={{ width: size * 0.62, height: size * 0.62 }}
      >
        {/* axes */}
        <path
          d="M6 26 L26 26 M6 26 L6 6"
          stroke="currentColor"
          strokeOpacity="0.45"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        {/* f(x) curve */}
        <path
          d="M6 23 C 12 23, 12 9, 18 9 C 23 9, 23 19, 26 19"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* node dot */}
        <circle cx="18" cy="9" r="1.9" fill="currentColor" />
      </svg>
    </span>
  );
}

export default function Logo({
  size = 36,
  showWordmark = true,
  href = '/',
  className = '',
}: LogoProps) {
  const inner = (
    <span className={`inline-flex items-center gap-2.5 group ${className}`}>
      <LogoMark size={size} />
      {showWordmark && (
        <span className="font-bold tracking-tight leading-none" style={{ fontSize: size * 0.46 }}>
          <span className="gradient-text">JEE Math</span>{' '}
          <span className="text-text-muted font-medium">Pro</span>
        </span>
      )}
    </span>
  );

  if (href === null) return inner;

  return (
    <Link href={href} aria-label="JEE Math Pro home" className="inline-flex">
      {inner}
    </Link>
  );
}
