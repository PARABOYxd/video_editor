import { z } from "zod";
import { ASPECT_RATIOS } from "./types";

export const PROJECT_TYPES = [
  "Reels & Shorts",
  "YouTube video",
  "Brand film",
  "Commercial",
  "Travel / cinematic",
  "Motion graphics",
  "Podcast",
  "Something else",
] as const;

export const DEADLINES = ["As soon as possible", "Within 2 weeks", "Within a month", "1–3 months", "Flexible"] as const;

export const BUDGETS = ["Under ₹10,000", "₹10,000 – ₹25,000", "₹25,000 – ₹50,000", "₹50,000 – ₹1,00,000", "Above ₹1,00,000", "Not sure yet"] as const;

export const inquirySchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(100),
  email: z.email("Please enter a valid email address.").trim().max(200),
  projectType: z.enum(PROJECT_TYPES, { error: "Please choose a project type." }),
  budget: z.enum(BUDGETS, { error: "Please choose a budget range." }),
  deadline: z.enum(DEADLINES, { error: "Please choose a timeline." }),
  message: z.string().trim().min(20, "Tell us a little more (at least 20 characters).").max(4000),
});

const optionalUrl = z
  .string()
  .trim()
  .max(2000)
  .refine((v) => v === "" || v.startsWith("/") || /^https?:\/\//i.test(v), "Use a full https:// link.");

export const projectSchema = z.object({
  title: z.string().trim().min(2, "Title is required.").max(160),
  slug: z
    .string()
    .trim()
    .max(80)
    .refine((v) => v === "" || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v), "Use lowercase letters, numbers and dashes."),
  categoryId: z.coerce.number().int().positive().nullable(),
  client: z.string().trim().max(120),
  clientType: z.string().trim().max(120),
  summary: z.string().trim().max(240),
  description: z.string().trim().max(8000),
  background: z.string().trim().max(4000),
  objective: z.string().trim().max(4000),
  approach: z.string().trim().max(4000),
  role: z.string().trim().max(600),
  software: z.array(z.string().trim().max(60)).max(20),
  aspectRatio: z.enum(ASPECT_RATIOS),
  gallery: z.array(optionalUrl).max(12),
  seoTitle: z.string().trim().max(70, "Keep SEO titles under 70 characters."),
  seoDescription: z.string().trim().max(170, "Keep SEO descriptions under 170 characters."),
  duration: z
    .string()
    .trim()
    .refine((v) => v === "" || /^(\d{1,2}:)?\d{1,2}:\d{2}$/.test(v), "Use mm:ss or h:mm:ss, e.g. 01:30."),
  videoUrl: optionalUrl,
  thumbnailUrl: optionalUrl,
  posterUrl: optionalUrl,
  year: z.string().trim().max(4),
  featured: z.boolean(),
  published: z.boolean(),
  sort: z.coerce.number().int().min(0).max(9999),
});

export const testimonialSchema = z.object({
  name: z.string().trim().min(2).max(100),
  role: z.string().trim().max(160),
  quote: z.string().trim().min(10).max(1200),
  photoUrl: optionalUrl,
  published: z.boolean(),
  sort: z.coerce.number().int().min(0).max(9999),
});

export const serviceSchema = z.object({
  title: z.string().trim().min(2).max(120),
  description: z.string().trim().max(600),
  deliverables: z.string().trim().max(600),
  idealFor: z.string().trim().max(600),
  process: z.string().trim().max(600),
  sort: z.coerce.number().int().min(0).max(9999),
});

export const categorySchema = z.object({
  name: z.string().trim().min(2).max(60),
  sort: z.coerce.number().int().min(0).max(9999),
});

/** Form errors keyed by field, ready for the UI. */
export type FieldErrors = Partial<Record<string, string>>;

export function fieldErrors(error: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    out[key] ??= issue.message;
  }
  return out;
}
