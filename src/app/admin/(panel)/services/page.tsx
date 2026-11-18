import RowForm from "@/components/admin/RowForm";
import { DeleteButton } from "@/components/admin/ui";
import { deleteService, saveService } from "../../actions";
import { requireAdmin } from "@/lib/auth/dal";
import { getServices } from "@/lib/content";

export default async function ServicesAdmin() {
  await requireAdmin();
  const services = await getServices();
  return (
    <div className="space-y-8">
      <div>
        <h1 className="t-section !text-[40px]">Services</h1>
        <p className="mt-1 text-[15px] text-secondary-aa">Shown on the home and Services pages, in this order.</p>
      </div>
      <ul className="space-y-4">
        {services.map((s) => (
          <li key={s.id} className="rounded border border-line bg-white p-5">
            <RowForm
              action={saveService}
              id={s.id}
              fields={[
                { name: "title", label: "Title", value: s.title },
                { name: "sort", label: "Order", type: "number", value: s.sort },
                { name: "description", label: "Short description", type: "textarea", value: s.description, wide: true },
                { name: "deliverables", label: "What the client receives", type: "textarea", value: s.deliverables, wide: true },
                { name: "idealFor", label: "What projects it suits", type: "textarea", value: s.idealFor, wide: true },
                { name: "process", label: "How the process works", type: "textarea", value: s.process, wide: true },
              ]}
            />
            <div className="mt-2 flex justify-end">
              <DeleteButton action={deleteService} id={s.id} confirmText={`Delete “${s.title}”?`} />
            </div>
          </li>
        ))}
      </ul>
      <section className="rounded border border-dashed border-ink/30 p-5">
        <h2 className="mb-4 text-[16px] font-semibold">Add a service</h2>
        <RowForm
          action={saveService}
          resetOnSuccess
          submitLabel="Add service"
          fields={[
            { name: "title", label: "Title" },
            { name: "sort", label: "Order", type: "number", value: services.length },
            { name: "description", label: "Short description", type: "textarea", wide: true },
            { name: "deliverables", label: "What the client receives", type: "textarea", wide: true },
            { name: "idealFor", label: "What projects it suits", type: "textarea", wide: true },
            { name: "process", label: "How the process works", type: "textarea", wide: true },
          ]}
        />
      </section>
    </div>
  );
}
