# Cursor Prompt — Smart AI-Powered Homepage Search (Auto-Routing, No Toggle)

Copy everything below into Cursor's chat/composer.

---

I'm working on "JEE Math Pro" (Next.js-based, dark theme, purple/teal gradient accents). The homepage hero has an existing search bar with placeholder text like `Try "Functions", "Probability", "I need help with Circles"...` and a purple "Search" button.

I want to upgrade ONLY this homepage search bar into a **smart AI-powered input** that automatically figures out what the student wants and routes them to the right place — **no manual toggle, no mode switch**. The AI decides everything itself.

## 1. What the Smart Search Must Do

When the student types into the search bar (in **any language — English, Hindi, or Hinglish/mixed**, and even with **minor spelling mistakes or broken grammar**) and hits Search/Enter, the system must:

1. **Understand intent first.** Send the raw input to an AI classification step (a fast Gemini call on Vertex AI, e.g. Gemini Flash for speed) with a system prompt like:
   > "You are an intent classifier for a JEE math platform. Given a user's raw search input (which may be in English, Hindi, Hinglish, or contain typos/grammar errors), classify it as one of: TOPIC_SEARCH (they want to browse/learn a topic, e.g. 'probability', 'functions ka chapter') or DOUBT_SOLVE (they have a specific question/problem to solve, e.g. contains an actual math expression, 'how to solve', 'is sawaal ka answer', '?', equations, or problem-like phrasing). Also correct/normalize the input text. Respond in structured JSON: { intent, normalized_query, confidence }."
2. **Auto-correct minor errors** as part of that same call — e.g. "probabilty" → "Probability", garbled Hinglish → clean intent — so downstream routing/search works on clean text.
3. **Route automatically based on intent:**
   - If `TOPIC_SEARCH` → take the student to the existing topic search/results experience (whatever currently happens when "Browse All Topics" / topic search is used) with the normalized query pre-filled.
   - If `DOUBT_SOLVE` → take the student to the Doubt Solver page/flow (the `/explain`-style AI Explain experience) with the normalized question **pre-filled and ready** (auto-submit or one-click confirm — your call, but minimize extra steps).
4. **Low-confidence fallback:** If the classifier's confidence is low (ambiguous input), don't guess blindly — show a quick lightweight inline prompt like two small buttons under the search bar: "Did you mean: Search Topics 🔍 | Solve this Doubt 🤔" so the student picks in one tap, instead of a wrong silent redirect.
5. Keep this fast — the classification call should feel near-instant (use the lightest/fastest suitable Gemini model on Vertex AI for this step specifically, since it's just intent detection, not the actual solving — save the heavier/best reasoning model for the actual doubt-solving step on the Doubt Solver page).

## 2. No Toggle, No Mode Switch

- Do NOT add any visible toggle/switch UI for "Topic mode" vs "Doubt mode" — the whole point is the AI infers this automatically from what the student typed.
- The search bar should look and feel exactly as simple as it does now — same visual style, same placeholder concept — just smarter underneath.
- Update the placeholder text to hint at this dual capability naturally, e.g.: `Search a topic or type your doubt... e.g. "Probability" or "solve x²-5x+6=0"`

## 3. Scope — Homepage Only

- This smart classification + auto-routing behavior applies **only to this homepage hero search bar**. Do not add this AI layer anywhere else in the app for now (no floating assistant, no other search bars need this).
- Don't touch or duplicate logic on other pages — just call into them (reuse the existing topic-search experience and the existing Doubt Solver / AI Explain experience, whichever pages those already live on).

## 4. Implementation Notes

- First, inspect the existing codebase: find where the current search bar lives, what happens on submit today, where "topic search" results render, and where the Doubt Solver / AI Explain page lives, so this builds on top of existing logic rather than duplicating it.
- Implement the classification call as a small dedicated API route (e.g. `/api/classify-search`) that takes raw text and returns `{ intent, normalized_query, confidence }`, so it's easy to test/tune independently.
- Handle loading state gracefully — a brief "Understanding your question..." micro-loading state (under ~1 second ideally) is fine, but don't let it feel laggy; show a subtle spinner in the search button itself rather than a full-page loader.
- Handle errors gracefully (e.g. if the classification API fails, fall back to treating the input as a TOPIC_SEARCH so the student isn't stuck).
- Keep all existing homepage layout, stats (24 Core Topics / 141 Subtopics / 27 Worked Questions), nav, and buttons ("Browse All Topics", "Explore Features") unchanged — this only modifies the search bar's submit behavior.

Start by showing me the relevant existing files (search bar component, topic search logic, doubt solver/explain page) and your implementation plan before writing code.