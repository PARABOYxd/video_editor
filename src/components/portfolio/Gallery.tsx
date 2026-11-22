"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import Img from "../ui/Img";

const loadLightbox = () => import("./GalleryLightbox");
const GalleryLightbox = dynamic(loadLightbox, { ssr: false });

/** Stills grid. The lightbox is only downloaded when someone goes to open it. */
export default function Gallery({ images, title }: { images: string[]; title: string }) {
  const [index, setIndex] = useState<number | null>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const odd = images.length % 2 === 1;

  return (
    <>
      <ul data-reveal-group className="grid gap-6 md:grid-cols-2">
        {images.map((src, i) => (
          <li key={`${i}-${src}`} className={odd && i === 0 ? "md:col-span-2" : ""}>
            <button
              type="button"
              data-cursor="View"
              aria-haspopup="dialog"
              aria-label={`Open still ${i + 1} of ${images.length}`}
              onPointerEnter={() => void loadLightbox()}
              onFocus={() => void loadLightbox()}
              onClick={(e) => {
                opener.current = e.currentTarget;
                setIndex(i);
              }}
              className={`group relative block w-full overflow-hidden rounded bg-media ${odd && i === 0 ? "aspect-ultrawide" : "aspect-cinema"}`}
            >
              <Img
                src={src}
                alt={`${title}: still ${i + 1} from the edit`}
                fill
                sizes={odd && i === 0 ? "(min-width: 1408px) 1280px, 92vw" : "(min-width: 1408px) 628px, (min-width: 768px) 45vw, 92vw"}
                className="object-cover transition-transform duration-slower group-hover:scale-(--zoom-media)"
              />
            </button>
          </li>
        ))}
      </ul>
      {index !== null && (
        <GalleryLightbox
          images={images}
          title={title}
          index={index}
          onChange={setIndex}
          onClose={() => {
            setIndex(null);
            requestAnimationFrame(() => opener.current?.focus({ preventScroll: true }));
          }}
        />
      )}
    </>
  );
}
