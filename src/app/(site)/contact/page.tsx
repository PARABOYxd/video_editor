import ContactDetails from "@/components/contact/ContactDetails";
import ContactForm from "@/components/contact/ContactForm";
import SectionHeading from "@/components/layout/SectionHeading";
import { getProfile } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata() {
  const profile = await getProfile();
  return pageMetadata({
    title: "Contact",
    description: `Start a project with ${profile.shortName}: send a short brief, or reach us on WhatsApp, email or Instagram.`,
    path: "/contact",
  });
}

export default async function ContactPage({ searchParams }: PageProps<"/contact">) {
  const [profile, sp] = await Promise.all([getProfile(), searchParams]);
  const type = typeof sp.type === "string" ? sp.type : "";

  return (
    <div className="container-site pb-24 pt-12 md:pb-32 md:pt-20">
      <SectionHeading as="h1" label="Contact" title={<>Let&apos;s make something <em className="t-italic">great</em>.</>} />

      <div className="grid-12 mt-14 gap-y-14 md:mt-20">
        <div className="col-span-12 lg:col-span-7">
          <ContactForm defaultType={type} />
        </div>
        <aside className="col-span-12 lg:col-span-4 lg:col-start-9">
          <p className="t-lead mb-8 text-secondary-aa">Prefer to talk directly? Reach us here.</p>
          <ContactDetails profile={profile} />
        </aside>
      </div>
    </div>
  );
}
