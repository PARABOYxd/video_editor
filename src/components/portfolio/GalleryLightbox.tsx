"use client";

import { useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import Img from "../ui/Img";

const CONTROL = "grid h-11 w-11 place-items-center rounded bg-scrim/60 text-on-dark hover:bg-scrim";

/** Full-screen stills: arrows or arrow keys to move, Esc or the close button to leave. */
export default function GalleryLightbox({
  images,
  title,
  index,
  onChange,
  onClose,
}: {
  images: string[];
  title: string;
  index: number;
  onChange: (index: number) => void;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const many = images.length > 1;
  const move = (by: number) => onChange((index + by + images.length) % images.length);

  useEffect(() => {
    const el = dialog.current;
    if (el && !el.open) el.showModal();
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = prev;
    };
  }, []);

  return (
    <dialog
      ref={dialog}
      data-tone="dark"
      data-gallery
      aria-label={`${title}: stills`}
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && e.currentTarget.close()}
      onKeyDown={(e) => {
        if (!many) return;
        if (e.key === "ArrowRight") move(1);
        else if (e.key === "ArrowLeft") move(-1);
      }}
      className="m-0 h-dvh max-h-none w-screen max-w-none bg-media p-0 text-on-dark backdrop:bg-scrim/90"
    >
      <div className="relative h-full w-full">
        <div className="absolute inset-x-3 inset-y-16 md:inset-x-20">
          <Img key={index} src={images[index]} alt={`${title}: still ${index + 1} of ${images.length}`} fill sizes="100vw" className="object-contain" />
        </div>
        <button type="button" autoFocus onClick={() => dialog.current?.close()} aria-label="Close stills" className={`${CONTROL} absolute right-3 top-3`}>
          <X aria-hidden className="h-6 w-6" />
        </button>
        {many && (
          <>
            <button type="button" onClick={() => move(-1)} aria-label="Previous still" className={`${CONTROL} absolute bottom-3 left-3`}>
              <ArrowLeft aria-hidden className="h-5 w-5" />
            </button>
            <button type="button" onClick={() => move(1)} aria-label="Next still" className={`${CONTROL} absolute bottom-3 right-3`}>
              <ArrowRight aria-hidden className="h-5 w-5" />
            </button>
          </>
        )}
        <p className="t-meta absolute bottom-6 left-1/2 -translate-x-1/2" aria-live="polite">
          {index + 1} / {images.length}
        </p>
      </div>
    </dialog>
  );
}
