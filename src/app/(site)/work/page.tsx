import { Suspense } from "react";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import ComingSoonCard, { FEW_PROJECTS } from "@/components/portfolio/ComingSoonCard";
import ProjectCard from "@/components/portfolio/ProjectCard";
import ProjectGrid, { ProjectGridFallback } from "@/components/portfolio/ProjectGrid";
import Container from "@/components/ui/Container";
import { getCategories, getProfile, getProjects } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import WorkHeading from "./WorkHeading";

export const revalidate = 3600;

export async function generateMetadata() {
  const profile = await getProfile();
  return pageMetadata({
    title: "Video Editing Portfolio in Pune, India",
    description: `See the video editing portfolio of ${profile.brandName} in Pune, India: YouTube videos, short-form Reels, brand films, travel videos and motion graphics.`,
    // Filtered views are canonical to /work.
    path: "/work",
    og: "work",
  });
}

export default async function WorkPage() {
  const [projects, categories] = await Promise.all([getProjects(), getCategories()]);
  const columns = Math.min(projects.length, 3);
  const sizes =
    columns >= 3
      ? "(min-width: 1408px) 416px, (min-width: 1024px) 29vw, (min-width: 768px) 44vw, 92vw"
      : "(min-width: 1408px) 624px, (min-width: 768px) 45vw, 92vw";
  const cards = Object.fromEntries(
    projects.map((p, i) => [p.id, <ProjectCard key={p.id} project={p} index={i} sizes={sizes} preload={i === 0} headingLevel="h2" />])
  );
  const soon = projects.length < FEW_PROJECTS ? <ComingSoonCard as="h2" wide={!projects.length} /> : null;
  // Only categories that have work; a filter for one category is no filter at all.
  const used = categories.filter((c) => projects.some((p) => p.categorySlug === c.slug));

  const grid = { projects: projects.map(({ id, categorySlug }) => ({ id, categorySlug })), categories: used, cards, comingSoon: soon };

  return (
    <Container className="pb-page-bottom pt-6">
      <Breadcrumbs items={[{ name: "Work", path: "/work" }]} />
      <WorkHeading />
      <div className="mt-14">
        {projects.length ? (
          // The fallback is the whole unfiltered grid, so the static HTML works for crawlers and without JS.
          <Suspense fallback={<ProjectGridFallback {...grid} />}>
            <ProjectGrid {...grid} />
          </Suspense>
        ) : (
          soon
        )}
      </div>
    </Container>
  );
}
