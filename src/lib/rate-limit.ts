import "server-only";
import { headers } from "next/headers";

/*
 * Best-effort, in-memory fixed-window limiter. On serverless each instance
 * has its own memory, so this slows down abuse rather than stopping a
 * determined attacker; it is paired with a honeypot on the contact form and
 * scrypt (deliberately slow) on the login.
 */
const hits = new Map<string, { count: number; reset: number }>();

export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = hits.get(key);
  if (!entry || now > entry.reset) {
    hits.set(key, { count: 1, reset: now + windowMs });
    return true;
  }
  if (entry.count >= limit) return false;
  entry.count += 1;
  return true;
}

export async function clientIp(): Promise<string> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "local";
}
