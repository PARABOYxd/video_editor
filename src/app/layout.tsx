import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { getProfile } from "@/lib/content";
import { env } from "@/lib/env";
import { OG_SIZE, SITE_NAME, TITLE_TEMPLATE, absoluteUrl } from "@/lib/seo";
import { LOCATION } from "@/config/location";
import { THEME } from "@/config/theme";

// Fonts are subsets of the Google files, cut down to the weights and widths in
// use (about 90 KB in place of 280 KB). Licences: src/app/fonts/OFL-*.txt.

// Headings: Archivo, variable 400-700 and 88-100% width.
const archivo = localFont({
  src: [
    { path: "./fonts/archivo.woff2", weight: "400 700", style: "normal" },
    { path: "./fonts/archivo-italic.woff2", weight: "400", style: "italic" },
  ],
  declarations: [{ prop: "font-stretch", value: "88% 100%" }],
  variable: "--font-archivo",
  display: "swap",
  adjustFontFallback: "Arial",
});
// Body: DM Sans, variable 400-700.
const dmSans = localFont({
  src: "./fonts/dm-sans.woff2",
  weight: "400 700",
  variable: "--font-dm-sans",
  display: "swap",
  adjustFontFallback: "Arial",
});
// Just the rupee sign, fetched only where one is shown.
const rupee = localFont({
  src: "./fonts/dm-sans-rupee.woff2",
  declarations: [{ prop: "unicode-range", value: "U+20B9" }],
  variable: "--font-rupee",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
});
// Technical labels: IBM Plex Mono.
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: "400", variable: "--font-plex-mono", display: "swap" });

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  const title = `${profile.roleTitle} in ${LOCATION.city}, ${LOCATION.country} | ${SITE_NAME}`;
  const description = `${profile.brandName} is a video editing studio in ${LOCATION.city}, ${LOCATION.country}, for YouTube video editing, Instagram Reels, brand films and cinematic travel videos.`;
  const image = { url: absoluteUrl("/og/home"), ...OG_SIZE, alt: title };
  return {
    metadataBase: new URL(env.siteUrl),
    title: { default: title, template: TITLE_TEMPLATE },
    description,
    applicationName: SITE_NAME,
    openGraph: { title, description, siteName: SITE_NAME, locale: "en_IN", type: "website", images: [image] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
    robots: env.allowIndexing ? undefined : { index: false, follow: false },
  };
}

export const viewport: Viewport = { themeColor: THEME.paper };

// The timeout is a safety net: the grid must never stay hidden if hydration fails.
const FILTER_PENDING = `if(location.pathname==="/work"&&/[?&]category=/.test(location.search)){var d=document.documentElement;d.setAttribute("data-filter-pending","");setTimeout(function(){d.removeAttribute("data-filter-pending")},5000)}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" data-scroll-behavior="smooth" suppressHydrationWarning className={`${archivo.variable} ${dmSans.variable} ${rupee.variable} ${plexMono.variable}`}>
      <head>
        {/* Before paint: a shared /work?category= link shows the skeleton, not a flash of every project. */}
        <script dangerouslySetInnerHTML={{ __html: FILTER_PENDING }} />
      </head>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
