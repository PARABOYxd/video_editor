import Link from "next/link";
import ProjectThumbnail, { FRAME } from "./ProjectThumbnail";
import type { Project } from "@/lib/types";

/**
 * Number, thumbnail, title, category / year / client, short description.
 * Hover: the still scales a touch and an arrow appears. The whole card is
 * one link, so it is a single tab stop with a readable name.
 */
export default function ProjectCard({
  project,
  index,
  frame = "wide",
  priority = false,
  headingLevel = "h3",
}: {
  project: Project;
  index?: number;
  frame?: keyof typeof FRAME;
  priority?: boolean;
  headingLevel?: "h2" | "h3";
}) {
  const H = headingLevel;
  const meta = [project.categoryName, project.year, project.client].filter(Boolean);
  return (
    <Link href={`/work/${project.slug}`} className="group block">
      <ProjectThumbnail project={project} frame={frame} priority={priority} />
      <div className="mt-5 flex items-start justify-between gap-6">
        <div className="min-w-0">
          <p className="t-meta text-secondary-aa">
            {index !== undefined && <span className="mr-3 text-ink">{String(index + 1).padStart(2, "0")}</span>}
            {meta.join(" · ")}
          </p>
          <H className="t-project mt-2">{project.title}</H>
          {project.summary && <p className="mt-2 max-w-md text-[15px] text-secondary-aa">{project.summary}</p>}
        </div>
        <span
          aria-hidden
          className="arrow mt-6 shrink-0 text-[20px] text-accent opacity-0 transition-[opacity,transform] duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
        >
          →
        </span>
      </div>
    </Link>
  );
}
