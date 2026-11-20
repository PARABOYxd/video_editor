"use client";

import { useEffect, useRef, useState } from "react";

/** "x.mp4" → "x-preview.mp4": a short, small, silent loop made for previews. */
const previewOf = (src: string) => src.replace(/(\.[a-z0-9]+)(\?.*)?$/i, "-preview$1$2");

/*
 * Touch screens have no hover, so the card that is most on screen previews,
 * and only that one: one shared registry picks the winner on every change.
 */
type Candidate = { ratio: number; on: () => void; off: () => void };
const candidates = new Map<Element, Candidate>();
let current: Element | null = null;

function pickPreview() {
  let best: Element | null = null;
  let bestRatio = 0.6; // at least 60% visible
  for (const [el, c] of candidates) {
    if (c.ratio >= bestRatio) {
      best = el;
      bestRatio = c.ratio;
    }
  }
  if (best === current) return;
  if (current) candidates.get(current)?.off();
  current = best;
  if (best) candidates.get(best)?.on();
}

/**
 * Muted looping preview layered over a still.
 *  - mode="hover": plays while the parent `.group` is hovered/focused. On touch
 *    screens it plays for the one card most on screen.
 *  - mode="auto": plays on mount (hero).
 * Only the light "-preview" clip is ever loaded. If it is missing the still
 * stays: the full file is never downloaded just for a preview. Reduced-motion
 * and data-saver users keep the still.
 */
export default function HoverVideo({ src, mode = "hover" }: { src: string; mode?: "hover" | "auto" }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(false);
  const [ready, setReady] = useState(false);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video || missing) return;
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
      return off;
    }

    if (!window.matchMedia("(hover: hover)").matches) {
      const entry: Candidate = { ratio: 0, on, off };
      candidates.set(video, entry);
      const io = new IntersectionObserver(
        ([e]) => {
          entry.ratio = e.intersectionRatio;
          pickPreview();
        },
        { threshold: [0, 0.6, 0.75, 0.9, 1] }
      );
      io.observe(video);
      return () => {
        io.disconnect();
        candidates.delete(video);
        if (current === video) current = null;
        off();
      };
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
  }, [mode, src, missing]);

  if (missing) return null;
  const visible = active && ready;

  return (
    <>
      <video
        ref={ref}
        muted
        loop
        playsInline
        preload="none"
        aria-hidden
        tabIndex={-1}
        onPlaying={() => setReady(true)}
        onError={() => {
          setActive(false);
          setMissing(true);
        }}
        className={`pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${visible ? "opacity-100" : "opacity-0"}`}
      />
      {mode === "hover" && (
        <span
          aria-hidden
          className={`pointer-events-none absolute left-3 top-3 flex items-center gap-1.5 rounded bg-black/60 px-2 py-1 font-mono text-[11px] uppercase tracking-[0.08em] text-white backdrop-blur-sm transition-opacity duration-300 ${
            visible ? "opacity-100" : "opacity-0"
          }`}
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
          Preview
        </span>
      )}
    </>
  );
}
