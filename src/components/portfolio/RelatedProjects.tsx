import Link from "next/link";
import ProjectCard from "./ProjectCard";
import type { Project } from "@/lib/types";

/** Two related projects (same category first), then a large "next project" link. */
export default function RelatedProjects({ current, all }: { current: Project; all: Project[] }) {
  const others = all.filter((p) => p.id !== current.id);
  const related = [...others.filter((p) => p.categoryId === current.categoryId), ...others.filter((p) => p.categoryId !== current.categoryId)].slice(0, 2);
  const idx = all.findIndex((p) => p.id === current.id);
  const next = all.length > 1 ? all[(idx + 1) % all.length] : null;

  return (
    <>
      {related.length > 0 && (
        <section className="container-site section border-t border-line" aria-labelledby="related">
          <p id="related" className="t-meta flex items-center gap-3 text-secondary-aa">
            <span aria-hidden className="h-px w-8 bg-accent" />
            Related projects
          </p>
          <ul className="mt-10 grid gap-x-8 gap-y-14 md:grid-cols-2">
            {related.map((p) => (
              <li key={p.id}>
                <ProjectCard project={p} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {next && next.id !== current.id && (
        <nav aria-label="Next project" className="border-t border-line">
          <Link href={`/work/${next.slug}`} className="group container-site flex items-end justify-between gap-6 py-14 md:py-20">
            <span>
              <span className="t-meta text-secondary-aa">Next project</span>
              <span className="t-section mt-3 block transition-colors duration-200 group-hover:text-accent">{next.title}</span>
            </span>
            <span aria-hidden className="arrow mb-2 text-[32px] text-accent">→</span>
          </Link>
        </nav>
      )}
    </>
  );
}
