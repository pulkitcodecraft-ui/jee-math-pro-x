'use client';

import { useRef, useState } from 'react';

const IMAGE_ACCEPT = 'image/jpeg,image/png,image/webp,image/heic,image/heif';
const PDF_ACCEPT = 'application/pdf';

interface FileUploadButtonProps {
  onSelect: (file: File) => void;
  disabled?: boolean;
}

/**
 * A "+" button (ChatGPT/Claude-style) that opens a small menu:
 * Take Photo, Upload Photo, Upload PDF. Each routes to a hidden file input.
 */
export default function FileUploadButton({ onSelect, disabled }: FileUploadButtonProps) {
  const [open, setOpen] = useState(false);
  const cameraRef = useRef<HTMLInputElement>(null);
  const photoRef = useRef<HTMLInputElement>(null);
  const pdfRef = useRef<HTMLInputElement>(null);

  function pick(ref: React.RefObject<HTMLInputElement | null>) {
    setOpen(false);
    ref.current?.click();
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) onSelect(file);
    e.target.value = ''; // allow re-selecting the same file
  }

  const menuItems = [
    {
      label: 'Take Photo',
      ref: cameraRef,
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
      ),
    },
    {
      label: 'Upload Photo',
      ref: photoRef,
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      ),
    },
    {
      label: 'Upload PDF',
      ref: pdfRef,
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z M13 3v5a1 1 0 001 1h5" />
      ),
    },
  ];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        disabled={disabled}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Attach a file"
        title="Attach a photo or PDF"
        className="w-8 h-8 rounded-lg flex items-center justify-center border border-border
                   text-text-muted hover:text-primary-light hover:border-primary/40
                   disabled:opacity-40 disabled:cursor-not-allowed
                   transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
      >
        <svg className={`w-4 h-4 transition-transform ${open ? 'rotate-45' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div
            role="menu"
            className="absolute left-0 z-20 mt-2 w-48 rounded-xl glass border border-border shadow-xl py-1.5 animate-fade-in"
          >
            {menuItems.map((item) => (
              <button
                key={item.label}
                type="button"
                role="menuitem"
                onClick={() => pick(item.ref)}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-text-muted hover:text-foreground hover:bg-surface-light transition-colors text-left"
              >
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {item.icon}
                </svg>
                {item.label}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Hidden inputs */}
      <input ref={cameraRef} type="file" accept={IMAGE_ACCEPT} capture="environment" className="hidden" onChange={handleChange} />
      <input ref={photoRef} type="file" accept={IMAGE_ACCEPT} className="hidden" onChange={handleChange} />
      <input ref={pdfRef} type="file" accept={PDF_ACCEPT} className="hidden" onChange={handleChange} />
    </div>
  );
}
