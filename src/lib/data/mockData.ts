/**
 * Mock/sample data for topics, questions, and approaches.
 * Used in Phase 2-3 to populate the UI before Firestore is wired up.
 */

import type { Topic } from '@/types/topic';
import type { Question } from '@/types/question';
import type { Approach } from '@/types/approach';
import {
  syllabusExtraTopics,
  syllabusExtraQuestions,
  syllabusExtraApproaches,
} from './syllabusContent';
import { enrichApproachContent, enrichMathText } from './mathLatex';
import type { McqOption } from '@/types/question';
import {
  topicBulkQuestions,
  topicBulkApproaches,
  getPassageById,
  getPassagesByTopic,
} from './topics';

function enrichQuestion(q: Question): Question {
  const options = q.options
    ? (Object.fromEntries(
        Object.entries(q.options).map(([k, v]) => [k, enrichMathText(v)])
      ) as Partial<Record<McqOption, string>>)
    : undefined;

  return {
    ...q,
    statement: enrichMathText(q.statement),
    options,
    commonMistakes: q.commonMistakes.map(enrichMathText),
    commonTraps: q.commonTraps.map(enrichMathText),
  };
}

function enrichApproach(a: Approach): Approach {
  return {
    ...a,
    content: enrichApproachContent(a.content),
  };
}

// ===== TOPICS =====

export const mockTopics: Topic[] = [
  {
    id: 'functions',
    name: 'Functions',
    subject: 'Mathematics',
    subtopics: [
      'Domain and Range',
      'Composition of Functions',
      'Inverse Functions',
      'Graphical Transformations',
      'Functional Equations',
      'Even and Odd Functions',
      'Periodic Functions',
      'Monotonicity',
    ],
    description:
      'Study of functions including domain, range, composition, inverses, transformations, and properties like monotonicity and periodicity. A cornerstone of JEE Advanced Mathematics.',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-06-01'),
  },
  {
    id: 'probability',
    name: 'Probability',
    subject: 'Mathematics',
    subtopics: [
      'Conditional Probability',
      "Bayes' Theorem",
      'Random Variables',
      'Binomial Distribution',
      'Probability Distributions',
      'Independent Events',
    ],
    description:
      'Probability theory covering conditional probability, Bayes\' theorem, distributions, and random variables. Essential for JEE Advanced problem-solving.',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-06-01'),
  },
  {
    id: 'coordinate-geometry',
    name: 'Coordinate Geometry',
    subject: 'Mathematics',
    subtopics: [
      'Straight Lines',
      'Circles',
      'Parabola',
      'Ellipse',
      'Hyperbola',
      'Pair of Straight Lines',
      'Locus Problems',
      'Tangent and Normal',
      'Chord of Contact',
      'Director Circle',
    ],
    description:
      'Analytic geometry covering conic sections, straight lines, circles, and their properties. One of the most heavily tested topics in JEE Advanced.',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-06-01'),
  },
  // Full JEE syllabus topics (Algebra, Trig, Calculus, Coordinate Geometry, Vectors & 3D)
  ...syllabusExtraTopics,
];

// ===== QUESTIONS =====

