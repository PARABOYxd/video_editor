import ProjectForm from "@/components/admin/ProjectForm";
import { requireAdmin } from "@/lib/auth/dal";
import { getCategories } from "@/lib/content";

export default async function NewProject() {
  await requireAdmin();
  return (
    <div>
      <h1 className="t-h2 mb-6 !text-title">Add project</h1>
      <ProjectForm categories={await getCategories()} />
    </div>
  );
}
