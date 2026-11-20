import "server-only";
import { cache } from "react";
import { getDb, slugify, type Row } from "./db";
import { env } from "./env";

/** Local "/videos/x.mp4" → "<MEDIA_BASE_URL>/x.mp4" when videos are hosted on Cloudflare R2. */
const media = (url: string) => (env.mediaBaseUrl && url.startsWith("/videos/") ? env.mediaBaseUrl + url.slice("/videos".length) : url);
import { seedCategories, seedProfile, seedProjectDescription, seedProjects, seedServices } from "./seed";
import { ASPECT_RATIOS, type AspectRatio, type Category, type Inquiry, type Profile, type Project, type Service, type Testimonial } from "./types";

/* Read layer used by every page. With no database it serves the seed. */

const iso = (v: unknown) => (v instanceof Date ? v.toISOString() : String(v ?? ""));
const text = (v: unknown) => String(v ?? "");
const list = (v: unknown): string[] => {
  const arr = typeof v === "string" ? (() => { try { return JSON.parse(v); } catch { return []; } })() : v;
  return Array.isArray(arr) ? arr.map(String).filter(Boolean) : [];
};
const ratio = (v: unknown): AspectRatio => (ASPECT_RATIOS as readonly string[]).includes(String(v)) ? (v as AspectRatio) : "16:9";

function toProject(r: Row): Project {
  const seed = seedProjects.find((p) => p.slug === r.slug);
  return {
    id: Number(r.id),
    slug: String(r.slug),
    title: String(r.title),
    categoryId: r.category_id == null ? null : Number(r.category_id),
    categoryName: (r.category_name as string) ?? null,
    categorySlug: (r.category_slug as string) ?? null,
    client: text(r.client),
    clientType: text(r.client_type),
    summary: text(r.summary) || (seed?.summary ?? ""),
    description: text(r.description),
    background: text(r.background),
    objective: text(r.objective),
    approach: text(r.approach),
    role: text(r.role),
    software: list(r.software),
    duration: text(r.duration) || (seed?.duration ?? "02:30"),
    videoUrl: media(text(r.video_url) || (seed?.videoUrl ?? "")),
    posterUrl: text(r.poster_url) || (seed?.posterUrl ?? ""),
    thumbnailUrl: text(r.thumbnail_url) || (seed?.thumbnailUrl ?? ""),
    aspectRatio: ratio(r.aspect_ratio || seed?.aspectRatio),
    gallery: list(r.gallery),
    year: String(r.year ?? seed?.year ?? "2026"),
    featured: Boolean(r.featured),
    published: Boolean(r.published),
    isSample: Boolean(r.is_sample),
    sort: Number(r.sort ?? 0),
    seoTitle: text(r.seo_title),
    seoDescription: text(r.seo_description),
    updatedAt: iso(r.updated_at),
  };
}

const seedCats: Category[] = seedCategories.map((name, i) => ({ id: i + 1, name, slug: slugify(name), sort: i }));
const seedProjectList: Project[] = seedProjects.map((p, i) => {
  const cat = seedCats.find((c) => c.name === p.category) ?? null;
  return {
    id: i + 1,
    slug: p.slug,
    title: p.title,
    categoryId: cat?.id ?? null,
    categoryName: cat?.name ?? null,
    categorySlug: cat?.slug ?? null,
    client: "",
    clientType: p.clientType,
    summary: p.summary,
    description: seedProjectDescription,
    background: "",
    objective: "",
    approach: "",
    role: "",
    software: [],
    duration: p.duration,
    videoUrl: media(p.videoUrl),
    posterUrl: p.posterUrl,
    thumbnailUrl: p.thumbnailUrl,
    aspectRatio: p.aspectRatio,
    gallery: [],
    year: p.year,
    featured: p.featured,
    published: true,
    isSample: true,
    sort: i,
    seoTitle: "",
    seoDescription: "",
    updatedAt: "2026-11-18T00:00:00.000Z",
  };
});

const PROJECT_SELECT = `
  select p.*, c.name as category_name, c.slug as category_slug
  from projects p left join categories c on c.id = p.category_id`;

export const getProfile = cache(async (): Promise<Profile> => {
  const db = await getDb();
  if (!db) return { ...seedProfile, showreelUrl: media(seedProfile.showreelUrl) };
  const rows = await db.query<{ value: Profile }>("select value from settings where key = 'profile'");
  const val = rows[0]?.value ?? {};
  return {
    ...seedProfile,
    ...val,
    showreelUrl: media(val.showreelUrl || seedProfile.showreelUrl),
    showreelPoster: val.showreelPoster || seedProfile.showreelPoster,
  };
});

