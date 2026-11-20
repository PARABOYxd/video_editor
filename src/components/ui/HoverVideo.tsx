"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Muted looping clip layered over a still. `mode="hover"` loads and plays only
 * while the parent `.group` is hovered/focused; `mode="auto"` plays on mount.
 * Nothing loads before it's needed, and reduced-motion users keep the still.
 */
export default function HoverVideo({ src, mode = "hover" }: { src: string; mode?: "hover" | "auto" }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const on = () => {
      if (!video.src) video.src = src;
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
      className={`pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
        active && ready ? "opacity-100" : "opacity-0"
      }`}
    />
  );
}
