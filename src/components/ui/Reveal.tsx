"use client";

import { useEffect, useRef } from "react";

/**
 * The only scroll animation on the site: a 500ms fade/lift, once.
 * Content renders visible on the server; the hidden state is applied only
 * after hydration and only for elements still below the fold, so nothing
 * flashes, nothing waits on JS, and reduced-motion users see no movement.
 */
export default function Reveal({ children, className = "", as: Tag = "div" }: { children: React.ReactNode; className?: string; as?: "div" | "li" | "section" }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return; // already in view
    el.classList.add("reveal-ready");
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-in");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag ref={ref as never} className={className}>
      {children}
    </Tag>
  );
}
