"use client";

import { useEffect, useRef, useState } from "react";
import Badge from "@/components/ui/Badge";

/** "x.mp4" → "x-preview.mp4": a short, small, silent loop made for previews. */
const previewOf = (src: string) => src.replace(/(\.[a-z0-9]+)(\?.*)?$/i, "-preview$1$2");

const AMBIENT_DELAY = 1500;

/**
 * Muted looping preview layered over a still.
 *  - mode="hover": desktop only. Plays while the parent `.group` is hovered
 *    or focused; touch screens keep the still and download nothing.
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
      // Decoration, so it waits: in view, and only after the page has loaded and gone quiet.
      let timer: ReturnType<typeof setTimeout> | undefined;
      let inView = false;
      const schedule = () => {
        clearTimeout(timer);
        if (inView && document.readyState === "complete") timer = setTimeout(on, AMBIENT_DELAY);
      };
      const io = new IntersectionObserver(
        ([entry]) => {
          inView = entry.isIntersecting;
          if (inView) return schedule();
          clearTimeout(timer);
          off();
        },
        { threshold: 0.35 }
      );
      io.observe(video);
      window.addEventListener("load", schedule);
      return () => {
        io.disconnect();
        clearTimeout(timer);
        window.removeEventListener("load", schedule);
        off();
      };
    }

    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

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
        className={`pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-slower ${visible ? "opacity-100" : "opacity-0"}`}
      />
      {mode === "hover" && (
        <Badge
          variant="overlay"
          aria-hidden
          className={`pointer-events-none absolute left-3 top-3 transition-opacity duration-slow ${
            visible ? "opacity-100" : "opacity-0"
          }`}
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
          Preview
        </Badge>
      )}
    </>
  );
}
