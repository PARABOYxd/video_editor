"use client";

import { useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { REDUCED_MOTION, duration, easing } from "./tokens";

/**
 * A short fade of the new page on client navigation. Opacity only: nothing
 * moves (no layout shift), clicks are never blocked, and the first load isn't
 * animated, so it can't delay LCP.
 */
export default function PageTransition() {
  const pathname = usePathname();
  const previous = useRef(pathname);

  useLayoutEffect(() => {
    if (previous.current === pathname) return;
    previous.current = pathname;
    if (window.matchMedia(REDUCED_MOTION).matches) return;
    document.getElementById("main")?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: duration("slow"), easing: easing(), id: "page-transition" });
  }, [pathname]);

  return null;
}
