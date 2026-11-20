"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";

const NAV = [
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
];

export default function Header({ name }: { name: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const active = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper">
      <div className="container-site flex h-[72px] items-center justify-between gap-8 md:h-20">
        <Link href="/" aria-label={`${name}, home`}>
          <Logo />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-10 md:flex">
          <ul className="flex items-center gap-8">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  aria-current={active(n.href) ? "page" : undefined}
                  className={`relative py-2 text-[15px] transition-colors duration-200 ${active(n.href) ? "text-ink" : "text-secondary-aa hover:text-ink"}`}
                >
                  {n.label}
                  {active(n.href) && <span aria-hidden className="absolute -bottom-0.5 left-0 h-px w-full bg-accent" />}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/contact" className="group inline-flex items-center gap-2 text-[15px] font-medium text-accent hover:text-accent-hover">
            Let&apos;s Talk <span className="arrow" aria-hidden>→</span>
          </Link>
        </nav>

        <button
          type="button"
          className="t-meta -mr-2 flex h-11 items-center px-2 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="border-t border-line bg-paper md:hidden">
          <ul className="container-site py-2">
            {NAV.map((n, i) => (
              <li key={n.href} className="border-b border-line last:border-0">
                <Link
                  href={n.href}
                  aria-current={active(n.href) ? "page" : undefined}
                  className="flex min-h-14 items-center justify-between font-display text-[22px] font-semibold uppercase [font-stretch:88%]"
                >
                  {n.label}
                  <span className="t-meta text-secondary-aa">{String(i + 1).padStart(2, "0")}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="container-site pb-6">
            <Link href="/contact" className="btn btn-accent w-full">
              Let&apos;s Talk <span className="arrow" aria-hidden>→</span>
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
