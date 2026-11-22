import { Play } from "lucide-react";
import Img from "../ui/Img";
import PlaceholderFrame from "../ui/PlaceholderFrame";
import HoverVideo from "../ui/HoverVideo";
import type { Project } from "@/lib/types";
import { parseVideo } from "@/lib/video";
import Badge from "@/components/ui/Badge";

export const isVertical = (p: Pick<Project, "aspectRatio">) => p.aspectRatio === "9:16" || p.aspectRatio === "4:5";

export function thumbnailOf(project: Project) {
  const v = parseVideo(project.videoUrl);
  return project.thumbnailUrl || project.posterUrl || (v.kind === "youtube" ? v.thumbnail : "");
}

/** Cards keep the film's shape: landscape work is 16:9, reels are portrait. */
function frameOf(project: Project) {
  if (project.aspectRatio === "9:16") return "aspect-reel";
  if (project.aspectRatio === "4:5") return "aspect-portrait";
  if (project.aspectRatio === "1:1") return "aspect-square";
  return "aspect-video";
}

/** Project still with a reserved aspect ratio; a labelled placeholder until one is added. */
export default function ProjectThumbnail({
  project,
  sizes = "(min-width: 768px) 46vw, 92vw",
  preload = false,
}: {
  project: Project;
  sizes?: string;
  preload?: boolean;
}) {
  const src = thumbnailOf(project);
  const hasVideo = parseVideo(project.videoUrl).kind !== "none";
  const isFile = /\.(mp4|webm|mov)(\?|$)/i.test(project.videoUrl);
  const vertical = isVertical(project);

  return (
    <div data-cursor={hasVideo ? "Play" : "View"} className={`relative overflow-hidden rounded bg-media ${frameOf(project)}`}>
      {src ? (
        <Img
          src={src}
          alt={`Still from ${project.title}${project.categoryName ? `, ${project.categoryName.toLowerCase()}` : ""}`}
          fill
          sizes={sizes}
          preload={preload}
          className="object-cover transition-transform duration-slower ease-out-soft group-hover:scale-(--zoom-media) group-focus-visible:scale-(--zoom-media)"
        />
      ) : (
        <PlaceholderFrame label="Still coming soon" compact={vertical} />
      )}
      {src && isFile && <HoverVideo src={project.videoUrl} />}
      <span
        aria-hidden
        data-card-overlay
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-scrim/55 via-scrim/10 to-transparent opacity-0 transition-opacity duration-slow group-hover:opacity-100 group-focus-visible:opacity-100"
      />
      {hasVideo && (
        <span
          aria-hidden
          data-card-play
          className="pointer-events-none absolute bottom-3 left-3 grid h-11 w-11 translate-y-1 place-items-center rounded-full bg-surface text-ink opacity-0 transition-[opacity,translate] duration-slow ease-out-soft group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
        >
          <Play className="ml-0.5 h-4 w-4 fill-current" />
        </span>
      )}
      {project.projectType === "spec" && (
        <Badge variant="overlay" className="absolute right-3 top-3">
          Spec project
        </Badge>
      )}
    </div>
  );
}
