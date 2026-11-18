import type { Metadata } from "next";
import { env } from "./env";
import type { Profile, Project } from "./types";
import { parseVideo, toIsoDuration } from "./video";

export const absoluteUrl = (path = "/") => (/^https?:\/\//i.test(path) ? path : `${env.siteUrl}${path === "/" ? "" : path}`);

type PageMeta = {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article" | "video.other";
};

/** Unique title, description, canonical and Open Graph / Twitter for one page. */
export function pageMetadata({ title, description, path, image, type = "website" }: PageMeta): Metadata {
  const images = image ? [{ url: absoluteUrl(image), width: 1600, height: 900, alt: title }] : undefined;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: absoluteUrl(path), type, images },
    twitter: { card: images ? "summary_large_image" : "summary", title, description, images: images?.map((i) => i.url) },
    robots: env.allowIndexing ? undefined : { index: false, follow: false },
  };
}

export function siteJsonLd(profile: Profile) {
  const id = `${env.siteUrl}/#studio`;
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${env.siteUrl}/#website`,
      url: env.siteUrl,
      name: profile.brandName,
      publisher: { "@id": id },
    },
    {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "@id": id,
      name: profile.brandName,
      description: profile.heroText,
      url: env.siteUrl,
      email: profile.email || undefined,
      telephone: profile.phone || undefined,
      image: profile.team[0]?.photoUrl ? absoluteUrl(profile.team[0].photoUrl) : undefined,
      areaServed: "Worldwide",
      sameAs: profile.socials.map((s) => s.url).filter(Boolean),
      employee: profile.team.map((m) => ({
        "@type": "Person",
        name: m.name,
        jobTitle: m.role,
        image: m.photoUrl ? absoluteUrl(m.photoUrl) : undefined,
      })),
    },
  ];
}

export function projectJsonLd(project: Project, profile: Profile) {
  const video = parseVideo(project.videoUrl);
  const thumb = project.thumbnailUrl || (video.kind === "youtube" ? video.thumbnail : "");
  const nodes: object[] = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
        { "@type": "ListItem", position: 2, name: "Work", item: absoluteUrl("/work") },
        { "@type": "ListItem", position: 3, name: project.title, item: absoluteUrl(`/work/${project.slug}`) },
      ],
    },
  ];
  // VideoObject only when there is a real video to point at.
  if (video.kind !== "none" && thumb) {
    nodes.push({
      "@context": "https://schema.org",
      "@type": "VideoObject",
      name: project.title,
      description: project.summary || project.description || project.title,
      thumbnailUrl: [absoluteUrl(thumb)],
      uploadDate: project.updatedAt || undefined,
      duration: project.duration ? toIsoDuration(project.duration) : undefined,
      embedUrl: video.kind === "file" ? undefined : video.embedUrl.split("?")[0],
      contentUrl: video.kind === "file" ? absoluteUrl(video.src) : undefined,
      creator: { "@id": `${env.siteUrl}/#studio`, name: profile.brandName },
    });
  }
  return nodes;
}
