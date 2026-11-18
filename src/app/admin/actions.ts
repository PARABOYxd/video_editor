"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/dal";
import { verifyPassword } from "@/lib/auth/password";
import { SESSION_COOKIE, SESSION_TTL_SECONDS, signSession } from "@/lib/auth/session";
import { getProfile } from "@/lib/content";
import { requireDb, slugify } from "@/lib/db";
import { adminConfigured, env } from "@/lib/env";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import type { Profile } from "@/lib/types";
import { uploadImage } from "@/lib/upload";
import {
  categorySchema,
  fieldErrors,
  projectSchema,
  serviceSchema,
  testimonialSchema,
  type FieldErrors,
} from "@/lib/validation";
import { parseVideo } from "@/lib/video";

export type FormState = { status: "idle" | "success" | "error"; message?: string; errors?: FieldErrors };

const str = (fd: FormData, k: string) => String(fd.get(k) ?? "");
const bool = (fd: FormData, k: string) => fd.get(k) === "on";
const file = (fd: FormData, k: string) => {
  const f = fd.get(k);
  return f instanceof File && f.size > 0 ? f : null;
};
const files = (fd: FormData, k: string) => fd.getAll(k).filter((f): f is File => f instanceof File && f.size > 0);
/** One item per line, blanks dropped. */
const lines = (s: string) =>
  s
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

/** Refresh every public page; the site is small, so one call keeps it simple. */
function refreshSite() {
  revalidatePath("/", "layout");
}

function fail(err: unknown): FormState {
  return { status: "error", message: err instanceof Error ? err.message : "Something went wrong." };
}

/* ------------------------------------------------------------------ auth */

