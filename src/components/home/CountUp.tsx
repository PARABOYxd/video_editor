"use client";

import { useEffect, useRef } from "react";
import { REDUCED_MOTION } from "@/components/motion/tokens";

const DURATION = 1400;
const format = (n: number, decimals: number) => n.toLocaleString("en-IN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

/** Counts up once when seen. Screen readers, crawlers and reduced motion get the final number. */
export default function CountUp({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const decimals = Number.isInteger(value) ? 0 : 1;

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia(REDUCED_MOTION).matches) return;
    let frame = 0;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      const started = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, Math.max(0, (now - started) / DURATION));
        el.textContent = format(value * (1 - (1 - p) ** 3), decimals) + suffix;
        if (p < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
      el.textContent = format(value, decimals) + suffix;
    };
  }, [value, suffix, decimals]);

  return (
    <>
      <span className="sr-only">
        {format(value, decimals)}
        {suffix}
      </span>
      <span ref={ref} aria-hidden>
        {format(value, decimals) + suffix}
      </span>
    </>
  );
}