const baseQuestions: Question[] = [
  // Functions questions
  {
    id: 'func-q1',
    topicId: 'functions',
    subtopicId: 'Domain and Range',
    difficulty: 'medium',
    statement:
      'Find the domain of f(x) = √(log₂(log₃(log₅(x² - 1)))). Express your answer in interval notation.',
    approaches: ['func-q1-a1', 'func-q1-a2', 'func-q1-a3'],
    commonMistakes: [
      'Forgetting that the argument of a logarithm must be strictly positive',
      'Not considering that √x requires x ≥ 0, but log needs x > 0',
      'Incorrectly applying the chain: each nested log must have its argument > 0, and the outermost must be ≥ 0 for the square root',
    ],
    commonTraps: [
      'The problem uses three nested logarithms with different bases — easy to lose track of which inequality applies where',
      'x² - 1 > 0 gives |x| > 1, but the full chain of inequalities further restricts the domain',
    ],
    createdAt: new Date('2026-02-01'),
    updatedAt: new Date('2026-06-01'),
  },
  {
    id: 'func-q2',
    topicId: 'functions',
    subtopicId: 'Composition of Functions',
    difficulty: 'hard',
    statement:
      'Let f(x) = x² + 1 and g(x) = √(x - 1). Find the domain of (g ∘ f ∘ g)(x) and simplify the expression.',
    approaches: ['func-q2-a1', 'func-q2-a2'],
    commonMistakes: [
      'Not checking the domain at each composition step',
      'Assuming the domain of the composition is the intersection of individual domains',
    ],
    commonTraps: [
      'g requires x ≥ 1, but after composing with f, the inner function always returns values ≥ 1, so the domain restriction comes from the outermost g',
    ],
    createdAt: new Date('2026-02-15'),
    updatedAt: new Date('2026-06-01'),
  },
  // Probability questions
  {
    id: 'prob-q1',
    topicId: 'probability',
    subtopicId: 'Conditional Probability',
    difficulty: 'medium',
    statement:
      'A bag contains 5 red and 3 blue balls. Two balls are drawn without replacement. Given that the first ball drawn is red, find the probability that both balls are red.',
    approaches: ['prob-q1-a1', 'prob-q1-a2'],
    commonMistakes: [
      'Using probability with replacement instead of without replacement',
      'Confusing P(A∩B) with P(B|A)',
      'Not updating the total count after first draw',
    ],
    commonTraps: [
      'The "without replacement" condition is crucial — if you miss it, you get the wrong answer',
    ],
    createdAt: new Date('2026-03-01'),
    updatedAt: new Date('2026-06-01'),
  },
  {
    id: 'prob-q2',
    topicId: 'probability',
    subtopicId: "Bayes' Theorem",
    difficulty: 'hard',
    statement:
      "In a factory, machines A, B, and C produce 30%, 45%, and 25% of total output respectively. The defect rates are 2%, 3%, and 5%. A randomly selected item is found defective. Find the probability it was produced by machine C.",
    approaches: ['prob-q2-a1', 'prob-q2-a2'],
    commonMistakes: [
      'Forgetting to multiply prior probability with likelihood',
      'Not normalizing by total probability of defect',
    ],
    commonTraps: [
      'Machine C has the highest defect rate but lowest production share — the answer isn\'t simply the highest defect rate',
    ],
    createdAt: new Date('2026-03-15'),
    updatedAt: new Date('2026-06-01'),
  },
  // Coordinate Geometry questions
  {
    id: 'cg-q1',
    topicId: 'coordinate-geometry',
    subtopicId: 'Parabola',
    difficulty: 'hard',
    statement:
      'Find the equation of the normal to the parabola y² = 12x that makes an angle of 45° with the x-axis.',
    approaches: ['cg-q1-a1', 'cg-q1-a2', 'cg-q1-a3'],
    commonMistakes: [
      'Confusing the slope of tangent with slope of normal',
      'Using the wrong parametric form for y² = 4ax (here a = 3, not 12)',
      'Sign errors when computing the normal equation from the tangent slope',
    ],
    commonTraps: [
      'There can be more than one normal at 45° — check for multiple solutions',
      'The standard form is y² = 4ax, so 4a = 12 means a = 3, not a = 12',
    ],
    createdAt: new Date('2026-04-01'),
    updatedAt: new Date('2026-06-01'),
  },
  {
    id: 'cg-q2',
    topicId: 'coordinate-geometry',
    subtopicId: 'Circles',
    difficulty: 'advanced',
    statement:
      'Two circles x² + y² = 9 and x² + y² - 6x - 8y + 9 = 0 intersect at points A and B. Find the equation of the circle passing through A, B, and the point (1, 1).',
    approaches: ['cg-q2-a1', 'cg-q2-a2'],
    commonMistakes: [
      'Not using the family of circles through the intersection points',
      'Incorrectly computing the radical axis',
    ],
    commonTraps: [
      'The family of circles S₁ + λS₂ = 0 includes a degenerate case (the radical axis) when λ = -1',
    ],
    createdAt: new Date('2026-04-15'),
    updatedAt: new Date('2026-06-01'),
  },
  // ── MCQ example (SRG Bank / workbook style) — Basic Maths ──
  {
    id: 'basic-maths-mcq2',
    topicId: 'basic-maths',
    subtopicId: 'Logarithms',
    difficulty: 'hard',
    format: 'mcq',
    statement:
      'If $25^{\\log_{10}(2\\sqrt{2})} + \\log_{|x|}\\left(\\dfrac{|x|-\\sqrt{3}}{\\sqrt{3}}\\right) = 25^{\\log_{10}(2\\sqrt{2})} + \\log_{|x|}\\left(\\dfrac{|x|+\\sqrt{3}}{\\sqrt{3}}\\right)$, then the number of real solutions of $x$ is',
    options: {
      A: '0',
      B: '1',
      C: '2',
      D: '3',
    },
    correctOption: 'A',
    approaches: ['basic-maths-mcq2-a1'],
    commonMistakes: [
      'Treating $\\log_{|x|}$ as $\\log x$ without enforcing $|x| > 0$ and $|x| \\neq 1$.',
      'Forgetting that the logarithm argument must be positive before equating two log expressions.',
    ],
    commonTraps: [
      'Both sides look identical at first glance — you must use $\\log a = \\log b \\Rightarrow a = b$ only when the arguments are valid.',
    ],
    createdAt: new Date('2026-06-20'),
    updatedAt: new Date('2026-06-20'),
  },
  ...topicBulkQuestions,
  ...syllabusExtraQuestions,
];

