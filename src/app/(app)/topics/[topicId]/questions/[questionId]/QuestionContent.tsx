'use client';

import { useState, useEffect } from 'react';
import type { Question } from '@/types/question';
import type { Approach } from '@/types/approach';
import SubmitApproach from '@/components/question/SubmitApproach';
import AIExplainButton from '@/components/AIExplainButton';
import { getCommunityApproaches } from '@/lib/firebase/approachService';

interface QuestionContentProps {
  question: Question;
  approaches: Approach[];
}

export default function QuestionContent({ question, approaches }: QuestionContentProps) {
  const [activeApproach, setActiveApproach] = useState<string | null>(
    approaches[0]?.id || null
  );
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    mistakes: true,
    traps: true,
  });
  const [communityApproaches, setCommunityApproaches] = useState<Approach[]>([]);

  useEffect(() => {
    getCommunityApproaches(question.id)
      .then(setCommunityApproaches)
      .catch(() => {});
  }, [question.id]);

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Find the "smartest" approach (label contains "smart" or the last official one)
  const smartestApproach = approaches.find(
    (a) => a.label.toLowerCase().includes('smart')
  );

  return (
    <div className="space-y-8">
      {/* ===== APPROACHES SECTION ===== */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h2 className="text-lg font-bold">Solution Approaches</h2>
          <span className="ml-auto text-xs text-text-dim">{approaches.length} approaches available</span>
        </div>

        {/* Approach tabs */}
        {approaches.length > 0 && (
          <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
            {approaches.map((approach, index) => {
              const isSmartest = approach.id === smartestApproach?.id;
              return (
                <button
                  key={approach.id}
                  id={`approach-tab-${index}`}
                  onClick={() => setActiveApproach(approach.id)}
                  className={`relative px-4 py-2.5 text-sm font-medium rounded-xl whitespace-nowrap transition-all duration-200 ${
                    activeApproach === approach.id
                      ? 'bg-primary/15 text-primary-light border border-primary/30 shadow-sm'
                      : 'bg-surface border border-border text-text-muted hover:border-border-light hover:text-foreground'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-xs opacity-60">#{index + 1}</span>
                    {approach.label}
                    {isSmartest && (
                      <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase rounded bg-accent-secondary/15 text-accent-secondary border border-accent-secondary/20">
                        ★ Smartest
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Active approach content */}
        {approaches.map((approach) => (
          <div
            key={approach.id}
            className={`${activeApproach === approach.id ? 'block' : 'hidden'}`}
          >
            <ApproachCard
              approach={approach}
              isSmartest={approach.id === smartestApproach?.id}
              questionText={question.statement}
            />
          </div>
        ))}

        {approaches.length === 0 && (
          <div className="rounded-2xl bg-surface border border-border p-8 text-center text-text-dim">
            <p>No approaches available yet for this question.</p>
          </div>
        )}
      </section>

      {/* ===== SMARTEST METHOD HIGHLIGHT ===== */}
      {smartestApproach && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-secondary to-teal-400 flex items-center justify-center text-white">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold">
              Smartest Method
            </h2>
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-accent-secondary/15 text-accent-secondary border border-accent-secondary/20">
              Recommended
            </span>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-accent-secondary/5 to-teal-500/5 border border-accent-secondary/20 p-6 relative overflow-hidden">
            {/* Glow effect */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-accent-secondary/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-semibold text-accent-secondary">
                  {smartestApproach.label}
                </span>
              </div>
              <div className="text-sm text-text-muted leading-relaxed whitespace-pre-line">
                {smartestApproach.content}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ===== COMMON MISTAKES ===== */}
      <section>
        <button
          onClick={() => toggleSection('mistakes')}
          className="w-full flex items-center gap-2 mb-4 group"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.999L13.732 4.002c-.77-1.333-2.694-1.333-3.464 0L3.34 16.002c-.77 1.332.192 2.999 1.732 2.999z" />
            </svg>
          </div>
          <h2 className="text-lg font-bold">Common Mistakes</h2>
          <span className="ml-1 px-2 py-0.5 text-[10px] font-medium rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
            {question.commonMistakes.length}
          </span>
          <svg
            className={`w-4 h-4 text-text-dim ml-auto transition-transform duration-200 ${
              expandedSections.mistakes ? 'rotate-180' : ''
            }`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <div className={`transition-all duration-300 overflow-hidden ${
          expandedSections.mistakes ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="space-y-3">
            {question.commonMistakes.map((mistake, index) => (
              <div
                key={index}
                id={`mistake-${index}`}
                className="rounded-xl bg-red-500/5 border border-red-500/10 p-4 flex items-start gap-3"
              >
                <div className="shrink-0 w-7 h-7 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <span className="text-xs font-bold text-red-400">{index + 1}</span>
                </div>
                <div>
                  <p className="text-sm text-text-muted leading-relaxed">{mistake}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== COMMUNITY APPROACHES ===== */}
      {communityApproaches.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold">Community Approaches</h2>
            <span className="ml-1 px-2 py-0.5 text-[10px] font-medium rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
              {communityApproaches.length} approved
            </span>
          </div>
          <div className="space-y-4">
            {communityApproaches.map((approach) => (
              <ApproachCard
                key={approach.id}
                approach={approach}
                isSmartest={false}
                questionText={question.statement}
              />
            ))}
          </div>
        </section>
      )}

      {/* ===== SUBMIT APPROACH ===== */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/40 to-accent/40 flex items-center justify-center text-white">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <h2 className="text-lg font-bold">Your Approach</h2>
        </div>
        <SubmitApproach questionId={question.id} />
      </section>

      {/* ===== COMMON TRAPS ===== */}
      <section>
        <button
          onClick={() => toggleSection('traps')}
          className="w-full flex items-center gap-2 mb-4 group"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center text-white">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 className="text-lg font-bold">Common Traps</h2>
          <span className="ml-1 px-2 py-0.5 text-[10px] font-medium rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
            {question.commonTraps.length}
          </span>
          <svg
            className={`w-4 h-4 text-text-dim ml-auto transition-transform duration-200 ${
              expandedSections.traps ? 'rotate-180' : ''
            }`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <div className={`transition-all duration-300 overflow-hidden ${
          expandedSections.traps ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="space-y-3">
            {question.commonTraps.map((trap, index) => (
              <div
                key={index}
                id={`trap-${index}`}
                className="rounded-xl bg-amber-500/5 border border-amber-500/10 p-4 flex items-start gap-3"
              >
                <div className="shrink-0 w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-text-muted leading-relaxed">{trap}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}

// ===== Approach Card Component =====
function ApproachCard({
  approach,
  isSmartest,
  questionText,
}: {
  approach: Approach;
  isSmartest: boolean;
  questionText?: string;
}) {
  return (
    <div
      className={`relative rounded-2xl border p-6 pb-14 transition-all duration-200 ${
        isSmartest
          ? 'bg-accent-secondary/5 border-accent-secondary/20'
          : 'bg-surface border-border'
      }`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <h3 className="text-base font-semibold text-foreground">{approach.label}</h3>
        {isSmartest && (
          <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-accent-secondary/15 text-accent-secondary border border-accent-secondary/20">
            ★ Smartest
          </span>
        )}
        <span className={`ml-auto px-2 py-0.5 text-[10px] font-medium rounded-md border ${
          approach.status === 'official'
            ? 'bg-primary/10 text-primary-light border-primary/20'
            : approach.status === 'approved'
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
            : 'bg-surface-light text-text-dim border-border'
        }`}>
          {approach.status}
        </span>
      </div>

      {/* Content */}
      <div className="text-sm text-text-muted leading-relaxed whitespace-pre-line">
        {approach.content}
      </div>

      {/* Solution image(s) / diagram(s) */}
      {(approach.imageUrl || (approach.images && approach.images.length > 0)) && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            ...(approach.imageUrl ? [approach.imageUrl] : []),
            ...(approach.images ?? []),
          ].map((src, i) => (
            <a
              key={`${src}-${i}`}
              href={src}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-xl overflow-hidden border border-border bg-surface-light hover:border-border-light transition-colors"
              title="Open full size"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`Solution figure ${i + 1}`}
                loading="lazy"
                className="w-full h-auto max-h-80 object-contain"
              />
            </a>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-border/50 flex items-center gap-4 text-xs text-text-dim">
        <span>Submitted by: {approach.submittedBy}</span>
        <span>Status: {approach.status}</span>
      </div>

      {/* AI Tutor entry point */}
      <AIExplainButton
        questionText={questionText ?? ''}
        solutionText={approach.content}
        imageUrl={approach.imageUrl ?? approach.images?.[0]}
      />
    </div>
  );
}
