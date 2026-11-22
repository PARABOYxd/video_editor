import { TESTIMONIALS } from "@/config/content";
import type { Testimonial } from "@/lib/types";
import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";
import SectionHeader from "@/components/ui/SectionHeader";
import Img from "../ui/Img";

/** Real quotes only: published ones from the admin, then filled-in ones from the config. */
export default function Testimonials({ items }: { items: Testimonial[] }) {
  const quotes = [
    ...items.map((t) => ({ quote: t.quote, name: t.name, role: t.role, avatar: t.photoUrl })),
    ...TESTIMONIALS.filter((t) => t.quote.trim() && t.name.trim()),
  ];
  if (!quotes.length) return null;

  return (
    <Section id="testimonials" aria-labelledby="testimonials-title">
      <SectionHeader id="testimonials-title" eyebrow="In their words" title="What clients say." />
      <ul data-reveal-group className="mt-14 grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
        {quotes.map((t, i) => (
          <li key={i}>
            <Card as="figure" variant="rule" padding="top" className="flex h-full flex-col">
              <blockquote className="t-quote">&ldquo;{t.quote}&rdquo;</blockquote>
              <figcaption className="mt-auto flex items-center gap-3 pt-8">
                <span className="relative grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full bg-ink text-on-dark">
                  {t.avatar ? <Img src={t.avatar} alt="" fill sizes="44px" className="object-cover" /> : <span aria-hidden>{t.name.trim()[0]}</span>}
                </span>
                <span>
                  <span className="block text-body-sm font-medium">{t.name}</span>
                  {t.role && <span className="block text-small text-secondary">{t.role}</span>}
                </span>
              </figcaption>
            </Card>
          </li>
        ))}
      </ul>
    </Section>
  );
}
