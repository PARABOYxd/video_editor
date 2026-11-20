import Link from "next/link";
import type { Profile } from "@/lib/types";

/** Closing call to action, shared by most pages. */
export default function ContactCTA({ profile, title = "Have something in mind?" }: { profile: Profile; title?: string }) {
  return (
    <section className="container-site section" aria-labelledby="cta-title">
      <div className="grid-12 gap-y-10">
        <h2 id="cta-title" className="t-hero col-span-12 lg:col-span-9">
          {title}
        </h2>
        <div className="col-span-12 md:col-span-6 lg:col-span-5">
          <p className="t-lead text-secondary-aa">Tell us about your next project. Let&apos;s make something worth watching.</p>
          <Link href="/contact" className="btn btn-accent mt-8">
            Start a project <span className="arrow" aria-hidden>→</span>
          </Link>
        </div>
        <ul className="col-span-12 space-y-6 self-end text-[16px] md:col-span-5 md:col-start-8 md:text-right">
          {profile.email && (
            <li>
              <a href={`mailto:${profile.email}`} className="tap-target link-u [overflow-wrap:anywhere]">{profile.email}</a>
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
    </section>
  );
}
