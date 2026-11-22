import clsx from "clsx";

const VARIANT = {
  outline: "rounded border border-line bg-surface",
  strong: "rounded border border-ink bg-surface",
  /** Editorial: a top rule, no box. */
  rule: "border-t border-ink",
} as const;
const PADDING = { none: "", top: "pt-8", md: "p-6", lg: "p-8 md:p-10" } as const;

type Props = React.HTMLAttributes<HTMLElement> & {
  as?: React.ElementType;
  variant?: keyof typeof VARIANT;
  padding?: keyof typeof PADDING;
};

export default function Card({ as: Tag = "div", variant = "outline", padding = "md", className, ...props }: Props) {
  return <Tag className={clsx(VARIANT[variant], PADDING[padding], className)} {...props} />;
}
