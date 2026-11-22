"use client";

import { usePathname } from "next/navigation";

/** Lets the layout leave out a block on one page (the closing CTA on /contact). */
export default function HideOnPath({ path, children }: { path: string; children: React.ReactNode }) {
  return usePathname() === path ? null : children;
}
