import clsx from "clsx";

const VARIANT = {
  outline: "border border-line bg-surface text-label",
  /** On top of stills and video. */
  overlay: "bg-scrim/70 font-mono text-caption uppercase tracking-label text-on-dark backdrop-blur-sm",
  /** Facts on project cards. */
  meta: "border border-line font-mono text-caption uppercase tracking-label text-ink",
  accent: "bg-accent text-caption text-on-dark",
  warning: "bg-warning-soft text-caption text-warning",
} as const;

type Props = React.HTMLAttributes<HTMLSpanElement> & { variant?: keyof typeof VARIANT };

/** Small label or tag. */
export default function Badge({ variant = "outline", className, ...props }: Props) {
  return <span className={clsx("inline-flex items-center gap-1.5 rounded px-2 py-1", VARIANT[variant], className)} {...props} />;
}