export const mockQuestions: Question[] = baseQuestions.map(enrichQuestion);

const baseApproaches: Approach[] = [
  // func-q1 approaches
  {
    id: 'func-q1-a1',
    questionId: 'func-q1',
    label: 'Inside-Out Method',
    content:
      'Work from the innermost function outward:\n\n1. **Innermost:** x² - 1 > 0 ⟹ |x| > 1\n2. **Second layer:** log₅(x² - 1) > 0 ⟹ x² - 1 > 5⁰ = 1 ⟹ x² > 2 ⟹ |x| > √2\n3. **Third layer:** log₃(log₅(x² - 1)) > 0 ⟹ log₅(x² - 1) > 1 ⟹ x² - 1 > 5 ⟹ |x| > √6\n4. **Outermost (√):** log₂(log₃(log₅(x² - 1))) ≥ 0 ⟹ log₃(log₅(x² - 1)) ≥ 1 ⟹ log₅(x² - 1) ≥ 3 ⟹ x² - 1 ≥ 125 ⟹ |x| ≥ √126\n\n**Domain:** (-∞, -√126] ∪ [√126, ∞)',
    status: 'official',
    submittedBy: 'admin',
    createdAt: new Date('2026-02-01'),
    updatedAt: new Date('2026-02-01'),
  },
  {
    id: 'func-q1-a2',
    questionId: 'func-q1',
    label: 'Substitution Method',
    content:
      'Let t₁ = x² - 1, t₂ = log₅(t₁), t₃ = log₃(t₂), t₄ = log₂(t₃).\n\nFor f(x) = √t₄ to be defined:\n- t₄ ≥ 0 ⟹ t₃ ≥ 1\n- t₃ ≥ 1 ⟹ t₂ ≥ 3\n- t₂ ≥ 3 ⟹ t₁ ≥ 5³ = 125\n- t₁ ≥ 125 ⟹ x² ≥ 126\n\n**Domain:** x ∈ (-∞, -√126] ∪ [√126, ∞)',
    status: 'official',
    submittedBy: 'admin',
    createdAt: new Date('2026-02-01'),
    updatedAt: new Date('2026-02-01'),
  },
  {
    id: 'func-q1-a3',
    questionId: 'func-q1',
    label: 'Smartest Method — Direct Chain',
    content:
      '**Key insight:** For √(log_a(x)), we need log_a(x) ≥ 0, which means x ≥ 1.\n\nApplying this recursively from outside in:\n- log₂(?) ≥ 0 ⟹ ? ≥ 1\n- So log₃(?) ≥ 1 ⟹ ? ≥ 3\n- So log₅(?) ≥ 3 ⟹ ? ≥ 125\n- So x² - 1 ≥ 125 ⟹ x² ≥ 126\n\nDone in 4 lines. **Domain:** |x| ≥ √126.',
    status: 'official',
    submittedBy: 'admin',
    createdAt: new Date('2026-02-01'),
    updatedAt: new Date('2026-02-01'),
  },
  // prob-q1 approaches
  {
    id: 'prob-q1-a1',
    questionId: 'prob-q1',
    label: 'Direct Conditional Probability',
    content:
      'Given: First ball is red.\n\nAfter drawing one red ball:\n- Remaining: 4 red, 3 blue (total 7)\n- P(second is red | first is red) = 4/7\n\n**Answer: 4/7**',
    status: 'official',
    submittedBy: 'admin',
    createdAt: new Date('2026-03-01'),
    updatedAt: new Date('2026-03-01'),
  },
  {
    id: 'prob-q1-a2',
    questionId: 'prob-q1',
    label: 'Using P(A∩B)/P(A)',
    content:
      'P(both red) = (5/8)(4/7) = 20/56 = 5/14\nP(first red) = 5/8\n\nP(both red | first red) = P(both red) / P(first red) = (5/14) / (5/8) = (5/14) × (8/5) = 8/14 = **4/7**',
    status: 'official',
    submittedBy: 'admin',
    createdAt: new Date('2026-03-01'),
    updatedAt: new Date('2026-03-01'),
  },
  // func-q2 approaches  —  (g ∘ f ∘ g)(x), f(x)=x²+1, g(x)=√(x−1)
  {
    id: 'func-q2-a1',
    questionId: 'func-q2',
    label: 'Layer-by-Layer Composition',
    content:
      'Build the composition from the inside out, tracking the domain at each layer.\n\n1. **Innermost g(x) = √(x − 1):** needs x − 1 ≥ 0 ⟹ x ≥ 1. Its output is ≥ 0.\n2. **Apply f:** f(g(x)) = (√(x − 1))² + 1 = (x − 1) + 1 = **x** (valid for x ≥ 1).\n3. **Outermost g:** g(f(g(x))) = √(f(g(x)) − 1) = √(x − 1), which needs x − 1 ≥ 0 ⟹ x ≥ 1.\n\nAll three conditions reduce to x ≥ 1.\n\n**Domain:** [1, ∞)  **Expression:** (g ∘ f ∘ g)(x) = √(x − 1)',
    status: 'official',
    submittedBy: 'admin',
    createdAt: new Date('2026-02-15'),
    updatedAt: new Date('2026-02-15'),
  },
  {
    id: 'func-q2-a2',
    questionId: 'func-q2',
    label: 'Smartest Method — Simplify First',
    content:
      '**Key insight:** f and g are almost inverses on this domain.\n\nSince f(g(x)) = (√(x − 1))² + 1 = x, the middle two operations cancel. The whole composition collapses to the **outer g acting on x**:\n\n(g ∘ f ∘ g)(x) = g(x) evaluated through f = √(x − 1).\n\nThe only constraint is that every √ has a non-negative argument, which forces x ≥ 1.\n\n**Domain:** [1, ∞)  **Answer:** √(x − 1).',
    status: 'official',
    submittedBy: 'admin',
    createdAt: new Date('2026-02-15'),
    updatedAt: new Date('2026-02-15'),
  },
  // prob-q2 approaches  —  Bayes' theorem (machine C | defective)
  {
    id: 'prob-q2-a1',
    questionId: 'prob-q2',
    label: "Bayes' Theorem (Direct)",
    content:
      'Let A, B, C be the producing machines and D the event "item is defective".\n\n**Priors:** P(A) = 0.30, P(B) = 0.45, P(C) = 0.25\n**Likelihoods:** P(D|A) = 0.02, P(D|B) = 0.03, P(D|C) = 0.05\n\n**Total probability of a defect:**\nP(D) = 0.30·0.02 + 0.45·0.03 + 0.25·0.05\n   = 0.0060 + 0.0135 + 0.0125 = 0.0320\n\n**Bayes:**\nP(C|D) = P(C)·P(D|C) / P(D) = 0.0125 / 0.0320 = **25/64 ≈ 0.391**',
    status: 'official',
    submittedBy: 'admin',
    createdAt: new Date('2026-03-15'),
    updatedAt: new Date('2026-03-15'),
  },
  {
    id: 'prob-q2-a2',
    questionId: 'prob-q2',
    label: 'Smartest Method — Scale to Whole Numbers',
    content:
      '**Trick:** avoid decimals by imagining 10,000 items.\n\n- Machine A: 3000 items × 2% = 60 defective\n- Machine B: 4500 items × 3% = 135 defective\n- Machine C: 2500 items × 5% = 125 defective\n\n**Total defective = 60 + 135 + 125 = 320.**\n\nGiven an item is defective, the chance it came from C is just C\'s share of those defectives:\n\nP(C|D) = 125 / 320 = **25/64 ≈ 0.391**\n\nNotice C has the highest defect *rate* yet not the highest count — the trap is ignoring its smaller production share.',
    status: 'official',
    submittedBy: 'admin',
    createdAt: new Date('2026-03-15'),
    updatedAt: new Date('2026-03-15'),
  },
  // cg-q1 approaches  —  normal to y²=12x at 45° to x-axis
  {
    id: 'cg-q1-a1',
    questionId: 'cg-q1',
    label: 'Slope Form of the Normal',
    content:
      '1. **Compare with standard form:** For $y^2 = 4ax$, compare with $y^2 = 12x$ $\\Rightarrow$ $4a = 12$ $\\Rightarrow$ $a = 3$.\n\n' +
      '2. **Slope at 45°:** A line at $45^\\circ$ to the $x$-axis has slope $m = \\tan 45^\\circ = 1$.\n\n' +
      '3. **Normal in slope form:** The normal to $y^2 = 4ax$ in slope form is\n' +
      '$$y = mx - 2am - am^3$$\n\n' +
      '4. **Substitute:** With $a = 3$, $m = 1$:\n' +
      '$$y = x - 2(3)(1) - (3)(1)^3 = x - 6 - 3$$\n\n' +
      'Answer: Normal $y = x - 9$.',
    status: 'official',
    submittedBy: 'admin',
    createdAt: new Date('2026-04-01'),
    updatedAt: new Date('2026-04-01'),
  },
  {
    id: 'cg-q1-a2',
    questionId: 'cg-q1',
    label: 'Parametric Point Method',
    content:
      'Use the parametric point (at², 2at) on y² = 4ax with a = 3.\n\nThe slope of the normal at parameter t is **−t**. We need slope 1:\n  −t = 1 ⟹ t = −1\n\nFoot of the normal: (at², 2at) = (3·1, 2·3·(−1)) = **(3, −6)**.\n\nEquation through (3, −6) with slope 1:\n  y − (−6) = 1·(x − 3) ⟹ y + 6 = x − 3\n\n**Normal: y = x − 9**',
    status: 'official',
    submittedBy: 'admin',
    createdAt: new Date('2026-04-01'),
    updatedAt: new Date('2026-04-01'),
  },
  {
    id: 'cg-q1-a3',
    questionId: 'cg-q1',
    label: 'Smartest Method — Memorised Result',
    content:
      '**One-liner:** for y² = 4ax, the normal of slope m is y = mx − 2am − am³.\n\nWith a = 3 and m = 1, plug straight in:\n  y = x − 2·3 − 3 = **x − 9**.\n\nA single normal exists here because only t = −1 gives slope 1 — but always check, since some slopes yield three real normals.',
    status: 'official',
    submittedBy: 'admin',
    createdAt: new Date('2026-04-01'),
    updatedAt: new Date('2026-04-01'),
  },
  // cg-q2 approaches  —  circle through intersection of two circles and (1,1)
  {
    id: 'cg-q2-a1',
    questionId: 'cg-q2',
    label: 'Family of Circles (S₁ + λS₂)',
    content:
      'Let S₁ : x² + y² − 9 = 0 and S₂ : x² + y² − 6x − 8y + 9 = 0.\n\nEvery circle through their intersection points A, B has the form:\n  S₁ + λS₂ = 0\n\nIt must pass through (1, 1). Substitute x = 1, y = 1:\n  S₁(1,1) = 1 + 1 − 9 = −7\n  S₂(1,1) = 1 + 1 − 6 − 8 + 9 = −3\n  −7 + λ(−3) = 0 ⟹ λ = −7/3\n\nPlug λ = −7/3 into S₁ + λS₂ and clear fractions (×3, then normalise):\n\n**Circle: 2x² + 2y² − 21x − 28y + 45 = 0**\n\nCheck (1,1): 2 + 2 − 21 − 28 + 45 = 0 ✓',
    status: 'official',
    submittedBy: 'admin',
    createdAt: new Date('2026-04-15'),
    updatedAt: new Date('2026-04-15'),
  },
  {
    id: 'cg-q2-a2',
    questionId: 'cg-q2',
    label: 'Smartest Method — Why the Family Works',
    content:
      '**Insight:** S₁ + λS₂ = 0 is automatically zero at any point where both S₁ = 0 and S₂ = 0, so it passes through A and B for *every* λ. You never need to find A and B explicitly.\n\nThat reduces the whole problem to one unknown λ, fixed by the single extra condition "passes through (1, 1)":\n  −7 − 3λ = 0 ⟹ λ = −7/3\n\nSubstituting back gives **2x² + 2y² − 21x − 28y + 45 = 0**.\n\n(The degenerate case λ = −1 collapses the family to the radical axis — the common chord AB — so avoid it when you want an actual circle.)',
    status: 'official',
    submittedBy: 'admin',
    createdAt: new Date('2026-04-15'),
    updatedAt: new Date('2026-04-15'),
  },
  // basic-maths MCQ solution — correct derivation (0 real solutions → option A)
  {
    id: 'basic-maths-mcq2-a1',
    questionId: 'basic-maths-mcq2',
    label: 'Official Solution',
    content:
      'The term $25^{\\log_{10}(2\\sqrt{2})}$ appears on both sides, so it cancels and only the logarithms remain.\n\n' +
      '1. **Cancel the common term:**\n' +
      '$$\\log_{|x|}\\left(\\frac{|x|-\\sqrt{3}}{\\sqrt{3}}\\right) = \\log_{|x|}\\left(\\frac{|x|+\\sqrt{3}}{\\sqrt{3}}\\right)$$\n' +
      '2. **Equal logs with the same base force equal arguments** (valid only when $|x|>0$, $|x|\\neq 1$ and both arguments are positive):\n' +
      '$$\\frac{|x|-\\sqrt{3}}{\\sqrt{3}} = \\frac{|x|+\\sqrt{3}}{\\sqrt{3}}$$\n' +
      '3. **Simplify** by multiplying both sides by $\\sqrt{3}$:\n' +
      '$$|x|-\\sqrt{3} = |x|+\\sqrt{3} \\;\\Rightarrow\\; -2\\sqrt{3} = 0$$\n' +
      'This is a contradiction — no value of $x$ can ever satisfy it.\n\n' +
      'Answer: $0$ real solutions — option (A).',
    status: 'official',
    submittedBy: 'admin',
    createdAt: new Date('2026-06-20'),
    updatedAt: new Date('2026-06-20'),
  },
  ...topicBulkApproaches,
  ...syllabusExtraApproaches,
];

