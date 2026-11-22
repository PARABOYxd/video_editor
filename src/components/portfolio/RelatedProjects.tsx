import ProjectCard from "./ProjectCard";
import type { Project } from "@/lib/types";
import Eyebrow from "@/components/ui/Eyebrow";
import Section from "@/components/ui/Section";

/** Two related projects, same category first. */
export default function RelatedProjects({ current, all }: { current: Project; all: Project[] }) {
  const others = all.filter((p) => p.id !== current.id);
  const related = [...others.filter((p) => p.categoryId === current.categoryId), ...others.filter((p) => p.categoryId !== current.categoryId)].slice(0, 2);
  if (!related.length) return null;

  return (
    <Section className="border-t border-line" aria-labelledby="related">
      <Eyebrow as="h2" id="related">
        Related projects
      </Eyebrow>
      <ul data-reveal-group className="mt-10 grid items-start gap-x-8 gap-y-14 md:grid-cols-2">
        {related.map((p) => (
          <li key={p.id} className={p.aspectRatio === "9:16" ? "w-full max-w-reel" : ""}>
            <ProjectCard project={p} sizes="(min-width: 1408px) 628px, (min-width: 768px) 45vw, 92vw" />
          </li>
        ))}
      </ul>
    </Section>
  );
}