export const getCategories = cache(async (): Promise<Category[]> => {
  const db = await getDb();
  if (!db) return seedCats;
  const rows = await db.query("select * from categories order by sort, name");
  return rows.map((r) => ({ id: Number(r.id), name: String(r.name), slug: String(r.slug), sort: Number(r.sort) }));
});

/** Published projects, in display order. */
export const getProjects = cache(async (): Promise<Project[]> => {
  const db = await getDb();
  if (!db) return seedProjectList;
  const rows = await db.query(`${PROJECT_SELECT} where p.published order by p.sort, p.created_at desc`);
  const projects = rows.map(toProject);
  for (const sp of seedProjectList) {
    if (!projects.some((p) => p.slug === sp.slug)) {
      projects.push(sp);
    }
  }
  return projects;
});

export const getProjectBySlug = cache(async (slug: string): Promise<Project | null> => {
  const db = await getDb();
  if (!db) return seedProjectList.find((p) => p.slug === slug) ?? null;
  const rows = await db.query(`${PROJECT_SELECT} where p.slug = $1 and p.published`, [slug]);
  if (rows[0]) return toProject(rows[0]);
  return seedProjectList.find((p) => p.slug === slug) ?? null;
});

export const getServices = cache(async (): Promise<Service[]> => {
  const db = await getDb();
  if (!db) return seedServices.map((sv, i) => ({ id: i + 1, ...sv, sort: i }));
  const rows = await db.query("select * from services order by sort, id");
  // Guard against repeated seed rows: show each service title once.
  const unique = rows.filter((r, i) => rows.findIndex((x) => x.title === r.title) === i);
  return unique.map((r) => ({
    id: Number(r.id),
    title: text(r.title),
    description: text(r.description),
    deliverables: text(r.deliverables),
    idealFor: text(r.ideal_for),
    process: text(r.process),
    sort: Number(r.sort),
  }));
});

function toTestimonial(r: Row): Testimonial {
  return {
    id: Number(r.id),
    name: String(r.name),
    role: String(r.role ?? ""),
    quote: String(r.quote),
    photoUrl: String(r.photo_url ?? ""),
    published: Boolean(r.published),
    sort: Number(r.sort ?? 0),
  };
}

/** Published testimonials only. Empty until real ones are added. */
export const getTestimonials = cache(async (): Promise<Testimonial[]> => {
  const db = await getDb();
  if (!db) return [];
  const rows = await db.query("select * from testimonials where published order by sort, id");
  return rows.map(toTestimonial);
});

/* ---------------- admin reads (include drafts, need a database) --------------- */

export async function adminGetProjects(): Promise<Project[]> {
  const db = await getDb();
  if (!db) return seedProjectList;
  const rows = await db.query(`${PROJECT_SELECT} order by p.sort, p.created_at desc`);
  return rows.map(toProject);
}

export async function adminGetProject(id: number): Promise<Project | null> {
  const db = await getDb();
  if (!db) return seedProjectList.find((p) => p.id === id) ?? null;
  const rows = await db.query(`${PROJECT_SELECT} where p.id = $1`, [id]);
  return rows[0] ? toProject(rows[0]) : null;
}

export async function adminGetTestimonials(): Promise<Testimonial[]> {
  const db = await getDb();
  if (!db) return [];
  const rows = await db.query("select * from testimonials order by sort, id");
  return rows.map(toTestimonial);
}

export async function adminGetInquiries(): Promise<Inquiry[]> {
  const db = await getDb();
  if (!db) return [];
  const rows = await db.query("select * from inquiries order by created_at desc limit 500");
  return rows.map((r) => ({
    id: Number(r.id),
    name: String(r.name),
    email: String(r.email),
    projectType: String(r.project_type ?? ""),
    budget: String(r.budget ?? ""),
    deadline: text(r.deadline),
    message: String(r.message),
    read: Boolean(r.read),
    createdAt: iso(r.created_at),
  }));
}

export async function adminCounts() {
  const db = await getDb();
  if (!db) return { projects: seedProjectList.length, samples: seedProjectList.length, unread: 0, inquiries: 0, testimonials: 0 };
  const [r] = await db.query(`select
      (select count(*) from projects) as projects,
      (select count(*) from projects where is_sample) as samples,
      (select count(*) from inquiries where not read) as unread,
      (select count(*) from inquiries) as inquiries,
      (select count(*) from testimonials) as testimonials`);
  return {
    projects: Number(r.projects),
    samples: Number(r.samples),
    unread: Number(r.unread),
    inquiries: Number(r.inquiries),
    testimonials: Number(r.testimonials),
  };
}
