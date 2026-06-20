'use client';

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from 'react';

type Direction = 'up' | 'down' | 'left' | 'right' | 'scale' | 'fade';

const OFFSETS: Record<Direction, CSSProperties> = {
  up: { ['--reveal-y' as string]: '34px' },
  down: { ['--reveal-y' as string]: '-34px' },
  left: { ['--reveal-x' as string]: '-48px', ['--reveal-y' as string]: '0px' },
  right: { ['--reveal-x' as string]: '48px', ['--reveal-y' as string]: '0px' },
  scale: { ['--reveal-s' as string]: '0.92', ['--reveal-y' as string]: '12px' },
  fade: { ['--reveal-y' as string]: '0px' },
};

interface RevealProps {
  children: ReactNode;
  /** Slide direction the element travels in from. */
  direction?: Direction;
  /** Entrance delay in ms (for staggering). */
  delay?: number;
  /** Render as a different element/component (e.g. Link). */
  as?: ElementType;
  className?: string;
  /** How much must be visible before revealing (0–1). */
  threshold?: number;
  /** Replay every time it enters the viewport instead of once. */
  repeat?: boolean;
  style?: CSSProperties;
  /** Forwarded to the underlying element (id, href, onClick, etc.). */
  [key: string]: unknown;
}

/**
 * Premium scroll-reveal wrapper. Slides + fades + un-blurs its children into
 * place when they enter the viewport, using the shared `--ease-premium`
 * easing. Direction and delay drive the staggered, directional "sliding"
 * choreography across the landing page.
 */
export default function Reveal({
  children,
  direction = 'up',
  delay = 0,
  as,
  className = '',
  threshold = 0.15,
  repeat = false,
  style,
  ...rest
}: RevealProps) {
  const Tag = (as ?? 'div') as ElementType;
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (!repeat) observer.unobserve(entry.target);
        } else if (repeat) {
          setVisible(false);
        }
      },
      { threshold, rootMargin: '0px 0px -8% 0px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, repeat]);

  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? 'reveal-visible' : ''} ${className}`}
      style={{
        ...OFFSETS[direction],
        ['--reveal-delay' as string]: `${delay}ms`,
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
