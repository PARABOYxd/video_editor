"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ArrowUpRight, Menu, X } from "lucide-react";
import Logo from "./Logo";

const NAV = [
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
];

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function Header({ name }: { name: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close whenever the route changes (link taps, back/forward).
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const drawer = drawerRef.current;
    const toggle = toggleRef.current;

    // Lock page scroll. overflow on <html> as well covers iOS Safari 16+;
    // the scroll position is kept, so nothing to restore.
    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    root.style.overflow = "hidden";

    drawer?.querySelector<HTMLElement>("[data-autofocus]")?.focus({ preventScroll: true });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return setOpen(false);
      if (e.key !== "Tab" || !drawer) return;
      const items = [...drawer.querySelectorAll<HTMLElement>(FOCUSABLE)];
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    const mq = window.matchMedia("(min-width: 768px)");
    const onBreakpoint = () => mq.matches && setOpen(false);

    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onBreakpoint);
    return () => {
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onBreakpoint);
      root.style.overflow = prevOverflow;
      toggle?.focus({ preventScroll: true });
    };
  }, [open]);

  const close = () => setOpen(false);
  const active = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper">
      <div className="container-site flex h-[72px] items-center justify-between gap-8 md:h-20">
        <Link href="/" aria-label={`${name}, home`} className="-my-1 flex min-h-11 items-center">
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
          ref={toggleRef}
          type="button"
          className="-mr-2.5 flex h-11 w-11 items-center justify-center rounded text-ink transition-colors active:bg-line/60 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label="Open menu"
          onClick={() => setOpen(true)}
        >
          <Menu aria-hidden className="h-6 w-6" strokeWidth={1.75} />
        </button>
      </div>

      {/* Mobile drawer. Rendered always so it can animate; inert while closed. */}
      <div className="md:hidden" inert={!open}>
        <div
          aria-hidden
          onClick={close}
          className={`fixed inset-0 z-50 bg-ink/45 transition-opacity duration-300 ease-out motion-reduce:transition-none ${
            open ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        />

        <div
          ref={drawerRef}
          id="mobile-nav"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className={`fixed inset-y-0 right-0 z-50 flex w-[min(88vw,380px)] flex-col bg-paper shadow-[-12px_0_40px_rgba(23,23,23,0.18)] duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
            // Visibility flips instantly on open (so focus can land) and waits for the slide on close.
            open ? "visible translate-x-0 transition-transform" : "invisible translate-x-full transition-[transform,visibility]"
          }`}
        >
          <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-line pl-6 pr-3">
            <p className="t-meta text-secondary-aa">Menu</p>
            <button
              type="button"
              data-autofocus
              onClick={close}
              aria-label="Close menu"
              className="flex h-11 w-11 items-center justify-center rounded text-ink transition-colors active:bg-line/60"
            >
              <X aria-hidden className="h-6 w-6" strokeWidth={1.75} />
            </button>
          </div>

          <nav aria-label="Mobile" className="flex-1 overflow-y-auto overscroll-contain px-6 py-4">
            <ul>
              {NAV.map((n, i) => {
                const isActive = active(n.href);
                return (
                  <li key={n.href} className="border-b border-line">
                    <Link
                      href={n.href}
                      onClick={close}
                      aria-current={isActive ? "page" : undefined}
                      className={`group flex min-h-16 items-center gap-4 py-3 transition-colors duration-200 ${
                        isActive ? "text-accent" : "text-ink active:text-accent"
                      }`}
                    >
                      <span className={`t-meta w-6 shrink-0 ${isActive ? "text-accent" : "text-secondary-aa"}`}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="flex-1 font-display text-[26px] font-semibold uppercase leading-none [font-stretch:88%]">
                        {n.label}
                      </span>
                      {isActive ? (
                        <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      ) : (
                        <ArrowUpRight
                          aria-hidden
                          className="h-5 w-5 shrink-0 text-secondary-aa transition-transform duration-200 group-active:-translate-y-0.5 group-active:translate-x-0.5"
                          strokeWidth={1.5}
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="shrink-0 border-t border-line px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-5">
            <p className="mb-3 text-[14px] text-secondary-aa">Have a project in mind?</p>
            <Link href="/contact" onClick={close} className="btn btn-accent w-full">
              Let&apos;s Talk <ArrowRight aria-hidden className="h-4 w-4" strokeWidth={2} />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
