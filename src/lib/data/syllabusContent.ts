/**
 * Authored content for every JEE syllabus topic that didn't already have a
 * full page (everything except Functions, which lives in mockData).
 *
 * Each seed produces:
 *  - one Topic (with subtopics + a short description)
 *  - one representative, worked Question (statement, mistakes, traps)
 *  - two official Approaches (a standard method + a "Smartest Method")
 *
 * These are merged into the mock arrays in mockData.ts and power the topic
 * detail pages, the /topics syllabus grid, and the home search.
 */

import type { Topic } from '@/types/topic';
import type { Question, Difficulty } from '@/types/question';
import type { Approach } from '@/types/approach';

interface ApproachSeed {
  label: string;
  content: string;
}

interface TopicSeed {
  slug: string;
  name: string;
  subtopics: string[];
  description: string;
  difficulty: Difficulty;
  subtopicId: string;
  statement: string;
  commonMistakes: string[];
  commonTraps: string[];
  approaches: ApproachSeed[];
}

const seeds: TopicSeed[] = [
  // ───────────────────────── ALGEBRA ─────────────────────────
  {
    slug: 'basic-maths',
    name: 'Basic Maths',
    subtopics: ['Algebraic Identities', 'Logarithms', 'Modulus & Inequalities', 'Ratios & Proportions', 'Componendo & Dividendo'],
    description: 'The algebraic toolkit every JEE topic leans on — identities, logarithms, inequalities and the modulus function.',
    difficulty: 'easy',
    subtopicId: 'Algebraic Identities',
    statement: 'If a and b are real numbers such that a + b = 4 and a² + b² = 10, find the value of a³ + b³.',
    commonMistakes: [
      'Trying to solve for a and b individually instead of using symmetric identities.',
      'Forgetting that ab = [(a+b)² − (a²+b²)] / 2.',
      'Sign slips when expanding (a+b)³.',
    ],
    commonTraps: [
      'The problem looks like it needs the actual values of a and b, but only the symmetric sums are required.',
    ],
    approaches: [
      {
        label: 'Symmetric Identities',
        content:
          'Use the identities linking power sums to a+b and ab.\n\n' +
          '1. **Find ab:** From (a+b)² = a² + b² + 2ab:\n' +
          '   16 = 10 + 2ab ⟹ ab = 3.\n' +
          '2. **Apply a³ + b³ identity:**\n' +
          '   a³ + b³ = (a+b)³ − 3ab(a+b) = 4³ − 3·3·4 = 64 − 36.\n\n' +
          'Answer: a³ + b³ = 28.',
      },
      {
        label: 'Smartest Method — Factor Form',
        content:
          'Key insight: a³ + b³ = (a+b)(a² − ab + b²) — factor first, don\'t solve for a and b separately.\n\n' +
          'We know a+b = 4, a² + b² = 10, and ab = 3 (from (a+b)² − (a²+b²) = 2ab ⟹ 16 − 10 = 2ab).\n\n' +
          'So a³ + b³ = (a+b)(a² + b² − ab) = 4·(10 − 3) = 4·7.\n\n' +
          'Answer: 28.',
      },
    ],
  },
  {
    slug: 'quadratic-equation',
    name: 'Quadratic Equation',
    subtopics: ['Nature of Roots', 'Sum & Product of Roots', 'Common Roots', 'Quadratic Inequalities', 'Common Roots & Inequalities', 'Range of Rational Functions', 'Theory of Equations', 'Roots of Unity', 'Equations Reducible to Quadratic', 'Functional Equations in Quadratics'],
    description: 'Roots, discriminants and sign analysis of quadratic and polynomial expressions — a JEE staple.',
    difficulty: 'medium',
    subtopicId: 'Nature of Roots',
    statement: 'Find all real values of k for which the equation (k − 2)x² + 2(k − 2)x + 4 = 0 has two equal real roots.',
    commonMistakes: [
      'Forgetting that for a quadratic the leading coefficient must be non-zero (k ≠ 2).',
      'Including k = 2 from D = 0 even though the equation stops being quadratic there.',
      'Errors factoring the discriminant.',
    ],
    commonTraps: [
      'D = 0 gives k = 2 and k = 6, but k = 2 makes the equation linear (no x² term), so it must be rejected.',
    ],
    approaches: [
      {
        label: 'Discriminant = 0',
        content:
          'Equal roots $\\Rightarrow$ discriminant $D = 0$, with leading coefficient $\\neq 0$.\n\n' +
          '1. **Coefficients:** Here $a = k-2$, $b = 2(k-2)$, $c = 4$.\n' +
          '2. **Discriminant:**\n' +
          '$$D = b^2 - 4ac = 4(k-2)^2 - 16(k-2) = 4(k-2)[(k-2) - 4] = 4(k-2)(k-6)$$\n' +
          '3. **Solve and reject:** Set $D = 0 \\Rightarrow k = 2$ or $k = 6$. But $k = 2$ makes $a = 0$ (not a quadratic), so reject it.\n\n' +
          'Answer: $k = 6$.',
      },
      {
        label: 'Smartest Method — Factor First',
        content:
          'Pull out (k−2) early: the equation is (k−2)[x² + 2x] + 4 = 0.\n\nFor a genuine quadratic we need k ≠ 2. Then D = 4(k−2)(k−6).\n\nThe (k−2) factor is already excluded, so equal roots come only from the other factor: k − 6 = 0 ⟹ k = 6.\n\nAnswer: k = 6.',
      },
    ],
  },
  {
    slug: 'sequence-and-series',
    name: 'Sequence and Series',
    subtopics: ['Arithmetic Progression', 'Geometric Progression', 'Harmonic Progression', 'AM–GM–HM Inequalities', 'Inequalities (AM-GM)', 'Sum to n Terms', 'Arithmetico-Geometric Series', 'Recurrence Relations', 'Binomial Identities', 'Infinite Series', 'Telescoping Series', 'Arithmetic Mean & Series'],
    description: 'Patterns, progressions and their sums — from AP/GP basics to mean inequalities.',
    difficulty: 'medium',
    subtopicId: 'Sum to n Terms',
    statement: 'The sum of the first n terms of a series is Sₙ = 3n² + 2n. Find its 10th term and prove the series is an A.P.',
    commonMistakes: [
      'Using aₙ = Sₙ instead of aₙ = Sₙ − Sₙ₋₁.',
      'Forgetting to verify the formula for n = 1 separately.',
      'Concluding it is an A.P. without showing the common difference is constant.',
    ],
    commonTraps: [
      'aₙ = Sₙ − Sₙ₋₁ holds for n ≥ 2; always cross-check a₁ = S₁.',
    ],
    approaches: [
      {
        label: 'nth Term from Sₙ',
        content:
          'Use aₙ = Sₙ − Sₙ₋₁ for n ≥ 2.\n\naₙ = (3n² + 2n) − [3(n−1)² + 2(n−1)]\n  = 3(n² − (n−1)²) + 2 = 3(2n − 1) + 2 = 6n − 1.\n\nCheck n = 1: a₁ = S₁ = 5 = 6(1) − 1 ✓, so aₙ = 6n − 1 for all n.\n\na₁₀ = 6(10) − 1 = 59.\nSince aₙ = 6n − 1 is linear in n, aₙ − aₙ₋₁ = 6 (constant) ⟹ A.P. with d = 6.',
      },
      {
        label: 'Smartest Method — Recognise the Pattern',
        content:
          'A series whose sum is a quadratic Sₙ = An² + Bn is always an A.P.: the nth term aₙ = Sₙ − Sₙ₋₁ is linear, so the common difference is constant (= 2A).\n\nHere A = 3 ⟹ d = 6, and a₁ = S₁ = 5.\nThus aₙ = 5 + (n−1)·6 = 6n − 1 and a₁₀ = 59.',
      },
    ],
  },
  {
    slug: 'complex-numbers',
    name: 'Complex Numbers',
    subtopics: ['Modulus & Argument', 'Polar & Euler Form', "De Moivre's Theorem", 'Cube Roots of Unity', 'Rotation', 'Loci in the Complex Plane'],
    description: 'Algebra and geometry of numbers of the form a + ib, including loci, rotation and roots of unity.',
    difficulty: 'medium',
    subtopicId: 'Loci in the Complex Plane',
    statement: 'If z is a complex number satisfying |z − 3| = |z − 3i|, find the locus of z and describe it geometrically.',
    commonMistakes: [
      'Treating |z − 3| as z − 3 (dropping the modulus).',
      'Algebra slips when squaring both sides.',
      'Not recognising the geometric meaning of an equidistant condition.',
    ],
    commonTraps: [
      '|z − a| = |z − b| is the perpendicular bisector of the segment joining a and b — you rarely need coordinates.',
    ],
    approaches: [
      {
        label: 'Cartesian Substitution',
        content:
          'Let z = x + iy.\n\n|z − 3|² = (x − 3)² + y²,  |z − 3i|² = x² + (y − 3)².\n\nEquate: (x − 3)² + y² = x² + (y − 3)²\n  x² − 6x + 9 + y² = x² + y² − 6y + 9\n  −6x = −6y ⟹ x = y.\n\nLocus: the line y = x.',
      },
      {
        label: 'Smartest Method — Geometric Meaning',
        content:
          'Key insight: |z − a| = |z − b| means z is equidistant from the points a and b, so z lies on the perpendicular bisector of the segment joining them.\n\nHere a = 3 = (3, 0) and b = 3i = (0, 3). The perpendicular bisector of the segment from (3,0) to (0,3) passes through their midpoint (1.5, 1.5) with slope 1.\n\nLocus: the line y = x. No squaring needed.',
      },
    ],
  },
  {
    slug: 'binomial-theorem',
    name: 'Binomial Theorem',
    subtopics: ['General Term', 'Middle Term', 'Term Independent of x', 'Greatest Coefficient', 'Greatest Term & Coefficient', 'Properties of Coefficients', 'Binomial Series', 'Binomial Sums', 'Irrational Powers & Conjugates', 'Coefficient Counting', 'Logarithmic Differentiation Sums', 'Combinatorial Sums', 'Coefficient Extraction', 'Alternating Binomial Sums'],
    description: 'Expansions of (a + b)ⁿ and the structure of their general term, coefficients and special terms.',
    difficulty: 'medium',
    subtopicId: 'Term Independent of x',
    statement: 'Find the term independent of x in the expansion of (2x² − 1/x)¹².',
    commonMistakes: [
      'Mishandling the sign (−1)ʳ from the second term.',
      'Forgetting the power of 2 in (2x²)^(12−r).',
      'Arithmetic in the exponent of x when collecting powers.',
    ],
    commonTraps: [
      '"Independent of x" means set the total exponent of x to zero — not the term number to zero.',
    ],
    approaches: [
      {
        label: 'General Term',
        content:
          'General term: T₍ᵣ₊₁₎ = C(12, r) (2x²)^(12−r) (−1/x)^r\n  = C(12, r) 2^(12−r) (−1)^r x^(2(12−r) − r)\n  = C(12, r) 2^(12−r) (−1)^r x^(24 − 3r).\n\nIndependent of x ⟹ 24 − 3r = 0 ⟹ r = 8.\n\nTerm = C(12, 8) · 2^4 · (−1)^8 = 495 · 16 = 7920.',
      },
      {
        label: 'Smartest Method — Solve the Exponent First',
        content:
          'Only the exponent of x matters for "independent of x". The exponent is 2(12 − r) − r = 24 − 3r.\n\nSet 24 − 3r = 0 ⟹ r = 8 immediately, then evaluate the coefficient once:\nC(12, 8)·2^(12−8)·(−1)^8 = 495·16 = 7920.',
      },
    ],
  },
  {
    slug: 'permutations-combinations',
    name: 'Permutations & Combinations (P&C)',
    subtopics: ['Fundamental Principle of Counting', 'Permutations', 'Combinations', 'Circular Permutations', 'Arrangements with Repetition', 'Distribution of Objects'],
    description: 'Systematic counting of arrangements and selections, including repetition and grouping constraints.',
    difficulty: 'medium',
    subtopicId: 'Arrangements with Repetition',
    statement: 'In how many ways can the letters of the word "MATHEMATICS" be arranged so that all the vowels come together?',
    commonMistakes: [
      'Forgetting the repeated letters: M (×2), T (×2) among consonants and A (×2) among vowels.',
      'Not multiplying by the internal arrangements of the vowel block.',
      'Counting MATHEMATICS as having all distinct letters.',
    ],
    commonTraps: [
      '"All vowels together" ⟹ glue the 4 vowels into one block, then arrange (consonants + block), and separately arrange inside the block.',
    ],
    approaches: [
      {
        label: 'Vowel-Block (Gluing) Method',
        content:
          'MATHEMATICS has 11 letters: vowels A, A, E, I (4) and consonants M, T, H, M, T, C, S (7, with M×2, T×2).\n\nTreat the 4 vowels as one block ⟹ 8 units to arrange: 7 consonants + 1 block, with M×2 and T×2:\n  8! / (2!·2!) = 40320 / 4 = 10080.\n\nInside the block, arrange A, A, E, I: 4!/2! = 12.\n\nTotal = 10080 × 12 = 120960.',
      },
      {
        label: 'Smartest Method — Count in Two Independent Stages',
        content:
          'Because "external" arrangement (units) and "internal" arrangement (within the vowel block) are independent, just multiply them.\n\nExternal: 8 units with repeats M×2, T×2 ⟹ 8!/(2!2!) = 10080.\nInternal: 4 vowels with A×2 ⟹ 4!/2! = 12.\n\nAnswer = 10080 × 12 = 120960.',
      },
    ],
  },

  // ───────────────────────── TRIGONOMETRY ─────────────────────────
  {
    slug: 'trigonometry',
    name: 'Trigonometry',
    subtopics: ['Trigonometric Ratios & Identities', 'Trigonometric Identities', 'Compound Angles', 'Multiple & Sub-multiple Angles', 'Transformation Formulae', 'Trigonometric Equations', 'Trigonometric Series', 'Conditional Identities', 'Triangle Identities'],
    description: 'Ratios, identities and equations on angles — the language of periodic phenomena in JEE.',
    difficulty: 'medium',
    subtopicId: 'Multiple & Sub-multiple Angles',
    statement: 'Prove that cos20° · cos40° · cos80° = 1/8.',
    commonMistakes: [
      'Trying to evaluate each cosine numerically instead of using a telescoping identity.',
      'Forgetting to multiply and divide by 2 sin20°.',
      'Sign errors when applying 2 sinθ cosθ = sin2θ.',
    ],
    commonTraps: [
      'The angles 20°, 40°, 80° double successively — a hint to use the 2 sinθ cosθ = sin2θ telescoping trick.',
    ],
    approaches: [
      {
        label: 'Multiply & Divide by 2 sin20°',
        content:
          'Let P = cos20° cos40° cos80°.\n\nMultiply and divide by 2 sin20°:\n2 sin20° · P = (2 sin20° cos20°) cos40° cos80° = sin40° cos40° cos80°\n4 sin20° · P = (2 sin40° cos40°) cos80° = sin80° cos80°\n8 sin20° · P = 2 sin80° cos80° = sin160° = sin20°.\n\nSo 8 sin20° · P = sin20° ⟹ P = 1/8.',
      },
      {
        label: 'Smartest Method — Standard Result',
        content:
          'Key result: cosθ · cos2θ · cos4θ … with successively doubling angles telescopes via 2 sinθ cosθ = sin2θ.\n\nFor three terms with first angle 20°: cos20° cos40° cos80° = sin(2³·20°) / (2³ sin20°) = sin160°/(8 sin20°) = sin20°/(8 sin20°) = 1/8.\n\n(General: cosA cos2A cos4A = sin8A / (8 sinA).)',
      },
    ],
  },
  {
    slug: 'inverse-trigonometry',
    name: 'Inverse Trigonometry',
    subtopics: ['Domain & Range', 'Principal Values', 'Properties of Inverse Functions', 'Sum & Difference Formulae', 'Inverse Trig Equations'],
    description: 'Inverse circular functions, their principal ranges, identities and equations.',
    difficulty: 'hard',
    subtopicId: 'Inverse Trig Equations',
    statement: 'Solve for x: tan⁻¹(x − 1) + tan⁻¹(x) + tan⁻¹(x + 1) = tan⁻¹(3x).',
    commonMistakes: [
      'Applying the tan⁻¹ a + tan⁻¹ b formula without tracking the 1 − ab condition.',
      'Forgetting to check which roots actually satisfy the original (principal-value) equation.',
      'Algebra errors combining three arctans.',
    ],
    commonTraps: [
      'Combining arctans can introduce extraneous roots; verify each candidate in the original equation.',
    ],
    approaches: [
      {
        label: 'Combine in Pairs',
        content:
          'First combine the symmetric pair:\ntan⁻¹(x−1) + tan⁻¹(x+1) = tan⁻¹( ((x−1)+(x+1)) / (1 − (x−1)(x+1)) ) = tan⁻¹( 2x / (2 − x²) ).\n\nAdd tan⁻¹ x and set equal to tan⁻¹ 3x:\ntan⁻¹ x + tan⁻¹(2x/(2−x²)) = tan⁻¹ 3x\n⟹ (x + 2x/(2−x²)) / (1 − x·2x/(2−x²)) = 3x\n⟹ (4x − x³)/(2 − 3x²) = 3x\n⟹ 4x − x³ = 6x − 9x³ ⟹ 8x³ − 2x = 0 ⟹ 2x(4x² − 1) = 0.\n\nSo x = 0 or x = ±1/2.',
      },
      {
        label: 'Smartest Method — Symmetry + Verify',
        content:
          'The left side is odd in x and the equation is symmetric, so test the natural candidate x = 0: both sides give 0 ✓.\n\nFor the rest, the pairing trick gives 2x(4x² − 1) = 0 ⟹ x = ±1/2. Quick check confirms x = 1/2 and x = −1/2 satisfy the principal-value identity.\n\nSolution set: x ∈ { −1/2, 0, 1/2 }.',
      },
    ],
  },
  {
    slug: 'solution-of-triangles',
    name: 'Solution of Triangles (SOT)',
    subtopics: ['Sine Rule', 'Cosine Rule', 'Projection Formulae', 'Area of a Triangle', 'In-radius & Circum-radius', 'Half-Angle Formulae'],
    description: 'Relations between the sides and angles of a triangle, plus area, in-radius and circum-radius.',
    difficulty: 'medium',
    subtopicId: 'Area of a Triangle',
    statement: 'In a triangle ABC, if a = 13, b = 14, c = 15, find the area and the radius of the inscribed circle.',
    commonMistakes: [
      'Using ½·base·height without a known height instead of Heron’s formula.',
      'Computing s as a + b + c instead of (a + b + c)/2.',
      'Confusing in-radius r = Area/s with circum-radius R = abc/(4·Area).',
    ],
    commonTraps: [
      'The 13-14-15 triangle is a classic: s = 21 and Area = 84 come out as whole numbers.',
    ],
    approaches: [
      {
        label: "Heron's Formula + r = Area/s",
        content:
          'Semi-perimeter: s = (13 + 14 + 15)/2 = 21.\n\nArea = √[s(s−a)(s−b)(s−c)] = √[21·8·7·6] = √7056 = 84.\n\nIn-radius: r = Area / s = 84 / 21 = 4.',
      },
      {
        label: 'Smartest Method — Recognise the 13-14-15 Triangle',
        content:
          'This is the well-known 13-14-15 triangle. It splits into 5-12-13 and 9-12-15 right triangles sharing the altitude 12 onto side 14.\n\nArea = ½·14·12 = 84, and with s = 21, r = Area/s = 84/21 = 4. (Also R = abc/(4·Area) = 2730/336 = 8.125.)',
      },
    ],
  },

  // ───────────────────────── CALCULUS (excl. Functions) ─────────────────────────
  {
    slug: 'limits-and-continuity',
    name: 'Limits and Continuity',
    subtopics: ['Limit of a Function', 'Standard Limits', "L'Hôpital's Rule", 'Continuity at a Point', 'Types of Discontinuity', 'Limits using Series Expansions'],
    description: 'Behaviour of functions near a point — evaluating limits and testing continuity.',
    difficulty: 'medium',
    subtopicId: 'Standard Limits',
    statement: 'Evaluate lim(x→0) (sin x − x) / x³.',
    commonMistakes: [
      'Claiming the limit is 0 because sin x ≈ x (the leading terms cancel, so you must go further).',
      'Stopping L’Hôpital too early before the form is resolved.',
      'Errors in the Taylor expansion of sin x.',
    ],
    commonTraps: [
      'sin x ≈ x is not accurate enough here; the next term (−x³/6) is exactly what survives.',
    ],
    approaches: [
      {
        label: 'Taylor Expansion',
        content:
          'Expand sin x near 0: sin x = x − x³/6 + x⁵/120 − …\n\nThen sin x − x = −x³/6 + x⁵/120 − …\n\nDivide by x³: (sin x − x)/x³ = −1/6 + x²/120 − …\n\nAs x → 0, the limit is −1/6.',
      },
      {
        label: "Smartest Method — L'Hôpital (×3)",
        content:
          'Form 0/0. Differentiate top and bottom three times:\n(sin x − x)/x³ → (cos x − 1)/3x² → (−sin x)/6x → (−cos x)/6.\n\nAt x = 0 this is −1/6.\nLimit = −1/6.',
      },
    ],
  },
  {
    slug: 'differentiation',
    name: 'Differentiability and Differentiation',
    subtopics: ['First Principles', 'Product & Quotient Rules', 'Chain Rule', 'Implicit Differentiation', 'Logarithmic Differentiation', 'Differentiability vs Continuity'],
    description: 'Rates of change and when they exist — rules of differentiation and tests for differentiability.',
    difficulty: 'medium',
    subtopicId: 'Differentiability vs Continuity',
    statement: 'Check whether f(x) = |x − 1| + |x − 2| is differentiable at x = 1 and x = 2, and find f′(x) where it exists.',
    commonMistakes: [
      'Assuming continuity implies differentiability (corners are continuous but not differentiable).',
      'Not splitting the modulus into intervals before differentiating.',
      'Sign errors when removing |x − a| on each interval.',
    ],
    commonTraps: [
      'Both x = 1 and x = 2 are "corner" points where the left and right derivatives differ — so f is not differentiable there even though it is continuous.',
    ],
    approaches: [
      {
        label: 'Piecewise Analysis',
        content:
          'Remove the moduli on each interval:\n• x < 1: f = (1 − x) + (2 − x) = 3 − 2x ⟹ f′ = −2.\n• 1 < x < 2: f = (x − 1) + (2 − x) = 1 ⟹ f′ = 0.\n• x > 2: f = (x − 1) + (x − 2) = 2x − 3 ⟹ f′ = 2.\n\nAt x = 1: left derivative −2 ≠ 0 right derivative ⟹ not differentiable.\nAt x = 2: left derivative 0 ≠ 2 right derivative ⟹ not differentiable.\nf is continuous everywhere but not differentiable at x = 1, 2.',
      },
      {
        label: 'Smartest Method — Count the Corners',
        content:
          'A sum of |x − aᵢ| has corners exactly at each aᵢ. Here the corners are at x = 1 and x = 2, so those are the only non-differentiable points.\n\nBetween/around them the slope is the sum of the signs ±1 from each term: −2 for x<1, 0 for 1<x<2, +2 for x>2. Continuous everywhere; not differentiable at x = 1 and 2.',
      },
    ],
  },
  {
    slug: 'application-of-derivatives',
    name: 'Application of Derivatives',
    subtopics: ['Tangents & Normals', 'Monotonicity', 'Maxima & Minima', "Rolle's & Mean Value Theorems", 'Rate of Change', 'Approximations'],
    description: 'Using the derivative to study monotonicity, optimisation, tangents and rates.',
    difficulty: 'hard',
    subtopicId: 'Maxima & Minima',
    statement: 'Find the maximum volume of a right circular cylinder that can be inscribed in a sphere of radius R.',
    commonMistakes: [
      'Forgetting the constraint r² + (h/2)² = R² linking the cylinder to the sphere.',
      'Maximising volume without reducing to a single variable first.',
      'Not verifying the critical point is a maximum.',
    ],
    commonTraps: [
      'The height is 2R/√3 (not R), and the optimal cylinder is comparatively short and wide.',
    ],
    approaches: [
      {
        label: 'Single-Variable Optimisation',
        content:
          'Let the cylinder have radius r and height h. Inscribed in the sphere: r² + (h/2)² = R², so r² = R² − h²/4.\n\nVolume V = πr²h = π(R² − h²/4)h = π(R²h − h³/4).\n\ndV/dh = π(R² − 3h²/4) = 0 ⟹ h² = 4R²/3 ⟹ h = 2R/√3.\nThen r² = R² − h²/4 = R² − R²/3 = 2R²/3.\n\nV_max = π·(2R²/3)·(2R/√3) = 4πR³ / (3√3).',
      },
      {
        label: 'Smartest Method — Optimise in h²',
        content:
          'Write V² ∝ r⁴h² or simply optimise V = π(R²h − h³/4). Setting dV/dh = 0 gives R² = 3h²/4 in one step ⟹ h = 2R/√3.\n\nSubstitute back: r² = 2R²/3, giving V_max = 4πR³/(3√3) ≈ 0.7698 R³. Second derivative is negative, confirming a maximum.',
      },
    ],
  },
  {
    slug: 'integration',
    name: 'Integration',
    subtopics: ['Standard Integrals', 'Substitution', 'Integration by Parts', 'Partial Fractions', 'Definite Integrals', 'Properties of Definite Integrals'],
    description: 'Antiderivatives and definite integrals, with the core techniques to evaluate them.',
    difficulty: 'hard',
    subtopicId: 'Substitution',
    statement: 'Evaluate ∫ (x² + 1) / (x⁴ + 1) dx.',
    commonMistakes: [
      'Attempting partial fractions over the reals without first simplifying.',
      'Not dividing numerator and denominator by x².',
      'Missing the substitution t = x − 1/x.',
    ],
    commonTraps: [
      'Dividing by x² turns the integrand into a form whose denominator is x² + 1/x² = (x − 1/x)² + 2 — exactly matching dt for t = x − 1/x.',
    ],
    approaches: [
      {
        label: 'Divide by x², then Substitute',
        content:
          'Divide top and bottom by x²:\n∫ (1 + 1/x²) / (x² + 1/x²) dx.\n\nLet t = x − 1/x ⟹ dt = (1 + 1/x²) dx, and x² + 1/x² = t² + 2.\n\nIntegral = ∫ dt/(t² + 2) = (1/√2) tan⁻¹(t/√2) + C\n  = (1/√2) tan⁻¹( (x² − 1)/(x√2) ) + C.',
      },
      {
        label: 'Smartest Method — Spot the t = x − 1/x Pattern',
        content:
          'Whenever you see (x² + 1)/(x⁴ + 1) (or x⁴ ± 1 denominators), divide by x² and use t = x − 1/x (for the + sign) or t = x + 1/x (for the − sign).\n\nHere it gives ∫ dt/(t² + 2) = (1/√2) tan⁻¹((x² − 1)/(x√2)) + C in one substitution.',
      },
    ],
  },
  {
    slug: 'area-under-curves',
    name: 'Area Under Curves',
    subtopics: ['Area Bounded by a Curve', 'Area Between Two Curves', 'Vertical vs Horizontal Strips', 'Symmetry in Area'],
    description: 'Using definite integrals to measure regions bounded by curves and lines.',
    difficulty: 'hard',
    subtopicId: 'Area Between Two Curves',
    statement: 'Find the area of the region bounded by the parabola y² = 4x and the line y = 2x − 4.',
    commonMistakes: [
      'Integrating with respect to x and mishandling the two-valued parabola.',
      'Wrong intersection points (must solve the system carefully).',
      'Forgetting to take (right curve − left curve) when integrating in y.',
    ],
    commonTraps: [
      'Integrating in y (horizontal strips) avoids splitting the parabola into two branches.',
    ],
    approaches: [
      {
        label: 'Horizontal Strips (integrate in y)',
        content:
          'Intersections: from y = 2x − 4 ⟹ x = (y + 4)/2, and y² = 4x ⟹ x = y²/4.\nSet equal: y² = 2(y + 4) ⟹ y² − 2y − 8 = 0 ⟹ y = 4 or y = −2.\n\nFor each y in [−2, 4], the line is to the right of the parabola:\nArea = ∫₋₂⁴ [ (y + 4)/2 − y²/4 ] dy.\n\nAntiderivative: y²/4 + 2y − y³/12.\nAt y = 4: 4 + 8 − 64/12 = 20/3. At y = −2: 1 − 4 + 2/3 = −7/3.\nArea = 20/3 − (−7/3) = 27/3 = 9.',
      },
      {
        label: 'Smartest Method — Choose the Right Variable',
        content:
          'Because the parabola opens along the x-axis, slicing horizontally (in y) makes each strip a single clean width = x_line − x_parabola.\n\nWith limits y = −2 to 4, Area = ∫ [(y+4)/2 − y²/4] dy = 9. Choosing y as the variable removes the need to split the region. Answer: 9 square units.',
      },
    ],
  },
  {
    slug: 'differential-equations',
    name: 'Differential Equations',
    subtopics: ['Order & Degree', 'Variable Separable', 'Linear Differential Equations', 'Homogeneous Equations', 'Exact Equations'],
    description: 'Equations involving derivatives and the standard methods to solve first-order ODEs.',
    difficulty: 'medium',
    subtopicId: 'Linear Differential Equations',
    statement: 'Solve the differential equation dy/dx + y·tan x = sec x, given y(0) = 1.',
    commonMistakes: [
      'Not recognising the standard linear form dy/dx + P(x)y = Q(x).',
      'Errors computing the integrating factor e^∫tan x dx = sec x.',
      'Forgetting to use the initial condition to fix the constant.',
    ],
    commonTraps: [
      'The integrating factor is sec x, and (y·sec x)′ neatly becomes sec²x — integrate to tan x.',
    ],
    approaches: [
      {
        label: 'Integrating Factor',
        content:
          'Linear form with P = tan x, Q = sec x.\nIntegrating factor: IF = e^∫tan x dx = e^(ln sec x) = sec x.\n\nMultiply through: (y·sec x)′ = sec x · sec x = sec²x.\nIntegrate: y·sec x = tan x + C.\n\nApply y(0) = 1: 1·1 = 0 + C ⟹ C = 1.\nSo y = (tan x + 1)·cos x = sin x + cos x.',
      },
      {
        label: 'Smartest Method — Recognise sin x + cos x',
        content:
          'After IF = sec x, the equation becomes (y sec x)′ = sec²x ⟹ y sec x = tan x + C ⟹ y = sin x + C cos x.\n\nThe initial condition y(0) = 1 gives C = 1 instantly, so y = sin x + cos x. A quick check: y′ + y tan x = (cos x − sin x) + (sin x + cos x)tan x = sec x ✓.',
      },
    ],
  },

  // ───────────────────────── COORDINATE GEOMETRY ─────────────────────────
  {
    slug: 'straight-line',
    name: 'Straight Line',
    subtopics: ['Slope & Forms of a Line', 'Angle Between Lines', 'Distance Formulae', 'Family of Lines', 'Pair of Straight Lines'],
    description: 'Lines in the plane — their equations, angles, distances and families.',
    difficulty: 'medium',
    subtopicId: 'Angle Between Lines',
    statement: 'Find the equations of the lines through the point (2, 3) that make an angle of 45° with the line x − 2y = 3.',
    commonMistakes: [
      'Using only the + sign in the tan formula and missing the second line.',
      'Reading the slope of x − 2y = 3 wrong (it is 1/2).',
      'Forgetting to write both final equations through (2, 3).',
    ],
    commonTraps: [
      'A given angle with a line yields TWO lines (slopes from the ± in the tangent formula).',
    ],
    approaches: [
      {
        label: 'tan θ Formula',
        content:
          'Slope of x − 2y = 3 is m₁ = 1/2. Required slope m satisfies\ntan45° = |(m − 1/2)/(1 + m/2)| = 1.\n\nCase +: m − 1/2 = 1 + m/2 ⟹ m/2 = 3/2 ⟹ m = 3.\nCase −: m − 1/2 = −(1 + m/2) ⟹ 3m/2 = −1/2 ⟹ m = −1/3.\n\nLines through (2, 3):\n• m = 3: y − 3 = 3(x − 2) ⟹ 3x − y − 3 = 0.\n• m = −1/3: y − 3 = −(1/3)(x − 2) ⟹ x + 3y − 11 = 0.',
      },
      {
        label: 'Smartest Method — Expect Two Lines',
        content:
          'Because a 45° tilt can go either way, immediately expect two slopes from m = (m₁ ± 1)/(1 ∓ m₁) with m₁ = 1/2.\n\nm = (1/2 + 1)/(1 − 1/2) = 3 and m = (1/2 − 1)/(1 + 1/2) = −1/3.\nThrough (2, 3): 3x − y − 3 = 0 and x + 3y − 11 = 0.',
      },
    ],
  },
  {
    slug: 'circle',
    name: 'Circle',
    subtopics: ['Equation of a Circle', 'Tangents & Normals', 'Family of Circles', 'Radical Axis', 'Common Chord', 'Power of a Point'],
    description: 'Circles and their interactions — tangents, families and radical axes.',
    difficulty: 'advanced',
    subtopicId: 'Family of Circles',
    statement: 'The circles x² + y² = 9 and x² + y² − 6x − 8y + 9 = 0 intersect at points A and B. Find the equation of the circle passing through A, B and the point (1, 1).',
    commonMistakes: [
      'Finding A and B explicitly instead of using the family S₁ + λS₂ = 0.',
      'Using λ = −1 (which collapses to the common chord, not a circle).',
      'Arithmetic slips substituting (1, 1).',
    ],
    commonTraps: [
      'The family S₁ + λS₂ = 0 passes through both intersection points for every λ — pick λ using the third point.',
    ],
    approaches: [
      {
        label: 'Family of Circles',
        content:
          'Let S₁ : x² + y² − 9 and S₂ : x² + y² − 6x − 8y + 9.\nEvery circle through A, B is S₁ + λS₂ = 0.\n\nMake it pass through (1, 1):\nS₁(1,1) = 1 + 1 − 9 = −7,  S₂(1,1) = 1 + 1 − 6 − 8 + 9 = −3.\n−7 + λ(−3) = 0 ⟹ λ = −7/3.\n\nSubstitute and clear fractions:\n2x² + 2y² − 21x − 28y + 45 = 0.\nCheck (1,1): 2 + 2 − 21 − 28 + 45 = 0 ✓.',
      },
      {
        label: 'Smartest Method — Why the Family Works',
        content:
          'S₁ + λS₂ = 0 is automatically zero wherever both S₁ = 0 and S₂ = 0, so it passes through A and B for every λ — you never need A, B themselves.\n\nThe lone unknown λ is fixed by the third point (1,1): −7 − 3λ = 0 ⟹ λ = −7/3, giving 2x² + 2y² − 21x − 28y + 45 = 0. (Avoid λ = −1, which gives the common chord.)',
      },
    ],
  },
  {
    slug: 'parabola',
    name: 'Parabola',
    subtopics: ['Standard Equation', 'Tangents & Normals', 'Focal Chord', 'Parametric Form', 'Director Circle'],
    description: 'The parabola y² = 4ax and its tangents, normals and focal properties.',
    difficulty: 'hard',
    subtopicId: 'Tangents & Normals',
    statement: 'Find the equation of the normal to the parabola y² = 12x that makes an angle of 45° with the x-axis.',
    commonMistakes: [
      'Reading 4a = 12 wrong — here a = 3, not 12.',
      'Confusing slope of tangent with slope of normal.',
      'Sign mistakes in the normal slope-form y = mx − 2am − am³.',
    ],
    commonTraps: [
      'Standard form is y² = 4ax, so 4a = 12 gives a = 3; the normal slope-form already encodes the sign.',
    ],
    approaches: [
      {
        label: 'Slope Form of the Normal',
        content:
          'Compare y² = 12x with y² = 4ax ⟹ 4a = 12 ⟹ a = 3.\nA 45° line has slope m = tan45° = 1.\n\nNormal in slope form: y = mx − 2am − am³.\nSubstitute a = 3, m = 1:\ny = x − 6 − 3 = x − 9.\n\nNormal: y = x − 9.',
      },
      {
        label: 'Smartest Method — Parametric Foot',
        content:
          'At parameter t on y² = 4ax (a = 3), the normal has slope −t. We need slope 1 ⟹ t = −1.\n\nFoot: (at², 2at) = (3, −6). Through (3, −6) with slope 1: y + 6 = x − 3 ⟹ y = x − 9.\n(Only t = −1 gives slope 1, so there is a single such normal.)',
      },
    ],
  },
  {
    slug: 'ellipse',
    name: 'Ellipse',
    subtopics: ['Standard Equation', 'Eccentricity & Foci', 'Tangents & Normals', 'Auxiliary Circle', 'Director Circle'],
    description: 'The ellipse x²/a² + y²/b² = 1, its tangents and key parameters.',
    difficulty: 'medium',
    subtopicId: 'Tangents & Normals',
    statement: 'Find the equations of the tangents to the ellipse x²/16 + y²/9 = 1 that are parallel to the line y = x + 5.',
    commonMistakes: [
      'Using the wrong tangent condition for the slope form.',
      'Mixing up a² and b² (a² = 16, b² = 9).',
      'Reporting only one tangent (there are two parallel ones).',
    ],
    commonTraps: [
      'Parallel to a given line ⟹ same slope m = 1; the slope-form tangent y = mx ± √(a²m² + b²) yields the ± pair.',
    ],
    approaches: [
      {
        label: 'Slope-Form Tangent',
        content:
          'Parallel to y = x + 5 ⟹ slope m = 1.\nFor x²/a² + y²/b² = 1 with a² = 16, b² = 9, the tangents of slope m are\ny = mx ± √(a²m² + b²).\n\ny = x ± √(16·1 + 9) = x ± √25 = x ± 5.\n\nTangents: y = x + 5 and y = x − 5.',
      },
      {
        label: 'Smartest Method — Plug into √(a²m² + b²)',
        content:
          'No need to differentiate: the slope-form tangent length term is √(a²m² + b²). With m = 1, a² = 16, b² = 9 it is √25 = 5.\n\nSo the two parallel tangents are y = x ± 5. (Interesting: y = x + 5 is itself tangent to the ellipse.)',
      },
    ],
  },
  {
    slug: 'hyperbola',
    name: 'Hyperbola',
    subtopics: ['Standard Equation', 'Eccentricity & Foci', 'Asymptotes', 'Rectangular Hyperbola', 'Conjugate Hyperbola'],
    description: 'The hyperbola x²/a² − y²/b² = 1, its eccentricity, foci and asymptotes.',
    difficulty: 'medium',
    subtopicId: 'Asymptotes',
    statement: 'For the hyperbola x²/9 − y²/16 = 1, find the eccentricity, the foci, and the equations of the asymptotes.',
    commonMistakes: [
      'Using the ellipse relation b² = a²(1 − e²) instead of b² = a²(e² − 1).',
      'Swapping a² and b² (a² = 9, b² = 16).',
      'Writing asymptotes with slope a/b instead of b/a.',
    ],
    commonTraps: [
      'For a hyperbola e > 1 and b² = a²(e² − 1); asymptotes are y = ±(b/a)x.',
    ],
    approaches: [
      {
        label: 'Standard Parameters',
        content:
          'Here a² = 9 (a = 3), b² = 16 (b = 4).\n\nEccentricity: b² = a²(e² − 1) ⟹ 16 = 9(e² − 1) ⟹ e² = 25/9 ⟹ e = 5/3.\nFoci: (±ae, 0) = (±3·5/3, 0) = (±5, 0).\nAsymptotes: y = ±(b/a)x = ±(4/3)x.',
      },
      {
        label: 'Smartest Method — Read Off a, b',
        content:
          'Directly: a = 3, b = 4 ⟹ c = √(a² + b²) = 5, so e = c/a = 5/3 and foci (±5, 0).\nAsymptotes of x²/a² − y²/b² = 1 are always y = ±(b/a)x = ±(4/3)x. (Note 3-4-5 makes the numbers clean.)',
      },
    ],
  },

  // ───────────────────────── VECTORS & 3D ─────────────────────────
  {
    slug: 'vectors-3d-geometry',
    name: 'Vectors and 3D Geometry',
    subtopics: ['Dot & Cross Product', 'Scalar Triple Product', 'Lines in Space', 'Planes', 'Shortest Distance', 'Direction Cosines'],
    description: 'Vectors and the geometry of lines and planes in three dimensions.',
    difficulty: 'hard',
    subtopicId: 'Shortest Distance',
    statement: 'Find the shortest distance between the lines r = (i + 2j + 3k) + λ(2i + 3j + 4k) and r = (2i + 4j + 5k) + μ(3i + 4j + 5k).',
    commonMistakes: [
      'Using the wrong formula (skew-line distance needs b₁ × b₂, not b₁ · b₂).',
      'Errors evaluating the cross product determinant.',
      'Forgetting to take the absolute value of the scalar triple product.',
    ],
    commonTraps: [
      'These lines are skew, so use d = |(a₂ − a₁)·(b₁ × b₂)| / |b₁ × b₂|.',
    ],
    approaches: [
      {
        label: 'Skew-Line Distance Formula',
        content:
          'Direction vectors b₁ = (2,3,4), b₂ = (3,4,5); points a₁ = (1,2,3), a₂ = (2,4,5).\n\nb₁ × b₂ = |i j k; 2 3 4; 3 4 5| = (3·5−4·4, −(2·5−4·3), 2·4−3·3) = (−1, 2, −1).\n|b₁ × b₂| = √(1 + 4 + 1) = √6.\n\na₂ − a₁ = (1, 2, 2). Dot with (−1, 2, −1): −1 + 4 − 2 = 1.\n\nShortest distance = |1| / √6 = 1/√6.',
      },
      {
        label: 'Smartest Method — Scalar Triple Product',
        content:
          'The numerator |(a₂ − a₁)·(b₁ × b₂)| is just the scalar triple product [a₂−a₁, b₁, b₂].\n\nCompute the 3×3 determinant with rows (1,2,2), (2,3,4), (3,4,5): it equals 1. Divide by |b₁ × b₂| = √6.\n\nShortest distance = 1/√6 = √6/6 ≈ 0.408.',
      },
    ],
  },
];

const CREATED = new Date('2026-06-01');

export const syllabusExtraTopics: Topic[] = seeds.map((s) => ({
  id: s.slug,
  name: s.name,
  subject: 'Mathematics',
  subtopics: s.subtopics,
  description: s.description,
  createdAt: CREATED,
  updatedAt: CREATED,
}));

export const syllabusExtraQuestions: Question[] = seeds.map((s) => ({
  id: `${s.slug}-q1`,
  topicId: s.slug,
  subtopicId: s.subtopicId,
  difficulty: s.difficulty,
  statement: s.statement,
  approaches: s.approaches.map((_, i) => `${s.slug}-q1-a${i + 1}`),
  commonMistakes: s.commonMistakes,
  commonTraps: s.commonTraps,
  createdAt: CREATED,
  updatedAt: CREATED,
}));

export const syllabusExtraApproaches: Approach[] = seeds.flatMap((s) =>
  s.approaches.map((a, i) => ({
    id: `${s.slug}-q1-a${i + 1}`,
    questionId: `${s.slug}-q1`,
    label: a.label,
    content: a.content,
    status: 'official' as const,
    submittedBy: 'admin',
    createdAt: CREATED,
    updatedAt: CREATED,
  }))
);
