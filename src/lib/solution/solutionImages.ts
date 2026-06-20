/**
 * Inline images inside official solution text (approach.content).
 *
 * Supported markers (use any when uploading bulk content):
 *   ![Step diagram](/questions/topic/sol-step2.png)
 *   [image:/questions/topic/sol-step2.png]
 *   [image:/questions/topic/scan.png invert]   — white PDF scan on dark UI
 */

export interface SolutionImage {
  src: string;
  alt: string;
  invert?: boolean;
}

export type SolutionContentPart =
  | { type: 'text'; value: string }
  | { type: 'image'; image: SolutionImage };

const IMAGE_MD = /!\[([^\]]*)\]\(([^)]+)\)/g;
const IMAGE_TAG = /\[image:([^\s\]]+)(?:\s+(invert))?\]/gi;

export function parseSolutionImages(text: string): SolutionContentPart[] {
  if (!text) return [];

  const parts: SolutionContentPart[] = [];
  const combined =
    /!\[([^\]]*)\]\(([^)]+)\)|\[image:([^\s\]]+)(?:\s+(invert))?\]/gi;

  let last = 0;
  let match: RegExpExecArray | null;
  combined.lastIndex = 0;

  while ((match = combined.exec(text)) !== null) {
    if (match.index > last) {
      parts.push({ type: 'text', value: text.slice(last, match.index) });
    }

    if (match[1] !== undefined && match[2] !== undefined) {
      parts.push({
        type: 'image',
        image: { alt: match[1] || 'Solution figure', src: match[2].trim() },
      });
    } else if (match[3] !== undefined) {
      parts.push({
        type: 'image',
        image: {
          alt: 'Solution figure',
          src: match[3].trim(),
          invert: Boolean(match[4]),
        },
      });
    }

    last = match.index + match[0].length;
  }

  if (last < text.length) {
    parts.push({ type: 'text', value: text.slice(last) });
  }

  return parts.length ? parts : [{ type: 'text', value: text }];
}

/** Remove image markers so titles / plain previews stay readable. */
export function stripSolutionImageMarkers(text: string): string {
  return text
    .replace(IMAGE_MD, '')
    .replace(IMAGE_TAG, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
