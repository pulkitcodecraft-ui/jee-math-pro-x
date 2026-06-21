'use client';

import { useMemo } from 'react';
import MathText from '@/components/ui/MathText';
import {
  parseCommonMistake,
  parseKeyInsight,
} from '@/lib/ai/parseStepExtras';

function InsightRow({
  label,
  text,
  accent,
}: {
  label: string;
  text: string;
  accent: 'teal' | 'amber';
}) {
  const labelClass =
    accent === 'teal'
      ? 'text-accent-secondary/90'
      : 'text-amber-300/90';

  return (
    <div className="flex gap-2.5">
      <span
        className={`shrink-0 mt-0.5 text-[10px] font-bold uppercase tracking-wider w-[4.5rem] ${labelClass}`}
      >
        {label}
      </span>
      <div className="flex-1 min-w-0 text-[13px] leading-relaxed text-text-muted">
        <MathText text={text} />
      </div>
    </div>
  );
}

/** Premium key-insight card after each explain step. */
export function KeyInsightCard({
  text,
  embedded = false,
  hasMistakeBelow = false,
}: {
  text: string;
  embedded?: boolean;
  hasMistakeBelow?: boolean;
}) {
  const parsed = useMemo(() => parseKeyInsight(text), [text]);

  if (!text.trim()) return null;

  const hasStructured =
    parsed.punchline || parsed.why || parsed.examSave;

  return (
    <div
      className={`relative overflow-hidden ${
        embedded
          ? `border-t border-accent-secondary/25 bg-gradient-to-br from-accent-secondary/[0.12] via-teal-500/[0.06] to-transparent ${
              hasMistakeBelow ? '' : 'rounded-b-xl'
            }`
          : 'mt-3.5 rounded-xl border border-accent-secondary/35 bg-gradient-to-br from-accent-secondary/[0.12] via-teal-500/[0.06] to-transparent'
      }`}
    >
      <div className="pointer-events-none absolute -top-10 -right-10 h-28 w-28 rounded-full bg-accent-secondary/20 blur-2xl" />
      <div className="relative px-3.5 py-3 sm:px-4 sm:py-3.5">
        <div className="flex items-center gap-2.5 mb-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-secondary/20 text-accent-secondary shadow-inner shadow-accent-secondary/10">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </span>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-accent-secondary">
              Key Insight
            </p>
            {parsed.punchline && (
              <p className="text-sm font-semibold text-foreground leading-snug mt-0.5">
                <MathText text={parsed.punchline} />
              </p>
            )}
          </div>
        </div>

        {hasStructured ? (
          <div className="space-y-2.5 pl-[2.625rem] sm:pl-[2.875rem]">
            {parsed.why && <InsightRow label="Why" text={parsed.why} accent="teal" />}
            {parsed.examSave && (
              <div className="rounded-lg border border-accent-secondary/25 bg-accent-secondary/[0.08] px-3 py-2">
                <div className="flex items-start gap-2">
                  <svg
                    className="w-3.5 h-3.5 shrink-0 mt-0.5 text-accent-secondary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-accent-secondary mb-0.5">
                      Exam save
                    </p>
                    <div className="text-[13px] leading-relaxed text-foreground/90">
                      <MathText text={parsed.examSave} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          parsed.fallback && (
            <div className="text-[13px] leading-relaxed text-text-muted pl-[2.625rem] sm:pl-[2.875rem]">
              <MathText text={parsed.fallback} />
            </div>
          )
        )}
      </div>
    </div>
  );
}

/** Premium common-mistake card after each explain step. */
export function CommonMistakeCard({
  text,
  embedded = false,
}: {
  text: string;
  embedded?: boolean;
}) {
  const parsed = useMemo(() => parseCommonMistake(text), [text]);

  if (!text.trim()) return null;

  const hasStructured = parsed.trap || parsed.fix;

  return (
    <div
      className={`relative overflow-hidden ${
        embedded
          ? 'border-t border-amber-400/25 bg-gradient-to-br from-amber-500/[0.08] to-orange-500/[0.04] rounded-b-xl'
          : 'mt-2.5 rounded-xl border border-amber-400/30 bg-gradient-to-br from-amber-500/[0.08] to-orange-500/[0.04]'
      }`}
    >
      <div className="pointer-events-none absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-amber-400/15 blur-2xl" />
      <div className="relative px-3.5 py-3 sm:px-4 sm:py-3.5">
        <div className="flex items-center gap-2.5 mb-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-400/15 text-amber-300">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4a2 2 0 00-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3z"
              />
            </svg>
          </span>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-amber-300">
              Watch Out
            </p>
            {parsed.trap && (
              <p className="text-sm font-medium text-amber-100/90 leading-snug mt-0.5">
                <MathText text={parsed.trap} />
              </p>
            )}
          </div>
        </div>

        {hasStructured ? (
          <div className="space-y-2.5 pl-[2.625rem] sm:pl-[2.875rem]">
            {!parsed.trap && parsed.fix && (
              <InsightRow label="Trap" text={parsed.fix} accent="amber" />
            )}
            {parsed.fix && (
              <div className="rounded-lg border border-emerald-500/25 bg-emerald-500/[0.08] px-3 py-2">
                <div className="flex items-start gap-2">
                  <svg
                    className="w-3.5 h-3.5 shrink-0 mt-0.5 text-emerald-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-0.5">
                      Do this instead
                    </p>
                    <div className="text-[13px] leading-relaxed text-foreground/90">
                      <MathText text={parsed.fix} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          parsed.fallback && (
            <div className="text-[13px] leading-relaxed text-text-muted pl-[2.625rem] sm:pl-[2.875rem]">
              <MathText text={parsed.fallback} />
            </div>
          )
        )}
      </div>
    </div>
  );
}
