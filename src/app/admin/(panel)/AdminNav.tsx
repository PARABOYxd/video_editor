"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Badge from "@/components/ui/Badge";

const LINKS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/about", label: "About & showreel" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/testimonials", label: "Testimonials" },
  { href: "/admin/inquiries", label: "Inquiries" },
];

export default function AdminNav({ unread }: { unread: number }) {
  const path = usePathname();
  const active = (href: string) => (href === "/admin" ? path === href : path.startsWith(href));
  return (
    <nav aria-label="Admin" className="flex gap-1 overflow-x-auto md:flex-col">
      {LINKS.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          aria-current={active(l.href) ? "page" : undefined}
          className={`flex min-h-10 shrink-0 items-center justify-between gap-3 rounded px-3 text-small ${
            active(l.href) ? "bg-ink text-on-dark" : "text-ink hover:bg-paper"
          }`}
        >
          {l.label}
          {l.href === "/admin/inquiries" && unread > 0 && (
            <Badge variant="accent" className="!py-0">{unread}</Badge>
          )}
        </Link>
      ))}
    </nav>
  );
}
