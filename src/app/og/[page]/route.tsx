import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { THEME } from "@/config/theme";
import { OG_PAGES, OG_SIZE, SITE_NAME, type OgPage } from "@/lib/seo";

// Branded share images for pages without a poster. A fixed set, made at build:
// taking the text from the URL would let anyone put words on our domain.
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return OG_PAGES.map((page) => ({ page }));
}

const COPY: Record<OgPage, [string, string]> = {
  home: ["WE MAKE EVERY", "FRAME MATTER."],
  work: ["THE WORK", "SPEAKS."],
  about: ["BEHIND EVERY", "FRAME, A STORY."],
  services: ["FROM FOOTAGE", "TO FINAL CUT."],
  contact: ["LET'S MAKE", "SOMETHING GREAT."],
  project: ["INSIDE", "THE EDIT."],
};

export async function GET(_req: Request, { params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  const [first, second] = COPY[page as OgPage] ?? COPY.home;
  const font = await readFile(join(process.cwd(), "src/app/fonts/archivo-og.ttf"));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: THEME.paper,
          color: THEME.ink,
          fontFamily: "Archivo",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <svg width="72" height="72" viewBox="0 0 32 32">
            <rect width="32" height="32" rx="7" fill={THEME.accent} />
            <path d="M8 6.5 H12 V25.5 H8 Z" fill={THEME.onDark} />
            <path d="M12 6.5 L24.5 12.75 L12 19 Z" fill={THEME.onDark} />
            <path d="M12 15.5 H16.6 L25 25.5 H20.2 Z" fill={THEME.onDark} />
          </svg>
          <div style={{ marginLeft: 22, fontSize: 36, letterSpacing: 3 }}>{SITE_NAME.toUpperCase()}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 112, lineHeight: 1 }}>
          <div>{first}</div>
          <div style={{ color: THEME.accent }}>{second}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", fontSize: 28, letterSpacing: 2 }}>
          <div style={{ width: 64, height: 3, marginRight: 20, background: THEME.accent }} />
          VIDEO EDITORS IN PUNE, INDIA
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: [{ name: "Archivo", data: font, weight: 400, style: "normal" }] }
  );
}
