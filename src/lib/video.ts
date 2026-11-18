/** Parses a video link into something the player can embed. Safe on client and server. */

export type VideoSource =
  | { kind: "youtube"; id: string; embedUrl: string; thumbnail: string }
  | { kind: "vimeo"; id: string; embedUrl: string; thumbnail: "" }
  | { kind: "file"; src: string; thumbnail: "" }
  | { kind: "none" };

export function parseVideo(url: string | null | undefined): VideoSource {
  const raw = (url ?? "").trim();
  if (!raw) return { kind: "none" };

  let u: URL;
  try {
    u = new URL(raw, "https://placeholder.local");
  } catch {
    return { kind: "none" };
  }
  const host = u.hostname.replace(/^www\.|^m\./, "");

  // YouTube: watch?v=, youtu.be/, /shorts/, /embed/, /live/
  let yt: string | null = null;
  if (host === "youtu.be") yt = u.pathname.slice(1).split("/")[0];
  else if (host.endsWith("youtube.com") || host.endsWith("youtube-nocookie.com")) {
    yt = u.searchParams.get("v") ?? u.pathname.match(/\/(?:shorts|embed|live)\/([\w-]{6,})/)?.[1] ?? null;
  }
  if (yt && /^[\w-]{6,20}$/.test(yt)) {
    return {
      kind: "youtube",
      id: yt,
      embedUrl: `https://www.youtube-nocookie.com/embed/${yt}?autoplay=1&rel=0&modestbranding=1&playsinline=1`,
      thumbnail: `https://i.ytimg.com/vi/${yt}/maxresdefault.jpg`,
    };
  }

  // Vimeo: vimeo.com/123, player.vimeo.com/video/123, vimeo.com/123/abcd (unlisted hash)
  if (host.endsWith("vimeo.com")) {
    const m = u.pathname.match(/(?:\/video)?\/(\d{5,})(?:\/([\da-f]+))?/);
    if (m) {
      const hash = m[2] ?? u.searchParams.get("h");
      return {
        kind: "vimeo",
        id: m[1],
        embedUrl: `https://player.vimeo.com/video/${m[1]}?autoplay=1&dnt=1${hash ? `&h=${hash}` : ""}`,
        thumbnail: "",
      };
    }
  }

  // Direct file (MP4 / WebM / MOV), on the site or any host
  if (/\.(mp4|webm|mov|m4v)$/i.test(u.pathname)) {
    return { kind: "file", src: raw, thumbnail: "" };
  }

  return { kind: "none" };
}

/** "00:45" | "18:24" | "1:02:05" → ISO 8601 duration for VideoObject schema. */
export function toIsoDuration(input: string): string | undefined {
  const parts = input.split(":").map((n) => Number.parseInt(n, 10));
  if (!parts.length || parts.some((n) => !Number.isFinite(n))) return undefined;
  const total = parts.reduce((acc, n) => acc * 60 + n, 0);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `PT${h ? `${h}H` : ""}${m ? `${m}M` : ""}${s || (!h && !m) ? `${s}S` : ""}`;
}
