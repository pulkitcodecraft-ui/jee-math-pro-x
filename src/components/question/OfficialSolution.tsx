'use client';

import { useMemo } from 'react';
import {
  parseOfficialSolution,
  type SolutionBlock,
} from '@/lib/solution/parseOfficialSolution';
import SolutionRichContent from './SolutionRichContent';
import SolutionText from './SolutionText';
import FigureImage from './FigureImage';

/**
 * Premium official-solution layout: optional diagram(s) → setup → steps → answer.
 * Diagrams belong here (solution section), not on the question stem.
 */
export default function OfficialSolution({
  content,
  solutionImages,
}: {
  content: string;
  solutionImages?: string[];
}) {
  const blocks = useMemo(() => parseOfficialSolution(content), [content]);
  const diagrams = solutionImages?.filter(Boolean) ?? [];

  const hasSteps = blocks.some((b) => b.kind === 'step');
  const hasStructure = blocks.length > 1 || blocks[0]?.kind !== 'text';

  if (!hasStructure) {
    return (
      <div className="space-y-3">
        {diagrams.length > 0 && <SolutionDiagrams images={diagrams} />}
        <div className="rounded-xl border border-border bg-surface-light/50 p-4 sm:p-5 overflow-x-auto">
          <SolutionRichContent text={blocks[0]?.body ?? content} className="text-sm leading-relaxed text-text-muted" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {diagrams.length > 0 && <SolutionDiagrams images={diagrams} />}
      {blocks.map((block, i) => (
        <BlockView key={`${block.kind}-${i}`} block={block} index={i} showRail={hasSteps} />
      ))}
    </div>
  );
}

function SolutionDiagrams({ images }: { images: string[] }) {
  return (
    <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3.5">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-primary-light mb-3">
        Solution diagram
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {images.map((src, i) => (
          <FigureImage
            key={`${src}-${i}`}
            src={src}
            alt={`Solution diagram ${i + 1}`}
            invert={!src.toLowerCase().endsWith('.svg')}
          />
        ))}
      </div>
    </div>
  );
}

function BlockView({
  block,
  index,
  showRail,
}: {
  block: SolutionBlock;
  index: number;
  showRail: boolean;
}) {
  switch (block.kind) {
    case 'intro':
      return (
        <div
          className="rounded-xl border border-border bg-surface-light/40 px-4 py-3.5 opacity-0 animate-fade-in-up overflow-x-auto"
          style={{ animationDelay: `${index * 60}ms` }}
        >
          <p className="text-[11px] font-semibold uppercase tracking-widest text-text-dim mb-2">
            {block.title}
          </p>
          <SolutionRichContent text={block.body} className="text-sm leading-relaxed text-text-muted" />
        </div>
      );

    case 'insight':
      return (
        <div
          className="relative rounded-xl border border-accent-secondary/30 bg-gradient-to-br from-accent-secondary/10 to-teal-500/5 px-4 py-3.5 opacity-0 animate-fade-in-up overflow-x-auto"
          style={{ animationDelay: `${index * 60}ms` }}
        >
          <div className="pointer-events-none absolute -top-8 -right-8 w-24 h-24 bg-accent-secondary/20 blur-2xl rounded-full" />
          <div className="relative flex items-start gap-3">
            <span className="shrink-0 flex h-8 w-8 items-center justify-center rounded-lg bg-accent-secondary/20 text-accent-secondary">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </span>
            <div>
              <p className="text-sm font-semibold text-accent-secondary mb-1">{block.title}</p>
              <SolutionRichContent text={block.body} className="text-sm leading-relaxed text-text-muted" />
            </div>
          </div>
        </div>
      );

    case 'step':
      return (
        <div
          className="relative flex gap-3 opacity-0 animate-fade-in-up"
          style={{ animationDelay: `${index * 60}ms` }}
        >
          {showRail && (
            <div className="flex flex-col items-center shrink-0 pt-1">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold bg-surface-lighter border border-border-light text-primary-light ring-4 ring-surface">
                {block.number ?? index + 1}
              </span>
              <span className="w-px flex-1 my-1 min-h-[12px] bg-gradient-to-b from-border-light to-transparent" />
            </div>
          )}
          <div className="flex-1 min-w-0 mb-1 rounded-xl border border-border bg-surface-light/60 px-3 sm:px-4 py-3.5 hover:border-border-light transition-colors overflow-x-auto">
            <div className="text-[13px] font-semibold text-foreground mb-1.5">
              <SolutionText text={block.title} />
            </div>
            <SolutionRichContent text={block.body} className="text-sm leading-relaxed text-text-muted" />
          </div>
        </div>
      );

    case 'answer':
      return (
        <div
          className="glow-border rounded-xl opacity-0 animate-fade-in-up"
          style={{ animationDelay: `${index * 60}ms` }}
        >
          <div className="rounded-xl bg-gradient-to-br from-primary/15 to-accent/10 border border-primary/25 px-4 py-4 overflow-x-auto">
            <div className="flex items-center gap-2 mb-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-light text-white shadow-md shadow-primary/30">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 6 9 17l-5-5" />
                </svg>
              </span>
              <p className="text-sm font-bold text-primary-light">{block.title}</p>
            </div>
            <SolutionRichContent text={block.body} className="text-base font-semibold text-foreground" />
          </div>
        </div>
      );

    case 'text':
    default:
      return (
        <div
          className="rounded-xl border border-border bg-surface-light/50 px-4 py-3.5 opacity-0 animate-fade-in-up overflow-x-auto"
          style={{ animationDelay: `${index * 60}ms` }}
        >
          <SolutionRichContent text={block.body} className="text-sm leading-relaxed text-text-muted" />
        </div>
      );
  }
}
