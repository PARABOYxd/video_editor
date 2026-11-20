import Link from "next/link";
import type { Profile } from "@/lib/types";
import Logo from "./Logo";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
];

export default function Footer({ profile }: { profile: Profile }) {
  return (
    <footer className="border-t border-line">
      <div className="container-site grid-12 gap-y-10 py-16">
        <div className="col-span-12 md:col-span-5">
          <Logo size="lg" />
          <p className="mt-3 max-w-sm text-[15px] text-secondary-aa">{profile.footerBlurb}</p>
        </div>

        <nav aria-label="Footer" className="col-span-6 md:col-span-2 md:col-start-7">
          <p className="t-meta text-secondary-aa">Pages</p>
          <ul className="mt-4 space-y-2 text-[15px]">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="link-u">{n.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="col-span-6 md:col-span-3 md:col-start-10">
          <p className="t-meta text-secondary-aa">Contact</p>
          <ul className="mt-4 space-y-2 text-[15px]">
            {profile.email && (
              <li>
                <a href={`mailto:${profile.email}`} className="link-u break-all">{profile.email}</a>
              </li>
            )}
            {profile.whatsapp && (
              <li>
                <a href={`https://wa.me/${profile.whatsapp}`} target="_blank" rel="noopener noreferrer" className="link-u">WhatsApp</a>
              </li>
            )}
            {profile.socials.map((s) => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="link-u">{s.label}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="container-site">
        <div className="flex flex-col gap-2 border-t border-line py-6 text-[13px] text-secondary-aa sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {profile.brandName}</p>
          <a href="#top" className="t-meta link-u">Back to top ↑</a>
        </div>
      </div>
    </footer>
  );
}
