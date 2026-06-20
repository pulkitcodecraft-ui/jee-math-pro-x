import type { CategoryId } from '@/lib/data/syllabus';

/**
 * Quiet, subject-grounded line motifs for each syllabus category.
 * All use `currentColor` so they inherit a single accent color (no rainbow)
 * and stay consistent as a family.
 */

const common = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

export default function CategoryMotif({
  id,
  className,
}: {
  id: CategoryId;
  className?: string;
}) {
  switch (id) {
    // Algebra — an x² parabola curve through an axis cross.
    case 'algebra':
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path {...common} d="M3 21h18M5 21V5" opacity={0.5} />
          <path {...common} d="M5 19C8 6 16 6 19 19" />
        </svg>
      );

    // Trigonometry — a unit circle with a sine wave through it.
    case 'trigonometry':
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <circle {...common} cx="8" cy="12" r="5" opacity={0.55} />
          <path {...common} d="M3 12c2.5-6 5-6 7.5 0s5 6 7.5 0" />
        </svg>
      );

    // Calculus — a curve with a tangent line touching it.
    case 'calculus':
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path {...common} d="M3 19C7 19 9 5 21 5" />
          <path {...common} d="M5 9l14 9" opacity={0.6} />
          <circle {...common} cx="12" cy="11.7" r="1.1" />
        </svg>
      );

    // Coordinate Geometry — overlapping conic outlines (circle + ellipse).
    case 'coordinate-geometry':
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <circle {...common} cx="10" cy="12" r="6" />
          <ellipse {...common} cx="15" cy="12" rx="3.5" ry="6.5" opacity={0.6} />
        </svg>
      );

    // Vectors & 3D — a small 3-axis arrow mark.
    case 'vectors-3d':
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path {...common} d="M6 18V8m0 10l-2.2-2.2M6 8l2.2 2.2" />
          <path {...common} d="M6 18h11m0 0l-2.4-1.4M17 18l-2.4 1.4" opacity={0.85} />
          <path {...common} d="M6 18l8-6m0 0l-2.8.2M14 12l.3 2.7" opacity={0.6} />
        </svg>
      );

    default:
      return null;
  }
}
