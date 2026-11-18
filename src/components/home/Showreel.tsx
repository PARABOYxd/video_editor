import VideoPlayer from "../ui/VideoPlayer";
import type { Profile, Project } from "@/lib/types";

/**
 * Dark "screening room" band with the showreel. Until a reel is set in the
 * admin, the first featured project with a video stands in, and says so.
 */
export default function Showreel({ profile, fallback }: { profile: Profile; fallback: Project | null }) {
  const usingReel = Boolean(profile.showreelUrl);
  const url = usingReel ? profile.showreelUrl : (fallback?.videoUrl ?? "");
  const poster = usingReel ? profile.showreelPoster : fallback ? fallback.posterUrl || fallback.thumbnailUrl : "";

  return (
    <section id="showreel" aria-labelledby="showreel-title" className="scroll-mt-20 bg-media text-white">
      <div className="container-site section">
        <div className="grid-12 items-end gap-y-6">
          <div className="col-span-12 lg:col-span-8">
            <p className="t-meta flex items-center gap-3 text-muted">
              <span aria-hidden className="h-px w-8 bg-muted" />
              Showreel
            </p>
            <h2 id="showreel-title" className="t-section mt-5">
              A few seconds. <em className="t-italic">A lot</em> of stories.
            </h2>
          </div>
          <p className="col-span-12 text-[15px] text-muted lg:col-span-4 lg:text-right">
            {usingReel ? "Press play. Sound on." : fallback?.videoUrl ? `Featured: ${fallback.title}` : "The reel is on its way."}
          </p>
        </div>
        <div className="mt-12 md:mt-16">
          <VideoPlayer url={url} poster={poster} title={usingReel ? `${profile.shortName} showreel` : (fallback?.title ?? "Showreel")} emptyLabel="Placeholder · showreel to come" />
        </div>
      </div>
    </section>
  );
}
