/**
 * Typed access to environment variables. Every value has a fallback so the
 * site builds with no configuration at all. See `.env.example`.
 *
 * Only `siteUrl` is public. Everything else is server-only: import this file
 * from server code, never from a "use client" component.
 */

function str(value: string | undefined, fallback = ""): string {
  const v = value?.trim();
  return v ? v : fallback;
}

function origin(value: string | undefined, fallback: string): string {
  let url = str(value, fallback).replace(/\/+$/, "");
  if (!/^https?:\/\//i.test(url)) url = `https://${url}`;
  try {
    return new URL(url).origin;
  } catch {
    return fallback;
  }
}

export const env = {
  /** Canonical origin, used for canonical URLs, sitemap, Open Graph and JSON-LD. */
  siteUrl: origin(
    process.env.NEXT_PUBLIC_SITE_URL ?? (process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`),
    "http://localhost:3000"
  ),
  /** false on preview deployments: robots.txt blocks crawlers, pages get noindex. */
  allowIndexing: str(process.env.NEXT_PUBLIC_ALLOW_INDEXING, "true") !== "false",

  /** Postgres connection string (Neon / Supabase / Vercel Postgres). */
  databaseUrl: str(process.env.DATABASE_URL ?? process.env.POSTGRES_URL),
  /** Vercel Blob token, for thumbnail uploads. */
  blobToken: str(process.env.BLOB_READ_WRITE_TOKEN),
  /** Public URL of the folder holding the videos (e.g. a Cloudflare R2 bucket). Replaces local "/videos/…" paths. */
  mediaBaseUrl: str(process.env.MEDIA_BASE_URL).replace(/\/+$/, ""),

  /** Admin login. The password is stored only as a scrypt hash (pnpm admin:hash). */
  adminEmail: str(process.env.ADMIN_EMAIL).toLowerCase(),
  adminPasswordHash: str(process.env.ADMIN_PASSWORD_HASH),
  /** At least 32 random characters. Signs the admin session cookie. */
  sessionSecret: str(process.env.SESSION_SECRET),

  isVercel: Boolean(process.env.VERCEL),
  isProduction: process.env.NODE_ENV === "production",
} as const;

export const adminConfigured = Boolean(env.adminEmail && env.adminPasswordHash && env.sessionSecret.length >= 32);
