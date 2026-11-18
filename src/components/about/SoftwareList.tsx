/** Software as a plain ruled list. No skill bars: they measure nothing. */
export default function SoftwareList({ software }: { software: string[] }) {
  if (!software.length) return null;
  return (
    <ul className="border-t border-ink">
      {software.map((s, i) => (
        <li key={s} className="flex items-baseline justify-between gap-6 border-b border-line py-4">
          <span className="text-[17px]">{s}</span>
          <span className="t-meta text-secondary-aa">{String(i + 1).padStart(2, "0")}</span>
        </li>
      ))}
    </ul>
  );
}
