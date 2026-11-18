import Link from "next/link";
import Img from "../ui/Img";
import type { Profile } from "@/lib/types";

/** Asymmetric: two portraits, offset, on the left; heading and approach on the right. */
export default function AboutPreview({ profile }: { profile: Profile }) {
  const [a, b] = profile.team;
  return (
    <section className="border-y border-line bg-surface" aria-labelledby="about-title">
      <div className="container-site section grid-12 gap-y-14">
        <div className="col-span-12 grid grid-cols-2 gap-4 md:col-span-6 lg:col-span-5">
          {[a, b].filter(Boolean).map((m, i) => (
            <figure key={m.name} className={i === 1 ? "mt-16 md:mt-24" : ""}>
              <div className="relative aspect-[4/5] overflow-hidden rounded bg-paper">
                <Img src={m.photoUrl} alt={`Portrait of ${m.name}`} fill sizes="(min-width: 1024px) 20vw, 45vw" className="object-cover" />
              </div>
              <figcaption className="mt-3">
                <span className="block text-[15px] font-medium">{m.name}</span>
                <span className="t-meta text-secondary-aa">{m.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="col-span-12 md:col-span-6 md:col-start-7 lg:col-span-6 lg:col-start-7 md:self-center">
          <p className="t-meta flex items-center gap-3 text-secondary-aa">
            <span aria-hidden className="h-px w-8 bg-accent" />
            About
          </p>
          <h2 id="about-title" className="t-section mt-5">
            Good editing is <em className="t-italic">more</em> than cutting clips.
          </h2>
          <div className="mt-8 max-w-xl space-y-4 text-[16px] text-secondary-aa">
            <p className="text-ink">{profile.intro}</p>
            <p>{profile.approach}</p>
          </div>
          <Link href="/about" className="link-arrow mt-10">
            More about us <span className="arrow" aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
