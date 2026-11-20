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

// 44px tall rows on touch screens; compact on desktop where a pointer is precise.
const linkCls = "inline-flex min-h-11 items-center md:min-h-9";

export default function Footer({ profile }: { profile: Profile }) {
  return (
    <footer className="border-t border-line">
      <div className="container-site grid-12 gap-y-10 py-16">
        <div className="col-span-12 md:col-span-5">
          <Logo size="lg" />
          <p className="mt-3 max-w-sm text-[15px] text-secondary-aa">{profile.footerBlurb}</p>
          {/* On phones the email gets its own row so it never breaks mid-word. */}
          {profile.email && (
            <a href={`mailto:${profile.email}`} className={`${linkCls} mt-4 text-[16px] font-medium md:hidden`}>
              <span className="link-u">{profile.email}</span>
            </a>
          )}
        </div>

        <nav aria-label="Footer" className="col-span-6 md:col-span-2 md:col-start-7">
          <p className="t-meta text-secondary-aa">Pages</p>
          <ul className="mt-2 text-[15px] md:mt-3">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className={linkCls}><span className="link-u">{n.label}</span></Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="col-span-6 md:col-span-3 md:col-start-10">
          <p className="t-meta text-secondary-aa">Contact</p>
          <ul className="mt-2 text-[15px] md:mt-3">
            {profile.email && (
              <li className="hidden md:block">
                <a href={`mailto:${profile.email}`} className={linkCls}><span className="link-u break-all">{profile.email}</span></a>
              </li>
            )}
            {profile.whatsapp && (
              <li>
                <a href={`https://wa.me/${profile.whatsapp}`} target="_blank" rel="noopener noreferrer" className={linkCls}><span className="link-u">WhatsApp</span></a>
              </li>
            )}
            {profile.socials.map((s) => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="noopener noreferrer" className={linkCls}><span className="link-u">{s.label}</span></a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="container-site">
        <div className="flex flex-col gap-1 border-t border-line py-5 text-[13px] text-secondary-aa sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {profile.brandName}</p>
          <a href="#top" className="t-meta -my-1 inline-flex min-h-11 items-center self-start sm:self-auto">
            <span className="link-u">Back to top ↑</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
