import type { Metadata } from "next";
import { PRICE_RANGE } from "@/config/content";
import { LOCATION } from "@/config/location";
import { env } from "./env";
import type { Profile, Project, Service } from "./types";
import { parseVideo, toIsoDuration } from "./video";

export const absoluteUrl = (path = "/") => (/^https?:\/\//i.test(path) ? path : `${env.siteUrl}${path === "/" ? "" : path}`);

export const SITE_NAME = "Rytora Studio";
export const TITLE_TEMPLATE = `%s | ${SITE_NAME}`;

/** The pages with a generated share image at /og/<page>. */
export const OG_PAGES = ["home", "work", "about", "services", "contact", "project"] as const;
export type OgPage = (typeof OG_PAGES)[number];
export const OG_SIZE = { width: 1200, height: 630 };

type PageMeta = {
  title: string;
  description: string;
  path: string;
  /** A real still (a project's poster). Otherwise the branded image for `og` is used. */
  image?: string;
  og?: OgPage;
  type?: "website" | "video.other";
  /** The title already carries the brand, or is too long to: skip the template. */
  absolute?: boolean;
};

/** Unique title, description, canonical and Open Graph / Twitter for one page. */
export function pageMetadata({ title, description, path, image, og = "home", type = "website", absolute = false }: PageMeta): Metadata {
  const shown = absolute ? title : TITLE_TEMPLATE.replace("%s", title);
  const images = image ? [{ url: absoluteUrl(image), alt: title }] : [{ url: absoluteUrl(`/og/${og}`), ...OG_SIZE, type: "image/png", alt: shown }];
  return {
    title: absolute ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    // A page's openGraph replaces the layout's, so the site defaults are repeated.
    openGraph: { title: shown, description, url: absoluteUrl(path), type, siteName: SITE_NAME, locale: "en_IN", images },
    twitter: { card: "summary_large_image", title: shown, description, images: images.map(({ url, alt }) => ({ url, alt })) },
    robots: env.allowIndexing ? undefined : { index: false, follow: false },
  };
}

/** Cuts at a word boundary, to at most `max` characters. */
function clip(value: string, max: number) {
  const text = value.replace(/\s+/g, " ").trim();
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  const space = cut.lastIndexOf(" ");
  return `${cut.slice(0, space > 0 ? space : cut.length).replace(/[\s,;:|·-]+$/, "")}…`;
}

/** Fits the project's own title into 50–60 characters. The title on the page is untouched. */
export function projectTitle(project: Project): { title: string; absolute: boolean } {
  if (project.seoTitle) return { title: project.seoTitle, absolute: project.seoTitle.length > 44 || project.seoTitle.includes(SITE_NAME) };
  const name = project.title.trim();
  const room = 60 - ` | ${SITE_NAME}`.length;
  if (name.length > room) return { title: clip(name, 60), absolute: true };

  const category = project.categoryName;
  const options = [
    category && `${name}: ${category} Video Editing`,
    category && `${name}: ${category} Editing`,
    category && `${name}: ${category} Edit`,
    `${name}: Video Editing Project, Pune`,
    `${name}: Video Editing in Pune`,
    `${name}: Video Editing`,
    category && `${name}: ${category}`,
    name,
  ].filter((t): t is string => Boolean(t) && (t as string).length <= room);
  return { title: options.reduce((best, t) => (t.length > best.length ? t : best)), absolute: false };
}

/** The project's own summary, rounded out to 140–160 characters. */
export function projectDescription(project: Project, profile: Profile) {
  if (project.seoDescription) return project.seoDescription;
  let text = (project.summary || project.description || project.title).replace(/\s+/g, " ").trim();
  const additions = [
    `${project.categoryName ?? "Video"} project in the portfolio of ${profile.brandName}, video editors in ${LOCATION.city}, ${LOCATION.country}.`,
    "Watch the film and read about the edit.",
    "Get in touch for a quote.",
  ];
  for (const more of additions) {
    if (text.length >= 140) break;
    text = `${text.replace(/([^.!?…])$/, "$1.")} ${more}`;
  }
  return clip(text, 160);
}

/* ------------------------------------------------------------------ JSON-LD */

const studioId = () => `${env.siteUrl}/#studio`;
const studioRef = (profile: Profile) => ({ "@type": "Organization", "@id": studioId(), name: profile.brandName, url: env.siteUrl });

// The starter number (+91 98000 00000) must never reach search engines as the studio's phone.
const realPhone = (phone: string) => (phone && !/0{5}$/.test(phone.replace(/\D/g, "")) ? phone : undefined);

const personId = (index: number) => `${env.siteUrl}/about#editor-${index + 1}`;

export function siteJsonLd(profile: Profile, services: Service[]) {
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${env.siteUrl}/#website`,
      url: env.siteUrl,
      name: profile.brandName,
      inLanguage: "en-IN",
      publisher: { "@id": studioId() },
    },
    {
      "@context": "https://schema.org",
      "@type": ["Organization", "ProfessionalService"],
      "@id": studioId(),
      name: profile.brandName,
      description: profile.heroText,
      url: env.siteUrl,
      logo: absoluteUrl("/icons/icon-512.png"),
      image: absoluteUrl("/og/home"),
      email: profile.email || undefined,
      telephone: realPhone(profile.phone),
      priceRange: PRICE_RANGE ?? undefined,
      address: {
        "@type": "PostalAddress",
        addressLocality: LOCATION.city,
        addressRegion: LOCATION.region,
        addressCountry: LOCATION.countryCode,
      },
      areaServed: [
        { "@type": "City", name: LOCATION.city },
        { "@type": "Country", name: LOCATION.country },
      ],
      knowsAbout: services.map((s) => s.title),
      // schema.org puts serviceType on Service, so each service carries its own.
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Video editing services",
        itemListElement: services.map((s) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: s.title, serviceType: s.title },
        })),
      },
      sameAs: profile.socials.map((s) => s.url).filter(Boolean),
      employee: profile.team.map((m, i) => ({ "@type": "Person", "@id": personId(i), name: m.name, jobTitle: m.role })),
    },
  ];
}

