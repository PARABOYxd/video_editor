/*
 * Contact form rules, shared by the browser and the server action. No zod
 * here on purpose: importing it would add ~30 KB of JS to /contact.
 */

export const INQUIRY_TYPES = [
  "Reels & Shorts",
  "YouTube video",
  "Brand film",
  "Commercial",
  "Travel / cinematic",
  "Wedding film",
  "Motion graphics",
  "Podcast",
  "Something else",
] as const;

export const BUDGETS = ["Under ₹10,000", "₹10,000 – ₹25,000", "₹25,000 – ₹50,000", "₹50,000 – ₹1,00,000", "Above ₹1,00,000", "Not sure yet"] as const;

export const INQUIRY_FIELDS = ["name", "email", "projectType", "budget", "deadline", "message", "reference"] as const;
export type InquiryField = (typeof INQUIRY_FIELDS)[number];
export type InquiryValues = Record<InquiryField, string>;
export type InquiryErrors = Partial<Record<InquiryField, string>>;

/** Today in India, as YYYY-MM-DD (what a date input uses). */
export const todayInIndia = () => new Date(Date.now() + 5.5 * 60 * 60 * 1000).toISOString().slice(0, 10);

export function readInquiry(form: FormData): InquiryValues {
  return Object.fromEntries(INQUIRY_FIELDS.map((k) => [k, String(form.get(k) ?? "").trim()])) as InquiryValues;
}

function isWebLink(value: string) {
  try {
    const url = new URL(value);
    return (url.protocol === "https:" || url.protocol === "http:") && url.hostname.includes(".");
  } catch {
    return false;
  }
}

function isRealDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function validateInquiry(v: InquiryValues): InquiryErrors {
  const e: InquiryErrors = {};

  if (v.name.length < 2) e.name = "Please enter your name.";
  else if (v.name.length > 100) e.name = "Please keep your name under 100 characters.";

  if (v.email.length > 200 || !/^[A-Za-z0-9._%+'-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/.test(v.email)) {
    e.email = "Please enter a valid email address.";
  }
  if (!(INQUIRY_TYPES as readonly string[]).includes(v.projectType)) e.projectType = "Please choose a project type.";
  if (!(BUDGETS as readonly string[]).includes(v.budget)) e.budget = "Please choose a budget range.";

  if (v.deadline) {
    if (!isRealDate(v.deadline)) e.deadline = "Please enter a valid date.";
    else if (v.deadline < todayInIndia()) e.deadline = "Please choose today or a later date.";
  }

  if (v.message.length < 20) e.message = "Tell us a little more (at least 20 characters).";
  else if (v.message.length > 4000) e.message = "Please keep the message under 4,000 characters.";

  if (v.reference && (v.reference.length > 500 || !isWebLink(v.reference))) e.reference = "Use a full link, starting with https://";

  return e;
}
