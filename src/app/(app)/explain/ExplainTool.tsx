'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { solveQuestion } from '@/lib/ai/solveQuestion';
import { extractFromFile } from '@/lib/ai/extractFromFile';
import type { SolveResult } from '@/lib/ai/types';
import { getTopicSample } from '@/lib/data/syllabus';
import { useAuth } from '@/lib/auth';
import { uploadQuestionFile, validateFile } from '@/lib/firebase/storageService';
import { saveHistory, getHistoryItem } from '@/lib/firebase/historyService';
import type { HistoryAttachment } from '@/types/history';
import MathText from '@/components/ui/MathText';
import FileUploadButton from '@/components/explain/FileUploadButton';
import FileChip from '@/components/explain/FileChip';

const sampleQuestion =
  'Find the domain of f(x) = √(log₂(log₃(log₅(x² - 1)))). Express your answer in interval notation.';
const sampleSolution =
  'For √(log_a(x)) we need log_a(x) ≥ 0, i.e. x ≥ 1. Applying recursively from the outside in: log₂(?) ≥ 0 ⟹ ? ≥ 1, so log₃(?) ≥ 1 ⟹ ? ≥ 3, so log₅(?) ≥ 3 ⟹ ? ≥ 125, so x² - 1 ≥ 125 ⟹ x² ≥ 126. Domain: |x| ≥ √126.';

const difficultyStyles: Record<string, string> = {
  Easy: 'bg-accent-secondary/10 text-accent-secondary border-accent-secondary/30',
  Medium: 'bg-amber-400/10 text-amber-300 border-amber-400/30',
  Hard: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
};

function newQuestionId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `q_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  }
}

function buildMarkdown(result: SolveResult): string {
  const lines: string[] = [];
  lines.push(`# ${result.topic} — ${result.difficulty}`);
  lines.push('');
  result.methods.forEach((method, idx) => {
    const recommended = idx === result.recommended_method_index ? ' (Recommended)' : '';
    lines.push(`## Method ${idx + 1}: ${method.method_name}${recommended}`);
    lines.push(`*Best for: ${method.best_for}*`);
    lines.push('');
    method.steps.forEach((step) => {
      lines.push(`### Step ${step.step_number}: ${step.title}`);
      lines.push(step.explanation);
      lines.push('');
      lines.push(`> **Key insight:** ${step.key_insight}`);
      if (step.common_mistake) {
        lines.push(`> **Common mistake:** ${step.common_mistake}`);
      }
      lines.push('');
    });
    lines.push(`**Final answer:** ${method.final_answer}`);
    lines.push('');
  });
  if (result.exam_tip) {
    lines.push(`**Exam tip:** ${result.exam_tip}`);
  }
  return lines.join('\n');
}

interface ExplainToolProps {
  initialTopic?: string | null;
  initialHistoryId?: string | null;
  initialQuestion?: string | null;
  autoSolve?: boolean;
}

