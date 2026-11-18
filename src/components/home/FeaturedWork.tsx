import Link from "next/link";
import SectionHeading from "../layout/SectionHeading";
import ProjectCard from "../portfolio/ProjectCard";
import Reveal from "../ui/Reveal";
import type { Project } from "@/lib/types";

/*
 * Asymmetric two-column rhythm: a wide still on one side, a tall one on the
 * other, offset vertically and swapped on the next row. Same grid, varied
 * frames, so no two neighbours look alike.
 */
const LAYOUT = [
  { frame: "cinema", cls: "md:col-span-7" },
  { frame: "tall", cls: "md:col-span-4 md:col-start-9 md:mt-40" },
  { frame: "tall", cls: "md:col-span-4 md:col-start-2" },
  { frame: "cinema", cls: "md:col-span-6 md:col-start-7 md:mt-24" },
  { frame: "cinema", cls: "md:col-span-7" },
  { frame: "tall", cls: "md:col-span-4 md:col-start-9 md:mt-40" },
] as const;

export default function FeaturedWork({ projects, total }: { projects: Project[]; total: number }) {
  return (
    <section className="container-site section" aria-labelledby="selected-work">
      <SectionHeading
        id="selected-work"
        label="A selection of projects, stories and visual experiments"
        title="Selected work."
        aside={
          <Link href="/work" className="link-arrow">
            View all projects ({total}) <span className="arrow" aria-hidden>→</span>
          </Link>
        }
      />
      <ul className="grid-12 mt-14 gap-y-16 md:mt-20 md:gap-y-24">
        {projects.slice(0, 6).map((p, i) => {
          const l = LAYOUT[i % LAYOUT.length];
          return (
            <Reveal as="li" key={p.id} className={`col-span-12 ${l.cls}`}>
              <ProjectCard project={p} index={i} frame={l.frame} />
            </Reveal>
          );
        })}
      </ul>
    </section>
  );
}
