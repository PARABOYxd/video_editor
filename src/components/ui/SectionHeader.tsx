import Button from "./Button";
import Eyebrow from "./Eyebrow";

type Props = {
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Sits bottom-right on desktop, under the text on phones. */
  cta?: { href: string; label: string };
  as?: "h1" | "h2";
  tone?: "light" | "dark";
  /** Goes on the heading, for aria-labelledby. */
  id?: string;
};

/** Section opener: eyebrow, heading, optional description and link. */
export default function SectionHeader({ eyebrow, title, description, cta, as: Tag = "h2", tone = "light", id }: Props) {
  return (
    <div data-reveal className="grid-12 items-end gap-y-6">
      <div className="col-span-12 lg:col-span-8">
        <Eyebrow tone={tone}>{eyebrow}</Eyebrow>
        <Tag id={id} className={`${Tag === "h1" ? "t-h1" : "t-h2"} mt-5 text-balance`}>
          {title}
        </Tag>
        {description && <p className={`t-lead mt-6 ${tone === "dark" ? "text-muted" : "text-secondary"}`}>{description}</p>}
      </div>
      {cta && (
        <div className="col-span-12 lg:col-span-4 lg:justify-self-end">
          <Button href={cta.href} variant="link" arrow>
            {cta.label}
          </Button>
        </div>
      )}
    </div>
  );
}
