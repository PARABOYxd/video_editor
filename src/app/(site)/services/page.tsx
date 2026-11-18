import Link from "next/link";
import ContactCTA from "@/components/home/ContactCTA";
import SectionHeading from "@/components/layout/SectionHeading";
import { getProfile, getServices } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { PROJECT_TYPES } from "@/lib/validation";

export const revalidate = 3600;

export async function generateMetadata() {
  const [profile, services] = await Promise.all([getProfile(), getServices()]);
  return pageMetadata({
    title: "Services",
    description: `${services.map((s) => s.title).join(", ")}. Video editing by ${profile.brandName}.`.slice(0, 158),
    path: "/services",
  });
}

// Pre-select the closest project type on the contact form.
function typeFor(title: string): string {
  const t = title.toLowerCase();
  const match = [
    ["social", "Reels & Shorts"],
    ["reel", "Reels & Shorts"],
    ["short", "Reels & Shorts"],
    ["youtube", "YouTube video"],
    ["brand", "Brand film"],
    ["commercial", "Commercial"],
    ["cinematic", "Travel / cinematic"],
    ["travel", "Travel / cinematic"],
    ["motion", "Motion graphics"],
    ["podcast", "Podcast"],
  ].find(([k]) => t.includes(k));
  return match && (PROJECT_TYPES as readonly string[]).includes(match[1]) ? match[1] : "";
}

export default async function ServicesPage() {
  const [services, profile] = await Promise.all([getServices(), getProfile()]);

  return (
    <>
      <div className="container-site pt-12 md:pt-20">
        <SectionHeading as="h1" label="Services" title="Editing, from footage to final cut." />
        <p className="t-lead mt-6 max-w-xl text-secondary-aa">
          Every project is quoted on its scope: the length of the footage, the finished runtime, and how much graphics and colour
          work it needs. Tell us about yours and we&apos;ll reply with a quote.
        </p>
      </div>

      <ol className="container-site section !pt-16">
        {services.map((s, i) => {
          const type = typeFor(s.title);
          return (
            <li key={s.id} className="grid-12 gap-y-6 border-t border-ink py-10 md:py-14">
              <div className="col-span-12 lg:col-span-5">
                <p className="t-meta text-secondary-aa">{String(i + 1).padStart(2, "0")}</p>
                <h2 className="mt-3 font-display text-[clamp(26px,2.6vw,36px)] font-semibold uppercase leading-[1.05] [font-stretch:88%]">{s.title}</h2>
                <p className="mt-4 max-w-md text-[16px] text-secondary-aa">{s.description}</p>
              </div>
              <dl className="col-span-12 grid gap-6 sm:grid-cols-3 lg:col-span-7">
                {(
                  [
                    ["You receive", s.deliverables],
                    ["Suits", s.idealFor],
                    ["How it works", s.process],
                  ] as const
                )
                  .filter(([, v]) => v)
                  .map(([k, v]) => (
                    <div key={k} className="border-t border-line pt-4">
                      <dt className="t-meta text-secondary-aa">{k}</dt>
                      <dd className="mt-2 text-[15px] leading-relaxed">{v}</dd>
                    </div>
                  ))}
                <div className="sm:col-span-3">
                  <Link href={type ? `/contact?type=${encodeURIComponent(type)}` : "/contact"} className="link-arrow">
                    Request a quote <span className="arrow" aria-hidden>→</span>
                  </Link>
                </div>
              </dl>
            </li>
          );
        })}
      </ol>

      <div className="border-t border-line">
        <ContactCTA profile={profile} />
      </div>
    </>
  );
}
