import clsx from "clsx";

type Props = React.HTMLAttributes<HTMLElement> & { as?: "p" | "h2"; tone?: "light" | "dark" };

/** Mono label with a short rule, used above headings. */
export default function Eyebrow({ as: Tag = "p", tone = "light", className, children, ...props }: Props) {
  const dark = tone === "dark";
  return (
    <Tag className={clsx("t-meta flex items-center gap-3", dark ? "text-muted" : "text-secondary", className)} {...props}>
      <span aria-hidden className={clsx("h-px w-8 shrink-0", dark ? "bg-muted" : "bg-accent")} />
      {children}
    </Tag>
  );
}
