import type { McqOption, Question } from '@/types/question';
import SolutionText from './SolutionText';

const LABELS: McqOption[] = ['A', 'B', 'C', 'D'];

function getCorrectSet(question: Question): Set<McqOption> {
  const keys =
    question.correctOptions?.length
      ? question.correctOptions
      : question.correctOption
        ? [question.correctOption]
        : [];
  return new Set(keys);
}

export default function McqOptions({
  question,
  revealAnswer = true,
}: {
  question: Question;
  revealAnswer?: boolean;
}) {
  if (!question.options) return null;

  const correctSet = getCorrectSet(question);
  const correctLabels =
    question.correctOptions?.length
      ? question.correctOptions
      : question.correctOption
        ? [question.correctOption]
        : [];
  const isMultiple = correctLabels.length > 1;

  return (
    <div className="mt-5 space-y-2">
      <p className="text-xs font-semibold uppercase tracking-widest text-text-dim mb-3">
        Options
        {isMultiple && (
          <span className="ml-2 normal-case font-medium text-cyan-400/90">
            — multiple correct
          </span>
        )}
      </p>
      <ul className="grid gap-2 sm:grid-cols-2">
        {LABELS.map((key) => {
          const text = question.options?.[key];
          if (!text) return null;
          const isCorrect = revealAnswer && correctSet.has(key);

          return (
            <li
              key={key}
              className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm leading-relaxed transition-colors ${
                isCorrect
                  ? 'border-emerald-500/40 bg-emerald-500/10 text-foreground'
                  : 'border-border bg-surface-light text-text-muted'
              }`}
            >
              <span
                className={`shrink-0 flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold ${
                  isCorrect
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-surface-lighter text-text-dim'
                }`}
              >
                {key}
              </span>
              <span className="flex-1 pt-0.5">
                <SolutionText text={text} />
              </span>
              {isCorrect && (
                <span className="shrink-0 text-[10px] font-bold uppercase text-emerald-400">
                  Ans.
                </span>
              )}
            </li>
          );
        })}
      </ul>
      {revealAnswer && correctLabels.length > 0 && (
        <p className="mt-3 text-sm font-medium text-emerald-400">
          Correct answer: ({correctLabels.join(', ')})
        </p>
      )}
    </div>
  );
}
