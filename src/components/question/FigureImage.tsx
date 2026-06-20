'use client';

/**
 * Renders a question/solution figure on the dark UI. White-background scans
 * (textbook / SRG Bank PDF crops) get a padded dark frame so they don't look
 * like harsh white slabs. Optional invert for black-text-on-white scans.
 */
export default function FigureImage({
  src,
  alt,
  invert = false,
  className = '',
}: {
  src: string;
  alt: string;
  invert?: boolean;
  className?: string;
}) {
  return (
    <a
      href={src}
      target="_blank"
      rel="noopener noreferrer"
      className={`block rounded-xl overflow-hidden border border-border bg-[#1a1a2e] hover:border-border-light transition-colors ${className}`}
      title="Open full size"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={`w-full h-auto max-h-[28rem] object-contain p-3 ${
          invert ? 'invert hue-rotate-180 brightness-95 contrast-90' : ''
        }`}
      />
    </a>
  );
}
