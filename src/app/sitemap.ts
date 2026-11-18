import type { MetadataRoute } from "next";
import { getProjects } from "@/lib/content";
import { env } from "@/lib/env";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjects();
  const base = env.siteUrl;
  const latest = projects.reduce((max, p) => (p.updatedAt > max ? p.updatedAt : max), "");
  const lastModified = latest ? new Date(latest) : undefined;

  return [
    { url: base, lastModified, priority: 1 },
    { url: `${base}/work`, lastModified, priority: 0.9 },
    { url: `${base}/about`, priority: 0.7 },
    { url: `${base}/services`, priority: 0.7 },
    { url: `${base}/contact`, priority: 0.6 },
    ...projects.map((p) => ({ url: `${base}/work/${p.slug}`, lastModified: new Date(p.updatedAt), priority: 0.8 })),
  ];
}
