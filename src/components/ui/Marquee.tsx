'use client';

import { type CSSProperties, type ReactNode } from 'react';

interface MarqueeProps {
  children: ReactNode;
  /** Seconds for one full loop — higher is slower. */
  speed?: number;
  /** Slide right-to-left (default) or reversed. */
  reverse?: boolean;
  /** Fade the edges with a gradient mask. */
  fade?: boolean;
  className?: string;
}

/**
 * Infinite horizontal slider. The children are rendered twice back-to-back and
 * the track is translated by -50%, so the loop is seamless. Hover pauses it.
 */
export default function Marquee({
  children,
  speed = 36,
  reverse = false,
  fade = true,
  className = '',
}: MarqueeProps) {
  return (
    <div
      className={`marquee-track group/marquee relative w-full overflow-hidden ${
        fade ? 'marquee-mask' : ''
      } ${className}`}
    >
      <div
        className={`animate-marquee flex w-max shrink-0 items-center gap-4 pr-4 ${
          reverse ? 'marquee-reverse' : ''
        }`}
        style={{ ['--marquee-duration' as string]: `${speed}s` } as CSSProperties}
      >
        {children}
        <span aria-hidden className="contents">
          {children}
        </span>
      </div>
    </div>
  );
}
