'use client';

import { useMemo } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

/**
 * Renders a string that mixes plain text with LaTeX written using
 * `\( ... \)` (inline) and `\[ ... \]` (display/block) delimiters.
 *
 * Math segments are rendered with KaTeX; everything else is rendered as
 * plain text. KaTeX output inherits `currentColor`, so it stays readable
 * on the dark theme instead of defaulting to black.
 */

interface MathSegment {
  type: 'text' | 'inline' | 'block';
  value: string;
}

// Matches \( ... \) and \[ ... \]. The `s` flag lets math span newlines.
const MATH_DELIMITERS = /\\\((.+?)\\\)|\\\[([\s\S]+?)\\\]/g;

function parseSegments(input: string): MathSegment[] {
  const segments: MathSegment[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  MATH_DELIMITERS.lastIndex = 0;
  while ((match = MATH_DELIMITERS.exec(input)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: 'text', value: input.slice(lastIndex, match.index) });
    }
    if (match[1] !== undefined) {
      segments.push({ type: 'inline', value: match[1] });
    } else if (match[2] !== undefined) {
      segments.push({ type: 'block', value: match[2] });
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < input.length) {
    segments.push({ type: 'text', value: input.slice(lastIndex) });
  }

  return segments;
}

function renderMath(tex: string, displayMode: boolean): string {
  try {
    return katex.renderToString(tex.trim(), {
      displayMode,
      throwOnError: false,
      output: 'htmlAndMathml',
      trust: false,
    });
  } catch {
    // Fall back to showing the raw LaTeX rather than crashing the render.
    return tex;
  }
}

export default function MathText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const segments = useMemo(() => parseSegments(text ?? ''), [text]);

  return (
    <span className={className}>
      {segments.map((seg, i) => {
        if (seg.type === 'text') {
          // Preserve line breaks present in plain-text portions.
          return <span key={i} style={{ whiteSpace: 'pre-wrap' }}>{seg.value}</span>;
        }
        const isBlock = seg.type === 'block';
        const html = renderMath(seg.value, isBlock);
        return (
          <span
            key={i}
            className={isBlock ? 'block my-2 overflow-x-auto' : 'inline'}
            // KaTeX produces sanitized, self-contained markup (trust: false).
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      })}
    </span>
  );
}
