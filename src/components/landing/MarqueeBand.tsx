'use client';

import Marquee from '@/components/ui/Marquee';
import Reveal from '@/components/ui/Reveal';

const rowOne = [
  'Quadratic Equations',
  'Definite Integrals',
  'Conditional Probability',
  'Complex Numbers',
  'Matrices & Determinants',
  'Permutations & Combinations',
  'Limits & Continuity',
  '3D Geometry',
];

const rowTwo = [
  'Binomial Theorem',
  'Vectors',
  'Differential Equations',
  'Circles & Conics',
  'Trigonometric Identities',
  'Application of Derivatives',
  'Sequences & Series',
  'Functions',
];

function Chip({ label }: { label: string }) {
  return (
    <span className="group inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-border bg-surface px-5 py-2.5 text-sm text-text-muted transition-colors duration-300 hover:border-primary/40 hover:text-foreground">
      <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-br from-primary to-accent transition-transform duration-300 group-hover:scale-150" />
      {label}
    </span>
  );
}

export default function MarqueeBand() {
  return (
    <section className="relative py-16 overflow-hidden border-y border-border/60 bg-surface/20">
      <Reveal direction="fade">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-text-dim mb-8">
          Every JEE Advanced Math chapter — worked, explained, and trap-mapped
        </p>
      </Reveal>

      <div className="flex flex-col gap-4">
        <Marquee speed={42}>
          {rowOne.map((label) => (
            <Chip key={label} label={label} />
          ))}
        </Marquee>
        <Marquee speed={38} reverse>
          {rowTwo.map((label) => (
            <Chip key={label} label={label} />
          ))}
        </Marquee>
      </div>
    </section>
  );
}
