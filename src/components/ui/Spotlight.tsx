'use client';

import { useEffect } from 'react';

/**
 * Mount once per page. Tracks the pointer and feeds `--mx`/`--my` (as
 * percentages) into whichever `.glow-card` it's hovering, powering the
 * cursor-following border glow defined in globals.css. One delegated listener
 * keeps it cheap regardless of how many cards are on screen.
 */
export default function Spotlight() {
  useEffect(() => {
    let frame = 0;

    const onMove = (e: PointerEvent) => {
      const target = (e.target as HTMLElement | null)?.closest<HTMLElement>('.glow-card');
      if (!target) return;
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = target.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        target.style.setProperty('--mx', `${x}%`);
        target.style.setProperty('--my', `${y}%`);
      });
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
