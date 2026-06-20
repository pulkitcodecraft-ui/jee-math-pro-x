/**
 * Converts Unicode / ASCII math in seed content to LaTeX delimiters so KaTeX
 * renders properly. Skips regions already inside $...$ / $$...$$ so we never
 * double-wrap or corrupt authored LaTeX.
 */

const SUPER: Record<string, string> = {
  '⁰': '^0', '¹': '^1', '²': '^2', '³': '^3', '⁴': '^4',
  '⁵': '^5', '⁶': '^6', '⁷': '^7', '⁸': '^8', '⁹': '^9',
  'ⁿ': '^n', '⁻': '^-',
};

const SUB: Record<string, string> = {
  '₀': '_0', '₁': '_1', '₂': '_2', '₃': '_3', '₄': '_4',
  '₅': '_5', '₆': '_6', '₇': '_7', '₈': '_8', '₉': '_9',
  'ₙ': '_n', '₋': '_-',
};

/** Matches the same delimiters MathText uses — keep in sync. */
const IMAGE_MARKER = /!\[[^\]]*\]\([^)]+\)|\[image:[^\s\]]+(?:\s+invert)?\]/gi;

function protectImageMarkers(text: string): { text: string; images: string[] } {
  const images: string[] = [];
  const protectedText = text.replace(IMAGE_MARKER, (m) => {
    images.push(m);
    return `__SOLIMG_${images.length - 1}__`;
  });
  return { text: protectedText, images };
}

function restoreImageMarkers(text: string, images: string[]): string {
  return text.replace(/__SOLIMG_(\d+)__/g, (_, i) => images[Number(i)] ?? '');
}

/** Matches the same delimiters MathText uses — keep in sync. */
const MATH_REGION =
  /\$\$([\s\S]+?)\$\$|\\\[([\s\S]+?)\\\]|\$(?!\s)([^$\n]+?)(?<!\s)\$|\\\((.+?)\\\)/g;

function splitMathRegions(text: string): { math: boolean; value: string }[] {
  const parts: { math: boolean; value: string }[] = [];
  let last = 0;
  let match: RegExpExecArray | null;

  MATH_REGION.lastIndex = 0;
  while ((match = MATH_REGION.exec(text)) !== null) {
    if (match.index > last) {
      parts.push({ math: false, value: text.slice(last, match.index) });
    }
    parts.push({ math: true, value: match[0] });
    last = match.index + match[0].length;
  }

  if (last < text.length) {
    parts.push({ math: false, value: text.slice(last) });
  }

  return parts.length ? parts : [{ math: false, value: text }];
}

function replaceSuperSub(text: string): string {
  let out = '';
  for (const ch of text) {
    if (SUPER[ch]) out += SUPER[ch];
    else if (SUB[ch]) out += SUB[ch];
    else out += ch;
  }
  return out;
}

function enrichPlainSegment(text: string): string {
  let s = replaceSuperSub(text);
  s = s
    .replace(/⟹/g, '$\\Rightarrow$')
    .replace(/⟺/g, '$\\Leftrightarrow$')
    .replace(/≠/g, '$\\neq$')
    .replace(/±/g, '$\\pm$')
    .replace(/·/g, '$\\cdot$')
    .replace(/∫/g, '$\\int$')
    .replace(/∞/g, '$\\infty$')
    .replace(/√(\w+|\([^)]+\))/g, (_, inner) => `$\\sqrt{${inner}}$`)
    .replace(/([a-zA-Z]+)⁻¹/g, '$1^{-1}');

  s = s.replace(
    /(?<!\$)([a-zA-Z0-9|()]+(?:\^|_)[a-zA-Z0-9|()+\-\/·]+(?:\^|_[a-zA-Z0-9|()+\-\/·]+)*)/g,
    (m) => (m.includes('$') ? m : `$${m}$`)
  );

  s = s.replace(/log_(\d+)/g, '$\\log_{$1}$');
  s = s.replace(/log₂/g, '$\\log_2$');
  s = s.replace(/log₃/g, '$\\log_3$');
  s = s.replace(/log₅/g, '$\\log_5$');
  s = s.replace(/log₁₀/g, '$\\log_{10}$');

  s = s.replace(/lim\s*\(\s*x\s*→\s*0\s*\)/gi, '$\\lim_{x \\to 0}$');
  s = s.replace(/lim\s*\(\s*x\s*→\s*(\w+)\s*\)/gi, '$\\lim_{x \\to $1}$');
  s = s.replace(/\bdy\/dx\b/g, '$\\frac{dy}{dx}$');

  return s;
}

/** Enrich a single text field for display. */
export function enrichMathText(text: string): string {
  if (!text?.trim()) return text ?? '';
  const { text: protectedText, images } = protectImageMarkers(text);
  const enriched = splitMathRegions(protectedText)
    .map((part) => (part.math ? part.value : enrichPlainSegment(part.value)))
    .join('');
  return restoreImageMarkers(enriched, images);
}

/** Enrich approach content: also normalize Answer line for OfficialSolution parser. */
export function enrichApproachContent(content: string): string {
  let s = enrichMathText(content);
  s = s.replace(/\nAnswer:\s*/g, '\n\nAnswer: ');
  return s;
}
