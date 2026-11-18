"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Maximize, Pause, Play, Volume2, VolumeX } from "lucide-react";
import Img from "./Img";
import PlaceholderFrame from "./PlaceholderFrame";
import { parseVideo } from "@/lib/video";

const PLAY_EVENT = "ve:play";
const ASPECT: Record<string, string> = {
  "16:9": "aspect-video",
  "21:9": "aspect-[21/9]",
  "4:3": "aspect-[4/3]",
  "1:1": "aspect-square",
  "4:5": "aspect-[4/5]",
  "9:16": "aspect-[9/16]",
};

function fmt(t: number) {
  if (!Number.isFinite(t) || t < 0) return "00:00";
  const s = Math.floor(t % 60);
  const m = Math.floor((t / 60) % 60);
  const h = Math.floor(t / 3600);
  const mm = String(m).padStart(2, "0");
  const ss = String(s).padStart(2, "0");
  return h ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

type Props = {
  url: string;
  poster?: string;
  title: string;
  aspect?: string;
  priority?: boolean;
  /** Label shown when there is no video yet. */
  emptyLabel?: string;
  sizes?: string;
};

/**
 * One player for the whole site.
 *  - MP4 / WebM: custom controls (play, seek, time, mute, fullscreen),
 *    preload="none", errors handled, pauses when scrolled away or when
 *    another player starts.
 *  - YouTube / Vimeo: poster first, the provider's player only after a click
 *    (their own controls; they can't be fully skinned).
 *  - No video yet: a labelled placeholder frame.
 */
export default function VideoPlayer({ url, poster = "", title, aspect = "16:9", priority = false, emptyLabel = "Video coming soon", sizes = "(min-width: 1408px) 1280px, 100vw" }: Props) {
  const source = parseVideo(url);
  const id = useId();
  const wrap = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [failed, setFailed] = useState(false);
  const image = poster || (source.kind === "youtube" ? source.thumbnail : "");
  const ratio = ASPECT[aspect] ?? ASPECT["16:9"];

  const start = useCallback(() => {
    setStarted(true);
    window.dispatchEvent(new CustomEvent(PLAY_EVENT, { detail: id }));
  }, [id]);

  // Only one video plays at a time; also stop when scrolled out of view.
  useEffect(() => {
    const onOther = (e: Event) => {
      if ((e as CustomEvent).detail !== id) {
        video.current?.pause();
        if (source.kind === "youtube" || source.kind === "vimeo") setStarted(false);
      }
    };
    window.addEventListener(PLAY_EVENT, onOther);
    const el = wrap.current;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) video.current?.pause();
    });
    if (el) io.observe(el);
    return () => {
      window.removeEventListener(PLAY_EVENT, onOther);
      io.disconnect();
    };
  }, [id, source.kind]);

  // First press on an MP4: load and play. play() needs a user gesture, which this is.
  useEffect(() => {
    if (started && source.kind === "file") video.current?.play().catch(() => setFailed(true));
  }, [started, source.kind]);

  const toggle = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused) {
      window.dispatchEvent(new CustomEvent(PLAY_EVENT, { detail: id }));
      v.play().catch(() => setFailed(true));
    } else v.pause();
  };

  const seek = (t: number) => {
    const v = video.current;
    if (v && Number.isFinite(t)) v.currentTime = Math.max(0, Math.min(t, v.duration || t));
  };

  const fullscreen = () => {
    const v = video.current as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null;
    if (document.fullscreenElement) document.exitFullscreen();
    else if (wrap.current?.requestFullscreen) wrap.current.requestFullscreen().catch(() => v?.webkitEnterFullscreen?.());
    else v?.webkitEnterFullscreen?.(); // iOS Safari
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (source.kind !== "file" || !started) return;
    if ((e.target as HTMLElement).tagName === "INPUT") return; // the seek slider handles its own keys
    if (e.key === " " || e.key === "k") {
      e.preventDefault();
      toggle();
    } else if (e.key === "ArrowRight") seek(time + 5);
    else if (e.key === "ArrowLeft") seek(time - 5);
    else if (e.key === "m") setMuted((m) => !m);
    else if (e.key === "f") fullscreen();
  };

  const posterLayer = image ? (
    <Img src={image} alt={`${title}: video still`} fill priority={priority} sizes={sizes} className="object-cover" />
  ) : null;

  const playButton = (
    <button
      type="button"
      onClick={start}
      aria-label={`Play ${title}`}
      className="group absolute inset-0 flex items-end justify-start p-5 md:p-7"
    >
      <span className="flex items-center gap-3 rounded bg-white py-3 pl-4 pr-5 text-[13px] font-medium uppercase tracking-[0.08em] text-ink transition-colors duration-200 group-hover:bg-accent group-hover:text-white">
        <Play className="h-4 w-4 fill-current" aria-hidden />
        Play
      </span>
    </button>
  );

  return (
    <div ref={wrap} onKeyDown={onKey} className={`relative w-full overflow-hidden rounded bg-media ${ratio}`}>
      {source.kind === "none" && (posterLayer ?? <PlaceholderFrame label={emptyLabel} title={title} />)}

      {(source.kind === "youtube" || source.kind === "vimeo") &&
        (started ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={source.embedUrl}
            title={title}
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
            allowFullScreen
          />
        ) : (
          <>
            {posterLayer ?? <PlaceholderFrame label="Press play" title={title} />}
            {playButton}
          </>
        ))}

      {source.kind === "file" && (
        <>
          {started && (
            <video
              ref={video}
              className="absolute inset-0 h-full w-full bg-media object-contain"
              preload="none"
              playsInline
              muted={muted}
              poster={image || undefined}
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              onEnded={() => setPlaying(false)}
              onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
              onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
              onError={() => setFailed(true)}
              onClick={toggle}
            >
              <source src={source.src} type={source.src.toLowerCase().endsWith(".webm") ? "video/webm" : "video/mp4"} />
            </video>
          )}
          {!started && (
            <>
              {posterLayer ?? <PlaceholderFrame label="Press play" title={title} />}
              {playButton}
            </>
          )}

          {started && !failed && (
            <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 bg-gradient-to-t from-black/70 to-transparent px-3 pb-3 pt-10 text-white md:gap-4 md:px-5 md:pb-4">
              <button type="button" onClick={toggle} aria-label={playing ? "Pause" : "Play"} className="flex h-11 w-11 shrink-0 items-center justify-center rounded hover:bg-white/15">
                {playing ? <Pause className="h-5 w-5 fill-current" aria-hidden /> : <Play className="h-5 w-5 fill-current" aria-hidden />}
              </button>
              <input
                type="range"
                min={0}
                max={duration || 0}
                step={0.1}
                value={time}
                onChange={(e) => seek(Number(e.target.value))}
                aria-label="Seek"
                aria-valuetext={`${fmt(time)} of ${fmt(duration)}`}
                className="h-11 min-w-0 flex-1 cursor-pointer accent-[#a64d32]"
              />
              <span className="t-meta shrink-0 tabular-nums text-white/85">
                {fmt(time)} / {fmt(duration)}
              </span>
              <button type="button" onClick={() => setMuted((m) => !m)} aria-label={muted ? "Unmute" : "Mute"} aria-pressed={muted} className="flex h-11 w-11 shrink-0 items-center justify-center rounded hover:bg-white/15">
                {muted ? <VolumeX className="h-5 w-5" aria-hidden /> : <Volume2 className="h-5 w-5" aria-hidden />}
              </button>
              <button type="button" onClick={fullscreen} aria-label="Fullscreen" className="flex h-11 w-11 shrink-0 items-center justify-center rounded hover:bg-white/15">
                <Maximize className="h-5 w-5" aria-hidden />
              </button>
            </div>
          )}

          {failed && (
            <div role="alert" className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-media/90 p-6 text-center text-white">
              <p className="text-[15px]">This video couldn&apos;t be played here.</p>
              <a href={source.src} target="_blank" rel="noopener noreferrer" className="link-u text-[14px] text-white/80">
                Open the video file
              </a>
            </div>
          )}
        </>
      )}
    </div>
  );
}
