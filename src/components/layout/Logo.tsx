/**
 * Rytora Studio logo: an "R" whose bowl is a play button, on an accent tile,
 * beside the wordmark. Colours come from the theme, so it works on light and dark.
 */
export function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden focusable="false">
      <rect width="32" height="32" rx="7" fill="var(--color-accent)" />
      <g fill="var(--color-on-dark)">
        <path d="M8 6.5 H12 V25.5 H8 Z" />
        <path d="M12 6.5 L24.5 12.75 L12 19 Z" />
        <path d="M12 15.5 H16.6 L25 25.5 H20.2 Z" />
      </g>
    </svg>
  );
}

export default function Logo({ size = "md" }: { size?: "md" | "lg" }) {
  const lg = size === "lg";
  return (
    <span className="inline-flex items-center gap-2.5">
      <LogoMark className={lg ? "h-10 w-10" : "h-8 w-8"} />
      <span aria-hidden className="flex flex-col leading-none">
        <span className={`font-display font-semibold uppercase tracking-logo stretch-condensed ${lg ? "text-logo-lg" : "text-logo"}`}>
          Rytora
        </span>
        <span className={`font-mono uppercase tracking-logo-sub text-secondary ${lg ? "mt-1 text-logo-sub-lg" : "mt-0.5 text-logo-sub"}`}>
          Studio
        </span>
      </span>
      <span className="sr-only">Rytora Studio</span>
    </span>
  );
}
