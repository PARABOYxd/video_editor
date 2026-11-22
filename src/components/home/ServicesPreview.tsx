import Link from "next/link";
import type { Service } from "@/lib/types";
import { serviceDetails } from "@/lib/service-details";
import ServiceIcon from "@/components/services/ServiceIcon";
import Section from "@/components/ui/Section";
import SectionHeader from "@/components/ui/SectionHeader";

/** Ruled cards: icon, title, one line. Each opens its block on /services. */
export default function ServicesPreview({ services }: { services: Service[] }) {
  if (!services.length) return null;
  return (
    <Section aria-labelledby="services-title">
      <SectionHeader id="services-title" eyebrow="Services" title="What we can help you create." cta={{ href: "/services", label: "All services" }} />
      <ul data-reveal-group className="mt-14 grid border-l border-t border-line sm:grid-cols-2 lg:grid-cols-3">
        {services.map(serviceDetails).map((s) => (
          <li key={s.id} className="border-b border-r border-line">
            <Link
              href={`/services#${s.slug}`}
              prefetch={false}
              data-service-card
              className="group flex h-full flex-col p-6 -outline-offset-2 transition-colors duration-base hover:bg-surface md:p-8"
            >
              <ServiceIcon slug={s.slug} className="h-7 w-7 text-accent" />
              <h3 className="t-h4 mt-8 uppercase stretch-condensed">{s.title}</h3>
              <p className="mt-3 text-body-sm text-secondary">{s.description}</p>
              <span className="t-meta mt-auto inline-flex items-center gap-2 pt-8 text-ink transition-colors duration-base group-hover:text-accent">
                See what&apos;s included
                <span aria-hidden className="arrow inline-block transition-transform duration-base">
                  →
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
