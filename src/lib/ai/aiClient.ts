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
import { searchableTopics } from '@/lib/data/mockData';

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
  await new Promise((resolve) => setTimeout(resolve, 400));

  const q = query.trim().toLowerCase();

  let best: { name: string; subtopics: string[]; matchedSub: string | null } | null = null;
  let bestScore = 0;

  for (const topic of searchableTopics) {
    const name = topic.name.toLowerCase();
    let score = 0;
    let matchedSub: string | null = null;

    // Match against the topic name (either direction handles plurals like "circles")
    if (q.length >= 3 && (q.includes(name) || name.includes(q))) {
      score = Math.max(score, name.length);
    }

    // Match against subtopics — a subtopic hit is the most specific signal
    for (const sub of topic.subtopics) {
      const s = sub.toLowerCase();
      if (q.length >= 3 && (q.includes(s) || s.includes(q))) {
        if (s.length + 1 > score) {
          score = s.length + 1;
          matchedSub = sub;
        }
      }
    }

    if (score > bestScore) {
      bestScore = score;
      best = { name: topic.name, subtopics: topic.subtopics, matchedSub };
    }
  }

  if (best) {
    return {
      topic: best.name,
      subtopic: best.matchedSub,
      difficultyLevel: null,
      suggestedOptions: best.subtopics.slice(0, 6),
    };
  }

  // Default fallback — surface a spread of core topics to pick from
  return {
    topic: 'General Mathematics',
    subtopic: null,
    difficultyLevel: null,
    suggestedOptions: [
      'Functions',
      'Quadratic Equation',
      'Trigonometry',
      'Integration',
      'Circle',
      'Vectors and 3D Geometry',
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
