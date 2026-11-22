import type { MetadataRoute } from "next";
import { CONTENT_UPDATED } from "@/config/content";
import { getProjects } from "@/lib/content";
import { env } from "@/lib/env";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjects();
  const base = env.siteUrl;
  const copy = new Date(CONTENT_UPDATED);
  // Home and /work also change whenever a project does.
  const latest = projects.reduce((max, p) => (new Date(p.updatedAt) > max ? new Date(p.updatedAt) : max), copy);

  return [
    { url: base, lastModified: latest, priority: 1 },
    { url: `${base}/work`, lastModified: latest, priority: 0.9 },
    { url: `${base}/about`, lastModified: copy, priority: 0.7 },
    { url: `${base}/services`, lastModified: copy, priority: 0.8 },
    { url: `${base}/contact`, lastModified: copy, priority: 0.6 },
    ...projects.map((p) => ({ url: `${base}/work/${p.slug}`, lastModified: new Date(p.updatedAt), priority: 0.8 })),
  ];
}
