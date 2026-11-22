import Link from "next/link";
import { breadcrumbJsonLd, type Crumb } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";

/** Trail at the top of every inner page, with its BreadcrumbList. `items` leaves out Home; the last is this page. */
export default function Breadcrumbs({ items, className = "" }: { items: Crumb[]; className?: string }) {
  const trail = [{ name: "Home", path: "/" }, ...items];
  return (
    <nav aria-label="Breadcrumb" className={`t-meta text-secondary ${className}`}>
      <JsonLd data={breadcrumbJsonLd(trail)} />
      <ol className="flex flex-wrap items-center gap-x-3 gap-y-1">
        {trail.map((crumb, i) => {
          const here = i === trail.length - 1;
          return (
            <li key={crumb.path} className="flex min-h-11 min-w-0 items-center gap-3">
              {i > 0 && <span aria-hidden>/</span>}
              {here ? (
                <span aria-current="page" className="text-ink [overflow-wrap:anywhere]">
                  {crumb.name}
                </span>
              ) : (
                <Link href={crumb.path} prefetch={false} className="link-u inline-flex min-h-11 min-w-11 items-center justify-center hover:text-ink">
                  {crumb.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
