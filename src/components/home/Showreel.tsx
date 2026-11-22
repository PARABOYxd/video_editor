import { Play, Volume2 } from "lucide-react";
import type { Profile } from "@/lib/types";
import { parseVideo } from "@/lib/video";
import Badge from "@/components/ui/Badge";
import Section from "@/components/ui/Section";
import SectionHeader from "@/components/ui/SectionHeader";
import HoverVideo from "../ui/HoverVideo";
import Img from "../ui/Img";
import PlaceholderFrame from "../ui/PlaceholderFrame";
import ReelLightbox from "./ReelLightbox";

/** The "screening room": only the studio's own reel. No playable reel, no section. */
export default function Showreel({ profile }: { profile: Profile }) {
  const source = parseVideo(profile.showreelUrl);
  if (source.kind === "none") return null;
  const still = profile.showreelPoster || (source.kind === "youtube" ? source.thumbnail : "");

  return (
    <Section id="showreel" bleed data-tone="dark" className="bg-media text-on-dark" aria-labelledby="showreel-title">
      <SectionHeader
        id="showreel-title"
        tone="dark"
        eyebrow="Showreel"
        title={
          <>
            Press play. <em className="t-italic">Sound on.</em>
          </>
        }
      />
      <div className="mt-10 md:mt-14">
        <ReelLightbox
          url={profile.showreelUrl}
          poster={profile.showreelPoster}
          captions={profile.showreelCaptions}
          title={`${profile.shortName} showreel`}
          label="Watch the reel Sound on"
        >
          <div data-cursor="Play" className="relative aspect-video overflow-hidden rounded bg-scrim md:aspect-ultrawide">
            {still ? (
              <Img
                src={still}
                alt=""
                fill
                sizes="(min-width: 1408px) 1280px, 92vw"
                className="object-cover transition-transform duration-slower group-hover:scale-(--zoom-media-lg)"
              />
            ) : (
              <PlaceholderFrame label="Showreel" />
            )}
            {source.kind === "file" && <HoverVideo src={source.src} mode="auto" />}
            <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-scrim/60 via-transparent to-transparent" />
            <span className="play-pill absolute bottom-4 left-4 md:bottom-7 md:left-7">
              <Play className="h-3.5 w-3.5 fill-current" aria-hidden /> Watch the reel
            </span>
            <Badge variant="overlay" className="absolute right-4 top-4 md:right-7 md:top-7">
              <Volume2 className="h-3.5 w-3.5" aria-hidden /> Sound on
            </Badge>
          </div>
        </ReelLightbox>
      </div>
    </Section>
  );
}
