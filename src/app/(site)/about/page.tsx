import Link from "next/link";
import { VALUES } from "@/config/content";
import { LOCATION } from "@/config/location";
import SoftwareList from "@/components/about/SoftwareList";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import Img from "@/components/ui/Img";
import Section from "@/components/ui/Section";
import SectionHeader from "@/components/ui/SectionHeader";
import { getProfile } from "@/lib/content";
import { pageMetadata, peopleJsonLd } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata() {
  const profile = await getProfile();
  return pageMetadata({
    title: "About Our Video Editors in Pune, India",
    description: `Meet the two video editors behind ${profile.brandName} in Pune, India, and see how we shape story, pacing, sound and colour for YouTube creators and brands.`,
    path: "/about",
    og: "about",
  });
}

export default async function AboutPage() {
  const profile = await getProfile();

  return (
    <>
      <JsonLd data={peopleJsonLd(profile)} />
      <Container as="header" className="pt-6">
        <Breadcrumbs items={[{ name: "About", path: "/about" }]} />
        <Eyebrow className="mt-8">
          About · {profile.brandName}, {LOCATION.city}
        </Eyebrow>
        <h1 className="t-h1 mt-5 max-w-headline-lg">
          Behind <em className="t-italic">every</em> frame, there&apos;s a story.
        </h1>
      </Container>

      <Section id="story" className="grid-12 gap-y-8" aria-labelledby="story-title">
        <div className="col-span-12 lg:col-span-4">
          <Eyebrow as="h2" id="story-title">
            Our story
          </Eyebrow>
        </div>
        <div className="col-span-12 lg:col-span-8">
          <p className="t-statement">{profile.intro}</p>
          <div className="t-prose mt-8 space-y-4 text-secondary">
            {profile.experience && <p>{profile.experience}</p>}
            {profile.philosophy && <p>{profile.philosophy}</p>}
            <p>
              You can see that thinking in{" "}
              <Link href="/work" className="tap-target link-u text-ink">
                our portfolio
              </Link>
              , and in each of our{" "}
              <Link href="/services" className="tap-target link-u text-ink">
                video editing services
              </Link>
              .
            </p>
          </div>
        </div>
      </Section>

      <Section id="editors" bleed className="border-y border-line bg-surface" aria-labelledby="editors-title">
        <SectionHeader id="editors-title" eyebrow="The editors" title="Two editors, one cut." />
        <ul data-reveal-group className="mt-14 grid gap-x-8 gap-y-12 md:grid-cols-2 lg:gap-x-20">
          {profile.team.map((m, i) => (
            <li key={m.name} className={i % 2 ? "md:mt-24" : ""}>
              <div className="relative aspect-portrait overflow-hidden rounded bg-paper">
                {m.photoUrl && (
                  <Img
                    src={m.photoUrl}
                    alt={`Portrait of ${m.name}, ${m.role} at ${profile.brandName}`}
                    fill
                    sizes="(min-width: 1408px) 600px, (min-width: 768px) 44vw, 92vw"
                    className="object-cover"
                  />
                )}
              </div>
              <h3 className="t-h4 mt-5">{m.name}</h3>
              <p className="t-meta mt-1 text-secondary">{m.role}</p>
              {m.bio && <p className="mt-3 max-w-md text-body text-secondary">{m.bio}</p>}
            </li>
          ))}
        </ul>
      </Section>

      <Section id="values" aria-labelledby="values-title">
        <SectionHeader id="values-title" eyebrow="Values & approach" title="How we think in the edit." description={profile.approach} />
        <ul data-reveal-group className="mt-14 grid gap-8 md:grid-cols-3">
          {VALUES.map((value) => (
            <li key={value.title} className="border-t border-ink pt-6">
              <h3 className="t-h4 uppercase stretch-condensed">{value.title}</h3>
              <p className="mt-3 text-body-sm text-secondary">{value.text}</p>
            </li>
          ))}
        </ul>
        {profile.difference && (
          <p data-reveal className="t-prose mt-12">
            {profile.difference}
          </p>
        )}
      </Section>

      {profile.software.length > 0 && (
        <Section id="tools" bleed className="border-t border-line" aria-labelledby="tools-title">
          <SectionHeader id="tools-title" eyebrow="Tools & software" title="What we cut with." />
          <div className="mt-12">
            <SoftwareList software={profile.software} />
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Button href="/contact" variant="accent" arrow>
              Work with us
            </Button>
            <Button href="/services" variant="link" arrow>
              See the services
            </Button>
          </div>
        </Section>
      )}
    </>
  );
}
