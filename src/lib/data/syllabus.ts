/**
 * Full JEE (Advanced) Mathematics syllabus, grouped into the standard
 * five categories. This grouping mirrors the real syllabus structure and is
 * the single source of truth for the /topics page and the topic-aware
 * behaviour on /explain (sample questions + topic context for Gemini).
 */

export type CategoryId =
  | 'algebra'
  | 'trigonometry'
  | 'calculus'
  | 'coordinate-geometry'
  | 'vectors-3d';

export interface SyllabusCategory {
  id: CategoryId;
  name: string;
  /** Short, syllabus-grounded blurb for the section header. */
  blurb: string;
  topics: string[];
}

export const syllabus: SyllabusCategory[] = [
  {
    id: 'algebra',
    name: 'Algebra',
    blurb: 'Foundations, equations, and counting.',
    topics: [
      'Basic Maths',
      'Quadratic Equation',
      'Sequence and Series',
      'Complex Numbers',
      'Binomial Theorem',
      'Permutations & Combinations (P&C)',
    ],
  },
  {
    id: 'trigonometry',
    name: 'Trigonometry',
    blurb: 'Ratios, identities, and triangles.',
    topics: ['Trigonometry', 'Inverse Trigonometry', 'Solution of Triangles (SOT)'],
  },
  {
    id: 'calculus',
    name: 'Calculus',
    blurb: 'Limits, change, and accumulation.',
    topics: [
      'Functions',
      'Limits and Continuity',
      'Differentiability and Differentiation',
      'Application of Derivatives',
      'Integration',
      'Area Under Curves',
      'Differential Equations',
    ],
  },
  {
    id: 'coordinate-geometry',
    name: 'Coordinate Geometry',
    blurb: 'Lines and conic sections in the plane.',
    topics: ['Straight Line', 'Circle', 'Parabola', 'Ellipse', 'Hyperbola'],
  },
  {
    id: 'vectors-3d',
    name: 'Vectors & 3D Geometry',
    blurb: 'Vectors, planes, and lines in space.',
    topics: ['Vectors and 3D Geometry'],
  },
];

/**
 * One short, representative, text-only JEE-level question per topic. Used by
 * the "Load sample" button on /explain when a topic is active. No solution is
 * provided — the AI solves from scratch.
 */
export const topicSamples: Record<string, string> = {
  // Algebra
  'Basic Maths':
    'If a, b are real numbers such that a + b = 4 and a² + b² = 10, find the value of a³ + b³.',
  'Quadratic Equation':
    'Find all real values of k for which the equation (k − 2)x² + 2(k − 2)x + 4 = 0 has two equal real roots.',
  'Sequence and Series':
    'The sum of the first n terms of a series is Sₙ = 3n² + 2n. Find its 10th term and prove the series is an A.P.',
  'Complex Numbers':
    'If z is a complex number satisfying |z − 3| = |z − 3i|, find the locus of z and describe it geometrically.',
  'Binomial Theorem':
    'Find the term independent of x in the expansion of (2x² − 1/x)¹².',
  'Permutations & Combinations (P&C)':
    'In how many ways can the letters of the word "MATHEMATICS" be arranged so that all the vowels come together?',

  // Trigonometry
  Trigonometry:
    'Prove that cos20° · cos40° · cos80° = 1/8.',
  'Inverse Trigonometry':
    'Solve for x: tan⁻¹(x − 1) + tan⁻¹(x) + tan⁻¹(x + 1) = tan⁻¹(3x).',
  'Solution of Triangles (SOT)':
    'In a triangle ABC, if a = 13, b = 14, c = 15, find the area and the radius of the inscribed circle.',

  // Calculus
  Functions:
    'Find the domain of f(x) = √(log₂(log₃(log₅(x² − 1)))). Express your answer in interval notation.',
  'Limits and Continuity':
    'Evaluate lim(x→0) (sin x − x) / x³.',
  'Differentiability and Differentiation':
    'Check whether f(x) = |x − 1| + |x − 2| is differentiable at x = 1 and x = 2, and find f′(x) where it exists.',
  'Application of Derivatives':
    'Find the maximum volume of a right circular cylinder that can be inscribed in a sphere of radius R.',
  Integration:
    'Evaluate ∫ (x² + 1) / (x⁴ + 1) dx.',
  'Area Under Curves':
    'Find the area of the region bounded by the parabola y² = 4x and the line y = 2x − 4.',
  'Differential Equations':
    'Solve the differential equation dy/dx + y·tan x = sec x, given y(0) = 1.',

  // Coordinate Geometry
  'Straight Line':
    'Find the equations of the lines through the point (2, 3) that make an angle of 45° with the line x − 2y = 3.',
  Circle:
    'Two circles x² + y² = 9 and x² + y² − 6x − 8y + 9 = 0 intersect at A and B. Find the equation of the circle through A, B and (1, 1).',
  Parabola:
    'Find the equation of the normal to the parabola y² = 12x that makes an angle of 45° with the x-axis.',
  Ellipse:
    'Find the equations of the tangents to the ellipse x²/16 + y²/9 = 1 that are parallel to the line y = x + 5.',
  Hyperbola:
    'For the hyperbola x²/9 − y²/16 = 1, find the eccentricity, the foci, and the equations of the asymptotes.',

  // Vectors & 3D
  'Vectors and 3D Geometry':
    'Find the shortest distance between the lines r = (i + 2j + 3k) + λ(2i + 3j + 4k) and r = (2i + 4j + 5k) + μ(3i + 4j + 5k).',
};

/** All topic names across every category, flattened. */
export const allTopics: string[] = syllabus.flatMap((c) => c.topics);

/** Returns true if `topic` is a known syllabus topic (exact match). */
export function isKnownTopic(topic: string): boolean {
  return allTopics.includes(topic);
}

/** Returns a sample question for a topic, or null if none is defined. */
export function getTopicSample(topic: string): string | null {
  return topicSamples[topic] ?? null;
}
