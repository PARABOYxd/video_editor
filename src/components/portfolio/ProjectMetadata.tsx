import type { Project } from "@/lib/types";

/** The facts block on a project page. Rows without a value are left out. */
export default function ProjectMetadata({ project }: { project: Project }) {
  const rows: [string, string][] = (
    [
      ["Category", project.categoryName ?? ""],
      ["Year", project.year],
      ["Client", project.client],
      ["Format", project.clientType],
      ["Duration", project.duration],
      ["Our role", project.role],
    ] as [string, string][]
  ).filter(([, v]) => v);

  return (
    <dl className="border-t border-ink">
      {rows.map(([k, v]) => (
        <div key={k} className="flex justify-between gap-6 border-b border-line py-3.5">
          <dt className="t-meta pt-0.5 text-secondary-aa">{k}</dt>
          <dd className="text-right text-[15px]">{v}</dd>
        </div>
      ))}
      {project.software.length > 0 && (
        <div className="flex justify-between gap-6 border-b border-line py-3.5">
          <dt className="t-meta pt-0.5 text-secondary-aa">Software</dt>
          <dd className="text-right text-[15px]">{project.software.join(", ")}</dd>
        </div>
      )}
    </dl>
  );
}
