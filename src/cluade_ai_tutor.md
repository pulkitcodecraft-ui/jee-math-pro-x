# Cursor prompt — AI Tutor premium chat UI with KaTeX

Paste everything below into Cursor (Agent/Composer mode, not just Ask mode —
it needs to create files and run terminal commands) in your Next.js project.

---

First, search this codebase and find the actual files that render the AI
tutor chat panel (the one with the "AI Tutor / Samjhao Hinglish mein" header
and step-by-step solutions), and the file where the tutor's system prompt is
built. Use those real paths instead of any placeholder paths mentioned below.

Before making any changes, list every file you intend to create or edit and
wait for my go-ahead.

Only touch the rendering of AI response content (turning raw text/LaTeX into
formatted step cards) and the system prompt's formatting instructions. Do not
modify message-sending logic, API routes beyond the system prompt, or auth.

I need to upgrade the AI Tutor chat panel in my JEE prep app. Currently the AI's
step-by-step solutions render raw LaTeX source as plain text (e.g. literally
showing `\frac{4}{7}` instead of a proper fraction), and each step is just a
plain text blob with no visual separation. I want a premium, Notion/Linear-style
UI that actually renders math properly.

## 1. Install dependencies

```bash
npm install katex react-katex
npm install -D @types/katex
```

## 2. Import KaTeX CSS globally

In `app/layout.tsx` (or `pages/_app.tsx` if on Pages Router), add at the top:

```tsx
import "katex/dist/katex.min.css";
```

## 3. Create a Markdown+LaTeX renderer component

Create `components/tutor/MathMarkdown.tsx`. This component should:
- Accept a `content: string` prop containing mixed text and LaTeX
- Parse inline math delimited by `$...$` and block math delimited by `$$...$$`
  (also support `\(...\)` and `\[...\]` since some models emit that)
- Render math spans with `react-katex`'s `InlineMath` and `BlockMath`
- Render everything else as plain text/markdown (use `react-markdown` for bold,
  bullet lists etc. if the AI response includes those)
- Wrap the whole thing so KaTeX errors (malformed LaTeX) don't crash the page —
  wrap each `InlineMath`/`BlockMath` in a try/catch via the `renderError` prop
  and fall back to showing the raw string in a `<code>` tag if parsing fails

```tsx
"use client";

import { InlineMath, BlockMath } from "react-katex";
import ReactMarkdown from "react-markdown";

interface MathMarkdownProps {
  content: string;
  className?: string;
}

// Splits a string into plain-text and math segments, supporting
// $$...$$ and \[...\] for block math, $...$ and \(...\) for inline math.
function splitMath(text: string) {
  const pattern = /(\$\$[\s\S]+?\$\$|\\\[[\s\S]+?\\\]|\$[^$\n]+?\$|\\\([\s\S]+?\\\))/g;
  const parts = text.split(pattern).filter(Boolean);
  return parts.map((part, i) => {
    const isBlock = /^\$\$[\s\S]+\$\$$/.test(part) || /^\\\[[\s\S]+\\\]$/.test(part);
    const isInline = /^\$[^$]+\$$/.test(part) || /^\\\([\s\S]+\\\)$/.test(part);
    if (isBlock) {
      const tex = part.replace(/^\$\$|\$\$$/g, "").replace(/^\\\[|\\\]$/g, "");
      return (
        <BlockMath
          key={i}
          math={tex}
          renderError={() => <code style={{ color: "var(--color-text-danger, #c0392b)" }}>{tex}</code>}
        />
      );
    }
    if (isInline) {
      const tex = part.replace(/^\$|\$$/g, "").replace(/^\\\(|\\\)$/g, "");
      return (
        <InlineMath
          key={i}
          math={tex}
          renderError={() => <code style={{ color: "var(--color-text-danger, #c0392b)" }}>{tex}</code>}
        />
      );
    }
    return <ReactMarkdown key={i}>{part}</ReactMarkdown>;
  });
}

export default function MathMarkdown({ content, className }: MathMarkdownProps) {
  return <span className={className}>{splitMath(content)}</span>;
}
```

## 4. Update the system prompt sent to the AI model

Find wherever the tutor's system/instruction prompt is constructed and ONLY
APPEND the formatting rules below to the end of the existing prompt. Do not
rewrite, reorder, or restructure any existing instructions (persona, tone,
safety rules, Hinglish calibration, etc.) — append only.

```
When writing any mathematical expression, ALWAYS wrap it in LaTeX delimiters:
- Inline math: $...$  (e.g. "the probability is $\frac{4}{7}$")
- Block/display math for standalone equations: $$...$$
- Use \frac{a}{b} for fractions, ^{...} for exponents, _{...} for subscripts,
  \sqrt{...} for roots, \binom{n}{k} for combinations.
- NEVER write fractions as a/b in plain text — always use \frac.
- NEVER write exponents as a^2 in plain text outside math delimiters — wrap
  them as $a^2$.

Structure every step-by-step solution as a numbered list using this exact
format so the UI can render each step as its own card:

STEP 1: <short title for this step>
<explanation in Hinglish, plain sentences>
$$<the key equation for this step, if any>$$

STEP 2: <short title for this step>
...

Keep each step focused on ONE idea. Put the final numeric/symbolic answer in
its own final step titled "Answer".
```

## 5. Parse the AI response into step objects

Create `lib/tutor/parseSteps.ts` to turn the model's `STEP N: title` format
into structured data:

```ts
export interface TutorStep {
  number: number;
  title: string;
  body: string;
}

export function parseSteps(raw: string): TutorStep[] {
  const stepPattern = /STEP\s+(\d+):\s*(.+?)\n([\s\S]*?)(?=STEP\s+\d+:|$)/gi;
  const steps: TutorStep[] = [];
  let match;
  while ((match = stepPattern.exec(raw)) !== null) {
    steps.push({
      number: parseInt(match[1], 10),
      title: match[2].trim(),
      body: match[3].trim(),
    });
  }
  // Fallback: if the model didn't use STEP format, treat the whole
  // response as a single step so nothing silently disappears.
  if (steps.length === 0) {
    steps.push({ number: 1, title: "Solution", body: raw.trim() });
  }
  return steps;
}
```

## 6. Build the premium step-card UI

Create `components/tutor/StepCard.tsx`:

```tsx
import MathMarkdown from "./MathMarkdown";
import type { TutorStep } from "@/lib/tutor/parseSteps";

interface StepCardProps {
  step: TutorStep;
  isLast: boolean;
}

export default function StepCard({ step, isLast }: StepCardProps) {
  const isAnswer = step.title.toLowerCase().includes("answer");

  return (
    <div
      className={`rounded-lg border overflow-hidden ${
        isAnswer
          ? "border-blue-300 dark:border-blue-700"
          : "border-zinc-200 dark:border-zinc-800"
      }`}
    >
      <div
        className={`flex items-center gap-2 px-3 py-2 ${
          isAnswer
            ? "bg-blue-50 dark:bg-blue-950"
            : "bg-zinc-50 dark:bg-zinc-900"
        }`}
      >
        <span
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-medium ${
            isAnswer
              ? "bg-white dark:bg-zinc-900 text-blue-700 dark:text-blue-300"
              : "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
          }`}
        >
          {isAnswer ? <CheckIcon /> : step.number}
        </span>
        <p
          className={`text-sm font-medium ${
            isAnswer ? "text-blue-700 dark:text-blue-300" : "text-zinc-900 dark:text-zinc-100"
          }`}
        >
          {step.title}
        </p>
      </div>
      <div className="px-3 py-3 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
        <MathMarkdown content={step.body} />
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
```

Create `components/tutor/SolutionPanel.tsx` that ties it together:

```tsx
import { parseSteps } from "@/lib/tutor/parseSteps";
import StepCard from "./StepCard";

export default function SolutionPanel({ rawResponse }: { rawResponse: string }) {
  const steps = parseSteps(rawResponse);
  return (
    <div className="flex flex-col gap-2.5">
      {steps.map((step, i) => (
        <StepCard key={step.number} step={step} isLast={i === steps.length - 1} />
      ))}
    </div>
  );
}
```

## 7. Wire it into the existing chat panel

Find the component currently rendering the AI's raw response (looks like it's
in something like `components/tutor/ChatPanel.tsx` or similar, based on the
"AI Tutor / Samjhao Hinglish mein" header in the screenshot). Replace whatever
renders `message.content` as plain text/`<p>` with:

```tsx
<SolutionPanel rawResponse={message.content} />
```

Also restyle the surrounding chat shell to match this spec:
- Panel: white/zinc-950 background, `rounded-xl border border-zinc-200 dark:border-zinc-800`
- Header: AI tutor icon in a soft blue circle (`bg-blue-50 dark:bg-blue-950`), title
  "AI tutor" at `text-sm font-medium`, subtitle "Samjhao Hinglish mein" at
  `text-xs text-zinc-500`
- Question recap block: `bg-zinc-50 dark:bg-zinc-900` panel above the steps,
  label "QUESTION" in `text-[11px] font-medium uppercase tracking-wide text-zinc-400`
- Suggested follow-up chips ("Ye step kaise aaya?", "Ek example do", "Phir se
  samjhao"): pill buttons, `rounded-full border border-zinc-200 dark:border-zinc-800
  px-3 py-1.5 text-xs hover:bg-zinc-50 dark:hover:bg-zinc-900`, each calls the
  existing send-message handler with that canned prompt
- Input bar: pinned at bottom, rounded input + circular send button with an
  up-arrow icon, matching the existing "Apna sawaal pucho..." placeholder

## 8. Test cases — verify these render correctly

After wiring it up, test the AI tutor with these to confirm KaTeX is working:
1. A probability problem with `\frac{4}{7}`
2. A quadratic with `x^2 + 5x + 6 = 0` and `\sqrt{b^2 - 4ac}`
3. A combinatorics problem with `\binom{n}{r}`
4. Something with subscripts like `a_n = a_1 + (n-1)d`

Each should show a properly typeset fraction/exponent/root, not raw backslash
syntax. If `react-katex` throws on any model output, the `renderError`
fallback should show the raw LaTeX in a styled `<code>` block instead of
crashing the panel — confirm this doesn't happen by checking the browser
console for KaTeX parse errors during testing.

## Notes
- `react-katex` renders client-side; component files above already have
  `"use client"` where needed — keep that directive if your file doesn't
  already have it, since KaTeX touches the DOM.
- If your model response streams token-by-token, don't call `parseSteps` on
  every partial chunk — debounce it or only run final parsing once the stream
  completes, otherwise you'll get flickering as STEP markers arrive mid-word.
- Tailwind dark mode classes above assume you have `darkMode: "class"` (or are
  using the OS-preference strategy) configured in `tailwind.config.ts`. If
  your app is dark-only (as the screenshot suggests), you can drop the
  `dark:` variants and just use the dark values directly.