export async function login(_prev: FormState, fd: FormData): Promise<FormState> {
  if (!adminConfigured) {
    return { status: "error", message: "Admin login isn't configured. Set ADMIN_EMAIL, ADMIN_PASSWORD_HASH and SESSION_SECRET." };
  }
  if (!rateLimit(`login:${await clientIp()}`, 8, 15 * 60 * 1000)) {
    return { status: "error", message: "Too many attempts. Try again in 15 minutes." };
  }
  const email = str(fd, "email").trim().toLowerCase();
  const password = str(fd, "password");
  // Always run the (slow) hash check so response time doesn't reveal whether the email matched.
  const passwordOk = await verifyPassword(password, env.adminPasswordHash);
  if (!passwordOk || email !== env.adminEmail) return { status: "error", message: "Email or password is incorrect." };

  (await cookies()).set(SESSION_COOKIE, await signSession(email, env.sessionSecret), {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
  const next = str(fd, "next");
  redirect(next.startsWith("/admin") && !next.startsWith("//") ? next : "/admin");
}

export async function logout() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/admin/login");
}

/* -------------------------------------------------------------- projects */

export async function saveProject(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const id = Number(str(fd, "id")) || null;
  const parsed = projectSchema.safeParse({
    title: str(fd, "title"),
    slug: str(fd, "slug"),
    categoryId: str(fd, "categoryId") || null,
    client: str(fd, "client"),
    clientType: str(fd, "clientType"),
    summary: str(fd, "summary"),
    description: str(fd, "description"),
    background: str(fd, "background"),
    objective: str(fd, "objective"),
    approach: str(fd, "approach"),
    role: str(fd, "role"),
    software: lines(str(fd, "software")),
    aspectRatio: str(fd, "aspectRatio") || "16:9",
    gallery: lines(str(fd, "gallery")),
    seoTitle: str(fd, "seoTitle"),
    seoDescription: str(fd, "seoDescription"),
    duration: str(fd, "duration"),
    videoUrl: str(fd, "videoUrl"),
    thumbnailUrl: str(fd, "thumbnailUrl"),
    posterUrl: str(fd, "posterUrl"),
    year: str(fd, "year"),
    featured: bool(fd, "featured"),
    published: bool(fd, "published"),
    sort: str(fd, "sort") || 0,
  });
  if (!parsed.success) return { status: "error", message: "Please fix the highlighted fields.", errors: fieldErrors(parsed.error) };

  const p = parsed.data;
  if (p.videoUrl && parseVideo(p.videoUrl).kind === "none") {
    return { status: "error", message: "Please fix the highlighted fields.", errors: { videoUrl: "Use a YouTube, Vimeo or direct .mp4 link." } };
  }
  const slug = p.slug || slugify(p.title);

  try {
    const db = await requireDb();
    const clash = await db.query("select id from projects where slug = $1 and id <> coalesce($2, -1)", [slug, id]);
    if (clash.length) return { status: "error", message: "Please fix the highlighted fields.", errors: { slug: "Another project already uses this URL." } };

    let thumbnailUrl = p.thumbnailUrl;
    const upload = file(fd, "thumbnailFile");
    if (upload) thumbnailUrl = await uploadImage(upload, "thumbnails", slug);
    if (!thumbnailUrl) {
      const v = parseVideo(p.videoUrl);
      if (v.kind === "youtube") thumbnailUrl = v.thumbnail;
    }
    let posterUrl = p.posterUrl;
    const posterUpload = file(fd, "posterFile");
    if (posterUpload) posterUrl = await uploadImage(posterUpload, "posters", slug);

    const gallery = [...p.gallery];
    for (const [i, g] of files(fd, "galleryFiles").slice(0, 12 - gallery.length).entries()) {
      gallery.push(await uploadImage(g, "gallery", `${slug}-${i + 1}`));
    }

    const values = [
      slug, p.title, p.categoryId, p.client, p.clientType, p.summary, p.description, p.background, p.objective, p.approach,
      p.role, JSON.stringify(p.software), p.duration, p.videoUrl, posterUrl, thumbnailUrl, p.aspectRatio, JSON.stringify(gallery),
      p.year, p.featured, p.published, p.sort, p.seoTitle, p.seoDescription,
    ];
    if (id) {
      await db.query(
        `update projects set slug=$1, title=$2, category_id=$3, client=$4, client_type=$5, summary=$6, description=$7,
         background=$8, objective=$9, approach=$10, role=$11, software=$12::jsonb, duration=$13, video_url=$14,
         poster_url=$15, thumbnail_url=$16, aspect_ratio=$17, gallery=$18::jsonb, year=$19, featured=$20, published=$21,
         sort=$22, seo_title=$23, seo_description=$24, is_sample=false, updated_at=now() where id=$25`,
        [...values, id]
      );
    } else {
      await db.query(
        `insert into projects (slug, title, category_id, client, client_type, summary, description, background, objective,
         approach, role, software, duration, video_url, poster_url, thumbnail_url, aspect_ratio, gallery, year, featured,
         published, sort, seo_title, seo_description)
         values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12::jsonb,$13,$14,$15,$16,$17,$18::jsonb,$19,$20,$21,$22,$23,$24)`,
        values
      );
    }
  } catch (err) {
    return fail(err);
  }
  refreshSite();
  redirect("/admin/projects?saved=1");
}

export async function deleteProject(fd: FormData) {
  await requireAdmin();
  const db = await requireDb();
  await db.query("delete from projects where id = $1", [Number(str(fd, "id"))]);
  refreshSite();
  redirect("/admin/projects?deleted=1");
}

/* ------------------------------------------------------------ categories */

export async function saveCategory(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const id = Number(str(fd, "id")) || null;
  const parsed = categorySchema.safeParse({ name: str(fd, "name"), sort: str(fd, "sort") || 0 });
  if (!parsed.success) return { status: "error", message: "Please fix the highlighted fields.", errors: fieldErrors(parsed.error) };
  try {
    const db = await requireDb();
    const slug = slugify(parsed.data.name);
    const clash = await db.query("select id from categories where slug = $1 and id <> coalesce($2, -1)", [slug, id]);
    if (clash.length) return { status: "error", message: "That category already exists.", errors: { name: "Already exists." } };
    if (id) await db.query("update categories set name=$1, slug=$2, sort=$3 where id=$4", [parsed.data.name, slug, parsed.data.sort, id]);
    else await db.query("insert into categories (name, slug, sort) values ($1, $2, $3)", [parsed.data.name, slug, parsed.data.sort]);
  } catch (err) {
    return fail(err);
  }
  refreshSite();
  return { status: "success", message: "Category saved." };
}

export async function deleteCategory(fd: FormData) {
  await requireAdmin();
  const db = await requireDb();
  // Projects in this category keep existing, just uncategorised (FK: on delete set null).
  await db.query("delete from categories where id = $1", [Number(str(fd, "id"))]);
  refreshSite();
  redirect("/admin/categories");
}

/* ------------------------------------------------------------- services */

export async function saveService(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const id = Number(str(fd, "id")) || null;
  const parsed = serviceSchema.safeParse({
    title: str(fd, "title"),
    description: str(fd, "description"),
    deliverables: str(fd, "deliverables"),
    idealFor: str(fd, "idealFor"),
    process: str(fd, "process"),
    sort: str(fd, "sort") || 0,
  });
  if (!parsed.success) return { status: "error", message: "Please fix the highlighted fields.", errors: fieldErrors(parsed.error) };
  try {
    const db = await requireDb();
    const { title, description, deliverables, idealFor, process, sort } = parsed.data;
    const values = [title, description, deliverables, idealFor, process, sort];
    if (id) {
      await db.query("update services set title=$1, description=$2, deliverables=$3, ideal_for=$4, process=$5, sort=$6 where id=$7", [...values, id]);
    } else {
      await db.query("insert into services (title, description, deliverables, ideal_for, process, sort) values ($1,$2,$3,$4,$5,$6)", values);
    }
  } catch (err) {
    return fail(err);
  }
  refreshSite();
  return { status: "success", message: "Service saved." };
}

export async function deleteService(fd: FormData) {
  await requireAdmin();
  const db = await requireDb();
  await db.query("delete from services where id = $1", [Number(str(fd, "id"))]);
  refreshSite();
  redirect("/admin/services");
}

/* --------------------------------------------------------- testimonials */

export async function saveTestimonial(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const id = Number(str(fd, "id")) || null;
  const parsed = testimonialSchema.safeParse({
    name: str(fd, "name"),
    role: str(fd, "role"),
    quote: str(fd, "quote"),
    photoUrl: str(fd, "photoUrl"),
    published: bool(fd, "published"),
    sort: str(fd, "sort") || 0,
  });
  if (!parsed.success) return { status: "error", message: "Please fix the highlighted fields.", errors: fieldErrors(parsed.error) };
  try {
    const db = await requireDb();
    let photoUrl = parsed.data.photoUrl;
    const upload = file(fd, "photoFile");
    if (upload) photoUrl = await uploadImage(upload, "testimonials", slugify(parsed.data.name));
    const t = parsed.data;
    const values = [t.name, t.role, t.quote, photoUrl, t.published, t.sort];
    if (id) await db.query("update testimonials set name=$1, role=$2, quote=$3, photo_url=$4, published=$5, sort=$6 where id=$7", [...values, id]);
    else await db.query("insert into testimonials (name, role, quote, photo_url, published, sort) values ($1,$2,$3,$4,$5,$6)", values);
  } catch (err) {
    return fail(err);
  }
  refreshSite();
  return { status: "success", message: "Testimonial saved." };
}

export async function deleteTestimonial(fd: FormData) {
  await requireAdmin();
  const db = await requireDb();
  await db.query("delete from testimonials where id = $1", [Number(str(fd, "id"))]);
  refreshSite();
  redirect("/admin/testimonials");
}

/* ------------------------------------------------------------ inquiries */

export async function setInquiryRead(fd: FormData) {
  await requireAdmin();
  const db = await requireDb();
  await db.query("update inquiries set read = $1 where id = $2", [str(fd, "read") === "true", Number(str(fd, "id"))]);
  revalidatePath("/admin", "layout");
}

export async function deleteInquiry(fd: FormData) {
  await requireAdmin();
  const db = await requireDb();
  await db.query("delete from inquiries where id = $1", [Number(str(fd, "id"))]);
  revalidatePath("/admin", "layout");
}

/* ---------------------------------------------------------------- about */

export async function saveProfile(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const current = await getProfile();
  try {
    const db = await requireDb();

    const team = await Promise.all(
      current.team.map(async (m, i) => {
        const upload = file(fd, `team${i}_photoFile`);
        return {
          name: str(fd, `team${i}_name`).trim() || m.name,
          role: str(fd, `team${i}_role`).trim(),
          bio: str(fd, `team${i}_bio`).trim(),
          photoUrl: upload ? await uploadImage(upload, "team", slugify(m.name)) : str(fd, `team${i}_photoUrl`).trim() || m.photoUrl,
        };
      })
    );

    const posterUpload = file(fd, "showreelPosterFile");
    const showreelUrl = str(fd, "showreelUrl").trim();
    if (showreelUrl && parseVideo(showreelUrl).kind === "none") {
      return { status: "error", message: "Please fix the highlighted fields.", errors: { showreelUrl: "Use a YouTube, Vimeo or direct .mp4 link." } };
    }

    const next: Profile = {
      ...current,
      brandName: str(fd, "brandName").trim() || current.brandName,
      shortName: str(fd, "shortName").trim() || current.shortName,
      roleTitle: str(fd, "roleTitle").trim(),
      location: str(fd, "location").trim(),
      availability: str(fd, "availability").trim(),
      heroLabel: str(fd, "heroLabel").trim(),
      heroHeadline: str(fd, "heroHeadline").trim() || current.heroHeadline,
      heroText: str(fd, "heroText").trim(),
      footerBlurb: str(fd, "footerBlurb").trim(),
      intro: str(fd, "intro").trim(),
      philosophy: str(fd, "philosophy").trim(),
      experience: str(fd, "experience").trim(),
      approach: str(fd, "approach").trim(),
      difference: str(fd, "difference").trim(),
      software: lines(str(fd, "software")),
      team,
      email: str(fd, "email").trim(),
      phone: str(fd, "phone").trim(),
      whatsapp: str(fd, "whatsapp").replace(/\D/g, ""),
      socials: lines(str(fd, "socials"))
        .map((l) => {
          const [label, ...rest] = l.split("|");
          return { label: label.trim(), url: rest.join("|").trim() };
        })
        .filter((s) => s.label && /^https?:\/\//.test(s.url)),
      showreelUrl,
      showreelPoster: posterUpload
        ? await uploadImage(posterUpload, "showreel", "poster")
        : str(fd, "showreelPoster").trim(),
    };

    await db.query(
      "insert into settings (key, value) values ('profile', $1::jsonb) on conflict (key) do update set value = excluded.value",
      [JSON.stringify(next)]
    );
  } catch (err) {
    return fail(err);
  }
  refreshSite();
  return { status: "success", message: "Saved. The live site is updated." };
}
