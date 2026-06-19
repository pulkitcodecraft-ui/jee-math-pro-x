'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { submitApproach } from '@/lib/firebase/approachService';

interface SubmitApproachProps {
  questionId: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export default function SubmitApproach({ questionId }: SubmitApproachProps) {
  const { firebaseUser, isConfigured, loading } = useAuth();
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    if (!file) {
      clearImage();
      return;
    }
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (PNG, JPG, etc).');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError('Image must be under 5 MB.');
      return;
    }
    setError(null);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function clearImage() {
    setImageFile(null);
    setImagePreview(null);
    if (fileRef.current) fileRef.current.value = '';
  }

  // Still resolving auth state
  if (loading) return null;

  // Not logged in (or Firebase not configured) — show a nudge
  if (!isConfigured || !firebaseUser) {
    return (
      <div className="rounded-2xl bg-surface border border-dashed border-border p-6 text-center">
        <p className="text-sm text-text-muted mb-3">
          Have a different approach? Share it with the community.
        </p>
        <Link
          href={`/login?next=/topics`}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 text-sm font-medium text-primary-light hover:bg-primary/20 transition-colors"
        >
          Log in to submit
        </Link>
      </div>
    );
  }

  // Success state
  if (submitted) {
    return (
      <div className="rounded-2xl bg-accent-secondary/5 border border-accent-secondary/20 p-6 text-center">
        <div className="w-10 h-10 rounded-full bg-accent-secondary/15 flex items-center justify-center mx-auto mb-3">
          <svg className="w-5 h-5 text-accent-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-sm font-medium text-foreground">Approach submitted!</p>
        <p className="text-xs text-text-muted mt-1">
          It&apos;s under admin review. It will appear here once approved.
        </p>
        <button
          onClick={() => { setSubmitted(false); setLabel(''); setContent(''); clearImage(); setOpen(false); }}
          className="mt-4 text-xs text-primary-light hover:text-primary transition-colors"
        >
          Submit another
        </button>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!label.trim() || !content.trim()) return;
    setError(null);
    setSubmitting(true);
    try {
      await submitApproach({
        questionId,
        label: label.trim(),
        content: content.trim(),
        submittedBy: firebaseUser!.uid,
        imageFile,
      });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-2xl bg-surface border border-border overflow-hidden">
      {/* Header toggle */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-3 p-5 hover:bg-surface-light transition-colors"
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/40 to-accent/40 flex items-center justify-center text-white">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <div className="text-left flex-1">
          <p className="text-sm font-semibold text-foreground">Submit Your Approach</p>
          <p className="text-xs text-text-dim">Share a different method with the community</p>
        </div>
        <svg
          className={`w-4 h-4 text-text-dim transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Form */}
      {open && (
        <form onSubmit={handleSubmit} className="px-5 pb-5 space-y-4 border-t border-border pt-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-300">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-text-muted mb-1.5">
              Approach title / label
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              required
              placeholder="e.g. Substitution Method, Graphical Approach…"
              className="w-full px-3 py-2.5 rounded-xl bg-background border border-border
                         focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20
                         text-sm text-foreground placeholder:text-text-dim transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-text-muted mb-1.5">
              Solution write-up
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={6}
              placeholder="Write your step-by-step solution here…"
              className="w-full px-3 py-2.5 rounded-xl bg-background border border-border
                         focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20
                         text-sm text-foreground placeholder:text-text-dim transition-all resize-y"
            />
          </div>

          {/* Optional image upload */}
          <div>
            <label className="block text-xs font-medium text-text-muted mb-1.5">
              Attach image <span className="text-text-dim">(optional)</span>
            </label>
            <div
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-3 px-4 py-3 rounded-xl border border-dashed border-border
                         hover:border-primary/40 cursor-pointer transition-colors"
            >
              <svg className="w-5 h-5 text-text-dim shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-xs text-text-dim">
                {imageFile ? imageFile.name : 'Click to upload a photo of your solution (max 5 MB)'}
              </span>
              {imageFile && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); clearImage(); }}
                  className="ml-auto text-text-dim hover:text-red-400 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            {imagePreview && (
              <div className="mt-3 rounded-xl border border-border overflow-hidden max-w-xs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imagePreview} alt="Approach preview" className="w-full object-contain max-h-48" />
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 pt-1">
            <button
              type="submit"
              disabled={submitting || !label.trim() || !content.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl
                         bg-gradient-to-r from-primary to-primary-light text-white text-sm font-medium
                         disabled:opacity-50 disabled:cursor-not-allowed
                         hover:shadow-lg hover:shadow-primary/20 transition-all"
            >
              {submitting ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : null}
              {submitting ? 'Submitting…' : 'Submit for Review'}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-4 py-2.5 rounded-xl text-sm text-text-muted border border-border hover:border-border-light transition-colors"
            >
              Cancel
            </button>
          </div>

          <p className="text-[11px] text-text-dim">
            Submissions are reviewed by admins before becoming visible to other students.
          </p>
        </form>
      )}
    </div>
  );
}
