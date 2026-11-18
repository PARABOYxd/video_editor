import Link from "next/link";
import Img from "@/components/ui/Img";
import { thumbnailOf } from "@/components/portfolio/ProjectThumbnail";
import { DeleteButton } from "@/components/admin/ui";
import { deleteProject } from "../../actions";
import { requireAdmin } from "@/lib/auth/dal";
import { adminGetProjects } from "@/lib/content";
import { parseVideo } from "@/lib/video";

export default async function ProjectsAdmin({ searchParams }: PageProps<"/admin/projects">) {
  await requireAdmin();
  const [projects, sp] = await Promise.all([adminGetProjects(), searchParams]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="t-section !text-[40px]">Projects</h1>
        <Link href="/admin/projects/new" className="btn btn-primary !min-h-11">Add project</Link>
      </div>
      {sp.saved && <p role="status" className="mt-4 text-[14px] text-emerald-700">Project saved and live.</p>}
      {sp.deleted && <p role="status" className="mt-4 text-[14px] text-emerald-700">Project deleted.</p>}

      <ul className="mt-6 divide-y divide-line rounded border border-line bg-white">
        {projects.map((p) => {
          const v = parseVideo(p.videoUrl);
          const thumb = thumbnailOf(p);
          return (
            <li key={p.id} className="flex items-center gap-4 p-3 sm:p-4">
              <div className="relative h-14 w-24 shrink-0 overflow-hidden rounded-md bg-paper">
                {thumb && <Img src={thumb} alt="" fill sizes="96px" className="object-cover" />}
              </div>
              <div className="min-w-0 flex-1">
                <Link href={`/admin/projects/${p.id}`} className="font-medium hover:underline">{p.title}</Link>
                <p className="mt-0.5 flex flex-wrap gap-x-2 text-[13px] text-secondary-aa">
                  <span>{p.categoryName ?? "Uncategorised"}</span>
                  {p.isSample && <span className="rounded bg-amber-100 px-1.5 text-amber-900">Placeholder</span>}
                  {!p.published && <span className="rounded bg-paper px-1.5">Draft</span>}
                  {p.featured && <span className="rounded bg-paper px-1.5">Featured</span>}
                  {v.kind === "none" && <span className="rounded bg-paper px-1.5">No video</span>}
                </p>
              </div>
              <Link href={`/admin/projects/${p.id}`} className="min-h-10 rounded px-3 py-2 text-[14px] hover:bg-paper">Edit</Link>
              <DeleteButton action={deleteProject} id={p.id} confirmText={`Delete “${p.title}”? This can't be undone.`} />
            </li>
          );
        })}
      </ul>
      {!projects.length && <p className="mt-6 text-secondary-aa">No projects yet.</p>}
    </div>
  );
}
