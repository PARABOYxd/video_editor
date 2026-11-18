/**
 * Section opener: a mono label with a short rule, then the headline.
 * `aside` sits bottom-right on desktop (a link or a supporting line).
 */
export default function SectionHeading({
  label,
  title,
  aside,
  as: Tag = "h2",
  dark = false,
  id,
}: {
  label: string;
  title: React.ReactNode;
  aside?: React.ReactNode;
  as?: "h1" | "h2";
  dark?: boolean;
  id?: string;
}) {
  return (
    <div className="grid-12 items-end gap-y-6">
      <div className="col-span-12 lg:col-span-8">
        <p className={`t-meta flex items-center gap-3 ${dark ? "text-muted" : "text-secondary-aa"}`}>
          <span aria-hidden className={`h-px w-8 ${dark ? "bg-muted" : "bg-accent"}`} />
          {label}
        </p>
        <Tag id={id} className={`${Tag === "h1" ? "t-page" : "t-section"} mt-5 text-balance`}>
          {title}
        </Tag>
      </div>
      {aside && <div className="col-span-12 lg:col-span-4 lg:justify-self-end lg:text-right">{aside}</div>}
    </div>
  );
}
