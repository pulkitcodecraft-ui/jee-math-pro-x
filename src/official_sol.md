# Cursor Command — paste this whole thing into Cursor chat (Agent mode)

I'm building "JEE Math Pro", a Next.js/React-based site (verify actual framework
first — check package.json) that shows MCQ math questions with step-by-step
solutions. Two things are broken and I need both fixed.

## PART 1 — Math is rendering as plain text instead of typeset LaTeX

Right now solution text is stored/rendered as raw strings like
`log_{|x|}((|x| - √3)/√3)` which looks broken and unprofessional. I want
proper math typesetting like Gemini/ChatGPT use — fractions stacked, real
radical signs, real super/subscripts.

Steps:
1. Detect the framework/stack from package.json before doing anything.
2. Install KaTeX (lightest, fastest option — not MathJax):
   - React: `react-katex` + `katex` (use `InlineMath` and `BlockMath` components)
   - Plain HTML/JS: `katex` package, import `katex.min.css`, call
     `katex.render()` or `katex.renderToString()`
3. Import `katex/dist/katex.min.css` once globally (e.g. in `_app.tsx` /
   `layout.tsx` / main entry file) — do not forget this, KaTeX looks broken
   without its CSS.
4. Find every place solution/question text is rendered (search for the
   component that renders "Solution Approaches", "Official Solution", and
   the question stem itself on the question detail page). Replace plain-text
   rendering with LaTeX rendering:
   - Question stem and any inline math inside prose → `InlineMath` (or `$...$`)
   - Standalone derivation steps (the equation on its own line) →
     `BlockMath` (or `$$...$$`)
5. Update the actual stored content for existing questions/solutions in the
   database/CMS/markdown files (wherever this content lives — find it) to use
   real LaTeX syntax instead of the current ASCII-math strings. Example
   conversion for THIS question:

   Old (broken): `25^(log_10(2√2)) + log_{|x|}((|x| - √3)/√3) = ...`

   New (LaTeX):
   ```
   25^{\log_{10}(2\sqrt{2})} + \log_{|x|}\left(\frac{|x|-\sqrt{3}}{\sqrt{3}}\right) = 25^{\log_{10}(2\sqrt{2})} + \log_{|x|}\left(\frac{|x|+\sqrt{3}}{\sqrt{3}}\right)
   ```

   Do this conversion for ALL existing questions in the database, not just
   this one — write a small migration/script if there are many, since they
   likely follow a consistent ASCII-math pattern that can be regex-converted
   (e.g. `√x` → `\sqrt{x}`, `a/b` inside parens → `\frac{a}{b}`, `log_{base}`
   stays `\log_{base}`). Flag any conversions you're not fully confident
   about instead of guessing silently.

## PART 2 — Redesign the "Official Solution" block layout

Current layout is a single gray text blob with no visual hierarchy — feels
like a placeholder, not a finished product. Replace it with a numbered
step-by-step card layout:

- Each logical step in the derivation gets its own row: a small numbered
  circle badge (1, 2, 3...) on the left, step description (one short line,
  bold, 14px) above the LaTeX-rendered equation for that step.
- The final step/answer row is visually distinct (e.g. colored circle badge)
  and the bottom of the card has a clear "Final answer" row, separated by a
  divider, with the answer right-aligned and emphasized.
- The whole thing sits in a single card: white/surface background, subtle
  1px border, rounded corners (8-12px), comfortable padding (~1.25rem).
- Remove the "official" pill clutter or keep it but make it a small badge
  at the top of the card, not competing with the content.
- This is a reusable component — build it as `<SolutionSteps steps={[...]}>`
  or similar, taking an array of `{ description, latex }` objects per step,
  plus a final `{ description, answer }`, so it works for every question on
  the site, not just this one.
- Remove any TODO/placeholder text in the existing data (e.g. "paste the
  Allen solution GIF below if you have it") — that should never have shipped
  to a question page users see.

## PART 3 — Fix the actual wrong answer on this specific question

This question (`basic-maths-mcq2`, "Basic Maths" topic, the 25^(log...) +
log_{|x|}... question) has TWO bugs:

1. The marked correct answer is option (B) "1", but solving it correctly
   gives **0 real solutions — option (A)**. Walk through it: the
   `25^{\log_{10}(2\sqrt2)}` term is identical on both sides and cancels.
   What's left is `log_{|x|}((|x|-√3)/√3) = log_{|x|}((|x|+√3)/√3)`. Equal
   logs with equal bases force equal arguments: `|x|-√3 = |x|+√3`, which
   simplifies to `-2√3 = 0` — never true for any x. So there is no real
   solution. Update the correct answer field for this question from B to A.

2. The stored "Official Solution" text currently derives this exact same
   contradiction and THEN ignores its own math, writing "Workbook answer:
   1 real solution → option (B)" with no justification, plus a stray
   internal note ("paste the Allen solution GIF below if you have it") that
   was clearly an unfinished draft. Replace the solution content with a
   clean, correct, complete derivation ending in "0 real solutions — option
   (A)", written in proper LaTeX per Part 1.

Before changing the database value, do a one-time audit: search for any
other questions where the stored "correct answer" field contradicts the
final line of the question's own stored solution text (this looks like it
might be a recurring data-entry issue, not a one-off). List anything
suspicious you find for me to review — don't silently change other answers
without flagging them first.

## General

- Show me a diff/preview of the new component before applying broadly if
  the codebase has many question pages — I want to sanity check one
  rendered example first.
- Keep dark mode working if the site already supports it (KaTeX text should
  inherit theme colors, don't hardcode black text).