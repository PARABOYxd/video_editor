import type { MetadataRoute } from "next";
import { THEME } from "@/config/theme";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Rytora Studio",
    short_name: "Rytora",
    description: "Video editing studio in Pune, India, for YouTube videos, Reels, brand films and cinematic travel videos.",
    start_url: "/",
    display: "standalone",
    background_color: THEME.paper,
    theme_color: THEME.paper,
    lang: "en-IN",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      { src: "/favicon.ico", sizes: "16x16 32x32 48x48", type: "image/x-icon" },
    ],
  };
}
