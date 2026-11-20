import Link from "next/link";
import SectionHeading from "../layout/SectionHeading";
import type { Service } from "@/lib/types";

/** Editorial list, not cards: number, title, one line, thin rules. */
export default function ServicesPreview({ services }: { services: Service[] }) {
  return (
    <section className="container-site section" aria-labelledby="services-title">
      <SectionHeading
        id="services-title"
        label="Services"
        title="What we can help you create."
        aside={
          <Link href="/services" className="link-arrow">
            All services <span className="arrow" aria-hidden>→</span>
          </Link>
        }
      />
      <ol className="mt-14 border-t border-ink">
        {services.slice(0, 4).map((s, i) => (
          <li key={s.id} className="grid-12 gap-y-2 border-b border-line py-6 md:py-8">
            <span className="t-meta col-span-12 pt-2 text-secondary-aa md:col-span-1">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="col-span-12 font-display text-[22px] font-semibold uppercase leading-tight [font-stretch:88%] md:col-span-5 md:text-[28px]">
              {s.title}
            </h3>
            <p className="col-span-12 text-[16px] text-secondary-aa md:col-span-5 md:col-start-8 md:pt-1">{s.description}</p>
          </li>
        ))}
      </ol>
      {services.length > 4 && (
        <div className="mt-10 flex justify-center">
          <Link href="/services" className="btn btn-primary">
            View all {services.length} services <span className="arrow" aria-hidden>→</span>
          </Link>
        </div>
      )}
    </section>
  );
}
