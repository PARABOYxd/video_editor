import Link from "next/link";
import { Check } from "lucide-react";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import ServiceIcon from "@/components/services/ServiceIcon";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import SectionHeader from "@/components/ui/SectionHeader";
import { getProfile, getProjects, getServices } from "@/lib/content";
import { pageMetadata, servicesJsonLd } from "@/lib/seo";
import { serviceDetails } from "@/lib/service-details";

export const revalidate = 3600;

export async function generateMetadata() {
  return pageMetadata({
    title: "Video Editing Services in Pune, India",
    description: "Video editing services in Pune: YouTube video editing, Instagram Reels, brand film and wedding film editing, cinematic travel videos and podcasts.",
    path: "/services",
    og: "services",
  });
}

export default async function ServicesPage() {
  const [rows, profile, projects] = await Promise.all([getServices(), getProfile(), getProjects()]);
  const services = rows.map(serviceDetails);
  const hasWork = (category: string | null) => Boolean(category) && projects.some((p) => p.categorySlug === category);

  return (
    <>
      <JsonLd data={servicesJsonLd(services, profile)} />
      <Container className="pt-6">
        <Breadcrumbs items={[{ name: "Services", path: "/services" }]} />
        <div className="mt-8">
          <SectionHeader
            as="h1"
            eyebrow="Services"
            title="Editing, from footage to final cut."
            description={
              <>
                From short-form Reels to YouTube videos and brand films, every project is quoted on its scope: footage, runtime, graphics and colour. See{" "}
                <Link href="/work" className="tap-target link-u text-ink">
                  our work
                </Link>{" "}
                or{" "}
                <Link href="/about" className="tap-target link-u text-ink">
                  meet the editors
                </Link>
                .
              </>
            }
          />
        </div>
      </Container>

      <Section as="ol" className="pb-0! pt-16!">
        {services.map((s, i) => (
          <li key={s.id} id={s.slug} data-service data-reveal className="grid-12 gap-y-8 border-t border-ink py-10 md:py-14">
            <div className="col-span-12 lg:col-span-5">
              <div className="flex items-center gap-4">
                <ServiceIcon slug={s.slug} className="h-7 w-7 text-accent" />
                <p className="t-meta text-secondary">{String(i + 1).padStart(2, "0")}</p>
              </div>
              <h2 className="t-h3 mt-5">{s.title}</h2>
              <p className="mt-4 max-w-md text-body text-secondary">{s.description}</p>
              <p className="t-h4 mt-8" data-price>
                {s.priceLabel}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-5">
                <Button href={`/contact?type=${encodeURIComponent(s.inquiryType)}`} variant={i === 0 ? "accent" : "primary"} arrow>
                  Get a quote
                </Button>
                {hasWork(s.category) && (
                  <Button href={`/work?category=${s.category}`} variant="link" arrow>
                    Related work
                  </Button>
                )}
              </div>
            </div>

            <dl className="col-span-12 grid content-start gap-6 sm:grid-cols-2 lg:col-span-7">
              {s.included.length > 0 && (
                <div className="border-t border-line pt-4 sm:col-span-2">
                  <dt className="t-meta text-secondary">What&apos;s included</dt>
                  <dd className="mt-3">
                    <ul className="grid gap-2 sm:grid-cols-2">
                      {s.included.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-body-sm">
                          <Check aria-hidden className="mt-1 h-4 w-4 shrink-0 text-accent" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              )}
              {(
                [
                  ["Deliverables", s.deliverables],
                  ["Turnaround", s.turnaroundLabel],
                  ["Suits", s.idealFor],
                  ["How it works", s.process],
                ] as const
              )
                .filter(([, value]) => value)
                .map(([label, value]) => (
                  <div key={label} className="border-t border-line pt-4">
                    <dt className="t-meta text-secondary">{label}</dt>
                    <dd className="mt-2 text-body-sm">{value}</dd>
                  </div>
                ))}
            </dl>
          </li>
        ))}
      </Section>

      <Section aria-labelledby="compare-title">
        <SectionHeader id="compare-title" eyebrow="Compare" title="Which edit fits?" />
        {/* Stacks into blocks on phones. Explicit roles keep the table semantics when it does. */}
        <table role="table" aria-labelledby="compare-title" className="mt-12 block w-full text-left text-body-sm lg:table">
          <thead role="rowgroup" className="sr-only lg:not-sr-only lg:table-header-group">
            <tr role="row" className="t-meta border-b border-ink text-secondary lg:table-row">
              {["Service", "Best for", "Format", "Turnaround", "Price"].map((h) => (
                <th key={h} role="columnheader" scope="col" className="py-4 pr-6 font-normal">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody role="rowgroup" className="block lg:table-row-group">
            {services.map((s) => (
              <tr key={s.id} role="row" className="block border-b border-line py-5 lg:table-row lg:py-0">
                <th role="rowheader" scope="row" className="block pb-3 text-body font-semibold lg:table-cell lg:w-1/5 lg:py-5 lg:pr-6 lg:align-top">
                  {s.title}
                </th>
                {(
                  [
                    ["Best for", s.idealFor],
                    ["Format", s.format],
                    ["Turnaround", s.turnaroundLabel],
                    ["Price", s.priceLabel],
                  ] as const
                ).map(([label, value]) => (
                  <td key={label} role="cell" className="grid grid-cols-5 gap-3 py-1.5 lg:table-cell lg:py-5 lg:pr-6 lg:align-top">
                    <span aria-hidden className="t-meta col-span-2 text-secondary lg:hidden">
                      {label}
                    </span>
                    <span className="col-span-3">{value}</span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Section>
    </>
  );
}
