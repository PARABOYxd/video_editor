"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Loader2, Maximize, Minimize, Pause, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import Img from "./Img";
import PlaceholderFrame from "./PlaceholderFrame";
import { parseVideo } from "@/lib/video";

const PLAY_EVENT = "ve:play";
const HIDE_AFTER = 2500;
const DOUBLE_TAP = 280;
const ASPECT: Record<string, string> = {
  "16:9": "aspect-video",
  "21:9": "aspect-[21/9]",
  "4:3": "aspect-[4/3]",
  "1:1": "aspect-square",
  "4:5": "aspect-[4/5]",
  "9:16": "aspect-[9/16]",
};
const RATIO: Record<string, number> = { "16:9": 16 / 9, "21:9": 21 / 9, "4:3": 4 / 3, "1:1": 1, "4:5": 4 / 5, "9:16": 9 / 16 };

function fmt(t: number) {
  if (!Number.isFinite(t) || t < 0) return "00:00";
  const s = Math.floor(t % 60);
  const m = Math.floor((t / 60) % 60);
  const h = Math.floor(t / 3600);
  const mm = String(m).padStart(2, "0");
  const ss = String(s).padStart(2, "0");
  return h ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

/** "x.mp4" → "x-720.mp4", the lighter copy made by scripts/make-video-assets.mjs. */
const mobileOf = (src: string) => (/-720\.mp4(\?|$)/i.test(src) ? "" : src.replace(/\.mp4(\?.*)?$/i, "-720.mp4$1"));

type Props = {
  url: string;
  poster?: string;
  title: string;
  aspect?: string;
  priority?: boolean;
  /** Label shown when there is no video yet. */
  emptyLabel?: string;
  sizes?: string;
  /** Start playing on mount (used inside a lightbox opened by a tap). */
  autoStart?: boolean;
  /** Shown on the poster: tells people the video has sound. */
  soundHint?: boolean;
  /** Offered on the end screen. */
  next?: { href: string; title: string };
};

/**
 * One player for the whole site.
 *  - MP4 / WebM: custom controls (play, seek with buffer, time, mute,
 *    fullscreen) that hide while playing; loading spinner; double-tap to skip
 *    on touch screens; replay / next project at the end. Phones get the 720p
 *    copy when it exists. Pauses when scrolled away or when another player starts.
 *  - YouTube / Vimeo: poster first, the provider's player only after a click.
 *  - No video yet: a labelled placeholder frame.
 */
export default function VideoPlayer({
  url,
  poster = "",
  title,
  aspect = "16:9",
  priority = false,
  emptyLabel = "Video coming soon",
  sizes = "(min-width: 1408px) 1280px, 100vw",
  autoStart = false,
  soundHint = false,
  next,
}: Props) {
  const source = parseVideo(url);
  const id = useId();
  const wrap = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const tapTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const lastTap = useRef(0);

  const [started, setStarted] = useState(autoStart);
  const [playing, setPlaying] = useState(false);
  const [hasFrame, setHasFrame] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [ended, setEnded] = useState(false);
  const [muted, setMuted] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [failed, setFailed] = useState(false);
  const [controls, setControls] = useState(true);
  const [isFull, setIsFull] = useState(false);
  const [skip, setSkip] = useState<{ dir: -1 | 1; key: number } | null>(null);
  const [realRatio, setRealRatio] = useState<number | null>(null);

  const image = poster || (source.kind === "youtube" ? source.thumbnail : "");
  const ratioCls = ASPECT[aspect] ?? ASPECT["16:9"];

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
    const onFs = () => setIsFull(document.fullscreenElement === el);
    document.addEventListener("fullscreenchange", onFs);
    return () => {
      window.removeEventListener(PLAY_EVENT, onOther);
      document.removeEventListener("fullscreenchange", onFs);
      io.disconnect();
      clearTimeout(hideTimer.current);
      clearTimeout(tapTimer.current);
    };
  }, [id, source.kind]);

  // First press on an MP4: load and play. If the browser blocks playback with
  // sound (autoStart without a fresh gesture), fall back to the poster + Play.
  useEffect(() => {
    if (!started || source.kind !== "file") return;
    window.dispatchEvent(new CustomEvent(PLAY_EVENT, { detail: id }));
    video.current?.play().catch((err: DOMException) => {
      if (err?.name === "NotAllowedError") setStarted(false);
    });
  }, [started, source.kind, id]);

  // Controls: always visible while paused; fade out after a moment of playback.
  const poke = useCallback(() => {
    setControls(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      if (video.current && !video.current.paused) setControls(false);
    }, HIDE_AFTER);
  }, []);

  const toggle = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused || v.ended) {
      window.dispatchEvent(new CustomEvent(PLAY_EVENT, { detail: id }));
      v.play().catch(() => {});
    } else v.pause();
  };

  const seek = (t: number) => {
    const v = video.current;
    if (v && Number.isFinite(t)) v.currentTime = Math.max(0, Math.min(t, v.duration || t));
  };

  const replay = () => {
    seek(0);
    setEnded(false);
    toggle();
  };

  const fullscreen = () => {
    const v = video.current as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null;
    if (document.fullscreenElement) document.exitFullscreen();
    else if (wrap.current?.requestFullscreen) wrap.current.requestFullscreen().catch(() => v?.webkitEnterFullscreen?.());
    else v?.webkitEnterFullscreen?.(); // iOS Safari
  };

  // Tap layer. Mouse: click toggles play. Touch: one tap shows/hides the
  // controls, a double tap on the left/right half skips 10 s.
  const onSurface = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse") {
      toggle();
      poke();
      return;
    }
    const now = Date.now();
    const rect = e.currentTarget.getBoundingClientRect();
    const dir: -1 | 1 = e.clientX - rect.left < rect.width / 2 ? -1 : 1;
    if (now - lastTap.current < DOUBLE_TAP) {
      clearTimeout(tapTimer.current);
      lastTap.current = 0;
      seek((video.current?.currentTime ?? 0) + dir * 10);
      setSkip({ dir, key: now });
      poke();
      return;
    }
    lastTap.current = now;
    tapTimer.current = setTimeout(() => {
      if (controls && playing) {
        clearTimeout(hideTimer.current);
        setControls(false);
      } else poke();
    }, DOUBLE_TAP);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (source.kind !== "file" || !started) return;
    poke();
    if ((e.target as HTMLElement).tagName === "INPUT" && e.key !== " " && e.key !== "k") return; // the slider handles arrows
    if (e.key === " " || e.key === "k") {
      e.preventDefault();
      toggle();
    } else if (e.key === "ArrowRight") seek(time + 5);
    else if (e.key === "ArrowLeft") seek(time - 5);
    else if (e.key === "m") setMuted((m) => !m);
    else if (e.key === "f") fullscreen();
  };

  const onMeta = (v: HTMLVideoElement) => {
    setDuration(v.duration);
    // The admin's aspect setting can be wrong; trust the file when it clearly differs.
    if (v.videoWidth && v.videoHeight) {
      const real = v.videoWidth / v.videoHeight;
      const set = RATIO[aspect] ?? 16 / 9;
      if (Math.abs(real - set) / set > 0.04) setRealRatio(real);
    }
  };

  const onProgress = (v: HTMLVideoElement) => {
    const b = v.buffered;
    for (let i = 0; i < b.length; i++) {
      if (b.start(i) <= v.currentTime + 0.5 && b.end(i) >= v.currentTime) return setBuffered(b.end(i));
    }
  };

  const posterLayer = image ? (
    <Img src={image} alt={`${title}: video still`} fill priority={priority} sizes={sizes} className="object-cover" />
  ) : null;

  const hint = soundHint && (
    <span className="absolute right-4 top-4 flex items-center gap-1.5 rounded bg-black/60 px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-white backdrop-blur-sm md:right-6 md:top-6">
      <Volume2 className="h-3.5 w-3.5" aria-hidden /> Sound on
    </span>
  );

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

  const pct = (n: number) => (duration ? `${Math.min(100, (n / duration) * 100)}%` : "0%");
  const show = controls || !playing;
  const mobileSrc = source.kind === "file" ? mobileOf(source.src) : "";
  const type = source.kind === "file" && source.src.toLowerCase().includes(".webm") ? "video/webm" : "video/mp4";

  return (
    <div
      ref={wrap}
      onKeyDown={onKey}
      onPointerMove={(e) => e.pointerType === "mouse" && started && poke()}
      className={`relative w-full overflow-hidden rounded bg-media ${realRatio ? "" : ratioCls} ${isFull ? "!rounded-none" : ""} ${
        started && playing && !show ? "cursor-none" : ""
      }`}
      style={realRatio ? { aspectRatio: String(realRatio) } : undefined}
    >
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
            {hint}
            {playButton}
          </>
        ))}

      {source.kind === "file" && (
        <>
          {/* Poster stays until the first frame is on screen: no black flash. */}
          {(!started || !hasFrame) && (posterLayer ?? <PlaceholderFrame label="Press play" title={title} />)}

          {started && (
            <video
              ref={video}
              className={`absolute inset-0 h-full w-full bg-media object-contain transition-opacity duration-300 ${hasFrame ? "opacity-100" : "opacity-0"}`}
              preload="metadata"
              playsInline
              muted={muted}
              onPlay={() => {
                setPlaying(true);
                setEnded(false);
                poke(); // starts the auto-hide countdown
              }}
              onPlaying={() => {
                setHasFrame(true);
                setWaiting(false);
              }}
              onPause={() => {
                setPlaying(false);
                clearTimeout(hideTimer.current);
                setControls(true);
              }}
              onEnded={() => {
                setPlaying(false);
                setEnded(true);
              }}
              onWaiting={() => setWaiting(true)}
              onCanPlay={() => setWaiting(false)}
              onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
              onLoadedMetadata={(e) => onMeta(e.currentTarget)}
              onProgress={(e) => onProgress(e.currentTarget)}
            >
              {mobileSrc && <source src={mobileSrc} type={type} media="(max-width: 1024px)" />}
              {/* Errors on the last <source> mean nothing could be played. */}
              <source src={source.src} type={type} onError={() => setFailed(true)} />
            </video>
          )}

          {!started && (
            <>
              {hint}
              {playButton}
            </>
          )}

          {started && !failed && (
            <>
              {/* Tap / click surface */}
              <div aria-hidden className="absolute inset-0" onPointerUp={onSurface} />

              {/* Loading */}
              {(waiting || !hasFrame) && !ended && (
                <div aria-hidden className="pointer-events-none absolute inset-0 grid place-items-center">
                  <span className="grid h-14 w-14 place-items-center rounded-full bg-black/45 backdrop-blur-sm">
                    <Loader2 className="h-7 w-7 animate-spin text-white" />
                  </span>
                </div>
              )}
              <span role="status" className="sr-only">
                {waiting ? "Loading video" : ""}
              </span>

              {/* Double-tap skip feedback */}
              {skip && (
                <span
                  key={skip.key}
                  aria-hidden
                  onAnimationEnd={() => setSkip(null)}
                  className={`pointer-events-none absolute top-1/2 grid h-16 w-16 -translate-y-1/2 animate-[vp-skip_600ms_ease-out_forwards] place-items-center rounded-full bg-black/50 font-mono text-[13px] text-white ${
                    skip.dir < 0 ? "left-[18%]" : "right-[18%]"
                  }`}
                >
                  {skip.dir < 0 ? "−10s" : "+10s"}
                </span>
              )}

              {/* Big centre button on touch screens while controls show */}
              {hasFrame && !ended && (
                <button
                  type="button"
                  onClick={() => {
                    toggle();
                    poke();
                  }}
                  aria-label={playing ? "Pause" : "Play"}
                  tabIndex={-1}
                  className={`absolute left-1/2 top-1/2 hidden h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-opacity duration-200 pointer-coarse:grid ${
                    show && !waiting ? "opacity-100" : "pointer-events-none opacity-0"
                  }`}
                >
                  {playing ? <Pause className="h-7 w-7 fill-current" aria-hidden /> : <Play className="ml-1 h-7 w-7 fill-current" aria-hidden />}
                </button>
              )}

              {/* End screen */}
              {ended && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/65 p-6 text-center text-white backdrop-blur-[2px]">
                  <button type="button" onClick={replay} className="btn btn-light">
                    <RotateCcw className="h-4 w-4" aria-hidden /> Replay
                  </button>
                  {next && (
                    <Link href={next.href} className="group inline-flex min-h-11 max-w-full items-center gap-2 text-[14px] text-white/85 hover:text-white">
                      <span className="t-meta text-white/60">Next</span>
                      <span className="truncate">{next.title}</span>
                      <ArrowRight className="arrow h-4 w-4 shrink-0" aria-hidden />
                    </Link>
                  )}
                </div>
              )}

              {/* Control bar */}
              {/* The gradient never takes taps (they reach the surface); only the controls do. */}
              <div
                className={`pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent px-2 pb-2 pt-12 text-white transition-opacity duration-300 md:px-4 md:pb-3 ${
                  show && !ended ? "opacity-100 [&>*]:pointer-events-auto" : "opacity-0"
                }`}
                onPointerMove={poke}
                onFocus={poke}
              >
                <input
                  type="range"
                  min={0}
                  max={duration || 0}
                  step={0.1}
                  value={time}
                  onChange={(e) => {
                    seek(Number(e.target.value));
                    poke();
                  }}
                  aria-label="Seek"
                  aria-valuetext={`${fmt(time)} of ${fmt(duration)}`}
                  className="vp-range mx-1 block w-[calc(100%-0.5rem)] md:mx-2 md:w-[calc(100%-1rem)]"
                  style={{ "--played": pct(time), "--buffered": pct(buffered) } as React.CSSProperties}
                />
                <div className="mt-0.5 flex items-center gap-1 md:gap-2">
                  <button type="button" onClick={toggle} aria-label={playing ? "Pause" : "Play"} className="vp-btn">
                    {playing ? <Pause className="h-5 w-5 fill-current" aria-hidden /> : <Play className="h-5 w-5 fill-current" aria-hidden />}
                  </button>
                  <button type="button" onClick={() => setMuted((m) => !m)} aria-label={muted ? "Unmute" : "Mute"} aria-pressed={muted} className="vp-btn">
                    {muted ? <VolumeX className="h-5 w-5" aria-hidden /> : <Volume2 className="h-5 w-5" aria-hidden />}
                  </button>
                  <span className="t-meta ml-1 tabular-nums text-white/85">
                    {fmt(time)} <span className="text-white/50">/ {fmt(duration)}</span>
                  </span>
                  <button type="button" onClick={fullscreen} aria-label={isFull ? "Exit fullscreen" : "Fullscreen"} className="vp-btn ml-auto">
                    {isFull ? <Minimize className="h-5 w-5" aria-hidden /> : <Maximize className="h-5 w-5" aria-hidden />}
                  </button>
                </div>
              </div>
            </>
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
