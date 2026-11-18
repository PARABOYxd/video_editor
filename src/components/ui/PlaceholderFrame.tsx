/**
 * A clearly labelled stand-in for media that hasn't been added yet. Drawn
 * like a camera viewfinder (corner marks, centre cross) so it reads as an
 * intentional frame, never as someone else's imagery.
 */
export default function PlaceholderFrame({ label, title, compact = false }: { label: string; title?: string; compact?: boolean }) {
  const corner = "absolute h-4 w-4 border-white/35";
  return (
    <div className="absolute inset-0 bg-media text-white" role="img" aria-label={`${label}${title ? `: ${title}` : ""}`}>
      <span className={`${corner} left-4 top-4 border-l border-t`} />
      <span className={`${corner} right-4 top-4 border-r border-t`} />
      <span className={`${corner} bottom-4 left-4 border-b border-l`} />
      <span className={`${corner} bottom-4 right-4 border-b border-r`} />
      <span className="absolute left-1/2 top-1/2 h-px w-6 -translate-x-1/2 bg-white/25" />
      <span className="absolute left-1/2 top-1/2 h-6 w-px -translate-y-1/2 bg-white/25" />
      <div className={`absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 ${compact ? "p-4" : "p-6"}`}>
        {title && !compact && <span className="t-project max-w-[70%] text-white/85">{title}</span>}
        <span className="t-meta ml-auto text-muted">{label}</span>
      </div>
    </div>
  );
}
