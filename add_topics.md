ROLE: Build a well-designed "Topics" page for the JEE Math Pro app (nav already has a "Topics" link) that lists the full Maths syllabus, organized clearly, and connects each topic into the existing AI Explain feature.

STEP 0 — EXPLORE FIRST:
- Find the existing /topics route (the nav link already points somewhere — check its current state, likely placeholder/empty).
- Note the EXISTING design tokens already used on /explain and elsewhere: exact background shades, the indigo/purple accent color, font family, border-radius, spacing scale, button and card styles. Reuse these exactly — do not introduce a new color palette or font. This app already has a visual identity; extend it, don't replace it.
- Check how /explain currently reads input (state, routing) so you can pass data into it cleanly from /topics.

STEP 1 — THE SYLLABUS (organize into these exact categories — this grouping is real JEE syllabus structure, not decoration, so keep it):

Algebra: Basic Maths, Quadratic Equation, Sequence and Series, Complex Numbers, Binomial Theorem, Permutations & Combinations (P&C)
Trigonometry: Trigonometry, Inverse Trigonometry, Solution of Triangles (SOT)
Calculus: Functions, Limits and Continuity, Differentiability and Differentiation, Application of Derivatives, Integration, Area Under Curves, Differential Equations
Coordinate Geometry: Straight Line, Circle, Parabola, Ellipse, Hyperbola
Vectors & 3D Geometry: Vectors and 3D Geometry

STEP 2 — DESIGN DIRECTION (read this before coding):
- Do NOT default to generic "AI-generated" patterns (cream+serif, random neon-on-black accent unrelated to the app, numbered 01/02/03 markers with no real meaning). This app already has a dark indigo identity — stay inside it.
- Give each of the 5 categories one small, subject-grounded visual motif instead of generic icon-pack icons — e.g. Algebra: a simple x² curve mark; Trigonometry: a unit-circle/wave mark; Calculus: a curve with a tangent line or shaded area; Coordinate Geometry: overlapping conic outlines (circle/parabola/ellipse); Vectors & 3D: a small 3-axis arrow mark. Keep these as quiet, consistent line-icons (one accent color, not a rainbow), not the main attraction — they should feel like part of the same family.
- Structure: each category is a clearly labeled section (collapsible or tabbed — your call based on how many topics fit comfortably). A topic count per category is useful info, show it.
- Add an instant search/filter input at the top that filters across all topics regardless of category as the student types.
- Motion: a single subtle entrance/hover treatment is enough (e.g. soft lift + accent-color border on hover for topic cards). Do not add scattered animation everywhere. Respect prefers-reduced-motion.
- Responsive: multi-column grid on desktop, single column on mobile. Visible keyboard focus states on every interactive element.

STEP 3 — BUILD THE PAGE
- Each topic renders as a card/row: topic name, its category's accent motif, hover state.
- Clicking a topic navigates to /explain?topic=<url-encoded-topic-name>.

STEP 4 — WIRE INTO AI EXPLAIN (/explain page)
- On load, read the `topic` query param if present.
- If present, show a small dismissible context chip above the Question field, e.g. "Practicing: Quadratic Equation ✕" (clicking ✕ clears it, doesn't navigate away).
- Update the "Load sample" button: if a topic is active, load a short sample question for THAT topic instead of a random one. Create a simple lookup object (topic name → one representative sample question string) covering all 22 topics — short, JEE-level, text only, no solution needed (since AI solves from scratch now).
- When a topic is active, append it as extra context in the message sent to Gemini, e.g.: "Topic context: Quadratic Equation — calibrate difficulty and method choice accordingly." This helps the model anchor scope appropriately.

STEP 5 — QUALITY CHECK
- Confirm search filters correctly across categories.
- Confirm every topic card navigates correctly, the context chip appears, "Load sample" loads the right topic-specific question.
- Confirm mobile layout doesn't break, and existing nav/branding/styling elsewhere is untouched.
- Confirm keyboard-only navigation works (tab through cards, enter to activate).

OPTIONAL (phase 2, skip for now unless it's trivial given the existing stack): since this app already has Firebase Auth + Firestore, per-topic practice tracking (mark a topic as "attempted" after a successful AI Explain run, show a small checkmark on its card) would be a natural next feature — but don't build it now, just don't make decisions in Step 3 that would make it hard to add later.

Priority order: correct categorized syllabus > clean navigation into /explain > visual polish > sample-question lookup > optional motion/icons.