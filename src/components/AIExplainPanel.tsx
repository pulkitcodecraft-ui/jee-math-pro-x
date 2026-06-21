'use client';

/**
 * AI Tutor — a slide-in chat panel that explains a solution in friendly
 * Hinglish using Gemini (via the shared Vertex AI setup).
 *
 * - Slides in from the right (full height, 384px wide) over a dim backdrop.
 * - Auto-asks the tutor to explain the solution as soon as it opens.
 * - If the solution card has an image, its URL is fetched and converted to
 *   base64 (FileReader, same pattern as extractFromFile.ts) and sent multimodally.
 * - Quick suggestion chips + a free-text input drive the follow-up conversation.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { explainSolution, type ExplainTurn } from '@/lib/ai/explainSolution';
import SolutionPanel from '@/components/tutor/SolutionPanel';

interface AIExplainPanelProps {
  open: boolean;
  onClose: () => void;
  questionText: string;
  solutionText: string;
  imageUrl?: string;
}

interface ChatMessage {
  role: 'ai' | 'user';
  text: string;
}

interface ImageData {
  data: string;
  mimeType: string;
}

/** Fetch an image URL and convert it to base64 (no data: prefix). */
async function urlToBase64(url: string): Promise<ImageData> {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Could not load image.');
  const blob = await res.blob();
  const mimeType = blob.type || 'image/png';
  const data = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== 'string') {
        reject(new Error('Could not read image.'));
        return;
      }
      const comma = result.indexOf(',');
      resolve(comma >= 0 ? result.slice(comma + 1) : result);
    };
    reader.onerror = () => reject(reader.error ?? new Error('Could not read image.'));
    reader.readAsDataURL(blob);
  });
  return { data, mimeType };
}

export default function AIExplainPanel({
  open,
  onClose,
  questionText,
  solutionText,
  imageUrl,
}: AIExplainPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');

  const imageDataRef = useRef<ImageData | null>(null);
  const startedRef = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const hasImage = Boolean(imageUrl);

  const ask = useCallback(
    async (userMessage?: string) => {
      setLoading(true);
      try {
        // Lazily fetch + cache the image as base64 on first use.
        if (imageUrl && !imageDataRef.current) {
          try {
            imageDataRef.current = await urlToBase64(imageUrl);
          } catch {
            imageDataRef.current = null; // fall back to text-only if it fails
          }
        }
        const img = imageDataRef.current;

        // Build conversation history from what's on screen (excludes this turn).
        const history: ExplainTurn[] = messages.map((m) => ({
          role: m.role === 'ai' ? 'tutor' : 'student',
          text: m.text,
        }));

        const reply = await explainSolution(
          questionText,
          solutionText,
          img?.data,
          img?.mimeType,
          userMessage,
          history
        );
        setMessages((prev) => [...prev, { role: 'ai', text: reply }]);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            role: 'ai',
            text: 'Sorry yaar, abhi explain nahi kar paaya 😅. Thodi der baad dobara try karo.',
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [imageUrl, messages, questionText, solutionText]
  );

  // Auto-explain once, the first time the panel opens.
  useEffect(() => {
    if (open && !startedRef.current) {
      startedRef.current = true;
      ask();
    }
  }, [open, ask]);

  // Keep the chat scrolled to the latest message.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  // Close on Escape + lock body scroll on mobile sheet.
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    setMessages((prev) => [...prev, { role: 'user', text: trimmed }]);
    setInput('');
    ask(trimmed);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  }

  const suggestions = [
    'Ye step kaise aaya?',
    'Ek example do',
    'Phir se samjhao',
    ...(hasImage ? ['Diagram samjhao'] : []),
  ];

  const showSuggestions = messages.some((m) => m.role === 'ai') && !loading;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        aria-hidden={!open}
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Panel */}
      <aside
        role="dialog"
        aria-label="AI Tutor"
        aria-hidden={!open}
        className={`fixed z-50 flex flex-col bg-surface border-border shadow-2xl shadow-black/40
                    transition-transform duration-300 ease-out
                    inset-x-0 bottom-0 top-auto h-[min(92dvh,100%)] w-full rounded-t-2xl border-t
                    sm:inset-x-auto sm:top-0 sm:right-0 sm:bottom-auto sm:h-full sm:w-96 sm:max-w-[92vw]
                    sm:rounded-none sm:rounded-l-2xl sm:border-l sm:border-t-0
                    ${open ? 'translate-y-0 sm:translate-y-0 sm:translate-x-0' : 'translate-y-full sm:translate-y-0 sm:translate-x-full'}`}
      >
        {/* Mobile drag handle */}
        <div className="sm:hidden flex justify-center pt-2 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full bg-border-light" />
        </div>
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-semibold text-foreground leading-tight">AI Tutor</h2>
            <p className="text-[11px] text-text-dim">Samjhao Hinglish mein</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close AI Tutor"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-text-dim hover:text-foreground hover:bg-surface-light transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Question context chip */}
        <div className="px-5 py-3 border-b border-border/60 shrink-0">
          <div className="rounded-xl bg-surface-light border border-border px-3 py-2">
            <p className="text-[10px] uppercase tracking-wider text-text-dim mb-0.5">Question</p>
            <p className="text-xs text-text-muted line-clamp-2 leading-relaxed">{questionText}</p>
          </div>
        </div>

        {/* Chat area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {messages.map((msg, i) =>
            msg.role === 'ai' ? (
              <div key={i} className="flex gap-2.5">
                <div className="shrink-0 w-7 h-7 rounded-lg bg-primary/15 border border-primary/20 flex items-center justify-center text-primary-light text-xs font-bold mt-0.5">
                  AI
                </div>
                <div className="flex-1 min-w-0">
                  <SolutionPanel rawResponse={msg.text} />
                </div>
              </div>
            ) : (
              <div key={i} className="flex justify-end">
                <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-primary/15 border border-primary/25 px-3.5 py-2.5 text-sm text-foreground leading-relaxed">
                  {msg.text}
                </div>
              </div>
            )
          )}

          {/* Typing indicator */}
          {loading && (
            <div className="flex gap-2.5">
              <div className="shrink-0 w-7 h-7 rounded-lg bg-primary/15 border border-primary/20 flex items-center justify-center text-primary-light text-xs font-bold mt-0.5">
                AI
              </div>
              <div className="rounded-2xl rounded-tl-sm bg-surface-light border border-border px-4 py-3 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-text-dim animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-text-dim animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-text-dim animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
        </div>

        {/* Quick suggestions */}
        {showSuggestions && (
          <div className="px-5 pt-1 pb-2 shrink-0 flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="px-3 py-1.5 text-xs rounded-full bg-surface-light border border-border
                           text-text-muted hover:text-primary-light hover:border-primary/40 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="px-4 sm:px-5 py-3 border-t border-border shrink-0 pb-safe">
          <div className="flex items-end gap-2 rounded-2xl bg-surface-light border border-border focus-within:border-primary/50 transition-colors px-3 py-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              placeholder="Apna sawaal pucho…"
              className="flex-1 bg-transparent resize-none outline-none text-sm text-foreground placeholder:text-text-dim max-h-28 leading-relaxed"
            />
            <button
              onClick={() => send(input)}
              disabled={!input.trim() || loading}
              aria-label="Send"
              className="shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-primary-light text-white
                         flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed
                         hover:shadow-lg hover:shadow-primary/25 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19V5m0 0l-7 7m7-7l7 7" />
              </svg>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
