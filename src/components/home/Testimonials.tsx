import Img from "../ui/Img";
import type { Testimonial } from "@/lib/types";

/** Rendered only when real, published testimonials exist. */
export default function Testimonials({ items }: { items: Testimonial[] }) {
  if (!items.length) return null;
  return (
    <section className="container-site section" aria-labelledby="testimonials-title">
      <p id="testimonials-title" className="t-meta flex items-center gap-3 text-secondary-aa">
        <span aria-hidden className="h-px w-8 bg-accent" />
        In their words
      </p>
      <ul className="mt-12 grid gap-x-12 gap-y-14 md:grid-cols-2">
        {items.map((t) => (
          <li key={t.id}>
            <figure className="border-t border-ink pt-8">
              <blockquote className="font-display text-[clamp(22px,2.2vw,30px)] leading-[1.3]">&ldquo;{t.quote}&rdquo;</blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                {t.photoUrl && (
                  <span className="relative h-11 w-11 overflow-hidden rounded bg-paper">
                    <Img src={t.photoUrl} alt={t.name} fill sizes="44px" className="object-cover" />
                  </span>
                )}
                <span>
                  <span className="block text-[15px] font-medium">{t.name}</span>
                  {t.role && <span className="block text-[14px] text-secondary-aa">{t.role}</span>}
                </span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}
