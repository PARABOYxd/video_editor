/*
 * Content that was withdrawn because it wasn't the studio's own work.
 *
 * Deleting the seed isn't enough: databases seeded by earlier versions still
 * hold these rows. So the public read layer hides anything matched here, the
 * proxy answers 410 for the old URLs, and the admin refuses to save them again.
 *
 * Only neutral slugs and file names belong here: no creator names, no sources.
 * Safe to import from the proxy (no server-only or database imports).
 */

export const RETIRED_SLUGS: ReadonlySet<string> = new Set([
  "the-art-of-travel",
  "beyond-the-frame",
  "stories-in-motion",
  "a-different-perspective",
  "launch-day",
  "type-in-motion",
  "royal-oath-wedding",
  "modern-founder-podcast",
]);

const RETIRED_FILES: ReadonlySet<string> = new Set([
  "showreel-cinematic",
  "credit-card-viral-reel",
  "himalayan-expedition",
  "kala-motion-graphics",
  "kredo-brand-anthem",
  "modern-founder-podcast",
  "moksha-d2c-commercial",
  "quick-commerce-youtube",
  "udaipur-royal-wedding",
  "showreel-loop",
]);

function decode(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export const isRetiredSlug = (slug: string) => RETIRED_SLUGS.has(decode(slug).toLowerCase());

/** True for a withdrawn file on any host, including its -720, -preview and -poster copies. */
export function isRetiredMedia(url: string) {
  const file = decode(url.trim().split(/[?#]/)[0].split("/").pop() ?? "").toLowerCase();
  const stem = file.replace(/\.(mp4|webm|mov|m4v|jpe?g|png|webp|avif)$/, "").replace(/-(720|preview|poster)$/, "");
  return RETIRED_FILES.has(stem);
}

type Checkable = { slug: string; videoUrl: string; thumbnailUrl: string; posterUrl: string; gallery: string[] };

export function isRetiredProject(p: Checkable) {
  return isRetiredSlug(p.slug) || [p.videoUrl, p.thumbnailUrl, p.posterUrl, ...p.gallery].some(isRetiredMedia);
}
