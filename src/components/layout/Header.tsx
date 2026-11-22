"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ArrowUpRight, Menu, X } from "lucide-react";
import Logo from "./Logo";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";

const NAV = [
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
];

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
/** Scroll this far in one direction before the header reacts, so jitter doesn't flicker it. */
const SCROLL_DELTA = 8;
const STAGGER_START = 120;
const STAGGER_STEP = 60;

function HomeLink({ onClick }: { onClick?: () => void }) {
  // Read once, as "Rytora Studio home": the wordmark itself is aria-hidden.
  return (
    <Link href="/" onClick={onClick} className="-my-1 flex min-h-11 items-center">
      <Logo />
      <span className="sr-only"> home</span>
    </Link>
  );
}

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // On every route change (link taps, back/forward): close the menu, show the header.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
    setHidden(false);
  }

  // Hide on scroll down, reveal on scroll up.
  useEffect(() => {
    let last = window.scrollY;
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const y = Math.max(0, Math.min(window.scrollY, max)); // ignores iOS rubber-banding
      setScrolled(y > 4);
      const height = headerRef.current?.offsetHeight ?? 0;
      if (y <= height) setHidden(false);
      else if (Math.abs(y - last) < SCROLL_DELTA) return;
      else setHidden(y > last);
      last = y;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    return () => {
      window.removeEventListener("scroll", schedule);
      cancelAnimationFrame(frame);
    };
  }, []);

  // While the menu is open: lock scroll, make the page inert, trap focus.
  useEffect(() => {
    if (!open) return;
    const menu = menuRef.current;
    const toggle = toggleRef.current;
    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    const behind = [...document.querySelectorAll<HTMLElement>("[data-behind-menu]")];
    behind.forEach((el) => (el.inert = true));

    menu?.querySelector<HTMLElement>("[data-autofocus]")?.focus({ preventScroll: true });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return setOpen(false);
      if (e.key !== "Tab" || !menu) return;
      const items = [...menu.querySelectorAll<HTMLElement>(FOCUSABLE)];
      const first = items[0];
      const last = items[items.length - 1];
      const at = document.activeElement;
      // Also catches focus that fell to <body>, e.g. after tapping empty space.
      if (!menu.contains(at)) {
        e.preventDefault();
        (e.shiftKey ? last : first)?.focus();
      } else if (e.shiftKey && at === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && at === last) {
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
      behind.forEach((el) => (el.inert = false)); // before focusing: inert elements can't take focus
      root.style.overflow = prevOverflow;
      toggle?.focus({ preventScroll: true });
    };
  }, [open]);

  const close = () => setOpen(false);
  const active = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const entering = (i: number) => ({ transitionDelay: open ? `${STAGGER_START + i * STAGGER_STEP}ms` : "0ms" });
  const entrance = `transition-[opacity,translate] duration-slower ease-out-soft ${open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`;

  return (
    <>
      <header
        ref={headerRef}
        data-behind-menu
        data-site-header
        data-hidden={hidden || undefined}
        data-scrolled={scrolled || undefined}
        onFocus={() => setHidden(false)}
        className={`sticky top-0 z-header border-b transition-[translate,background-color,border-color] duration-slow ease-out-soft ${
          hidden ? "-translate-y-full" : "translate-y-0"
        } ${scrolled ? "border-line bg-paper/90 backdrop-blur-md" : "border-transparent bg-paper"}`}
      >
        <Container className="flex h-header items-center justify-between gap-8 md:h-header-lg">
          <HomeLink />

          <nav aria-label="Main" className="hidden items-center gap-6 md:flex lg:gap-10">
            <ul className="flex items-center gap-5 lg:gap-8">
              {NAV.map((n) => {
                const isActive = active(n.href);
                return (
                  <li key={n.href}>
                    <Link
                      href={n.href}
                      aria-current={isActive ? "page" : undefined}
                      // Over a scrolled page the bar is translucent, so the text goes darker to stay AA.
                      className={`group relative inline-flex min-h-11 min-w-11 items-center justify-center text-body-sm transition-colors duration-base ${
                        isActive || scrolled ? "text-ink" : "text-secondary hover:text-ink"
                      }`}
                    >
                      {n.label}
                      <span
                        aria-hidden
                        data-underline
                        className={`absolute inset-x-0 bottom-1.5 h-px bg-accent transition-transform duration-slow ease-out-soft ${
                          isActive
                            ? "scale-x-100"
                            : "origin-right scale-x-0 group-hover:origin-left group-hover:scale-x-100 group-focus-visible:origin-left group-focus-visible:scale-x-100"
                        }`}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
            <Link
              href="/contact"
              className={`group inline-flex min-h-11 items-center gap-2 text-body-sm font-medium transition-colors duration-base hover:text-accent-hover ${
                scrolled ? "text-accent-hover" : "text-accent"
              }`}
            >
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
        </Container>
      </header>

      {/* Outside <header>: its transform and blur would trap a fixed child. Always rendered so it can animate. */}
      <div
        ref={menuRef}
        id="mobile-nav"
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        inert={!open}
        className={`fixed inset-0 z-overlay flex flex-col bg-paper duration-slow ease-out-soft md:hidden ${
          // Visibility flips instantly on open (so focus can land) and waits for the fade on close.
          open ? "visible opacity-100 transition-opacity" : "invisible opacity-0 transition-[opacity,visibility]"
        }`}
      >
        <div className="shrink-0 border-b border-line">
          <Container className="flex h-header items-center justify-between gap-8">
            <HomeLink onClick={close} />
            <button
              type="button"
              data-autofocus
              onClick={close}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label="Close menu"
              className="-mr-2.5 flex h-11 w-11 items-center justify-center rounded text-ink transition-colors active:bg-line/60"
            >
              <X aria-hidden className="h-6 w-6" strokeWidth={1.75} />
            </button>
          </Container>
        </div>

        <nav aria-label="Mobile" className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <Container as="ul" className="flex min-h-full flex-col justify-center py-4">
            {NAV.map((n, i) => {
              const isActive = active(n.href);
              return (
                <li key={n.href} data-menu-item style={entering(i)} className={`border-b border-line last:border-0 ${entrance}`}>
                  <Link
                    href={n.href}
                    onClick={close}
                    aria-current={isActive ? "page" : undefined}
                    className={`group flex min-h-16 items-center gap-4 py-3 -outline-offset-2 transition-colors duration-base ${
                      isActive ? "text-accent" : "text-ink active:text-accent"
                    }`}
                  >
                    <span className={`t-meta w-6 shrink-0 ${isActive ? "text-accent" : "text-secondary"}`}>{String(i + 1).padStart(2, "0")}</span>
                    <span className="t-h2 flex-1">{n.label}</span>
                    {isActive ? (
                      <span aria-hidden className="h-2 w-2 shrink-0 rounded-full bg-accent" />
                    ) : (
                      <ArrowUpRight
                        aria-hidden
                        className="h-6 w-6 shrink-0 text-secondary transition-transform duration-base group-active:-translate-y-0.5 group-active:translate-x-0.5"
                        strokeWidth={1.5}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </Container>
        </nav>

        <div className="shrink-0 border-t border-line pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-5">
          <Container>
            <div style={entering(NAV.length)} className={entrance}>
              <p className="mb-3 text-small text-secondary">Have a project in mind?</p>
              <Button
                href="/contact"
                onClick={close}
                variant="accent"
                iconPosition="end"
                icon={<ArrowRight aria-hidden className="h-4 w-4" strokeWidth={2} />}
                className="w-full"
              >
                Let&apos;s Talk
              </Button>
            </div>
          </Container>
        </div>
      </div>
    </>
  );
}
