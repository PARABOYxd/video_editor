import "server-only";
import { env } from "./env";

const MAX_BYTES = 4 * 1024 * 1024;

/** Detects the real image type from the first bytes, ignoring the client-supplied MIME. */
function sniff(bytes: Uint8Array): { ext: string; type: string } | null {
  const b = bytes;
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return { ext: "jpg", type: "image/jpeg" };
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return { ext: "png", type: "image/png" };
  const ascii = (from: number, to: number) => String.fromCharCode(...b.slice(from, to));
  if (ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP") return { ext: "webp", type: "image/webp" };
  if (ascii(4, 8) === "ftyp" && /avif|avis/.test(ascii(8, 12))) return { ext: "avif", type: "image/avif" };
  return null;
}

/**
 * Stores an uploaded image and returns its public URL.
 * Production: Vercel Blob (needs BLOB_READ_WRITE_TOKEN). Local dev: public/uploads.
 */
export async function uploadImage(file: File, folder: string, nameHint: string): Promise<string> {
  if (file.size > MAX_BYTES) throw new Error("Image is larger than 4 MB. Please export a smaller JPG or WebP.");
  const bytes = new Uint8Array(await file.arrayBuffer());
  const kind = sniff(bytes);
  if (!kind) throw new Error("Upload a JPG, PNG, WebP or AVIF image.");

  const safe = nameHint.replace(/[^a-z0-9-]/gi, "").slice(0, 40) || "image";
  const filename = `${folder}/${safe}-${Date.now()}.${kind.ext}`;

  if (env.blobToken) {
    const { put } = await import("@vercel/blob");
    const blob = await put(filename, Buffer.from(bytes), {
      access: "public",
      contentType: kind.type,
      token: env.blobToken,
    });
    return blob.url;
  }

  if (env.isVercel) {
    throw new Error("Uploads need Vercel Blob. Add BLOB_READ_WRITE_TOKEN, or paste an image URL instead.");
  }

  const { mkdir, writeFile } = await import("node:fs/promises");
  const path = await import("node:path");
  const dir = path.join(process.cwd(), "public", "uploads", folder);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(process.cwd(), "public", "uploads", filename), bytes);
  return `/uploads/${filename}`;
}
