"use client";

import { ArrowUp } from "lucide-react";
import Button from "@/components/ui/Button";
import { REDUCED_MOTION } from "@/components/motion/tokens";

/** Smooth scroll to the top (instant with reduced motion), taking keyboard focus along. */
export default function BackToTop() {
  const toTop = () => {
    const reduce = window.matchMedia(REDUCED_MOTION).matches;
    document.getElementById("main")?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: reduce ? "instant" : "smooth" });
  };
  return (
    <Button variant="secondary" size="sm" onClick={toTop} data-back-to-top icon={<ArrowUp aria-hidden className="h-4 w-4" />}>
      Back to top
    </Button>
  );
}
