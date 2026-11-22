import { DeleteButton } from "@/components/admin/ui";
import { deleteInquiry, setInquiryRead } from "../../actions";
import { requireAdmin } from "@/lib/auth/dal";
import { adminGetInquiries } from "@/lib/content";

export default async function InquiriesAdmin() {
  await requireAdmin();
  const inquiries = await adminGetInquiries();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="t-h2 !text-title">Inquiries</h1>
        <p className="mt-1 text-body-sm text-secondary">Everything sent through the contact form, newest first.</p>
      </div>

      {inquiries.length === 0 && <p className="text-secondary">No inquiries yet.</p>}

      <ul className="space-y-4">
        {inquiries.map((q) => (
          <li key={q.id} className={`rounded border bg-surface p-5 ${q.read ? "border-line" : "border-ink"}`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-body font-medium">
                  {!q.read && <span className="mr-2 inline-block h-2 w-2 rounded-full bg-accent" aria-label="Unread" />}
                  {q.name}
                </p>
                <p className="mt-0.5 text-small">
                  <a href={`mailto:${q.email}?subject=${encodeURIComponent(`Re: your ${q.projectType} project`)}`} className="link-u">{q.email}</a>
                </p>
              </div>
              <time className="text-label text-secondary" dateTime={q.createdAt}>
                {new Date(q.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
              </time>
            </div>
            <p className="mt-3 flex flex-wrap gap-2 text-label">
              <span className="rounded bg-paper px-3 py-1">{q.projectType}</span>
              <span className="rounded bg-paper px-3 py-1">{q.budget}</span>
              {q.deadline && <span className="rounded bg-paper px-3 py-1">Deadline: {q.deadline}</span>}
            </p>
            {q.reference && (
              <p className="mt-3 text-small">
                Reference:{" "}
                <a href={q.reference} target="_blank" rel="noopener noreferrer nofollow" className="link-u [overflow-wrap:anywhere]">
                  {q.reference}
                </a>
              </p>
            )}
            <p className="mt-4 whitespace-pre-wrap text-body-sm leading-relaxed">{q.message}</p>
            <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
              <form action={setInquiryRead}>
                <input type="hidden" name="id" value={q.id} />
                <input type="hidden" name="read" value={q.read ? "false" : "true"} />
                <button type="submit" className="min-h-10 rounded px-3 text-small hover:bg-paper">
                  Mark as {q.read ? "unread" : "read"}
                </button>
              </form>
              <DeleteButton action={deleteInquiry} id={q.id} confirmText={`Delete the inquiry from ${q.name}?`} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
