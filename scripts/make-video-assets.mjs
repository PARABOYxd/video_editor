#!/usr/bin/env node
/**
 * Builds the web assets for every video in public/videos (needs ffmpeg on PATH):
 *
 *   x-720.mp4      720p H.264 copy that phones and tablets stream instead of the
 *                  1080p master (VideoPlayer picks it with <source media>).
 *   x-preview.mp4  short, silent, small loop for card hover / in-view previews.
 *   x-poster.jpg   in public/images, grabbed at the time in POSTER_AT
 *                  (a strong frame, not the opening title card).
 *
 * Existing files are kept; pass --force to rebuild them.
 *   node scripts/make-video-assets.mjs [--force] [--only=name]
 */
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

const VIDEOS = "public/videos";
const IMAGES = "public/images";
const force = process.argv.includes("--force");
const only = process.argv.find((a) => a.startsWith("--only="))?.slice(7);

/** Poster frame (seconds) per video. Pick a frame with colour, a face or action. */
const POSTER_AT = {
  "showreel-cinematic": 17.8,
  "credit-card-viral-reel": 9.6,
  "moksha-d2c-commercial": 34.4,
  "himalayan-expedition": 3,
  "kala-motion-graphics": 3,
  "kredo-brand-anthem": 3,
  "modern-founder-podcast": 3,
  "quick-commerce-youtube": 3,
  "udaipur-royal-wedding": 3,
};

const ff = (...args) => execFileSync("ffmpeg", ["-v", "error", "-y", ...args], { stdio: "inherit" });
const isMaster = (f) => f.endsWith(".mp4") && !/-(preview|720)\.mp4$/.test(f);

for (const file of readdirSync(VIDEOS).filter(isMaster)) {
  const name = file.replace(/\.mp4$/, "");
  if (only && only !== name) continue;
  const src = join(VIDEOS, file);

  const v720 = join(VIDEOS, `${name}-720.mp4`);
  if (force || !existsSync(v720)) {
    console.log(`720p     ${name}`);
    // scale only ever shrinks; even dimensions for H.264
    ff("-i", src, "-vf", "scale='min(1280,iw)':'min(720,ih)':force_original_aspect_ratio=decrease:force_divisible_by=2",
      "-c:v", "libx264", "-preset", "medium", "-crf", "25", "-profile:v", "high", "-pix_fmt", "yuv420p",
      "-c:a", "aac", "-b:a", "112k", "-movflags", "+faststart", v720);
  }

  const preview = join(VIDEOS, `${name}-preview.mp4`);
  if (force || !existsSync(preview)) {
    console.log(`preview  ${name}`);
    const at = POSTER_AT[name] ?? 3;
    ff("-ss", String(Math.max(0, at - 1)), "-t", "6", "-i", src, "-an",
      "-vf", "scale=640:-2,fps=24", "-c:v", "libx264", "-preset", "slow", "-crf", "30", "-pix_fmt", "yuv420p", "-movflags", "+faststart", preview);
  }

  const poster = join(IMAGES, `${name}-poster.jpg`);
  if (force || !existsSync(poster) || (POSTER_AT[name] ?? 3) !== 3) {
    console.log(`poster   ${name} @ ${POSTER_AT[name] ?? 3}s`);
    ff("-ss", String(POSTER_AT[name] ?? 3), "-i", src, "-frames:v", "1", "-q:v", "3", poster);
  }
}
console.log("done");
