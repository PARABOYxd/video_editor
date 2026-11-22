import Link from "next/link";
import { LOCATION } from "@/config/location";
import { slugify } from "@/lib/db";
import type { Profile, Service } from "@/lib/types";
import Container from "@/components/ui/Container";
import BackToTop from "./BackToTop";
import Logo from "./Logo";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
];

// 44px tall rows on touch screens; compact on desktop where a pointer is precise.
const LINK = "inline-flex min-h-11 min-w-11 items-center lg:min-h-9";

function Column({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <p className="t-meta text-secondary">{title}</p>
      <ul className="mt-2 text-body-sm lg:mt-3">{children}</ul>
    </>
  );
}

export default function Footer({ profile, services }: { profile: Profile; services: Service[] }) {
  return (
    <footer data-behind-menu className="border-t border-line">
      <Container className="grid-12 gap-y-10 py-16">
        <div className="col-span-12 lg:col-span-4">
          <Logo size="lg" />
          <p className="mt-3 max-w-sm text-body-sm text-secondary">{profile.footerBlurb}</p>
          <p className="t-meta mt-4 text-secondary">
            {LOCATION.city}, {LOCATION.country}
          </p>
        </div>

        <nav aria-label="Footer" className="col-span-5 md:col-span-3 lg:col-span-2">
          <Column title="Pages">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} prefetch={false} className={LINK}>
                  <span className="link-u">{n.label}</span>
                </Link>
              </li>
            ))}
          </Column>
        </nav>

        <nav aria-label="Services" className="col-span-7 md:col-span-4 lg:col-span-3">
          <Column title="Services">
            {services.map((s) => (
              <li key={s.id}>
                <Link href={`/services#${slugify(s.title)}`} prefetch={false} className={LINK}>
                  <span className="link-u">{s.title}</span>
                </Link>
              </li>
            ))}
          </Column>
        </nav>

        {/* Full width on phones, so the email never breaks mid-word. */}
        <div className="col-span-12 md:col-span-5 lg:col-span-3">
          <Column title="Contact & social">
            {profile.email && (
              <li>
                <a href={`mailto:${profile.email}`} className={LINK}>
                  <span className="link-u [overflow-wrap:anywhere]">{profile.email}</span>
                </a>
              </li>
            )}
            {profile.whatsapp && (
              <li>
                <a href={`https://wa.me/${profile.whatsapp}`} target="_blank" rel="noopener noreferrer" className={LINK}>
                  <span className="link-u">WhatsApp</span>
                </a>
              </li>
            )}
            {profile.socials.map((s) => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="noopener noreferrer" className={LINK}>
                  <span className="link-u">{s.label}</span>
                </a>
              </li>
            ))}
          </Column>
        </div>
      </Container>

      <Container>
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line py-5 text-label text-secondary">
          <p>
            © {new Date().getFullYear()} {profile.brandName}
          </p>
          <BackToTop />
        </div>
      </Container>
    </footer>
  );
}
