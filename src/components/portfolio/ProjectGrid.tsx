"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Category, Project } from "@/lib/types";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

// Never more columns than items, so a short list doesn't leave a hole.
const COLUMNS = ["", "max-w-3xl", "md:columns-2", "md:columns-2 lg:columns-3"];
const STAGGER = 50;

type GridProps = {
  projects: Pick<Project, "id" | "categorySlug">[];
  categories: Category[];
  cards: Record<number, React.ReactNode>;
  comingSoon?: React.ReactNode;
};

/**
 * Work page filters + masonry. The filter lives in ?category= and changes
 * without a round trip. /work is static, so on a shared filtered link a small
 * script in the root layout shows the skeleton until the filter is applied.
 */
export default function ProjectGrid(props: GridProps) {
  const params = useSearchParams();
  const current = params.get("category") ?? "all";
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    document.documentElement.removeAttribute("data-filter-pending");
  }, []);

  const select = (slug: string) => {
    const q = new URLSearchParams(params.toString());
    if (slug === "all") q.delete("category");
    else q.set("category", slug);
    setTouched(true);
    // Next keeps useSearchParams in sync with the History API.
    window.history.replaceState(null, "", `${window.location.pathname}${q.size ? `?${q}` : ""}`);
  };

  return <GridView {...props} current={current} animate={touched} select={select} />;
}

/** What's in the static HTML: every project, plus the skeleton for filtered deep links. */
export function ProjectGridFallback(props: GridProps) {
  return (
    <>
      <div data-grid-full>
        <GridView {...props} current="all" animate={false} select={() => {}} />
      </div>
      <div data-grid-skeleton aria-hidden className="min-h-screen">
        <div className="skeleton h-19" />
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i}>
              <div className="skeleton aspect-video" />
              <div className="skeleton mt-5 h-6 w-3/4" />
              <div className="skeleton mt-3 h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function GridView({
  projects,
  categories,
  cards,
  comingSoon,
  current,
  animate,
  select,
}: GridProps & { current: string; animate: boolean; select: (slug: string) => void }) {
  const visible = current === "all" ? projects : projects.filter((p) => p.categorySlug === current);
  const label = categories.find((c) => c.slug === current)?.name;
  const withSoon = Boolean(comingSoon) && current === "all";
  const items = visible.length + (withSoon ? 1 : 0);

  const options = [
    { slug: "all", name: "All", count: projects.length },
    ...categories.map((c) => ({ slug: c.slug, name: c.name, count: projects.filter((p) => p.categorySlug === c.slug).length })),
  ];
  const showFilters = categories.length > 1 || current !== "all";

  return (
    <>
      {showFilters && (
        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4 border-y border-line py-4">
          <div role="group" aria-label="Filter projects by category" className="-mx-1 flex min-w-0 flex-wrap gap-1">
            {options.map((c) => {
              const on = current === c.slug;
              return (
                <button
                  key={c.slug}
                  type="button"
                  data-filter={c.slug}
                  onClick={() => select(c.slug)}
                  aria-pressed={on}
                  className={`inline-flex min-h-11 min-w-11 items-center gap-2 rounded px-3 text-small transition-colors duration-base ${
                    on ? "bg-ink text-on-dark" : "text-secondary hover:text-ink"
                  }`}
                >
                  {c.name} <span className={`font-mono text-caption ${on ? "text-on-dark/75" : ""}`}>{c.count}</span>
                </button>
              );
            })}
          </div>
          <p className="t-meta text-secondary" aria-live="polite">
            {String(visible.length).padStart(2, "0")} {visible.length === 1 ? "project" : "projects"}
          </p>
        </div>
      )}

      {visible.length ? (
        // Keyed by filter, so the items animate in on every change.
        <ul key={current} data-work-grid className={`mt-12 gap-8 ${COLUMNS[Math.min(items, 3)]}`}>
          {visible.map((p, i) => (
            <li key={p.id} className={`${animate ? "filter-item" : ""} mb-14 break-inside-avoid`} style={{ animationDelay: `${Math.min(i, 6) * STAGGER}ms` }}>
              {cards[p.id]}
            </li>
          ))}
          {withSoon && <li className="mb-14 break-inside-avoid">{comingSoon}</li>}
        </ul>
      ) : (
        <Card padding="none" className="mt-12 px-6 py-16 text-center">
          <p className="t-h4">Nothing in {label ?? "this category"} yet.</p>
          <p className="mt-2 text-body-sm text-secondary">See everything else, or ask us about a project like this.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button variant="secondary" onClick={() => select("all")}>
              See all work
            </Button>
            <Button href="/contact">Ask about this</Button>
          </div>
        </Card>
      )}
    </>
  );
}
