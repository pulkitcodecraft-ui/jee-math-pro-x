'use client';

import { useMemo } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

/**
 * Renders a string that mixes plain text with LaTeX. Supported delimiters:
 *   - `$$ ... $$` and `\[ ... \]`  → display/block math
 *   - `$ ... $`   and `\( ... \)`  → inline math
 *
 * Many models emit dollar-delimited LaTeX (e.g. `$\frac{4}{7}$`), so we
 * handle both the TeX `$`/`$$` style and the `\(`/`\[` style to avoid ever
 * leaking raw LaTeX source into the UI.
 *
 * Math segments are rendered with KaTeX; everything else is rendered as
 * plain text. KaTeX output inherits `currentColor`, so it stays readable
 * on the dark theme instead of defaulting to black.
 */

interface MathSegment {
  type: 'text' | 'inline' | 'block';
  value: string;
}

// Order matters: match the longer/greedier block delimiters ($$, \[) before
// the inline ones ($, \() so a `$$` is never mistaken for two `$`. Group map:
//   1 → $$...$$ (block)   2 → \[...\] (block)
//   3 → $...$   (inline)  4 → \(...\) (inline)
const MATH_DELIMITERS =
  /\$\$([\s\S]+?)\$\$|\\\[([\s\S]+?)\\\]|\$(?!\s)([^$\n]+?)(?<!\s)\$|\\\((.+?)\\\)/g;

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
      segments.push({ type: 'block', value: match[1] });
    } else if (match[2] !== undefined) {
      segments.push({ type: 'block', value: match[2] });
    } else if (match[3] !== undefined) {
      segments.push({ type: 'inline', value: match[3] });
    } else if (match[4] !== undefined) {
      segments.push({ type: 'inline', value: match[4] });
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
    <span className={`math-content max-w-full ${className ?? ''}`}>
      {segments.map((seg, i) => {
        if (seg.type === 'text') {
          return (
            <span key={i} className="whitespace-pre-wrap break-words">
              {seg.value}
            </span>
          );
        }
        const isBlock = seg.type === 'block';
        const html = renderMath(seg.value, isBlock);
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
