import type { Profile } from "@/lib/types";
import Button from "@/components/ui/Button";
import Eyebrow from "@/components/ui/Eyebrow";
import Section from "@/components/ui/Section";

/** The large band above the footer on every page except /contact. */
export default function ClosingCTA({ profile }: { profile: Profile }) {
  return (
    <Section bleed data-tone="dark" data-closing-cta className="bg-media text-on-dark" aria-labelledby="cta-title">
      <div data-reveal-group className="grid-12 gap-y-10">
        <div className="col-span-12 lg:col-span-10">
          <Eyebrow tone="dark">Your footage, our cut</Eyebrow>
          <h2 id="cta-title" className="t-display mt-6 max-w-headline">
            Have a project <em className="t-italic">in mind?</em>
          </h2>
        </div>
        <div className="col-span-12 md:col-span-6 lg:col-span-5">
          <p className="t-quote">Send a short brief.</p>
          <p className="t-lead mt-3 text-muted">We&apos;ll come back with questions, a timeline and a quote. Let&apos;s make something worth watching.</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button href="/contact" variant="light" size="lg" arrow>
              Start a project
            </Button>
          </div>
        </div>
        <ul className="col-span-12 space-y-6 self-end text-body md:col-span-6 md:text-right lg:col-span-5 lg:col-start-8">
          {profile.email && (
            <li>
              <a href={`mailto:${profile.email}`} className="tap-target link-u [overflow-wrap:anywhere]">
                {profile.email}
              </a>
            </li>
          )}
          {profile.whatsapp && (
            <li>
              <a href={`https://wa.me/${profile.whatsapp}`} target="_blank" rel="noopener noreferrer" className="tap-target link-u">
                WhatsApp {profile.phone}
              </a>
            </li>
          )}
        </ul>
      </div>
    </Section>
  );
}
