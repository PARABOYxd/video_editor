import Link from "next/link";
import { requireAdmin } from "@/lib/auth/dal";
import { adminCounts, adminGetInquiries, getProfile } from "@/lib/content";

export default async function AdminHome() {
  await requireAdmin();
  const [counts, inquiries, profile] = await Promise.all([adminCounts(), adminGetInquiries(), getProfile()]);
  const tiles = [
    { label: "Projects", value: counts.projects, href: "/admin/projects" },
    { label: "Unread inquiries", value: counts.unread, href: "/admin/inquiries" },
    { label: "Testimonials", value: counts.testimonials, href: "/admin/testimonials" },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="t-section !text-[40px]">Overview</h1>
        <p className="mt-1 text-[15px] text-secondary-aa">Everything you change here goes live on the site straight away.</p>
      </div>

      <ul className="grid gap-4 sm:grid-cols-3">
        {tiles.map((t) => (
          <li key={t.label}>
            <Link href={t.href} className="block rounded border border-line bg-white p-5 hover:border-ink">
              <span className="font-display text-[44px] font-semibold leading-none">{t.value}</span>
              <span className="mt-2 block text-[14px] text-secondary-aa">{t.label}</span>
            </Link>
          </li>
        ))}
      </ul>

      {(counts.samples > 0 || !profile.showreelUrl) && (
        <section className="rounded border border-line bg-white p-6">
          <h2 className="text-[17px] font-semibold">Before you launch</h2>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[15px]">
            {counts.samples > 0 && (
              <li>
                {counts.samples} sample {counts.samples === 1 ? "project still uses" : "projects still use"} placeholder text and stock thumbnails.{" "}
                <Link href="/admin/projects" className="link-u">Replace them with your real work</Link>.
              </li>
            )}
            {!profile.showreelUrl && (
              <li>
                No showreel yet: the homepage shows your first featured project instead. <Link href="/admin/about" className="link-u">Add your showreel link</Link>.
              </li>
            )}
            <li>Check the email, phone and WhatsApp number on the <Link href="/admin/about" className="link-u">About page settings</Link>.</li>
          </ul>
        </section>
      )}

      <section>
        <div className="flex items-baseline justify-between">
          <h2 className="text-[17px] font-semibold">Latest inquiries</h2>
          <Link href="/admin/inquiries" className="link-u text-[14px]">All inquiries</Link>
        </div>
        {inquiries.length ? (
          <ul className="mt-4 divide-y divide-line rounded border border-line bg-white">
            {inquiries.slice(0, 5).map((q) => (
              <li key={q.id} className="flex items-center justify-between gap-4 px-5 py-4 text-[15px]">
                <span>
                  {!q.read && <span className="mr-2 inline-block h-2 w-2 rounded-full bg-accent" aria-label="Unread" />}
                  <span className="font-medium">{q.name}</span> <span className="text-secondary-aa">· {q.projectType}</span>
                </span>
                <time className="shrink-0 text-[13px] text-secondary-aa" dateTime={q.createdAt}>
                  {new Date(q.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                </time>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-[15px] text-secondary-aa">No inquiries yet. They appear here when someone submits the contact form.</p>
        )}
      </section>
    </div>
  );
}
