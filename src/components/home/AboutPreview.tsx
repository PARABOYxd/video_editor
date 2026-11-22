import type { Profile } from "@/lib/types";
import Button from "@/components/ui/Button";
import Eyebrow from "@/components/ui/Eyebrow";
import Section from "@/components/ui/Section";
import Img from "../ui/Img";

/** Heading and intro beside two offset portraits, each with that editor's focus. */
export default function AboutPreview({ profile }: { profile: Profile }) {
  return (
    <Section id="about" bleed className="border-y border-line bg-surface" innerClassName="grid-12 gap-y-14" aria-labelledby="about-title">
      <div data-reveal className="col-span-12 md:col-span-6 md:self-center lg:col-span-5">
        <Eyebrow>About</Eyebrow>
        <h2 id="about-title" className="t-h2 mt-5">
          Good editing is <em className="t-italic">more</em> than cutting clips.
        </h2>
        <p className="t-lead mt-8">{profile.intro}</p>
        <p className="mt-4 max-w-measure text-body text-secondary">{profile.difference || profile.approach}</p>
        <Button href="/about" variant="link" arrow className="mt-10">
          More about us
        </Button>
      </div>

      <div data-reveal-group className="col-span-12 grid grid-cols-2 gap-x-4 md:col-span-6 md:col-start-7 lg:gap-x-6">
        {profile.team.slice(0, 2).map((m, i) => (
          <figure key={m.name} className={i === 1 ? "mt-12 md:mt-24" : ""}>
            <div className="relative aspect-portrait overflow-hidden rounded bg-paper">
              {m.photoUrl && (
                <Img src={m.photoUrl} alt={`Portrait of ${m.name}, ${m.role}`} fill sizes="(min-width: 1408px) 300px, (min-width: 768px) 22vw, 44vw" className="object-cover" />
              )}
            </div>
            <figcaption className="mt-3 border-t border-ink pt-3">
              <span className="block text-body font-medium">{m.name}</span>
              <span className="t-meta block text-secondary">{m.role}</span>
              {m.bio && <span className="mt-2 block text-small text-secondary">{m.bio}</span>}
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}
