import RowForm from "@/components/admin/RowForm";
import { DeleteButton } from "@/components/admin/ui";
import { deleteCategory, saveCategory } from "../../actions";
import { requireAdmin } from "@/lib/auth/dal";
import { getCategories } from "@/lib/content";

export default async function CategoriesAdmin() {
  await requireAdmin();
  const categories = await getCategories();
  return (
    <div className="space-y-8">
      <div>
        <h1 className="t-section !text-[40px]">Categories</h1>
        <p className="mt-1 text-[15px] text-secondary-aa">Used for the filter on the Work page. Deleting a category keeps its projects, just uncategorised.</p>
      </div>
      <ul className="space-y-4">
        {categories.map((c) => (
          <li key={c.id} className="rounded border border-line bg-white p-5">
            <RowForm
              action={saveCategory}
              id={c.id}
              fields={[
                { name: "name", label: "Name", value: c.name },
                { name: "sort", label: "Order", type: "number", value: c.sort },
              ]}
            />
            <div className="mt-2 flex justify-end">
              <DeleteButton action={deleteCategory} id={c.id} confirmText={`Delete the “${c.name}” category?`} />
            </div>
          </li>
        ))}
      </ul>
      <section className="rounded border border-dashed border-ink/30 p-5">
        <h2 className="mb-4 text-[16px] font-semibold">Add a category</h2>
        <RowForm
          action={saveCategory}
          resetOnSuccess
          submitLabel="Add category"
          fields={[
            { name: "name", label: "Name" },
            { name: "sort", label: "Order", type: "number", value: categories.length },
          ]}
        />
      </section>
    </div>
  );
}
