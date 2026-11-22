// Typographic marks, not the vendors' logos: those are trademarks with their own usage rules.
const MARKS: [RegExp, string][] = [
  [/premiere/i, "Pr"],
  [/after effects/i, "Ae"],
  [/audition/i, "Au"],
  [/photoshop/i, "Ps"],
  [/davinci|resolve/i, "DR"],
  [/final cut/i, "FC"],
];

const markFor = (name: string) =>
  MARKS.find(([pattern]) => pattern.test(name))?.[1] ??
  name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

/** Tool tiles. No skill bars: they measure nothing. */
export default function SoftwareList({ software }: { software: string[] }) {
  if (!software.length) return null;
  return (
    <ul data-reveal-group className="grid grid-cols-2 border-l border-t border-line lg:grid-cols-4">
      {software.map((name) => (
        <li key={name} className="flex flex-col items-center gap-4 border-b border-r border-line px-3 py-8 text-center">
          <span aria-hidden className="t-h4 grid h-14 w-14 place-items-center rounded border border-ink">
            {markFor(name)}
          </span>
          <span className="text-body-sm">{name}</span>
        </li>
      ))}
    </ul>
  );
}
