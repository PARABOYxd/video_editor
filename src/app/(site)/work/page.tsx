import { Suspense } from "react";
import SectionHeading from "@/components/layout/SectionHeading";
import ProjectCard from "@/components/portfolio/ProjectCard";
import ProjectGrid from "@/components/portfolio/ProjectGrid";
import { getCategories, getProfile, getProjects } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata() {
  const profile = await getProfile();
  return pageMetadata({
    title: "Work",
    description: `Video editing work by ${profile.brandName}: reels and shorts, YouTube, brand films, commercials, travel and motion graphics.`,
    path: "/work",
  });
}

export default async function WorkPage() {
  const [projects, categories] = await Promise.all([getProjects(), getCategories()]);
  const cards = Object.fromEntries(projects.map((p, i) => [p.id, <ProjectCard key={p.id} project={p} index={i} priority={i < 2} />]));

  return (
    <div className="container-site pb-24 pt-12 md:pt-20">
      <SectionHeading as="h1" label="Portfolio" title="The work speaks." />
      <p className="t-lead mt-6 max-w-xl text-secondary-aa">
        A collection of projects, experiments and stories brought together through editing.
      </p>

      <div className="mt-14">
        <Suspense
          fallback={
            <ul className="mt-12 grid gap-x-8 gap-y-16 md:grid-cols-2">
              {projects.map((p) => (
                <li key={p.id}>{cards[p.id]}</li>
              ))}
            </ul>
          }
        >
          <ProjectGrid projects={projects.map(({ id, categorySlug }) => ({ id, categorySlug }))} categories={categories} cards={cards} />
        </Suspense>
      </div>
    </div>
  );
}
