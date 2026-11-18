import type { Profile } from "@/lib/types";

/** Direct channels beside the form: email, WhatsApp, Instagram and the rest. */
export default function ContactDetails({ profile }: { profile: Profile }) {
  const wa = profile.whatsapp
    ? `https://wa.me/${profile.whatsapp}?text=${encodeURIComponent(`Hi ${profile.shortName}, I have a project in mind.`)}`
    : "";
  const rows: { label: string; value: string; href: string; external?: boolean }[] = [
    ...(profile.email ? [{ label: "Email", value: profile.email, href: `mailto:${profile.email}` }] : []),
    ...(wa ? [{ label: "WhatsApp", value: profile.phone || "Message us", href: wa, external: true }] : []),
    ...profile.socials.map((s) => ({ label: s.label, value: s.url.replace(/^https?:\/\/(www\.)?/, ""), href: s.url, external: true })),
  ];

  return (
    <dl className="border-t border-ink">
      {rows.map((r) => (
        <div key={r.label} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-line py-4">
          <dt className="t-meta text-secondary-aa">{r.label}</dt>
          <dd className="min-w-0 text-right text-[16px]">
            <a href={r.href} className="link-u break-all" {...(r.external && { target: "_blank", rel: "noopener noreferrer" })}>
              {r.value}
            </a>
          </dd>
        </div>
      ))}
      {profile.availability && (
        <div className="flex items-center gap-3 py-4 text-[15px]">
          <span aria-hidden className="h-2 w-2 rounded-full bg-accent" />
          {profile.availability}
        </div>
      )}
    </dl>
  );
}
