import Link from "next/link";
import { notFound } from "next/navigation";
import ContactCTA from "@/components/home/ContactCTA";
import ProjectMetadata from "@/components/portfolio/ProjectMetadata";
import RelatedProjects from "@/components/portfolio/RelatedProjects";
import { thumbnailOf } from "@/components/portfolio/ProjectThumbnail";
import Img from "@/components/ui/Img";
import VideoPlayer from "@/components/ui/VideoPlayer";
import { getProfile, getProjectBySlug, getProjects } from "@/lib/content";
import { pageMetadata, projectJsonLd } from "@/lib/seo";

export const revalidate = 3600;

export async function generateStaticParams() {
  return (await getProjects()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  return pageMetadata({
    title: project.seoTitle || `${project.title}${project.categoryName ? ` · ${project.categoryName}` : ""}`,
    description: project.seoDescription || project.summary || project.description.slice(0, 155),
    path: `/work/${project.slug}`,
    image: thumbnailOf(project) || undefined,
    type: "video.other",
  });
}

const paragraphs = (text: string) => text.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);

export default async function ProjectPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const [project, profile, all] = await Promise.all([getProjectBySlug(slug), getProfile(), getProjects()]);
  if (!project) notFound();

  const vertical = project.aspectRatio === "9:16" || project.aspectRatio === "4:5";
  const story = (
    [
      ["Overview", project.description],
      ["Background", project.background],
      ["Creative objective", project.objective],
      ["Editing approach", project.approach],
      ["Our role", project.role],
    ] as const
  ).filter(([, text]) => text.trim());

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(projectJsonLd(project, profile)) }} />

      {/* Title block */}
      <header className="container-site pb-12 pt-10 md:pb-16 md:pt-16">
        <nav aria-label="Breadcrumb" className="t-meta text-secondary-aa">
          <Link href="/work" className="link-u hover:text-ink">Work</Link>
          <span aria-hidden> / </span>
          <span className="text-ink">{project.title}</span>
        </nav>
        <div className="grid-12 mt-10 gap-y-6">
          <div className="col-span-12 lg:col-span-8">
            <p className="t-meta flex flex-wrap items-center gap-x-3 text-secondary-aa">
              <span aria-hidden className="h-px w-8 bg-accent" />
              {[project.categoryName, project.year].filter(Boolean).join(" · ")}
            </p>
            <h1 className="t-page mt-5 text-balance">{project.title}</h1>
          </div>
          {project.summary && <p className="t-lead col-span-12 text-secondary-aa lg:col-span-4 lg:self-end">{project.summary}</p>}
        </div>
      </header>

      {/* Featured video */}
      {vertical ? (
        <div className="bg-media py-10 md:py-16">
          <div className="container-site">
            <div className="mx-auto w-full max-w-[420px]">
              <VideoPlayer url={project.videoUrl} poster={project.posterUrl || thumbnailOf(project)} title={project.title} aspect={project.aspectRatio} priority sizes="420px" />
            </div>
          </div>
        </div>
      ) : (
        <div className="container-site">
          <VideoPlayer url={project.videoUrl} poster={project.posterUrl || thumbnailOf(project)} title={project.title} aspect={project.aspectRatio} priority />
        </div>
      )}

      {/* Case study */}
      <div className="container-site section grid-12 gap-y-12">
        <aside className="col-span-12 md:col-span-5 lg:col-span-4">
          <div className="md:sticky md:top-28">
            <ProjectMetadata project={{ ...project, role: "" }} />
          </div>
        </aside>
        <div className="col-span-12 space-y-12 md:col-span-7 md:col-start-6 lg:col-span-7 lg:col-start-6">
          {story.map(([title, text]) => (
            <section key={title}>
              <h2 className="t-meta flex items-center gap-3 text-secondary-aa">
                <span aria-hidden className="h-px w-8 bg-accent" />
                {title}
              </h2>
              <div className="mt-4 space-y-4 text-[17px] leading-[1.7]">
                {paragraphs(text).map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      {/* Additional visuals */}
      {project.gallery.length > 0 && (
        <section className="container-site pb-24" aria-label="Stills from the project">
          <ul className="grid gap-6 md:grid-cols-2">
            {project.gallery.map((src, i) => (
              <li key={src} className={project.gallery.length % 2 === 1 && i === 0 ? "md:col-span-2" : ""}>
                <div className={`relative overflow-hidden rounded bg-media ${project.gallery.length % 2 === 1 && i === 0 ? "aspect-[21/9]" : "aspect-[3/2]"}`}>
                  <Img src={src} alt={`${project.title}, still ${i + 1}`} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <RelatedProjects current={project} all={all} />
      <div className="border-t border-line">
        <ContactCTA profile={profile} title="Have a project like this?" />
      </div>
    </article>
  );
}
