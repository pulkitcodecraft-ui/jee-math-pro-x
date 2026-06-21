'use client';

import { useMemo } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { enrichMathText, parseMathSegments } from '@/lib/data/mathLatex';

/**
 * Renders mixed prose + LaTeX via KaTeX. Dollar delimiters (`$…$`, `$$…$$`),
 * `\(...\)`, and `\[...\]` are parsed and rendered — raw `$` syntax should
 * never appear in the UI for well-formed content.
 */

function renderMath(tex: string, displayMode: boolean): string {
  const trimmed = tex.trim();
  if (!trimmed) return '';
  try {
    return katex.renderToString(trimmed, {
      displayMode,
      throwOnError: false,
      output: 'htmlAndMathml',
      trust: false,
      strict: 'ignore',
    });
  } catch {
    return trimmed;
  }
}

export default function MathText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const segments = useMemo(() => {
    const prepared = enrichMathText(text ?? '');
    return parseMathSegments(prepared);
  }, [text]);

  return (
    <span className={`math-content max-w-full ${className ?? ''}`}>
      {segments.map((seg, i) => {
        if (seg.type === 'text') {
          if (!seg.value) return null;
          return (
            <span key={i} className="whitespace-pre-wrap break-words">
              {seg.value}
            </span>
          );
        }
        const isBlock = seg.type === 'block';
        const html = renderMath(seg.value, isBlock);
        if (!html) return null;
        return (
          <span
            key={i}
            className={
              isBlock
                ? 'math-scroll block my-2 w-full'
                : 'math-scroll inline-block max-w-full align-middle'
            }
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      })}
    </span>
  );
}
