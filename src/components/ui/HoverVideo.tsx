"use client";

import { useEffect, useRef, useState } from "react";

/** "x.mp4" → "x-preview.mp4": a short, small, silent loop made for previews. */
const previewOf = (src: string) => src.replace(/(\.[a-z0-9]+)(\?.*)?$/i, "-preview$1$2");

/**
 * Muted looping preview layered over a still.
 *  - mode="hover": plays while the parent `.group` is hovered/focused. On touch
 *    screens (no hover) it plays while the card is mostly on screen instead.
 *  - mode="auto": plays on mount (hero).
 * Loads the light "-preview" clip first and falls back to the full file if
 * that is missing. Nothing loads before it's needed; reduced-motion and
 * data-saver users keep the still.
 */
export default function HoverVideo({ src, mode = "hover" }: { src: string; mode?: "hover" | "auto" }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || conn?.saveData) return;

    const on = () => {
      if (!video.getAttribute("src")) video.src = previewOf(src);
      video.play().catch(() => {});
      setActive(true);
    };
    const off = () => {
      video.pause();
      setActive(false);
    };

    if (mode === "auto") {
      on();
      return;
    }

    // Touch screens: no hover, so play while the card is in view.
    if (!window.matchMedia("(hover: hover)").matches) {
      const io = new IntersectionObserver(([e]) => (e.intersectionRatio >= 0.6 ? on() : off()), { threshold: [0, 0.6] });
      io.observe(video);
      return () => io.disconnect();
    }

    const group = video.closest(".group");
    if (!group) return;
    group.addEventListener("pointerenter", on);
    group.addEventListener("pointerleave", off);
    group.addEventListener("focusin", on);
    group.addEventListener("focusout", off);
    return () => {
      group.removeEventListener("pointerenter", on);
      group.removeEventListener("pointerleave", off);
      group.removeEventListener("focusin", on);
      group.removeEventListener("focusout", off);
    };
  }, [mode, src]);

  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden
      tabIndex={-1}
      onPlaying={() => setReady(true)}
      onError={(e) => {
        // No preview clip uploaded: use the full video instead.
        const v = e.currentTarget;
        if (v.getAttribute("src") !== src) {
          v.src = src;
          if (active) v.play().catch(() => {});
        }
      }}
      className={`pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
        active && ready ? "opacity-100" : "opacity-0"
      }`}
    />
  );
}
