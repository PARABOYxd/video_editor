import Link from "next/link";
import clsx from "clsx";
import { Loader2 } from "lucide-react";

const VARIANT = {
  primary: "btn btn-primary",
  accent: "btn btn-accent",
  secondary: "btn btn-secondary",
  ghost: "btn btn-ghost",
  /** For dark or video backgrounds. */
  light: "btn btn-light",
  link: "link-arrow",
} as const;
const SIZE = { sm: "btn-sm", md: "", lg: "btn-lg" } as const;

type Look = {
  variant?: keyof typeof VARIANT;
  /** Ignored by the link variant. */
  size?: keyof typeof SIZE;
  icon?: React.ReactNode;
  iconPosition?: "start" | "end";
  /** Trailing arrow that nudges on hover; pass a string for another glyph. */
  arrow?: boolean | string;
};
type AsLink = Look & Omit<React.ComponentProps<typeof Link>, keyof Look> & { loading?: never; loadingText?: never };
type AsButton = Look &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof Look> & {
    href?: never;
    loading?: boolean;
    loadingText?: React.ReactNode;
  };

/** A link when given `href`, otherwise a button. Works in Server and Client Components. */
export default function Button(props: AsLink | AsButton) {
  const { variant = "primary", size = "md", icon, iconPosition = "start", arrow, className, children, loading, loadingText, ...rest } = props;
  const classes = clsx(VARIANT[variant], variant !== "link" && SIZE[size], className);
  const content = loading ? (
    <>
      <Loader2 aria-hidden className="h-4 w-4 animate-spin" />
      {loadingText ?? children}
    </>
  ) : (
    <>
      {iconPosition === "start" && icon}
      {children}
      {iconPosition === "end" && icon}
      {arrow && (
        <span className="arrow" aria-hidden>
          {arrow === true ? "→" : arrow}
        </span>
      )}
    </>
  );

  if (rest.href !== undefined) {
    return (
      <Link {...(rest as React.ComponentProps<typeof Link>)} className={classes}>
        {content}
      </Link>
    );
  }
  const { type = "button", disabled, ...button } = rest as React.ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button {...button} type={type} disabled={disabled || loading} aria-busy={loading || undefined} className={classes}>
      {content}
    </button>
  );
}
