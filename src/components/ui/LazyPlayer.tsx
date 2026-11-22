"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Play } from "lucide-react";
import { parseVideo } from "@/lib/video";
import Img from "./Img";
import PlaceholderFrame from "./PlaceholderFrame";

const loadPlayer = () => import("./VideoPlayer");
const VideoPlayer = dynamic(loadPlayer, { ssr: false, loading: () => <div className="absolute inset-0 bg-media" /> });

const ASPECT: Record<string, string> = {
  "16:9": "aspect-video",
  "21:9": "aspect-ultrawide",
  "4:3": "aspect-classic",
  "1:1": "aspect-square",
  "4:5": "aspect-portrait",
  "9:16": "aspect-reel",
};

type Props = {
  url: string;
  poster: string;
  title: string;
  aspect: string;
  sizes: string;
  captions?: string;
  next?: { href: string; title: string };
};

/** Poster and Play button in the first load; the player itself arrives on intent. */
export default function LazyPlayer({ url, poster, title, aspect, sizes, captions, next }: Props) {
  const [started, setStarted] = useState(false);
  const source = parseVideo(url);
  const image = poster || (source.kind === "youtube" ? source.thumbnail : "");
  const ratio = ASPECT[aspect] ?? ASPECT["16:9"];

  if (started) {
    return (
      // Holds the space while the chunk loads, then hands the shape over to the player.
      <div data-player className={`relative ${ratio} has-[[data-video-player]]:aspect-auto`}>
        <VideoPlayer url={url} poster={image} title={title} aspect={aspect} sizes={sizes} captions={captions} next={next} autoStart />
      </div>
    );
  }

  return (
    <div data-player data-tone="dark" className={`relative w-full overflow-hidden rounded bg-media ${ratio}`}>
      {image ? <Img src={image} alt={`${title}: video still`} fill preload sizes={sizes} className="object-cover" /> : <PlaceholderFrame label="Press play" />}
      {source.kind !== "none" && (
        <>
          <span aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-scrim/55 via-transparent to-transparent" />
          <button
            type="button"
            onClick={() => setStarted(true)}
            onPointerEnter={() => void loadPlayer()}
            onFocus={() => void loadPlayer()}
            aria-label={`Play ${title}`}
            className="group absolute inset-0 flex -outline-offset-4 items-end justify-start p-5 md:p-7"
          >
            <span className="play-pill">
              <Play className="h-4 w-4 fill-current" aria-hidden />
              Play
            </span>
          </button>
        </>
      )}
    </div>
  );
}
