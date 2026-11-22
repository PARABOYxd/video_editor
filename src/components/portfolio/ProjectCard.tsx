import { Fragment } from "react";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import type { Project } from "@/lib/types";
import ProjectThumbnail from "./ProjectThumbnail";

/**
 * Still, number, title, then category / year / duration / ratio as separate
 * badges. The whole card is one link, so it is a single tab stop.
 */
export default function ProjectCard({
  project,
  index,
  sizes,
  preload = false,
  headingLevel = "h3",
}: {
  project: Project;
  index?: number;
  sizes?: string;
  preload?: boolean;
  headingLevel?: "h2" | "h3";
}) {
  const H = headingLevel;
  const badges = [
    { key: "category", label: "Category", value: project.categoryName },
    { key: "year", label: "Year", value: project.year },
    { key: "duration", label: "Duration", value: project.duration },
    { key: "ratio", label: "Aspect ratio", value: project.aspectRatio },
  ].filter((b) => b.value);

  return (
    <Link href={`/work/${project.slug}`} className="group block">
      <ProjectThumbnail project={project} sizes={sizes} preload={preload} />
      <div className="mt-5 flex items-start justify-between gap-4">
        <div className="min-w-0">
          {(index !== undefined || project.client) && (
            <p className="t-meta text-secondary">
              {index !== undefined && <span className="mr-3 text-ink">{String(index + 1).padStart(2, "0")}</span>}
              {project.client}
            </p>
          )}
          <H className="t-h4 mt-2 [overflow-wrap:anywhere]">{project.title}</H>
          {project.summary && <p className="mt-2 max-w-md text-body-sm text-secondary">{project.summary}</p>}
          <p className="mt-3 flex flex-wrap gap-1.5">
            {badges.map((b) => (
              <Fragment key={b.key}>
                <Badge variant="meta" data-badge={b.key}>
                  <span className="sr-only">{b.label}: </span>
                  {b.value}
                </Badge>{" "}
              </Fragment>
            ))}
          </p>
        </div>
        <span
          aria-hidden
          className="arrow mt-2 shrink-0 text-arrow text-accent opacity-0 transition-[opacity,transform] duration-base group-hover:opacity-100 group-focus-visible:opacity-100"
        >
          →
        </span>
      </div>
    </Link>
  );
}
