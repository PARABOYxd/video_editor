import ComingSoonCard, { FEW_PROJECTS } from "../portfolio/ComingSoonCard";
import ProjectCard from "../portfolio/ProjectCard";
import { isVertical } from "../portfolio/ProjectThumbnail";
import SectionHeader from "@/components/ui/SectionHeader";
import Section from "@/components/ui/Section";
import type { Project } from "@/lib/types";

type Shape = "wide" | "tall";
type Slot = { cls: string; sizes: string };

const slot = (cls: string, columns: number): Slot => ({
  cls,
  sizes: `(min-width: 1408px) ${Math.round((1312 / 12) * columns - 32)}px, (min-width: 768px) ${Math.round(columns * 7.6)}vw, 92vw`,
});

/*
 * Editorial rows of two. Every film keeps its real shape (16:9 stays wide,
 * 9:16 stays tall), so the columns are chosen per pair of shapes, and the
 * sides swap on every other row.
 */
function layout(shapes: Shape[]): Slot[] {
  return shapes.map((shape, i) => {
    const first = i % 2 === 0;
    const other = shapes[first ? i + 1 : i - 1];
    const flipped = Math.floor(i / 2) % 2 === 1;
    const offset = first ? "" : " md:mt-24";
    if (!other) return shape === "wide" ? slot("md:col-span-8 md:col-start-3", 8) : slot("md:col-span-4 md:col-start-5", 4);
    if (shape === "wide" && other === "wide") {
      if (first) return flipped ? slot("md:col-span-5", 5) : slot("md:col-span-7", 7);
      return flipped ? slot(`md:col-span-7 md:col-start-6${offset}`, 7) : slot(`md:col-span-5 md:col-start-8${offset}`, 5);
    }
    if (shape === "tall" && other === "tall") {
      return first ? slot("md:col-span-4 md:col-start-2", 4) : slot(`md:col-span-4 md:col-start-8${offset}`, 4);
    }
    if (shape === "wide") return first ? slot("md:col-span-7 md:self-center", 7) : slot("md:col-span-7 md:col-start-6 md:self-center", 7);
    return first ? slot("md:col-span-4", 4) : slot("md:col-span-4 md:col-start-9", 4);
  });
}

export default function FeaturedWork({ projects, total }: { projects: Project[]; total: number }) {
  const shown = projects.slice(0, 6);
  const few = total < FEW_PROJECTS;
  const shapes: Shape[] = shown.map((p) => (isVertical(p) ? "tall" : "wide"));
  const slots = layout(few ? [...shapes, "wide"] : shapes);

  return (
    <Section aria-labelledby="selected-work">
      <SectionHeader
        id="selected-work"
        eyebrow="A selection of projects, stories and visual experiments"
        title="Selected work."
        cta={total ? { href: "/work", label: `View all projects (${total})` } : undefined}
      />
      <ul data-reveal-group className="grid-12 mt-14 gap-y-16 md:mt-20 md:gap-y-24">
        {shown.map((p, i) => (
          <li key={p.id} className={`col-span-12 ${slots[i].cls}`}>
            <ProjectCard project={p} index={i} sizes={slots[i].sizes} />
          </li>
        ))}
        {few && (
          <li className={`col-span-12 self-center ${shown.length ? slots[shown.length].cls : ""}`}>
            <ComingSoonCard wide={!shown.length} />
          </li>
        )}
      </ul>
    </Section>
  );
}
