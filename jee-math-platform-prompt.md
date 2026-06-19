# Build Prompt: JEE Advanced Mathematics Learning Platform

## Role & Working Style
You are building a web app incrementally, in clearly separated phases. After each phase:
1. Summarize what you built and which files you touched/created.
2. Tell me how to run/test it.
3. STOP and wait for my confirmation before starting the next phase.

Do not skip ahead to a later phase even if it seems efficient. Do not delete or rewrite files from a previous phase unless I explicitly ask you to — if something needs to change, tell me what and why first.

Keep a running file called `PROGRESS.md` at the project root. After every phase, append a short entry (phase number, what was done, files changed). This is your memory anchor — if you ever seem unsure what's already built, read this file first before assuming.

---

## Tech Stack (fixed — do not substitute)
- **Frontend:** Next.js (App Router) + React + TypeScript
- **Styling:** Tailwind CSS
- **Backend/Data:** Firebase — Firestore (database), Firebase Auth (login/signup), Firebase Storage (image uploads for community approaches)
- **AI features:** Build behind a single abstraction layer (e.g. `lib/ai/aiClient.ts`) that currently returns mocked/simulated responses. Do not wire up a real AI API yet — just design the interface so a real API call can be dropped in later without touching the UI code.

---

## Product Overview
A web platform to help JEE Advanced Mathematics students find the right resources for a topic they're struggling with, see multiple solution approaches per question, learn common mistakes/traps, get AI-style step-by-step explanations, and submit their own approaches for admin review.

**Scope for v1: Mathematics only.** Do not build Physics/Chemistry sections — just make sure the data model wouldn't make adding them painful later (e.g. a `subject` field on topics, defaulted to "Mathematics").

---

## Phase 0 — Project Setup
- Scaffold a Next.js + TypeScript + Tailwind project.
- Set up Firebase project config (use placeholder env vars in `.env.local.example`; I will supply real Firebase keys later).
- Set up the Firestore data model (just the schema/types in code, e.g. in `types/`), covering:
  - `topics` (id, name, subject, subtopics[])
  - `questions` (id, topicId, subtopicId, difficulty, statement, approaches[], commonMistakes, commonTraps)
  - `approaches` (id, questionId, label, content, status: "official" | "pending" | "approved" | "rejected", submittedBy, imageUrl?)
  - `users` (basic profile, role: "student" | "admin")
- Create `PROGRESS.md` and log Phase 0.
- **Stop here and wait for me before continuing.**

## Phase 1 — Landing Page (No Login Required)
- Build an engaging landing page as the site's root (`/`) — this is the FIRST thing any visitor sees, never the login page.
- Landing page should clearly communicate what the platform does and have a clear call-to-action to enter the platform (e.g. "Start Learning" button) without forcing login.
- Login/Signup should be accessible via a nav link but never forced on entry.
- **Stop and wait for confirmation.**

## Phase 2 — Core Navigation & Topic Pages (Static/Mock Data First)
- Build the main app shell (navbar, layout) for the logged-out browsing experience.
- Create a topic listing page and individual topic pages using mock/sample data (e.g. 2–3 sample topics: "Functions", "Probability", "Coordinate Geometry").
- Each topic page should have placeholder sections for: Theory, Notes, Resources, Practice Questions, Previous Year Questions, Approaches, Common Mistakes, Common Traps.
- **Stop and wait for confirmation.**

## Phase 3 — Question Page Structure
- Build the individual question page template with these required sections, populated with sample/placeholder content for now:
  - Approach 1, Approach 2, Approach 3
  - Smartest Method
  - Common Mistakes
  - Common Traps
- **Stop and wait for confirmation.**

## Phase 4 — AI-Powered Search Bar (Mocked AI Layer)
- Build the search bar UI on the landing/home area.
- Build `lib/ai/aiClient.ts` with a function like `interpretSearchQuery(query: string)` that currently returns a mocked structured response: `{ topic, subtopic, difficultyLevel, suggestedOptions: string[] }`, simulating what a real AI call would return, based on simple keyword matching against the sample topics from Phase 2.
- Wire the search bar to call this mocked function and display the resulting list of options (like the example in the spec: student types "I need questions related to Functions" → gets a clickable list of subtopic options).
- Clicking an option routes to the corresponding topic page.
- **Stop and wait for confirmation.** (This is the seam where a real AI API gets plugged in later — flag this clearly in `PROGRESS.md`.)

## Phase 5 — AI Step-by-Step Explanation Tool (Mocked)
- Build a UI where a student can paste a question + a solution and click "Explain Step by Step."
- Wire this to a second mocked function in `aiClient.ts`, e.g. `explainSolution(question, solution)`, returning a structured, plausible-looking step-by-step breakdown (mocked, not a real AI call).
- **Stop and wait for confirmation.**

## Phase 6 — Authentication (Firebase Auth)
- Add Login/Signup pages, only reachable via nav, never forced.
- Implement Firebase Auth (email/password to start).
- Add a basic student profile and an admin role flag.
- **Stop and wait for confirmation.**

## Phase 7 — Community Approach Submission + Admin Review
- Add an "Submit Your Approach" UI on question pages (logged-in students only) that lets a student upload an image (Firebase Storage) tied to a specific question.
- Submitted approaches are saved with `status: "pending"` and are NOT publicly visible.
- Build a simple `/admin` review dashboard (admin-role-only) listing pending approaches with Approve/Reject actions.
- Approved approaches become visible on the question page as an additional approach; rejected ones stay hidden.
- **Stop and wait for confirmation.**

## Phase 8 — Polish & Review
- Review all pages for consistency, fix obvious UI issues, and confirm the full flow works end-to-end with sample data: landing page → search → topic → question → approaches/mistakes/traps → AI explain → submit approach → admin approval.
- Summarize what's mocked vs. real (the two AI functions) so it's clear what needs a real API key later.

---

## Constraints / Things to avoid
- Don't introduce a different backend (e.g. don't switch to Express or a SQL database) — Firebase only.
- Don't wire a real AI API in this pass — keep it mocked behind the `aiClient.ts` abstraction.
- Don't build Physics/Chemistry sections yet, only leave room for them in the schema.
- Don't skip phases or batch multiple phases into one giant commit — I want to review and test after each phase.
- If you're about to make an architectural decision I haven't specified (e.g. routing library choice, state management), ask me first instead of assuming.
