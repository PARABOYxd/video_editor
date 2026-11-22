import "server-only";
import { cache } from "react";
import { getDb, slugify, type Row } from "./db";
import { env } from "./env";
import { isRetiredMedia, isRetiredProject } from "./retired";
import { seedCategories, seedProfile, seedServices } from "./seed";
import {
  ASPECT_RATIOS,
  PROJECT_KINDS,
  type AspectRatio,
  type Category,
  type Inquiry,
  type Profile,
  type Project,
  type ProjectKind,
  type Service,
  type Testimonial,
} from "./types";

/** Local "/videos/x.mp4" → "<MEDIA_BASE_URL>/x.mp4" when videos are hosted on Cloudflare R2. */
const media = (url: string) => (env.mediaBaseUrl && url.startsWith("/videos/") ? env.mediaBaseUrl + url.slice("/videos".length) : url);

/*
 * Read layer used by every page. With no database it serves the seed profile
 * and services, and no projects: there is no such thing as a starter project.
 */

const iso = (v: unknown) => (v instanceof Date ? v.toISOString() : String(v ?? ""));
const text = (v: unknown) => String(v ?? "");
const list = (v: unknown): string[] => {
  const arr = typeof v === "string" ? (() => { try { return JSON.parse(v); } catch { return []; } })() : v;
  return Array.isArray(arr) ? arr.map(String).filter(Boolean) : [];
};
const ratio = (v: unknown): AspectRatio => (ASPECT_RATIOS as readonly string[]).includes(String(v)) ? (v as AspectRatio) : "16:9";

const kind = (v: unknown) => ((PROJECT_KINDS as readonly unknown[]).includes(v) ? (v as ProjectKind) : undefined);

/** Seeded sample rows and withdrawn work never reach the public site. */
const isPublic = (p: Project) => !p.isSample && !isRetiredProject(p);

function toProject(r: Row): Project {
  return {
    id: Number(r.id),
    slug: String(r.slug),
    title: String(r.title),
    categoryId: r.category_id == null ? null : Number(r.category_id),
    categoryName: (r.category_name as string) ?? null,
    categorySlug: (r.category_slug as string) ?? null,
    client: text(r.client),
    clientType: text(r.client_type),
    summary: text(r.summary),
    description: text(r.description),
    background: text(r.background),
    objective: text(r.objective),
    approach: text(r.approach),
    role: text(r.role),
    result: text(r.result),
    captionsUrl: text(r.captions_url),
    software: list(r.software),
    duration: text(r.duration),
    videoUrl: media(text(r.video_url)),
    posterUrl: text(r.poster_url),
    thumbnailUrl: text(r.thumbnail_url),
    aspectRatio: ratio(r.aspect_ratio),
    gallery: list(r.gallery),
    year: text(r.year),
    featured: Boolean(r.featured),
    published: Boolean(r.published),
    isSample: Boolean(r.is_sample),
    projectType: kind(r.project_type),
    footageSource: text(r.footage_source),
    sort: Number(r.sort ?? 0),
    seoTitle: text(r.seo_title),
    seoDescription: text(r.seo_description),
    createdAt: iso(r.created_at),
    updatedAt: iso(r.updated_at),
  };
}

const seedCats: Category[] = seedCategories.map((name, i) => ({ id: i + 1, name, slug: slugify(name), sort: i }));
const PROJECT_SELECT = `
  select p.*, c.name as category_name, c.slug as category_slug
  from projects p left join categories c on c.id = p.category_id`;

export const getProfile = cache(async (): Promise<Profile> => {
  const db = await getDb();
  const rows = db ? await db.query<{ value: Profile }>("select value from settings where key = 'profile'") : [];
  const profile: Profile = { ...seedProfile, ...rows[0]?.value };
  // No reel, or a withdrawn one, means no showreel at all (poster included).
  const url = (profile.showreelUrl ?? "").trim();
  const hasReel = url !== "" && !isRetiredMedia(url);
  const poster = profile.showreelPoster ?? "";
  return {
    ...profile,
    showreelUrl: hasReel ? media(url) : "",
    showreelPoster: hasReel && !isRetiredMedia(poster) ? poster : "",
  };
});

export const getCategories = cache(async (): Promise<Category[]> => {
  const db = await getDb();
  if (!db) return seedCats;
  const rows = await db.query("select * from categories order by sort, name");
  return rows.map((r) => ({ id: Number(r.id), name: String(r.name), slug: String(r.slug), sort: Number(r.sort) }));
});

/** Published projects that are really ours to show, in display order. */
export const getProjects = cache(async (): Promise<Project[]> => {
  const db = await getDb();
  if (!db) return [];
  const rows = await db.query(`${PROJECT_SELECT} where p.published order by p.sort, p.created_at desc`);
  return rows.map(toProject).filter(isPublic);
});

export const getProjectBySlug = cache(async (slug: string): Promise<Project | null> => {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.query(`${PROJECT_SELECT} where p.slug = $1 and p.published`, [slug]);
  const project = rows[0] ? toProject(rows[0]) : null;
  return project && isPublic(project) ? project : null;
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
  if (!db) return [];
  const rows = await db.query(`${PROJECT_SELECT} order by p.sort, p.created_at desc`);
  return rows.map(toProject);
}

export async function adminGetProject(id: number): Promise<Project | null> {
  const db = await getDb();
  if (!db) return null;
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
    reference: text(r.reference_url),
    message: String(r.message),
    read: Boolean(r.read),
    createdAt: iso(r.created_at),
  }));
}

export async function adminCounts() {
  const db = await getDb();
  if (!db) return { projects: 0, hidden: 0, unread: 0, inquiries: 0, testimonials: 0 };
  const projects = (await db.query(PROJECT_SELECT)).map(toProject);
  const [r] = await db.query(`select
      (select count(*) from inquiries where not read) as unread,
      (select count(*) from inquiries) as inquiries,
      (select count(*) from testimonials) as testimonials`);
  return {
    projects: projects.filter(isPublic).filter((p) => p.published).length,
    hidden: projects.filter((p) => !isPublic(p)).length,
    unread: Number(r.unread),
    inquiries: Number(r.inquiries),
    testimonials: Number(r.testimonials),
  };
}
