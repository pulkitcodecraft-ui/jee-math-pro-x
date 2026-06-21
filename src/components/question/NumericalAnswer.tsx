import type { Question } from '@/types/question';
import SolutionText from './SolutionText';

export default function NumericalAnswer({ question }: { question: Question }) {
  if (!question.correctAnswer) return null;

  return (
    <div className="mt-5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400/80 mb-1">
        Answer
      </p>
      <p className="text-sm font-semibold text-emerald-300">
        <SolutionText text={question.correctAnswer} />
      </p>
    </div>
  );
}
