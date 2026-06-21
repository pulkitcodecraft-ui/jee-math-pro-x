'use client';

import MathText from '@/components/ui/MathText';

/**
 * Renders solution prose with **bold** labels and inline LaTeX via MathText.
 */
export default function SolutionText({
  text,
  className = '',
}: {
  text: string;
  className?: string;
}) {
  const parts = (text ?? '').split(/(\*\*[^*]+\*\*)/g);

  return (
    <span className={`math-content max-w-full whitespace-pre-wrap break-words ${className}`}>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={i} className="font-semibold text-foreground">
              <MathText text={part.slice(2, -2)} />
            </strong>
          );
        }
        if (!part) return null;
        return <MathText key={i} text={part} />;
      })}
    </span>
  );
}
