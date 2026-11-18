import Link from "next/link";
import { notFound } from "next/navigation";
import ProjectForm from "@/components/admin/ProjectForm";
import { requireAdmin } from "@/lib/auth/dal";
import { adminGetProject, getCategories } from "@/lib/content";

export default async function EditProject({ params }: PageProps<"/admin/projects/[id]">) {
  await requireAdmin();
  const { id } = await params;
  const [project, categories] = await Promise.all([adminGetProject(Number(id)), getCategories()]);
  if (!project) notFound();
  return (
    <div>
      <div className="mb-6 flex flex-wrap items-baseline justify-between gap-4">
        <h1 className="t-section !text-[40px]">Edit project</h1>
        {project.published && (
          <Link href={`/work/${project.slug}`} target="_blank" className="link-u text-[14px]">View on site</Link>
        )}
      </div>
      {project.isSample && (
        <p className="mb-6 rounded border border-amber-300 bg-amber-50 p-4 text-[14px] text-amber-900">
          This is a placeholder project. Replace the title, text, video link and thumbnail with your own work; saving removes the placeholder flag.
        </p>
      )}
      <ProjectForm project={project} categories={categories} />
    </div>
  );
}
