import RowForm, { type RowField } from "@/components/admin/RowForm";
import { DeleteButton } from "@/components/admin/ui";
import { deleteTestimonial, saveTestimonial } from "../../actions";
import { requireAdmin } from "@/lib/auth/dal";
import { adminGetTestimonials } from "@/lib/content";
import type { Testimonial } from "@/lib/types";

const fields = (t?: Testimonial): RowField[] => [
  { name: "name", label: "Client name", value: t?.name },
  { name: "role", label: "Role and company", value: t?.role, hint: "e.g. Founder, Brand name" },
  { name: "quote", label: "Their words", type: "textarea", value: t?.quote, wide: true },
  { name: "photoFile", label: "Upload photo", type: "file" },
  { name: "photoUrl", label: "…or photo URL", value: t?.photoUrl },
  { name: "sort", label: "Order", type: "number", value: t?.sort ?? 0 },
  { name: "published", label: "Published", type: "checkbox", value: t?.published ?? true },
];

export default async function TestimonialsAdmin() {
  await requireAdmin();
  const items = await adminGetTestimonials();
  return (
    <div className="space-y-8">
      <div>
        <h1 className="t-section !text-[40px]">Testimonials</h1>
        <p className="mt-1 max-w-2xl text-[15px] text-secondary-aa">
          Only add genuine feedback, with the client&apos;s permission to show their name and photo. The section stays hidden on the site until at least one is published.
        </p>
      </div>
      {items.length > 0 && (
        <ul className="space-y-4">
          {items.map((t) => (
            <li key={t.id} className="rounded border border-line bg-white p-5">
              <RowForm action={saveTestimonial} id={t.id} fields={fields(t)} />
              <div className="mt-2 flex justify-end">
                <DeleteButton action={deleteTestimonial} id={t.id} confirmText={`Delete the testimonial from ${t.name}?`} />
              </div>
            </li>
          ))}
        </ul>
      )}
      <section className="rounded border border-dashed border-ink/30 p-5">
        <h2 className="mb-4 text-[16px] font-semibold">Add a testimonial</h2>
        <RowForm action={saveTestimonial} resetOnSuccess submitLabel="Add testimonial" fields={fields()} />
      </section>
    </div>
  );
}
