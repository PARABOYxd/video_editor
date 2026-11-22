"use client";

import { useState } from "react";
import Image from "next/image";
import { Pause, Play } from "lucide-react";
import type { ClientLogo } from "@/config/content";

/**
 * Auto-scrolling logos. Pauses on hover and focus, and has a pause button
 * (WCAG 2.2.2). With reduced motion it is a static, wrapped row.
 */
export default function LogoMarquee({ logos }: { logos: ClientLogo[] }) {
  const [paused, setPaused] = useState(false);
  // Enough copies that one half is always wider than the screen.
  const repeat = Math.max(1, Math.ceil(12 / logos.length));
  const half = Array.from({ length: repeat }, () => logos).flat();

  const row = (copy: boolean) => (
    <ul className="marquee-row" aria-hidden={copy || undefined}>
      {half.map((logo, i) => {
        const extra = copy || i >= logos.length;
        return (
          <li key={i} className={extra ? "marquee-extra" : undefined} aria-hidden={extra || undefined}>
            <Image
              src={logo.logo}
              alt={extra ? "" : logo.name}
              width={logo.width}
              height={logo.height}
              unoptimized={logo.logo.endsWith(".svg")}
              className="h-8 w-auto opacity-75"
            />
          </li>
        );
      })}
    </ul>
  );

  return (
    <div className="mt-10 flex items-center gap-2 pr-2 first:mt-0">
      <div className="marquee" data-paused={paused || undefined}>
        <div className="marquee-track">
          {row(false)}
          {row(true)}
        </div>
      </div>
      <button
        type="button"
        onClick={() => setPaused((p) => !p)}
        aria-label={paused ? "Play the logo scroller" : "Pause the logo scroller"}
        className="grid h-11 w-11 shrink-0 place-items-center rounded text-secondary hover:text-ink motion-reduce:hidden"
      >
        {paused ? <Play aria-hidden className="h-4 w-4" /> : <Pause aria-hidden className="h-4 w-4" />}
      </button>
    </div>
  );
}
