export const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

/** Reads a timing token from globals.css for the Web Animations API. */
export function duration(name: "fast" | "base" | "slow" | "slower") {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(`--transition-duration-${name}`).trim();
  const n = parseFloat(raw) || 0;
  // The CSS minifier may turn 500ms into .5s.
  return raw.endsWith("ms") ? n : n * 1000;
}

export function easing() {
  return getComputedStyle(document.documentElement).getPropertyValue("--ease-out-soft").trim() || "ease-out";
}