export const mockApproaches: Approach[] = baseApproaches.map(enrichApproach);

// ===== HELPER FUNCTIONS =====

export function getTopicById(id: string): Topic | undefined {
  return mockTopics.find((t) => t.id === id);
}

export function getQuestionsByTopic(topicId: string): Question[] {
  return mockQuestions.filter((q) => q.topicId === topicId);
}

export function getQuestionById(id: string): Question | undefined {
  return mockQuestions.find((q) => q.id === id);
}

export function getApproachById(id: string): Approach | undefined {
  return mockApproaches.find((a) => a.id === id);
}

export function getApproachesByQuestion(questionId: string): Approach[] {
  return mockApproaches.filter((a) => a.questionId === questionId);
}

export { getPassageById, getPassagesByTopic };

export interface PlatformStats {
  topicCount: number;
  subtopicCount: number;
  questionCount: number;
}

/**
 * Real, derived counts for the current content library. Used anywhere we
 * surface numbers to users so the marketing never drifts from reality.
 */
export function getPlatformStats(): PlatformStats {
  return {
    topicCount: mockTopics.length,
    subtopicCount: mockTopics.reduce((sum, t) => sum + t.subtopics.length, 0),
    questionCount: mockQuestions.length,
  };
}

/** Map of exact topic name → slug (id), built from all topics. */
export const topicNameToSlug: Record<string, string> = Object.fromEntries(
  mockTopics.map((t) => [t.name, t.id])
);

/** Resolve a topic name to its detail-page slug, or undefined if unknown. */
export function getSlugForTopicName(name: string): string | undefined {
  return topicNameToSlug[name];
}

export interface SearchableTopic {
  name: string;
  slug: string;
  subtopics: string[];
}

/** Flat index used by the AI search bar to match queries to topic pages. */
export const searchableTopics: SearchableTopic[] = mockTopics.map((t) => ({
  name: t.name,
  slug: t.id,
  subtopics: t.subtopics,
}));
