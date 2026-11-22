import Link from "next/link";
import Img from "@/components/ui/Img";
import { thumbnailOf } from "@/components/portfolio/ProjectThumbnail";
import { DeleteButton } from "@/components/admin/ui";
import { deleteProject } from "../../actions";
import { requireAdmin } from "@/lib/auth/dal";
import { adminGetProjects } from "@/lib/content";
import { isRetiredProject } from "@/lib/retired";
import { parseVideo } from "@/lib/video";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

export default async function ProjectsAdmin({ searchParams }: PageProps<"/admin/projects">) {
  await requireAdmin();
  const [projects, sp] = await Promise.all([adminGetProjects(), searchParams]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="t-h2 !text-title">Projects</h1>
        <Button href="/admin/projects/new" size="sm">Add project</Button>
      </div>
      {sp.saved && <p role="status" className="mt-4 text-small text-success">Project saved and live.</p>}
      {sp.deleted && <p role="status" className="mt-4 text-small text-success">Project deleted.</p>}

      <ul className="mt-6 divide-y divide-line rounded border border-line bg-surface">
        {projects.map((p) => {
          const v = parseVideo(p.videoUrl);
          const hidden = p.isSample || isRetiredProject(p);
          const thumb = hidden ? "" : thumbnailOf(p);
          return (
            <li key={p.id} className="flex items-center gap-4 p-3 sm:p-4">
              <div className="relative h-14 w-24 shrink-0 overflow-hidden rounded-md bg-paper">
                {thumb && <Img src={thumb} alt="" fill sizes="96px" className="object-cover" />}
              </div>
              <div className="min-w-0 flex-1">
                <Link href={`/admin/projects/${p.id}`} className="font-medium hover:underline">{p.title}</Link>
                <p className="mt-0.5 flex flex-wrap gap-x-2 text-label text-secondary">
                  <span>{p.categoryName ?? "Uncategorised"}</span>
                  {hidden && <Badge variant="warning" className="!py-0">Withdrawn · hidden from site</Badge>}
                  {p.projectType === "spec" && <Badge className="!py-0">Spec project</Badge>}
                  {!p.published && <span className="rounded bg-paper px-1.5">Draft</span>}
                  {p.featured && <span className="rounded bg-paper px-1.5">Featured</span>}
                  {v.kind === "none" && <span className="rounded bg-paper px-1.5">No video</span>}
                </p>
              </div>
              <Link href={`/admin/projects/${p.id}`} className="min-h-10 rounded px-3 py-2 text-small hover:bg-paper">Edit</Link>
              <DeleteButton action={deleteProject} id={p.id} confirmText={`Delete “${p.title}”? This can't be undone.`} />
            </li>
          );
        })}
      </ul>
      {!projects.length && <p className="mt-6 text-secondary">No projects yet.</p>}
    </div>
  );
}
