import Img from "../ui/Img";
import PlaceholderFrame from "../ui/PlaceholderFrame";
import HoverVideo from "../ui/HoverVideo";
import type { Project } from "@/lib/types";
import { parseVideo } from "@/lib/video";

export const FRAME = {
  wide: "aspect-[16/10]",
  cinema: "aspect-[3/2]",
  tall: "aspect-[4/5]",
} as const;

export const isVertical = (p: Pick<Project, "aspectRatio">) => p.aspectRatio === "9:16" || p.aspectRatio === "4:5";

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
  const isFile = /\.(mp4|webm|mov)(\?|$)/i.test(project.videoUrl);
  // Reels and shorts get a portrait frame wherever they appear, so a 9:16 edit isn't cropped to a letterbox.
  const vertical = isVertical(project);
  const shape = vertical ? "tall" : frame;
  return (
    <div className={`relative overflow-hidden rounded bg-media ${FRAME[shape]}`}>
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
        <PlaceholderFrame label="Placeholder · thumbnail to come" title={project.title} compact={shape === "tall"} />
      )}
      {src && isFile && <HoverVideo src={project.videoUrl} />}
      {(project.duration || vertical) && (
        <span className="absolute bottom-3 right-3 flex items-center gap-2 rounded bg-black/70 px-2 py-1 font-mono text-[11px] tracking-wide text-white backdrop-blur-sm">
          {vertical && <span className="text-white/70">{project.aspectRatio}</span>}
          {project.duration}
        </span>
      )}
    </div>
  );
}
