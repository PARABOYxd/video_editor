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
    const mq = window.matchMedia("(min-width: 768px)");
    const onResize = () => mq.matches && setOpen(false);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onResize);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onResize);
    };
  }, [open]);

  const close = () => setOpen(false);

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
          className="-mr-2 flex h-11 items-center gap-3 px-2 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="t-meta relative inline-grid overflow-hidden text-right">
            <span
              className={`col-start-1 row-start-1 transition-transform duration-300 ease-out motion-reduce:transition-none ${open ? "-translate-y-full" : "translate-y-0"}`}
            >
              Menu
            </span>
            <span
              className={`col-start-1 row-start-1 transition-transform duration-300 ease-out motion-reduce:transition-none ${open ? "translate-y-0" : "translate-y-full"}`}
            >
              Close
            </span>
          </span>
          <span aria-hidden className="relative block h-3 w-6">
            <span
              className={`absolute left-0 h-[1.5px] w-full bg-ink transition-all duration-300 ease-out motion-reduce:transition-none ${open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0"}`}
            />
            <span
              className={`absolute left-0 h-[1.5px] bg-ink transition-all duration-300 ease-out motion-reduce:transition-none ${open ? "top-1/2 w-full -translate-y-1/2 -rotate-45" : "bottom-0 w-2/3"}`}
            />
          </span>
        </button>
      </div>

      <nav
        id="mobile-nav"
        aria-label="Mobile"
        aria-hidden={!open}
        inert={!open}
        className={`fixed inset-x-0 bottom-0 top-[72px] z-30 flex flex-col overflow-y-auto border-t border-line bg-paper transition-[opacity,transform,visibility] duration-300 ease-out motion-reduce:transition-none md:hidden ${
          open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0"
        }`}
      >
        <ul className="container-site flex-1 pt-4">
          {NAV.map((n, i) => {
            const isActive = active(n.href);
            return (
              <li
                key={n.href}
                className={`border-b border-line transition-[opacity,transform] duration-500 ease-out motion-reduce:transition-none ${
                  open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                }`}
                style={{ transitionDelay: open ? `${80 + i * 50}ms` : "0ms" }}
              >
                <Link
                  href={n.href}
                  onClick={close}
                  aria-current={isActive ? "page" : undefined}
                  className={`group flex min-h-[68px] items-center justify-between font-display text-[30px] font-semibold uppercase leading-none [font-stretch:88%] transition-colors duration-200 ${
                    isActive ? "text-accent" : "text-ink active:text-accent"
                  }`}
                >
                  <span className="flex items-baseline gap-4">
                    <span className="t-meta w-6 font-sans text-secondary-aa">{String(i + 1).padStart(2, "0")}</span>
                    {n.label}
                  </span>
                  <span
                    aria-hidden
                    className={`text-xl transition-transform duration-200 group-active:translate-x-1 ${isActive ? "text-accent" : "text-secondary-aa"}`}
                  >
                    →
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div
          className={`container-site pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-8 transition-[opacity,transform] duration-500 ease-out motion-reduce:transition-none ${
            open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
          }`}
          style={{ transitionDelay: open ? `${80 + NAV.length * 50}ms` : "0ms" }}
        >
          <p className="t-meta mb-4 text-secondary-aa">Have a project in mind?</p>
          <Link href="/contact" onClick={close} className="btn btn-accent w-full">
            Let&apos;s Talk <span className="arrow" aria-hidden>→</span>
          </Link>
        </div>
      </nav>
    </header>
  );
}
