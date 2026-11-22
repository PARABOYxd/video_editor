import Link from "next/link";
import type { Project } from "@/lib/types";
import Container from "@/components/ui/Container";

/** Previous / next in portfolio order, wrapping round. */
export default function ProjectPager({ previous, next }: { previous: Project; next: Project }) {
  const items = [
    { project: previous, label: "Previous project", before: "← ", after: "", align: "" },
    { project: next, label: "Next project", before: "", after: " →", align: "md:items-end md:text-right" },
  ];
  return (
    <nav aria-label="More projects" className="border-t border-line">
      <Container className="grid md:grid-cols-2">
        {items.map(({ project, label, before, after, align }) => (
          <Link
            key={label}
            href={`/work/${project.slug}`}
            className={`group flex min-w-0 flex-col gap-3 border-b border-line py-10 last:border-0 md:border-b-0 md:py-14 ${align}`}
          >
            <span className="t-meta text-secondary">
              <span aria-hidden>{before}</span>
              {label}
              <span aria-hidden>{after}</span>
            </span>
            <span className="t-h3 max-w-full transition-colors duration-base [overflow-wrap:anywhere] group-hover:text-accent">{project.title}</span>
          </Link>
        ))}
      </Container>
    </nav>
  );
}