export function peopleJsonLd(profile: Profile) {
  return profile.team.map((m, i) => ({
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": personId(i),
    name: m.name,
    jobTitle: m.role,
    description: m.bio || undefined,
    image: m.photoUrl ? absoluteUrl(m.photoUrl) : undefined,
    url: absoluteUrl("/about"),
    worksFor: studioRef(profile),
  }));
}

type ServiceForSchema = { slug: string; title: string; description: string; startingPrice: number | null };

export function servicesJsonLd(services: ServiceForSchema[], profile: Profile) {
  return services.map((s) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${absoluteUrl("/services")}#${s.slug}`,
    url: `${absoluteUrl("/services")}#${s.slug}`,
    name: s.title,
    serviceType: s.title,
    description: s.description || undefined,
    provider: studioRef(profile),
    areaServed: { "@type": "Country", name: LOCATION.country },
    // An Offer only once a real price is in the config.
    offers:
      s.startingPrice === null
        ? undefined
        : {
            "@type": "Offer",
            url: absoluteUrl("/contact"),
            priceCurrency: "INR",
            priceSpecification: { "@type": "PriceSpecification", minPrice: s.startingPrice, priceCurrency: "INR" },
          },
  }));
}

export type Crumb = { name: string; path: string };

export function breadcrumbJsonLd(trail: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, i) => ({ "@type": "ListItem", position: i + 1, name: crumb.name, item: absoluteUrl(crumb.path) })),
  };
}

export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
  };
}

/** Only work explicitly declared as ours (client or spec) is claimed, with us as creator. */
export function projectJsonLd(project: Project, profile: Profile) {
  if (!project.projectType) return [];

  const video = parseVideo(project.videoUrl);
  const thumb = project.thumbnailUrl || project.posterUrl || (video.kind === "youtube" ? video.thumbnail : "");
  const url = absoluteUrl(`/work/${project.slug}`);
  const description = project.summary || project.description || project.title;
  const creator = studioRef(profile);
  const hasVideo = video.kind !== "none" && Boolean(thumb);

  const work = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${url}#work`,
    url,
    name: project.title,
    description,
    genre: project.categoryName ?? undefined,
    dateCreated: /^\d{4}$/.test(project.year) ? project.year : undefined,
    image: thumb ? absoluteUrl(thumb) : undefined,
    creator,
    video: hasVideo ? { "@id": `${url}#video` } : undefined,
  };
  // VideoObject only when there is a real video to point at.
  if (!hasVideo) return [work];

  return [
    work,
    {
      "@context": "https://schema.org",
      "@type": "VideoObject",
      "@id": `${url}#video`,
      name: project.title,
      description,
      thumbnailUrl: [absoluteUrl(thumb)],
      // The day it was published here: stable, unlike updatedAt.
      uploadDate: project.createdAt || project.updatedAt,
      duration: project.duration ? toIsoDuration(project.duration) : undefined,
      embedUrl: video.kind === "file" ? undefined : video.embedUrl.split("?")[0],
      contentUrl: video.kind === "file" ? absoluteUrl(video.src) : undefined,
      creator,
    },
  ];
}
