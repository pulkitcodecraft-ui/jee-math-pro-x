/**
 * AI Client Abstraction Layer
 *
 * This module provides AI-powered features behind a clean interface.
 * Currently all functions return MOCKED responses.
 *
 * ⚠️  INTEGRATION POINT: When you're ready to wire a real AI API (e.g. OpenAI,
 * Gemini), replace the function bodies below. The types, function signatures,
 * and all UI code that calls these functions should remain unchanged.
 *
 * Functions:
 * - interpretSearchQuery()  → used in Phase 4 (AI search bar)
 * - explainSolution()       → used in Phase 5 (step-by-step explainer)
 */

import type { SearchResult, ExplanationResult } from './types';

/**
 * Interprets a natural-language search query and returns structured results.
 *
 * Currently mocked — uses simple keyword matching against sample topics.
 * In production, this would call an LLM to parse the query into a structured
 * topic/subtopic/difficulty recommendation.
 *
 * @param query - The user's natural-language search input
 * @returns Structured search result with topic, subtopic, and suggestions
 */
export async function interpretSearchQuery(query: string): Promise<SearchResult> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Simple keyword matching for mock purposes
  const lowerQuery = query.toLowerCase();

  if (lowerQuery.includes('function')) {
    return {
      topic: 'Functions',
      subtopic: null,
      difficultyLevel: null,
      suggestedOptions: [
        'Domain and Range',
        'Composition of Functions',
        'Inverse Functions',
        'Graphical Transformations',
        'Functional Equations',
      ],
    };
  }

  if (lowerQuery.includes('probability')) {
    return {
      topic: 'Probability',
      subtopic: null,
      difficultyLevel: null,
      suggestedOptions: [
        'Conditional Probability',
        'Bayes\' Theorem',
        'Random Variables',
        'Binomial Distribution',
        'Probability Distributions',
      ],
    };
  }

  if (lowerQuery.includes('coordinate') || lowerQuery.includes('geometry')) {
    return {
      topic: 'Coordinate Geometry',
      subtopic: null,
      difficultyLevel: null,
      suggestedOptions: [
        'Straight Lines',
        'Circles',
        'Parabola',
        'Ellipse',
        'Hyperbola',
      ],
    };
  }

  // Default fallback
  return {
    topic: 'General Mathematics',
    subtopic: null,
    difficultyLevel: null,
    suggestedOptions: [
      'Functions',
      'Probability',
      'Coordinate Geometry',
    ],
  };
}

/**
 * Takes a question and a proposed solution, returns a step-by-step breakdown.
 *
 * Currently mocked — returns a plausible-looking generic explanation.
 * In production, this would send both the question and solution to an LLM
 * and return a parsed, structured explanation.
 *
 * @param question - The math question/problem statement
 * @param solution - The student's or reference solution to explain
 * @returns Structured step-by-step explanation
 */
export async function explainSolution(
  question: string,
  solution: string
): Promise<ExplanationResult> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  return {
    question,
    steps: [
      {
        stepNumber: 1,
        title: 'Understand the Problem',
        content: `First, let's parse what the question is asking: "${question.slice(0, 100)}..." We need to identify the key variables and constraints.`,
      },
      {
        stepNumber: 2,
        title: 'Identify the Approach',
        content: 'Based on the structure of this problem, we can see that the solution uses a standard technique. Let\'s break down the method chosen.',
      },
      {
        stepNumber: 3,
        title: 'Apply the Method',
        content: `The solution applies the chosen technique: "${solution.slice(0, 100)}..." Here's why each step follows logically from the previous one.`,
      },
      {
        stepNumber: 4,
        title: 'Verify the Result',
        content: 'Finally, we should verify our answer by substituting back or checking edge cases to ensure correctness.',
      },
    ],
    summary: 'This problem demonstrates a classic JEE-style approach. The key insight is recognizing the underlying pattern and applying the right technique methodically.',
  };
}