export default function ExplainTool({
  initialTopic = null,
  initialHistoryId = null,
  initialQuestion = null,
  autoSolve = false,
}: ExplainToolProps) {
  const { firebaseUser, isConfigured } = useAuth();
  const isLoggedIn = isConfigured && !!firebaseUser;

  const [question, setQuestion] = useState('');
  const [solution, setSolution] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SolveResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeMethod, setActiveMethod] = useState(0);
  const [copied, setCopied] = useState(false);
  const [activeTopic, setActiveTopic] = useState<string | null>(initialTopic);
  const [savedToHistory, setSavedToHistory] = useState(false);

  const [questionId, setQuestionId] = useState<string>(newQuestionId);

  // File attachment state
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [attachment, setAttachment] = useState<HistoryAttachment | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [fileBusy, setFileBusy] = useState(false);
  const [fileBusyLabel, setFileBusyLabel] = useState<string>('');

  // One-shot guard + pending flag for smart-search auto-solve (?q=…&autosolve=1).
  const autoSolvedRef = useRef(false);
  const [autoSolvePending, setAutoSolvePending] = useState(false);

  // Sync when navigating to /explain?topic=… with the tool already mounted.
  useEffect(() => {
    setActiveTopic(initialTopic);
  }, [initialTopic]);

  // Pre-fill the question coming from the homepage smart search.
  useEffect(() => {
    if (initialQuestion && !autoSolvedRef.current) {
      setQuestion(initialQuestion);
      if (autoSolve) setAutoSolvePending(true);
    }
  }, [initialQuestion, autoSolve]);

  // Once the pre-filled question is in state, auto-run the solve exactly once.
  useEffect(() => {
    if (autoSolvePending && question.trim().length > 0 && !autoSolvedRef.current) {
      autoSolvedRef.current = true;
      setAutoSolvePending(false);
      void runSolve(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoSolvePending, question]);

  // Load a past question from history back into the view.
  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!initialHistoryId || !isLoggedIn || !firebaseUser) return;
      try {
        const item = await getHistoryItem(firebaseUser.uid, initialHistoryId);
        if (cancelled || !item) return;
        setQuestion(item.question);
        setSolution(item.solution ?? '');
        setActiveTopic(item.topic ?? null);
        setAttachment(item.attachment ?? null);
        setPendingFile(null);
        setQuestionId(item.id);
        if (item.explanation) {
          const res = item.explanation as SolveResult;
          setResult(res);
          setActiveMethod(res.recommended_method_index ?? 0);
        }
      } catch {
        /* ignore — user can just re-run */
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [initialHistoryId, isLoggedIn, firebaseUser]);

  const canSubmit = question.trim().length > 0 && !loading;

  async function persistHistory(res: SolveResult) {
    if (!isLoggedIn || !firebaseUser) return;
    try {
      const recommended = res.methods[res.recommended_method_index] ?? res.methods[0];
      await saveHistory({
        userId: firebaseUser.uid,
        questionId,
        question: question.trim(),
        solution: solution.trim() || null,
        attachment,
        topic: activeTopic,
        difficulty: res.difficulty ?? null,
        method: recommended?.method_name ?? null,
        explanation: res,
      });
      setSavedToHistory(true);
    } catch (err) {
      console.error('[AI Explain] saveHistory failed:', err);
    }
  }

  async function runSolve(forceRefresh: boolean) {
    if (question.trim().length === 0 || loading) return;
    setLoading(true);
    setError(null);
    setSavedToHistory(false);
    if (forceRefresh) setResult(null);
    try {
      const res = await solveQuestion(question.trim(), solution.trim(), {
        forceRefresh,
        topicContext: activeTopic ?? undefined,
      });
      setResult(res);
      setActiveMethod(res.recommended_method_index);
      void persistHistory(res);
    } catch (err) {
      console.error('[AI Explain] solveQuestion failed:', err);
      setResult(null);
      const detail = err instanceof Error ? err.message : String(err);
      setError(detail || 'We couldn\u2019t solve this question right now. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleFileSelected(file: File) {
    setFileError(null);
    const invalid = validateFile(file);
    if (invalid) {
      setFileError(invalid);
      return;
    }
    setPendingFile(file);
    setAttachment(null);
  }

  async function uploadPending(file: File): Promise<HistoryAttachment | null> {
    if (!firebaseUser) return null;
    const att = await uploadQuestionFile(file, firebaseUser.uid, questionId);
    setAttachment(att);
    return att;
  }

  async function handleExtractAndFill() {
    if (!pendingFile) return;
    setFileError(null);
    setFileBusy(true);
    setFileBusyLabel('Reading file…');
    try {
      const extracted = await extractFromFile(pendingFile);
      if (extracted.question) setQuestion(extracted.question);
      if (extracted.solution) setSolution(extracted.solution);
      // Keep the source file linked to this question in history.
      setFileBusyLabel('Saving file…');
      await uploadPending(pendingFile);
      setPendingFile(null);
    } catch (err) {
      console.error('[AI Explain] extract failed:', err);
      setFileError(
        err instanceof Error
          ? `Couldn’t read that file: ${err.message}`
          : 'Couldn’t read that file. Try a clearer photo or another file.'
      );
    } finally {
      setFileBusy(false);
      setFileBusyLabel('');
    }
  }

  async function handleAttachReference() {
    if (!pendingFile) return;
    setFileError(null);
    setFileBusy(true);
    setFileBusyLabel('Uploading…');
    try {
      await uploadPending(pendingFile);
      setPendingFile(null);
    } catch (err) {
      console.error('[AI Explain] upload failed:', err);
      setFileError(
        err instanceof Error ? `Upload failed: ${err.message}` : 'Upload failed. Please try again.'
      );
    } finally {
      setFileBusy(false);
      setFileBusyLabel('');
    }
  }

  function removeFile() {
    setPendingFile(null);
    setAttachment(null);
    setFileError(null);
  }

  function handleSample() {
    if (activeTopic) {
      const topicSample = getTopicSample(activeTopic);
      if (topicSample) {
        setQuestion(topicSample);
        setSolution('');
        setResult(null);
        setError(null);
        return;
      }
    }
    setQuestion(sampleQuestion);
    setSolution(sampleSolution);
    setResult(null);
    setError(null);
  }

  function handleClear() {
    setQuestion('');
    setSolution('');
    setResult(null);
    setError(null);
    setPendingFile(null);
    setAttachment(null);
    setFileError(null);
    setSavedToHistory(false);
    setQuestionId(newQuestionId());
  }

  async function handleCopy() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(buildMarkdown(result));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — ignore */
    }
  }

  const method = result?.methods[activeMethod] ?? null;
  const hasInput = question || solution || pendingFile || attachment;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* ── Input panel ── */}
      <div className="space-y-5">
        {activeTopic && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-xs font-medium text-primary-light">
            <span className="text-text-muted">Practicing:</span>
            <span className="text-foreground">{activeTopic}</span>
            <button
              onClick={() => setActiveTopic(null)}
              aria-label="Clear topic"
              className="ml-0.5 w-4 h-4 rounded-full flex items-center justify-center text-primary-light/70 hover:text-foreground hover:bg-primary/20 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        <div className="rounded-2xl bg-surface border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <label htmlFor="explain-question" className="text-sm font-semibold text-foreground">
              Question <span className="text-rose-400">*</span>
            </label>
            <div className="flex items-center gap-2">
              {isLoggedIn ? (
                <FileUploadButton onSelect={handleFileSelected} disabled={fileBusy} />
              ) : (
                <Link
                  href="/login?next=/explain"
                  title="Sign in to attach a photo or PDF"
                  className="w-8 h-8 rounded-lg flex items-center justify-center border border-border text-text-dim hover:text-primary-light hover:border-primary/40 transition-colors"
                  aria-label="Sign in to attach a file"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </Link>
              )}
              <button
                onClick={handleSample}
                className="text-xs text-primary-light hover:text-primary transition-colors"
              >
                Load sample
              </button>
            </div>
          </div>
          <textarea
            id="explain-question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={5}
            placeholder="Paste the math question / problem statement here — or attach a photo/PDF with the + button…"
            className="w-full resize-y rounded-xl bg-background border border-border
                       focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20
                       text-sm text-foreground placeholder:text-text-dim p-3 transition-all leading-relaxed"
          />

          {/* File error */}
          {fileError && (
            <div className="mt-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">
              {fileError}
            </div>
          )}

          {/* Pending file — choose how to use it */}
          {pendingFile && (
            <div className="mt-3 space-y-3">
              <FileChip
                name={pendingFile.name}
                fileType={pendingFile.type}
                status={fileBusy ? fileBusyLabel : 'Ready — choose how to use it'}
                busy={fileBusy}
                onRemove={fileBusy ? undefined : removeFile}
              />
              {!fileBusy && (
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={handleExtractAndFill}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary/15 border border-primary/30 text-xs font-medium text-primary-light hover:bg-primary/25 transition-all"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m0 13a5 5 0 003.536-8.536A5 5 0 1012 17z" />
                    </svg>
                    Extract &amp; Fill Question
                  </button>
                  <button
                    onClick={handleAttachReference}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border text-xs font-medium text-text-muted hover:text-foreground hover:border-border-light transition-all"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    Attach as Reference Only
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Uploaded reference attachment */}
          {!pendingFile && attachment && (
            <div className="mt-3">
              <FileChip
                name={attachment.name.replace(/^\d+_/, '')}
                fileType={attachment.fileType}
                status="Attached as reference"
                url={attachment.url}
                onRemove={removeFile}
              />
            </div>
          )}
        </div>

        <div className="rounded-2xl bg-surface border border-border p-5">
          <label htmlFor="explain-solution" className="block text-sm font-semibold text-foreground mb-1">
            Solution <span className="text-text-dim font-normal">(optional)</span>
          </label>
          <p className="text-xs text-text-dim mb-4">
            Paste a solution to cross-check — leave blank and the AI will solve it for you.
          </p>
          <textarea
            id="explain-solution"
            value={solution}
            onChange={(e) => setSolution(e.target.value)}
            rows={8}
            placeholder="Optional — paste a solution to cross-check (leave blank and AI will solve it for you)…"
            className="w-full resize-y rounded-xl bg-background border border-border
                       focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20
                       text-sm text-foreground placeholder:text-text-dim p-3 transition-all leading-relaxed"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => runSolve(false)}
            disabled={!canSubmit}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl
                       bg-gradient-to-r from-primary to-primary-light text-white font-medium text-sm
                       disabled:opacity-50 disabled:cursor-not-allowed
                       hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5
                       disabled:hover:translate-y-0 disabled:hover:shadow-none
                       transition-all duration-200"
          >
            {loading ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Solving…
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Explain Step by Step
              </>
            )}
          </button>
          {hasInput && (
            <button
              onClick={handleClear}
              className="px-5 py-3.5 rounded-2xl text-text-muted text-sm border border-border
                         hover:border-border-light hover:text-foreground transition-all"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* ── Output panel ── */}
      <div className="lg:sticky lg:top-20 lg:self-start">
        {/* Empty state */}
        {!loading && !result && !error && (
          <div className="rounded-2xl bg-surface border border-dashed border-border p-10 text-center h-full flex flex-col items-center justify-center min-h-[300px]">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <svg className="w-7 h-7 text-primary-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <p className="text-sm text-text-muted font-medium">Your step-by-step solution appears here</p>
            <p className="text-xs text-text-dim mt-1 max-w-xs">
              Paste a question and click &quot;Explain Step by Step&quot; — the AI solves it and shows every approach.
            </p>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="rounded-2xl glass border border-primary/20 p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="h-6 w-32 rounded-full bg-surface-lighter animate-pulse" />
              <div className="h-6 w-20 rounded-full bg-surface-lighter animate-pulse" />
            </div>
            <div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-8 w-28 rounded-lg bg-surface-lighter animate-pulse" />
              ))}
            </div>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-surface-lighter animate-pulse shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 rounded bg-surface-lighter animate-pulse" />
                  <div className="h-3 w-full rounded bg-surface-lighter animate-pulse" />
                  <div className="h-3 w-4/5 rounded bg-surface-lighter animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="rounded-2xl bg-surface border border-rose-500/30 p-8 text-center min-h-[300px] flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 flex items-center justify-center mb-4">
              <svg className="w-7 h-7 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <p className="text-sm text-foreground font-medium mb-1">Something went wrong</p>
            <p className="text-xs text-text-muted max-w-xs mb-5">{error}</p>
            <button
              onClick={() => runSolve(true)}
              className="px-5 py-2.5 rounded-xl bg-primary/15 border border-primary/30 text-sm
                         text-primary-light hover:bg-primary/25 transition-all"
            >
              Try again
            </button>
          </div>
        )}

        {/* Result */}
        {!loading && result && method && (
          <div className="rounded-2xl glass border border-primary/20 p-6 animate-fade-in-up">
            {/* Topic + difficulty + actions */}
            <div className="flex items-start justify-between gap-3 mb-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 border border-primary/25 text-xs font-semibold text-primary-light">
                  {result.topic}
                </span>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full border text-xs font-semibold ${
                    difficultyStyles[result.difficulty] ?? difficultyStyles.Medium
                  }`}
                >
                  {result.difficulty}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleCopy}
                  title="Copy as Markdown"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border
                             text-xs text-text-muted hover:text-foreground hover:border-border-light transition-all"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h6a2 2 0 002-2v-2" />
                  </svg>
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <button
                  onClick={() => runSolve(true)}
                  title="Regenerate"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border
                             text-xs text-text-muted hover:text-foreground hover:border-border-light transition-all"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Regenerate
                </button>
              </div>
            </div>

            {/* Method selector */}
            {result.methods.length > 1 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {result.methods.map((m, idx) => {
                  const isActive = idx === activeMethod;
                  const isRecommended = idx === result.recommended_method_index;
                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveMethod(idx)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        isActive
                          ? 'bg-primary/15 border-primary/40 text-primary-light'
                          : 'bg-surface border-border text-text-muted hover:text-foreground hover:border-border-light'
                      }`}
                    >
                      {m.method_name}
                      {isRecommended && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-accent-secondary/15 text-accent-secondary text-[10px] font-semibold uppercase tracking-wide">
                          Rec
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Active method header */}
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-base font-bold text-foreground">{method.method_name}</h2>
              {activeMethod === result.recommended_method_index && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-accent-secondary/15 border border-accent-secondary/30 text-accent-secondary text-[10px] font-semibold uppercase tracking-wide">
                  Recommended
                </span>
              )}
            </div>
            {method.best_for && (
              <p className="text-xs text-text-muted -mt-2 mb-5">
                <span className="font-semibold text-foreground">Best for:</span> {method.best_for}
              </p>
            )}

            {/* Steps */}
            <div className="space-y-4">
              {method.steps.map((step) => (
                <div key={step.step_number} className="flex gap-3">
                  <div className="shrink-0 w-8 h-8 rounded-lg bg-primary/15 border border-primary/20 flex items-center justify-center">
                    <span className="text-xs font-bold text-primary-light">{step.step_number}</span>
                  </div>
                  <div className="flex-1 pb-1 min-w-0">
                    <h3 className="text-sm font-semibold text-foreground mb-1">{step.title}</h3>
                    <div className="text-sm text-text-muted leading-relaxed">
                      <MathText text={step.explanation} />
                    </div>

                    {step.key_insight && (
                      <div className="mt-3 rounded-xl bg-primary/5 border border-primary/20 p-3">
                        <div className="flex items-center gap-1.5 mb-1">
                          <svg className="w-3.5 h-3.5 text-primary-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m0 13a5 5 0 003.536-8.536A5 5 0 1012 17z" />
                          </svg>
                          <span className="text-[11px] font-bold uppercase tracking-wide text-primary-light">Key Insight</span>
                        </div>
                        <div className="text-sm text-text-muted leading-relaxed">
                          <MathText text={step.key_insight} />
                        </div>
                      </div>
                    )}

                    {step.common_mistake && (
                      <div className="mt-2 rounded-xl bg-amber-400/5 border border-amber-400/20 p-3">
                        <div className="flex items-center gap-1.5 mb-1">
                          <svg className="w-3.5 h-3.5 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4a2 2 0 00-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3z" />
                          </svg>
                          <span className="text-[11px] font-bold uppercase tracking-wide text-amber-300">Common Mistake</span>
                        </div>
                        <div className="text-sm text-text-muted leading-relaxed">
                          <MathText text={step.common_mistake} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Final answer */}
            <div className="mt-6 rounded-xl bg-accent-secondary/5 border border-accent-secondary/25 p-4">
              <div className="flex items-center gap-2 mb-1.5">
                <svg className="w-4 h-4 text-accent-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-xs font-bold uppercase tracking-wide text-accent-secondary">Final Answer</span>
              </div>
              <div className="text-sm text-foreground leading-relaxed font-medium">
                <MathText text={method.final_answer} />
              </div>
            </div>

            {/* Exam tip */}
            {result.exam_tip && (
              <div className="mt-3 rounded-xl bg-surface-light border border-border p-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="text-xs font-bold uppercase tracking-wide text-accent">Exam Tip</span>
                </div>
                <div className="text-sm text-text-muted leading-relaxed">
                  <MathText text={result.exam_tip} />
                </div>
              </div>
            )}

            {/* Saved-to-history note */}
            {savedToHistory && (
              <p className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-text-dim">
                <svg className="w-3.5 h-3.5 text-accent-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Saved to your <Link href="/history" className="text-primary-light hover:text-primary underline-offset-2 hover:underline">history</Link>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
