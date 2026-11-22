import Link from "next/link";
import { notFound } from "next/navigation";
import ProjectForm from "@/components/admin/ProjectForm";
import { requireAdmin } from "@/lib/auth/dal";
import { adminGetProject, getCategories } from "@/lib/content";
import { isRetiredProject } from "@/lib/retired";

export default async function EditProject({ params }: PageProps<"/admin/projects/[id]">) {
  await requireAdmin();
  const { id } = await params;
  const [project, categories] = await Promise.all([adminGetProject(Number(id)), getCategories()]);
  if (!project) notFound();
  const hidden = project.isSample || isRetiredProject(project);
  return (
    <div>
      <div className="mb-6 flex flex-wrap items-baseline justify-between gap-4">
        <h1 className="t-h2 !text-title">Edit project</h1>
        {project.published && !hidden && (
          <Link href={`/work/${project.slug}`} target="_blank" className="link-u text-small">View on site</Link>
        )}
      </div>
      {hidden && (
        <p className="mb-6 rounded border border-warning-line bg-warning-soft p-4 text-small text-warning">
          This project was withdrawn and is hidden from the site. Delete it, and add your own work as a new project.
        </p>
      )}
      <ProjectForm project={project} categories={categories} />
    </div>
  );
}
