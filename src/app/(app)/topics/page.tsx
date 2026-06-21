import type { Metadata } from 'next';
import { allTopics } from '@/lib/data/syllabus';
import TopicsBrowser from './TopicsBrowser';

export const metadata: Metadata = {
  title: 'Topics — JEE Math Pro',
  description:
    'Browse the full JEE Advanced Mathematics syllabus — Algebra, Trigonometry, Calculus, Coordinate Geometry, and Vectors & 3D — and jump straight into an AI-solved explanation for any topic.',
};

export default function TopicsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Mathematics <span className="gradient-text">Syllabus</span>
        </h1>
        <p className="text-text-muted mt-2 text-sm max-w-2xl">
          The complete JEE Advanced Maths syllabus across {allTopics.length} topics. Pick any
          topic to open it in AI Explain — paste a question and get a fully worked, multi-method
          solution.
        </p>
      </div>

      <TopicsBrowser />
    </div>
  );
}
