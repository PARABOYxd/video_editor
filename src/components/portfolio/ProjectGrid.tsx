"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Category, Project } from "@/lib/types";

/**
 * Work page filters + grid. The filter lives in ?category= so a filtered
 * view can be shared and survives reload. Cards are rendered on the server
 * and passed in; filtering only chooses which ones to show.
 */
export default function ProjectGrid({
  projects,
  categories,
  cards,
}: {
  projects: Pick<Project, "id" | "categorySlug">[];
  categories: Category[];
  cards: Record<number, React.ReactNode>;
}) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const current = params.get("category") ?? "all";
  const visible = current === "all" ? projects : projects.filter((p) => p.categorySlug === current);
  const label = categories.find((c) => c.slug === current)?.name;

  const select = (slug: string) => {
    const q = new URLSearchParams(params.toString());
    if (slug === "all") q.delete("category");
    else q.set("category", slug);
    router.replace(`${pathname}${q.size ? `?${q}` : ""}`, { scroll: false });
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4 border-y border-line py-4">
        <div role="group" aria-label="Filter projects by category" className="-mx-1 flex flex-wrap gap-1">
          {[{ slug: "all", name: "All" }, ...categories].map((c) => {
            const on = current === c.slug;
            return (
              <button
                key={c.slug}
                type="button"
                onClick={() => select(c.slug)}
                aria-pressed={on}
                className={`min-h-11 rounded px-3 text-[14px] transition-colors duration-200 ${
                  on ? "bg-ink text-white" : "text-secondary-aa hover:text-ink"
                }`}
              >
                {c.name}
              </button>
            );
          })}
        </div>
        <p className="t-meta text-secondary-aa" aria-live="polite">
          {String(visible.length).padStart(2, "0")} {visible.length === 1 ? "project" : "projects"}
        </p>
      </div>

      {visible.length ? (
        <ul className="mt-12 grid gap-x-8 gap-y-16 md:grid-cols-2 md:gap-y-20">
          {visible.map((p) => (
            <li key={p.id}>{cards[p.id]}</li>
          ))}
        </ul>
      ) : (
        <div className="mt-12 rounded border border-line bg-surface px-6 py-16 text-center">
          <p className="t-project">Nothing in {label ?? "this category"} yet.</p>
          <p className="mt-2 text-[15px] text-secondary-aa">See everything else, or ask us about a project like this.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button type="button" onClick={() => select("all")} className="btn btn-outline">See all work</button>
            <Link href="/contact" className="btn btn-primary">Ask about this kind of project</Link>
          </div>
        </div>
      )}
    </>
  );
}
