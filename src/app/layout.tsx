import type { Metadata, Viewport } from "next";
import { Archivo, DM_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { getProfile } from "@/lib/content";
import { env } from "@/lib/env";

// Headings: Archivo (variable width; headlines use it slightly condensed).
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  style: ["normal", "italic"],
  variable: "--font-archivo",
  display: "swap",
});
// Body: DM Sans.
const dmSans = DM_Sans({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-dm-sans", display: "swap" });
// Technical labels: IBM Plex Mono.
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-plex-mono", display: "swap" });

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  const title = `${profile.brandName} · ${profile.roleTitle}`;
  return {
    metadataBase: new URL(env.siteUrl),
    title: { default: title, template: `%s · ${profile.shortName}` },
    description: profile.heroText,
    openGraph: { siteName: profile.brandName, locale: "en_IN", type: "website" },
    robots: env.allowIndexing ? { index: true, follow: true } : { index: false, follow: false },
  };
}

export const viewport: Viewport = { themeColor: "#f5f3ee" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning className={`${archivo.variable} ${dmSans.variable} ${plexMono.variable}`}>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
