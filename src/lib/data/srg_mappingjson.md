# SRG Bank Maths — Question Tracker

Purpose: Track exactly which questions from `SRG_Bank_-_Maths.pdf` have already
been converted into site JSON, so future batches never re-do or skip a question
by accident. Update this file every time a new batch is added.

PDF file: `SRG_Bank_-_Maths.pdf` (193 pages total, no text layer — every page
was read visually).

---

## Chapter: Trigonometric Ratios and Identities

- PDF chapter title page: **page 1**
- Questions start: **page 3**
- Site topicId used: `trigonometry`

| PDF Page | PDF Q# | Site Question ID | Subtopic (site) | Status |
|---|---|---|---|---|
| 3 | 1 | *(not used — duplicate of PDF Q10)* | — | Skipped (duplicate) |
| 3 | 2 | `trig-bulk1-q1` | Trigonometric Series | ✅ Done |
| 3 | 3 | *(not used — duplicate of PDF Q12)* | — | Skipped (duplicate) |
| 4 | 4 | `trig-bulk1-q2` | Trigonometric Equations | ✅ Done |
| 4 | 5 | *(not used yet)* | — | ⬜ Available for next batch |
| 4 | 6 | *(not used yet — very long, multi-part)* | — | ⬜ Available for next batch |
| 4 | 7 | *(not used yet — very long, multi-part)* | — | ⬜ Available for next batch |
| 5 | 8 | *(not used yet)* | — | ⬜ Available for next batch |
| 5 | 9 | `trig-bulk1-q3` | Triangle Identities | ✅ Done |
| 5 | 10 | *(not used — duplicate of PDF Q1)* | — | Skipped (duplicate) |
| 6 | 11 | *(not used — duplicate of PDF Q2)* | — | Skipped (duplicate) |
| 6 | 12 | *(not used — duplicate of PDF Q3)* | — | Skipped (duplicate) |
| 6 | 13 | `trig-bulk1-q4` | Trigonometric Identities | ✅ Done |
| 7 | 14 | `trig-bulk1-q5` | Trigonometric Identities | ✅ Done |
| 7 | 15 | `trig-bulk1-q6` | Trigonometric Identities | ✅ Done |
| 7 | 16 | `trig-bulk1-q7` | Trigonometric Equations | ✅ Done |
| 7 | 17 | `trig-bulk1-q8` | Trigonometric Identities | ✅ Done |
| 8+ | 18+ | *(not yet reviewed)* | — | ⬜ Not yet looked at |

**Note on duplicates:** the PDF repeats Q1–3 again as Q10–13 (pages 5–6) —
these were intentionally skipped as duplicates, not missed.

**Second-approach (Approach 2) status for this batch:** not yet generated —
only quadratic-equations batch 1 has Approach 2 so far. Ask if you want
trig-bulk1 Approach 2 next.

---

## Chapter: Quadratic Expression and Equation

- PDF chapter title page: **page 15** (title appears partway down the page,
  after the last 2 trig questions on that page)
- Questions start: **page 15 (Q1–2)**, continue **page 16 (Q3–6)**, **page 17
  (Q7–10)**, **page 18 (Q11–14)**, **page 19 (Q15–18)**
- Site topicId used: `quadratic-equations`

| PDF Page | PDF Q# | Site Question ID | Subtopic (site) | Status |
|---|---|---|---|---|
| 15 | 1 | *(not used yet)* | — | ⬜ Available for next batch |
| 15 | 2 | `quad-bulk1-q2` | Theory of Equations | ✅ Done |
| 16 | 3 | `quad-bulk1-q3` | Theory of Equations | ✅ Done |
| 16 | 4 | *(not used yet)* | — | ⬜ Available for next batch |
| 16 | 5 | `quad-bulk1-q4` | Theory of Equations | ✅ Done |
| 16 | 6 | `quad-bulk1-q5` | Common Roots & Inequalities | ✅ Done |
| 17 | 7 | *(not used yet)* | — | ⬜ Available for next batch |
| 17 | 8 | `quad-bulk1-q6` | Sum and Product of Roots | ✅ Done |
| 17 | 9 | `quad-bulk1-q7` | Roots of Unity | ✅ Done |
| 17 | 10 | `quad-bulk1-q8` | Equations Reducible to Quadratic | ✅ Done |
| 18 | 11 | *(not used yet)* | — | ⬜ Available for next batch |
| 18 | 12 | *(not used yet)* | — | ⬜ Available for next batch |
| 18 | 13 | *(not used yet — paragraph, need page 18 passage text)* | — | ⬜ Available for next batch |
| 18 | 14 | *(not used yet — part of Q13's paragraph set)* | — | ⬜ Available for next batch |
| 19 | 15 | *(not used yet — part of Q13's paragraph set)* | — | ⬜ Available for next batch |
| 19 | 16 | *(not used yet)* | — | ⬜ Available for next batch |
| 19 | 17 | `quad-bulk1-passage-functional-q1` | Functional Equations in Quadratics | ✅ Done |
| 19 | 18 | `quad-bulk1-passage-functional-q2` | Functional Equations in Quadratics | ✅ Done |
| 20+ | 19+ | *(not yet reviewed)* | — | ⬜ Not yet looked at |

**Note on Q1 (page 15):** This question was visible but intentionally **not
included** in batch 1 — only 8 standalone + 1 passage were selected for the
test batch size. It's still available, not skipped for any quality reason.

**Approach 2 (alternate solving methods) — generated for this batch:**

| Site Question ID | 2nd Approach Given? | Type |
|---|---|---|
| `quad-bulk1-q1` | ✅ | AM-GM range trick |
| `quad-bulk1-q2` | ✅ | Direct factor-matching (no full quartic expansion) |
| `quad-bulk1-q3` | ✅ | Calculus (derivative) instead of AM-GM |
| `quad-bulk1-q4` | ✅ | Plug-in-numbers shortcut |
| `quad-bulk1-q5` | ❌ Skipped — no genuinely different method exists |
| `quad-bulk1-q6` | ❌ Skipped — no genuinely different method exists |
| `quad-bulk1-q7` | ✅ | Explicit root of unity instead of abstract mod-5 |
| `quad-bulk1-q8` | ✅ | Algebraic identity ($p+q+r=0\Rightarrow p^3+q^3+r^3=3pqr$) instead of monotonicity |
| `quad-bulk1-passage-functional-q1` | ❌ Not generated yet | — |
| `quad-bulk1-passage-functional-q2` | ❌ Not generated yet | — |

Delivered in file: `quadratic-bulk1-approach2.json`

---

## Files delivered so far

| File | Contains | Merge target in repo |
|---|---|---|
| `trigonometry-bulk1.json` | 8 trig questions | `src/lib/data/topics/trigonometry/questions.json` |
| `quadratic-bulk1.json` | 8 quad questions + 1 passage (2 sub-Qs) | `src/lib/data/topics/quadratic-equations/questions.json` |
| `quadratic-bulk1-approach2.json` | 6 alternate approaches (addendum, not standalone questions) | merge into existing `approaches[]` arrays in `quadratic-equations/questions.json` |

---

## How to keep this updated

Every time a new batch is generated, this file should get:
1. New rows added to the relevant chapter table (or a new chapter section if
   it's a new topic).
2. The PDF page + PDF question number, so we always know the source.
3. The site Question ID actually used in the JSON, so it's searchable in
   Cursor instantly (`Ctrl+Shift+F` → paste the ID).
4. Status of duplicates/skips, so nothing gets silently missed or redone.