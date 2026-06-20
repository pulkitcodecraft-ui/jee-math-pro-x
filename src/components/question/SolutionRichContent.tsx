'use client';

import FigureImage from '@/components/question/FigureImage';
import SolutionText from '@/components/question/SolutionText';
import { parseSolutionImages } from '@/lib/solution/solutionImages';

/**
 * Solution body: prose + LaTeX + optional inline images via markdown or [image:...].
 */
export default function SolutionRichContent({
  text,
  className = '',
  imageClassName = 'my-3',
}: {
  text: string;
  className?: string;
  imageClassName?: string;
}) {
  const parts = parseSolutionImages(text ?? '');

  if (parts.length === 1 && parts[0].type === 'text') {
    return <SolutionText text={parts[0].value} className={className} />;
  }

  return (
    <div className={className}>
      {parts.map((part, i) => {
        if (part.type === 'text' && part.value.trim()) {
          return <SolutionText key={i} text={part.value} className="text-sm leading-relaxed text-text-muted" />;
        }
        if (part.type === 'image') {
          const invert =
            part.image.invert ??
            !part.image.src.toLowerCase().endsWith('.svg');
          return (
            <FigureImage
              key={i}
              src={part.image.src}
              alt={part.image.alt}
              invert={invert}
              className={imageClassName}
            />
          );
        }
        return null;
      })}
    </div>
  );
}
