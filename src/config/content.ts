/*
 * Every piece of content the redesign needed that isn't in the admin.
 *
 * Anything left empty (null, "" or []) stays off the public site and out of
 * structured data, so no invented number, quote, logo or price can go live by
 * accident. Search this file for "TODO".
 */

export type Stat = { label: string; value: number | null; suffix?: string };
export type ClientLogo = { name: string; logo: string; width: number; height: number };
export type ConfigTestimonial = { quote: string; name: string; role: string; avatar: string };

/** When site copy last changed (used by the sitemap). TODO: update when you edit page copy. */
export const CONTENT_UPDATED = "2026-11-22";

/* ---------------------------------------------------------------- homepage */

// TODO: real numbers only. A stat shows once `value` is a number; the strip shows once one does.
export const STATS: Stat[] = [
  { label: "Projects delivered", value: null, suffix: "+" }, // TODO
  { label: "Views generated", value: null, suffix: "M+" }, // TODO: in millions
  { label: "Clients", value: null, suffix: "+" }, // TODO
  { label: "Years editing", value: null }, // TODO
];

// TODO: only clients who agreed to be shown. Put the files in public/logos, e.g.
// { name: "Client name", logo: "/logos/client.svg", width: 160, height: 40 },
export const CLIENT_LOGOS: ClientLogo[] = [];

export const PROCESS = [
  { title: "Brief", text: "You share the footage, references and where the film will live. We agree the scope, timeline and quote." },
  { title: "First cut", text: "We find the story and shape the structure, pace and sound, then send you a cut to watch." },
  { title: "Revisions", text: "You give feedback and we refine the edit with you, in focused rounds agreed at the start." },
  { title: "Final delivery", text: "We finish colour, sound and graphics, then deliver masters in the formats your platforms need." },
];

// TODO: genuine quotes, with permission. Shown alongside any published in /admin/testimonials.
// A card shows only when both quote and name are filled.
export const TESTIMONIALS: ConfigTestimonial[] = [
  { quote: "", name: "", role: "", avatar: "" }, // TODO
  { quote: "", name: "", role: "", avatar: "" }, // TODO
  { quote: "", name: "", role: "", avatar: "" }, // TODO
];

// TODO: confirm each answer. They deliberately promise no numbers: add your real turnaround, rounds and terms.
export const FAQ = [
  {
    question: "How long does an edit take?",
    // TODO: add your typical turnaround.
    answer: "It depends on the amount of footage, the finished length and the graphics and colour work involved. We confirm a delivery date with your quote, before we start.",
  },
  {
    question: "How many revisions are included?",
    // TODO: add the number of rounds you include.
    answer: "We work in focused rounds of feedback. The number of rounds is agreed in your quote, so there are no surprises later.",
  },
  {
    question: "Which file formats will I receive?",
    // TODO: confirm.
    answer: "A master plus the versions your platforms need, for example 16:9 for YouTube or 9:16 for Reels and Shorts, with or without burned-in captions.",
  },
  {
    question: "How do I share my footage?",
    // TODO: name the service you prefer.
    answer: "Send a link to a cloud folder with your raw files, references, logos and fonts. For very large projects, tell us in your brief and we'll agree the easiest way to transfer it.",
  },
  {
    question: "How does payment work?",
    // TODO: add advance %, methods, GST and invoicing.
    answer: "Every project is quoted on its scope. The amount, payment schedule and method are confirmed in writing before work begins.",
  },
];

/* ---------------------------------------------------------------- services */

export type ServiceExtra = {
  included: string[];
  /** Starting price in INR. null shows "Quoted per project" and adds no Offer to structured data. */
  startingPrice: number | null;
  /** e.g. "3–5 working days". null shows "Confirmed with your quote". */
  turnaround: string | null;
  format: string;
  /** Category slug of the related work on /work. */
  category: string | null;
  /** Pre-selected option on the contact form. */
  inquiryType: string;
};

// Keyed by the slug of the service title in /admin/services.
export const SERVICE_EXTRAS: Record<string, ServiceExtra> = {
  "social-media-videos": {
    included: ["Cuts built around the first second", "Captions", "Sound design", "Revisions with you"],
    startingPrice: null, // TODO
    turnaround: null, // TODO
    format: "9:16, 1:1",
    category: "reels-and-shorts",
    inquiryType: "Reels & Shorts",
  },
  "youtube-content": {
    included: ["Story structure", "B-roll and graphics", "A clean audio mix", "Short cut-downs for promotion"],
    startingPrice: null, // TODO
    turnaround: null, // TODO
    format: "16:9",
    category: "youtube",
    inquiryType: "YouTube video",
  },
  "brand-films-and-commercials": {
    included: ["An edit built to the brief", "A first cut to review", "Focused feedback rounds", "Versions for each platform"],
    startingPrice: null, // TODO
    turnaround: null, // TODO
    format: "Campaign sizes",
    category: "brand-films",
    inquiryType: "Brand film",
  },
  "cinematic-videos": {
    included: ["A story found in your footage", "Rhythm cut to music", "Colour grade", "Social-length versions"],
    startingPrice: null, // TODO
    turnaround: null, // TODO
    format: "16:9, social cuts",
    category: "travel",
    inquiryType: "Travel / cinematic",
  },
  "motion-graphics": {
    included: ["Titles and lower thirds", "Animated text", "Logo reveals", "Reusable templates where useful"],
    startingPrice: null, // TODO
    turnaround: null, // TODO
    format: "Any",
    category: "motion-graphics",
    inquiryType: "Motion graphics",
  },
  "podcast-editing": {
    included: ["Multi-camera sync", "Cuts to the conversation", "Levelled, clean audio", "Vertical clips"],
    startingPrice: null, // TODO
    turnaround: null, // TODO
    format: "16:9, 9:16 clips",
    category: null,
    inquiryType: "Podcast",
  },
};

/** For services added later in the admin. */
export const DEFAULT_SERVICE: ServiceExtra = {
  included: [],
  startingPrice: null,
  turnaround: null,
  format: "To your brief",
  category: null,
  inquiryType: "Something else",
};

// TODO: a range like "₹₹" or "₹5,000–₹1,00,000". Used in structured data only.
export const PRICE_RANGE: string | null = null;

/* ----------------------------------------------------------- about, contact */

// TODO: confirm. Drawn from your own About copy.
export const VALUES = [
  { title: "Story first", text: "Every choice of pace, sound and colour has to make the story easier to feel." },
  { title: "Sound is half the film", text: "Sound carries more of the emotion than people expect, so it is shaped with the cut, not after it." },
  { title: "A second pair of eyes", text: "There are two of us, so each edit is watched by someone who didn't cut it before it reaches you." },
];

// TODO: e.g. "Within one working day". null shows a neutral line with no promise.
export const RESPONSE_TIME: string | null = null;
