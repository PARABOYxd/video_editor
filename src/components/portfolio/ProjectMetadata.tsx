import type { Project } from "@/lib/types";
import Badge from "@/components/ui/Badge";

/** The meta row under the player. Facts without a value are left out. */
export default function ProjectMetadata({ project }: { project: Project }) {
  const facts = [
    ["Category", project.categoryName ?? ""],
    ["Year", project.year],
    ["Duration", project.duration],
    ["Format", [project.clientType, project.aspectRatio].filter(Boolean).join(" · ")],
    ["Client", project.client],
  ].filter(([, value]) => value);

  return (
    <dl data-meta-row className="flex flex-wrap gap-x-10 gap-y-6 border-y border-line py-6">
      {facts.map(([label, value]) => (
        <div key={label} className="min-w-28">
          <dt className="t-meta text-secondary">{label}</dt>
          <dd className="mt-1.5 text-body-sm">{value}</dd>
        </div>
      ))}
      {project.software.length > 0 && (
        <div>
          <dt className="t-meta text-secondary">Tools used</dt>
          <dd className="mt-1.5">
            <ul className="flex flex-wrap gap-2">
              {project.software.map((tool) => (
                <li key={tool}>
                  <Badge>{tool}</Badge>
                </li>
              ))}
            </ul>
          </dd>
        </div>
      )}
    </dl>
  );
}
