import Img from "../ui/Img";
import PlaceholderFrame from "../ui/PlaceholderFrame";
import type { Project } from "@/lib/types";
import { parseVideo } from "@/lib/video";

export const FRAME = {
  wide: "aspect-[16/10]",
  cinema: "aspect-[3/2]",
  tall: "aspect-[4/5]",
} as const;

export function thumbnailOf(project: Project) {
  const v = parseVideo(project.videoUrl);
  return project.thumbnailUrl || project.posterUrl || (v.kind === "youtube" ? v.thumbnail : "");
}

/** Project still with reserved aspect ratio; a labelled placeholder until one is added. */
export default function ProjectThumbnail({
  project,
  frame = "wide",
  sizes = "(min-width: 768px) 50vw, 100vw",
  priority = false,
}: {
  project: Project;
  frame?: keyof typeof FRAME;
  sizes?: string;
  priority?: boolean;
}) {
  const src = thumbnailOf(project);
  return (
    <div className={`relative overflow-hidden rounded bg-media ${FRAME[frame]}`}>
      {src ? (
        <Img
          src={src}
          alt={`Still from ${project.title}${project.categoryName ? `, ${project.categoryName.toLowerCase()}` : ""}`}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.025]"
        />
      ) : (
        <PlaceholderFrame label="Placeholder · thumbnail to come" title={project.title} compact={frame === "tall"} />
      )}
    </div>
  );
}
