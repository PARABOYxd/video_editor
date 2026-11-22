"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { X } from "lucide-react";

const loadPlayer = () => import("../ui/VideoPlayer");
// The player is only downloaded when someone is about to open the reel.
const VideoPlayer = dynamic(loadPlayer, { ssr: false, loading: () => <div className="aspect-video rounded bg-media" /> });

/**
 * The showreel frame is the trigger: one tap opens the reel full screen and it
 * starts with sound (the tap is the user gesture browsers require). Esc, the
 * close button or a tap on the dark backdrop closes it, stops playback and
 * returns focus to the frame. Visiting /#showreel (old /showreel links
 * redirect there) opens it too.
 */
export default function ReelLightbox({
  url,
  poster,
  captions,
  title,
  label,
  children,
}: {
  url: string;
  poster: string;
  captions?: string;
  title: string;
  label: string;
  children: React.ReactNode;
}) {
  const trigger = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [fromGesture, setFromGesture] = useState(false);

  // Fetch the player as the frame comes into view, so the tap can start it right away.
  useEffect(() => {
    const el = trigger.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        loadPlayer();
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const show = (gesture: boolean) => {
    setFromGesture(gesture);
    setOpen(true);
    dialog.current?.showModal();
  };

  // Open for /#showreel links, on load and on in-page hash changes.
  useEffect(() => {
    const check = () => {
      if (window.location.hash === "#showreel" && !dialog.current?.open) show(false);
    };
    const raf = requestAnimationFrame(check);
    window.addEventListener("hashchange", check);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("hashchange", check);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = prev;
    };
  }, [open]);

  const close = () => dialog.current?.close();

  return (
    <>
      <button
        ref={trigger}
        type="button"
        onClick={() => show(true)}
        onPointerEnter={() => void loadPlayer()}
        onFocus={() => void loadPlayer()}
        aria-haspopup="dialog"
        aria-label={label}
        className="group block w-full text-left"
      >
        {children}
      </button>

      <dialog
        ref={dialog}
        aria-label={title}
        data-tone="dark"
        onClose={() => {
          setOpen(false);
          if (window.location.hash === "#showreel") history.replaceState(null, "", window.location.pathname + window.location.search);
          trigger.current?.focus({ preventScroll: true });
        }}
        // A click that lands on the dialog itself (not its content) is the backdrop.
        onClick={(e) => e.target === e.currentTarget && close()}
        className="m-0 h-dvh max-h-none w-screen max-w-none bg-transparent p-0 text-on-dark backdrop:bg-scrim/90 backdrop:backdrop-blur-sm open:animate-reel-in"
      >
        <div className="flex h-full w-full flex-col items-center justify-center px-4 py-16 md:px-10" onClick={(e) => e.target === e.currentTarget && close()}>
          <button
            type="button"
            onClick={close}
            aria-label="Close video"
            className="absolute right-3 top-3 grid h-11 w-11 place-items-center rounded text-on-dark/85 transition-colors hover:bg-on-dark/10 hover:text-on-dark md:right-6 md:top-6"
          >
            <X className="h-6 w-6" strokeWidth={1.75} aria-hidden />
          </button>
          {/* Widest 16:9 box that fits the screen. */}
          <div className="w-full max-w-[min(var(--container-player),calc((100dvh-8rem)*16/9))]">
            {open && <VideoPlayer url={url} poster={poster} captions={captions} title={title} autoStart={fromGesture} soundHint={!fromGesture} />}
          </div>
          <p className="t-meta mt-4 text-on-dark/70">{title}</p>
        </div>
      </dialog>
    </>
  );
}
