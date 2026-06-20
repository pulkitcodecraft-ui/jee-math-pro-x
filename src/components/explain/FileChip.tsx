'use client';

interface FileChipProps {
  name: string;
  fileType: string;
  /** Optional status line, e.g. "Uploading…" or "Attached as reference". */
  status?: string;
  /** When true, shows a spinner instead of the remove button. */
  busy?: boolean;
  onRemove?: () => void;
  /** Optional download/view URL — makes the chip a link when present. */
  url?: string;
}

function FileIcon({ isPdf }: { isPdf: boolean }) {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      {isPdf ? (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z M13 3v5a1 1 0 001 1h5" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      )}
    </svg>
  );
}

export default function FileChip({ name, fileType, status, busy, onRemove, url }: FileChipProps) {
  const isPdf = fileType === 'application/pdf';

  const inner = (
    <>
      <span className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 text-primary-light flex items-center justify-center shrink-0">
        <FileIcon isPdf={isPdf} />
      </span>
      <span className="flex-1 min-w-0">
        <span className="block text-sm text-foreground truncate">{name}</span>
        {status && <span className="block text-[11px] text-text-dim">{status}</span>}
      </span>
    </>
  );

  return (
    <div className="flex items-center gap-2.5 rounded-xl bg-surface border border-border p-2.5 pr-3">
      {url ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 flex-1 min-w-0 hover:opacity-80 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-lg"
        >
          {inner}
        </a>
      ) : (
        <div className="flex items-center gap-2.5 flex-1 min-w-0">{inner}</div>
      )}

      {busy ? (
        <svg className="w-4 h-4 animate-spin text-text-muted shrink-0" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove file"
          className="w-6 h-6 rounded-full flex items-center justify-center text-text-dim hover:text-rose-400 hover:bg-rose-500/10 transition-colors shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      ) : null}
    </div>
  );
}
