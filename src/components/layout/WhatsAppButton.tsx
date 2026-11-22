"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";

const COVERED = "[data-hide-fab], [data-closing-cta], footer";

/** Floating contact button, phones only. Steps aside over the form, closing CTA and footer. */
export default function WhatsAppButton({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const [covered, setCovered] = useState(false);

  useEffect(() => {
    const seen = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) seen.add(e.target);
        else seen.delete(e.target);
      }
      setCovered(seen.size > 0);
    });
    document.querySelectorAll(COVERED).forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  return (
    <aside aria-label="Quick contact" className="md:hidden">
      <a
        href={href}
        data-behind-menu
        data-fab
        aria-label={label}
        {...(href.startsWith("http") && { target: "_blank", rel: "noopener noreferrer" })}
        className={`fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-float grid h-14 w-14 place-items-center rounded-full bg-accent text-on-dark shadow-float transition-[opacity,visibility] duration-base md:hidden ${
          covered ? "invisible opacity-0" : "visible opacity-100"
        }`}
      >
        <MessageCircle aria-hidden className="h-6 w-6" />
      </a>
    </aside>
  );
}
