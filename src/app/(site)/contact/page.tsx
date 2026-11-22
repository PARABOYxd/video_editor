import { Clock } from "lucide-react";
import { RESPONSE_TIME } from "@/config/content";
import { LOCATION } from "@/config/location";
import ContactDetails from "@/components/contact/ContactDetails";
import ContactForm from "@/components/contact/ContactForm";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import { getProfile } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata() {
  const profile = await getProfile();
  return pageMetadata({
    title: "Hire a Video Editor in Pune, India",
    description: `Hire a video editor in Pune, India. Send ${profile.brandName} a brief for YouTube, Reels or a brand film and get a quote, or reach us on WhatsApp and email.`,
    path: "/contact",
    og: "contact",
  });
}

export default async function ContactPage({ searchParams }: PageProps<"/contact">) {
  const [profile, sp] = await Promise.all([getProfile(), searchParams]);
  const type = typeof sp.type === "string" ? sp.type : "";

  return (
    <Container className="pb-page-bottom pt-6">
      <Breadcrumbs items={[{ name: "Contact", path: "/contact" }]} />
      <div className="mt-8">
        <SectionHeader
          as="h1"
          eyebrow="Contact"
          title={
            <>
              Let&apos;s make something <em className="t-italic">great</em>.
            </>
          }
        />
      </div>

      <div className="grid-12 mt-block gap-y-14">
        <div className="col-span-12 lg:col-span-7">
          <ContactForm defaultType={type} />
        </div>
        <aside aria-labelledby="direct-title" className="col-span-12 lg:col-span-4 lg:col-start-9">
          <h2 id="direct-title" className="t-h4">
            Prefer to talk directly?
          </h2>
          <p className="mb-8 mt-3 text-body text-secondary">We&apos;re based in {LOCATION.city}. Reach us here.</p>
          <ContactDetails profile={profile} />
          <div data-response-time className="mt-6 flex items-start gap-3 rounded border border-line bg-surface p-4">
            <Clock aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
            <p className="text-body-sm">
              <span className="t-meta block text-secondary">Response time</span>
              {RESPONSE_TIME ?? "Every brief gets a personal reply, as soon as we've read it."}
            </p>
          </div>
        </aside>
      </div>
    </Container>
  );
}
