import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import Gallery from "@/components/portfolio/Gallery";
import ProjectMetadata from "@/components/portfolio/ProjectMetadata";
import ProjectPager from "@/components/portfolio/ProjectPager";
import RelatedProjects from "@/components/portfolio/RelatedProjects";
import { isVertical, thumbnailOf } from "@/components/portfolio/ProjectThumbnail";
import JsonLd from "@/components/seo/JsonLd";
import Badge from "@/components/ui/Badge";
import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import LazyPlayer from "@/components/ui/LazyPlayer";
import Section from "@/components/ui/Section";
import { getProfile, getProjectBySlug, getProjects, getServices } from "@/lib/content";
import { pageMetadata, projectDescription, projectJsonLd, projectTitle } from "@/lib/seo";
import { serviceDetails } from "@/lib/service-details";
import { parseVideo } from "@/lib/video";

export const revalidate = 3600;

export async function generateStaticParams() {
  return (await getProjects()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const [project, profile] = await Promise.all([getProjectBySlug(slug), getProfile()]);
  if (!project) notFound();
  const { title, absolute } = projectTitle(project);
  return pageMetadata({
    title,
    absolute,
    description: projectDescription(project, profile),
    path: `/work/${project.slug}`,
    image: project.posterUrl || thumbnailOf(project) || undefined,
    og: "project",
    type: "video.other",
  });
}

const paragraphs = (text: string) => text.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);

export default async function ProjectPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const [project, profile, all, services] = await Promise.all([getProjectBySlug(slug), getProfile(), getProjects(), getServices()]);
  if (!project) notFound();

  const idx = all.findIndex((p) => p.id === project.id);
  const nextProject = all[(idx + 1) % all.length];
  const previous = all[(idx - 1 + all.length) % all.length];
  const hasSiblings = all.length > 1 && idx >= 0;
  const next = hasSiblings ? { href: `/work/${nextProject.slug}`, title: nextProject.title } : undefined;

  const vertical = isVertical(project);
  const poster = project.posterUrl || thumbnailOf(project);
  // A project with neither video nor still gets no media block, rather than an empty player.
  const hasMedia = parseVideo(project.videoUrl).kind !== "none" || Boolean(poster);
  const service = project.categorySlug ? services.map(serviceDetails).find((s) => s.category === project.categorySlug) : undefined;

  // "Brief" is the context and the goal. Without those fields, the overview is the brief.
  const briefFields = [project.background, project.objective].filter((t) => t.trim());
  const sections = [
    { title: "Overview", text: briefFields.length ? project.description : "" },
    { title: "Brief", text: briefFields.length ? briefFields.join("\n\n") : project.description },
    { title: "Approach", text: project.approach },
    { title: "Result", text: project.result },
    { title: "Our role", text: project.role },
  ].filter((s) => s.text.trim());

  return (
    <article>
      <JsonLd data={projectJsonLd(project, profile)} />

      <Container as="header" className="pb-10 pt-6 md:pb-14">
        <Breadcrumbs
          items={[
            { name: "Work", path: "/work" },
            { name: project.title, path: `/work/${project.slug}` },
          ]}
        />
        <div className="grid-12 mt-8 gap-y-6">
          <div className="col-span-12 lg:col-span-8">
            {project.categoryName && <Eyebrow>{project.categoryName}</Eyebrow>}
            <h1 className="t-h1 mt-5 [overflow-wrap:anywhere]">{project.title}</h1>
            {project.projectType === "spec" && <Badge className="mt-5">Spec project</Badge>}
            {project.footageSource && <p className="mt-3 text-caption text-secondary">Footage: {project.footageSource}</p>}
          </div>
          {project.summary && <p className="t-lead col-span-12 text-secondary lg:col-span-4 lg:self-end">{project.summary}</p>}
        </div>
      </Container>

      {!hasMedia ? null : vertical ? (
        <div data-tone="dark" className="bg-media py-10 md:py-16">
          <Container>
            <div className="mx-auto w-full max-w-reel">
              <LazyPlayer url={project.videoUrl} poster={poster} title={project.title} aspect={project.aspectRatio} captions={project.captionsUrl} sizes="(min-width: 460px) 420px, 92vw" next={next} />
            </div>
          </Container>
        </div>
      ) : (
        <Container>
          <LazyPlayer url={project.videoUrl} poster={poster} title={project.title} aspect={project.aspectRatio} captions={project.captionsUrl} sizes="(min-width: 1408px) 1280px, 92vw" next={next} />
        </Container>
      )}

      <Container className="pt-8">
        <ProjectMetadata project={project} />
      </Container>

      <Section as="div" className="grid-12 gap-y-12">
        <div data-reveal-group className="col-span-12 space-y-12 lg:col-span-8 lg:col-start-3">
          {sections.map(({ title, text }) => (
            <section key={title} className="grid gap-4 md:grid-cols-4">
              <Eyebrow as="h2" className="self-start pt-1">
                {title}
              </Eyebrow>
              <div className="t-prose space-y-4 md:col-span-3">
                {paragraphs(text).map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </section>
          ))}
          <p className="max-w-measure text-body text-secondary">
            Planning something similar?{" "}
            {service ? (
              <>
                See what our{" "}
                <Link href={`/services#${service.slug}`} className="tap-target link-u text-ink">
                  {service.title.toLowerCase()} service
                </Link>{" "}
                includes.
              </>
            ) : (
              <Link href="/services" className="tap-target link-u text-ink">
                See our video editing services.
              </Link>
            )}
          </p>
        </div>
      </Section>

      {project.gallery.length > 0 && (
        <Container as="section" className="pb-page-bottom" aria-labelledby="stills-title">
          <Eyebrow as="h2" id="stills-title" className="mb-8">
            Stills
          </Eyebrow>
          <Gallery images={project.gallery} title={project.title} />
        </Container>
      )}

      <RelatedProjects current={project} all={all} />
      {hasSiblings && <ProjectPager previous={previous} next={nextProject} />}
    </article>
  );
}
