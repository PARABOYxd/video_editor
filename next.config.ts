import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    // The widest slot is 1280px: nothing needs the 3840px default.
    deviceSizes: [360, 420, 640, 750, 828, 1080, 1280, 1600, 1920],
    qualities: [75, 90],
    remotePatterns: [
      // Thumbnails uploaded from the admin (Vercel Blob)
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
      // Auto thumbnails for YouTube links
      { protocol: "https", hostname: "i.ytimg.com" },
    ],
  },
  // PGlite (the local dev database) ships a WASM build of Postgres; load it with
  // Node's own require instead of bundling it.
  serverExternalPackages: ["@electric-sql/pglite"],
  experimental: {
    serverActions: {
      // Thumbnail uploads go through a server action. Vercel functions accept
      // up to 4.5 MB, so 4 MB leaves room for the multipart overhead.
      bodySizeLimit: "4mb",
    },
  },
  async redirects() {
    return [
      // Old routes from the previous version of the site. /projects/:slug is in
      // src/proxy.ts (withdrawn slugs must 410, not redirect) and /showreel in
      // src/app/showreel/route.ts (it depends on whether a reel exists).
      { source: "/projects", destination: "/work", permanent: true },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
