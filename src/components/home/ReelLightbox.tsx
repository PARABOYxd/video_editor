"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import VideoPlayer from "../ui/VideoPlayer";

/**
 * The hero frame is the trigger: one tap opens the reel full screen and it
 * starts with sound (the tap is the user gesture browsers require). Esc, the
 * close button or a tap on the dark backdrop closes it and stops playback.
 * Visiting /#showreel (old /showreel links redirect there) opens it too.
 */
export default function ReelLightbox({
  url,
  poster,
  title,
  label,
  children,
}: {
  url: string;
  poster: string;
  title: string;
  label: string;
  children: React.ReactNode;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [fromGesture, setFromGesture] = useState(false);

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
      <button type="button" onClick={() => show(true)} aria-haspopup="dialog" aria-label={label} className="group block w-full text-left">
        {children}
      </button>

      <dialog
        ref={dialog}
        aria-label={title}
        onClose={() => {
          setOpen(false);
          if (window.location.hash === "#showreel") history.replaceState(null, "", window.location.pathname + window.location.search);
        }}
        // A click that lands on the dialog itself (not its content) is the backdrop.
        onClick={(e) => e.target === e.currentTarget && close()}
        className="m-0 h-dvh max-h-none w-screen max-w-none bg-transparent p-0 text-white backdrop:bg-black/90 backdrop:backdrop-blur-sm open:animate-[reel-in_250ms_ease-out]"
      >
        <div className="flex h-full w-full flex-col items-center justify-center px-4 py-16 md:px-10" onClick={(e) => e.target === e.currentTarget && close()}>
          <button
            type="button"
            onClick={close}
            aria-label="Close video"
            className="absolute right-3 top-3 grid h-11 w-11 place-items-center rounded text-white/85 transition-colors hover:bg-white/10 hover:text-white md:right-6 md:top-6"
          >
            <X className="h-6 w-6" strokeWidth={1.75} aria-hidden />
          </button>
          {/* Widest 16:9 box that fits the screen. */}
          <div className="w-full max-w-[min(1280px,calc((100dvh-8rem)*16/9))]">
            {open && <VideoPlayer url={url} poster={poster} title={title} autoStart={fromGesture} soundHint={!fromGesture} />}
          </div>
          <p className="t-meta mt-4 text-white/60">{title}</p>
        </div>
      </dialog>
    </>
  );
}
