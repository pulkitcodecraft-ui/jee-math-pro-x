# Bulk question upload (50+ per topic)

Add many questions to one topic **without editing `mockData.ts`** — only edit JSON in this folder.

## Quick start (Parabola)

1. Open **`parabola/questions.json`**
2. For **standalone MCQ:** copy `question.template.json` → paste into `"questions": [ ... ]`
3. For **paragraph type:** copy `passage.template.json` → paste into `"passages": [ ... ]`
4. Run `npm run validate:bulk`
5. Refresh `/topics/parabola`

## Question types supported

| Type | JSON | UI badge |
|------|------|----------|
| **Subjective** | no `format`, no `options` | — |
| **MCQ** (single / multi correct) | `"format": "mcq"` + `options` + `correctOption` or `correctOptions` | MCQ |
| **Paragraph MCQ** | `"passages": [ { passage, questions: [...] } ]` | Paragraph + linked sub-questions |

## Standalone MCQ

```json
{
  "id": "parabola-mcq7",
  "subtopicId": "Tangents & Normals",
  "difficulty": "hard",
  "format": "mcq",
  "statement": "Question with $LaTeX$",
  "options": { "A": "$1$", "B": "$2$", "C": "$3$", "D": "$4$" },
  "correctOptions": ["A", "B"],
  "approaches": [{ "label": "Official Solution", "content": "1. **Step:** ...\n\nAnswer: (A,B)." }]
}
```

## Paragraph type (shared stem + multiple MCQs)

One passage, many sub-questions — like JEE workbook "Paragraph" blocks:

```json
"passages": [
  {
    "id": "parabola-passage-curves",
    "title": "Paragraph",
    "passage": "Consider $C_1 : y = \\frac{8}{27}x^3$ and $C_2 : y = (x+a)^2$.",
    "subtopicId": "Tangents & Normals",
    "difficulty": "hard",
    "questions": [
      {
        "id": "parabola-passage-curves-q5",
        "passageLabel": "5",
        "statement": "Sub-question text...",
        "options": { "A": "...", "B": "...", "C": "...", "D": "..." },
        "correctOption": "B",
        "approaches": [{ "label": "Official Solution", "content": "..." }]
      },
      {
        "id": "parabola-passage-curves-q6",
        "passageLabel": "6",
        "statement": "If $a=4$, then ...",
        "correctOption": "B",
        "approaches": [...]
      }
    ]
  }
]
```

- `passageLabel` — workbook number shown as **5.** on detail page
- Sub-questions get their own URL: `/topics/parabola/questions/parabola-passage-curves-q5`
- Passage text appears on topic list (grouped card) and on each sub-question page

## Templates

| File | Use |
|------|-----|
| `question.template.json` | Standalone MCQ / subjective |
| `passage.template.json` | Full paragraph block |

## Images & LaTeX

**Solution diagrams only** (shown inside Official Solution, not on the question stem):

| Method | JSON field | Example |
|--------|------------|---------|
| Single figure | `approaches[].imageUrl` | `"imageUrl": "/questions/parabola/sol.png"` |
| Multiple figures | `approaches[].images` | `"images": ["/questions/parabola/step1.svg", "/questions/parabola/step2.png"]` |
| Inline in a step | `approaches[].content` | `![label](/questions/parabola/mid-step.png)` or `[image:/path invert]` |

Put files under `public/questions/<topic>/` (URL path starts with `/questions/...`).

- PNG workbook scans → use as **solution** figures, not on `question.images` or `passage.images`
- JSON LaTeX: double backslashes `\\frac{1}{2}`

## New topic bulk folder

1. Create `topics/ellipse/questions.json`
2. Register in `topics/index.ts`
3. Same `questions` + `passages` structure, `"topicId": "ellipse"`
