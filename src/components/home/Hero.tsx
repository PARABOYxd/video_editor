import Link from "next/link";
import { Play } from "lucide-react";
import Img from "../ui/Img";
import PlaceholderFrame from "../ui/PlaceholderFrame";
import HoverVideo from "../ui/HoverVideo";
import { thumbnailOf } from "../portfolio/ProjectThumbnail";
import type { Profile, Project } from "@/lib/types";

/** Puts one word of the headline in light italic, for editorial contrast. */
function Headline({ text }: { text: string }) {
  const words = text.split(" ");
  const pick = words.findIndex((w) => /^every$/i.test(w));
  return (
    <>
      {words.map((w, i) => (
        <span key={i}>
          {i === pick ? <em className="t-italic">{w.toLowerCase()}</em> : w}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </>
  );
}

export default function Hero({ profile, featured }: { profile: Profile; featured: Project | null }) {
  // The hero still: the showreel poster, else the first featured project's still.
  const still = profile.showreelPoster || (featured ? thumbnailOf(featured) : "");
  const caption = profile.showreelPoster ? "Showreel" : featured ? `${featured.title}${featured.categoryName ? ` · ${featured.categoryName}` : ""}` : "";

  return (
    <section className="container-site pb-16 pt-12 md:pb-24 md:pt-20">
      <div className="grid-12 gap-y-8">
        <p className="t-meta col-span-12 flex items-center gap-3 text-secondary-aa">
          <span aria-hidden className="h-px w-8 bg-accent" />
          {profile.heroLabel}
        </p>
        <h1 className="t-hero col-span-12 max-w-[13ch] lg:col-span-10">
          <Headline text={profile.heroHeadline} />
        </h1>
        <div className="col-span-12 grid gap-8 md:col-span-7 md:col-start-6 lg:col-span-5 lg:col-start-8">
          <p className="t-lead text-secondary-aa">{profile.heroText}</p>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
            <Link href="/work" className="btn btn-primary">
              Explore our work <span className="arrow" aria-hidden>→</span>
            </Link>
            <Link href="/contact" className="link-arrow">
              Let&apos;s talk <span className="arrow" aria-hidden>↗</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Opening frame: links to the showreel below */}
      <a href="#showreel" className="group mt-14 block md:mt-20" aria-label="Watch the showreel">
        <div className="relative aspect-video overflow-hidden rounded bg-media">
          {still ? (
            <Img src={still} alt={`${caption}: video still`} fill priority sizes="(min-width: 1408px) 1280px, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.015]" />
          ) : (
            <PlaceholderFrame label="Placeholder · add a showreel still in the admin" />
          )}
          {/\.(mp4|webm|mov)(\?|$)/i.test(profile.showreelUrl) && <HoverVideo src={profile.showreelUrl} mode="auto" />}
          <span className="absolute bottom-5 left-5 flex items-center gap-3 rounded bg-white py-2.5 pl-3.5 pr-4 text-[12px] font-medium uppercase tracking-[0.08em] text-ink transition-colors duration-200 group-hover:bg-accent group-hover:text-white md:bottom-7 md:left-7">
            <Play className="h-3.5 w-3.5 fill-current" aria-hidden /> Watch the reel
          </span>
        </div>
        {caption && <p className="t-meta mt-3 text-secondary-aa">{caption}</p>}
      </a>
    </section>
  );
}
