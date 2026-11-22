"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { REDUCED_MOTION } from "./tokens";

const FINE_POINTER = "(hover: hover) and (pointer: fine)";

/**
 * "Play" / "View" cursor over elements with data-cursor. Mouse only: off on
 * touch screens and with reduced motion. The native cursor is hidden only
 * while the label is showing, so there's never no cursor at all.
 */
export default function CustomCursor() {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const cursor = ref.current;
    const text = cursor?.firstElementChild;
    if (!cursor || !text) return;
    const root = document.documentElement;
    const fine = window.matchMedia(FINE_POINTER);
    const reduced = window.matchMedia(REDUCED_MOTION);
    let x = -1;
    let y = -1;
    let frame = 0;

    const hide = () => {
      cursor.removeAttribute("data-show");
      root.removeAttribute("data-cursor-on");
    };
    const update = () => {
      frame = 0;
      if (x < 0 || !fine.matches || reduced.matches) return hide();
      const label = document.elementFromPoint(x, y)?.closest<HTMLElement>("[data-cursor]")?.dataset.cursor;
      if (!label) return hide();
      cursor.style.translate = `${x}px ${y}px`;
      text.textContent = label;
      cursor.setAttribute("data-show", "");
      root.setAttribute("data-cursor-on", "");
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const leave = () => {
      x = -1;
      hide();
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return leave();
      x = e.clientX;
      y = e.clientY;
      schedule();
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("scroll", schedule, { passive: true }); // the card moves under a still mouse
    root.addEventListener("pointerleave", leave);
    window.addEventListener("blur", leave);
    reduced.addEventListener("change", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("scroll", schedule);
      root.removeEventListener("pointerleave", leave);
      window.removeEventListener("blur", leave);
      reduced.removeEventListener("change", schedule);
      hide();
    };
  }, [pathname]);

  return (
    <div ref={ref} aria-hidden className="cursor-label">
      <span />
    </div>
  );
}
