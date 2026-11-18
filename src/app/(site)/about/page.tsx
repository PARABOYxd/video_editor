import ContactCTA from "@/components/home/ContactCTA";
import SoftwareList from "@/components/about/SoftwareList";
import Img from "@/components/ui/Img";
import { getProfile } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata() {
  const profile = await getProfile();
  return pageMetadata({
    title: "About",
    description: `${profile.intro} ${profile.experience}`.slice(0, 158),
    path: "/about",
    image: profile.team[0]?.photoUrl,
  });
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="grid-12 gap-y-4 border-t border-line pt-8">
      <h2 className="t-meta col-span-12 flex items-center gap-3 text-secondary-aa md:col-span-4">
        <span aria-hidden className="h-px w-8 bg-accent" />
        {label}
      </h2>
      <div className="col-span-12 text-[17px] leading-[1.7] md:col-span-8">{children}</div>
    </section>
  );
}

export default async function AboutPage() {
  const profile = await getProfile();
  const [a, b] = profile.team;

  return (
    <>
      <header className="container-site pt-12 md:pt-20">
        <p className="t-meta flex items-center gap-3 text-secondary-aa">
          <span aria-hidden className="h-px w-8 bg-accent" />
          About · {profile.brandName}
        </p>
        <h1 className="t-page mt-5 max-w-[15ch]">
          Behind <em className="t-italic">every</em> frame, there&apos;s a story.
        </h1>
      </header>

      {/* Portraits: one large, one smaller and offset */}
      <section className="container-site mt-14 md:mt-20" aria-label="Portraits">
        <div className="grid-12 gap-y-10">
          {a && (
            <figure className="col-span-12 md:col-span-7">
              <div className="relative aspect-[4/5] overflow-hidden rounded bg-surface md:aspect-[5/6]">
                <Img src={a.photoUrl} alt={`Portrait of ${a.name}`} fill priority sizes="(min-width: 768px) 58vw, 100vw" className="object-cover" />
              </div>
              <figcaption className="mt-3 flex justify-between gap-4">
                <span className="text-[15px] font-medium">{a.name}</span>
                <span className="t-meta text-secondary-aa">{a.role}</span>
              </figcaption>
              {a.bio && <p className="mt-2 max-w-md text-[15px] text-secondary-aa">{a.bio}</p>}
            </figure>
          )}
          {b && (
            <figure className="col-span-10 col-start-3 md:col-span-4 md:col-start-9 md:mt-48">
              <div className="relative aspect-[4/5] overflow-hidden rounded bg-surface">
                <Img src={b.photoUrl} alt={`Portrait of ${b.name}`} fill sizes="(min-width: 768px) 33vw, 80vw" className="object-cover" />
              </div>
              <figcaption className="mt-3 flex justify-between gap-4">
                <span className="text-[15px] font-medium">{b.name}</span>
                <span className="t-meta text-secondary-aa">{b.role}</span>
              </figcaption>
              {b.bio && <p className="mt-2 text-[15px] text-secondary-aa">{b.bio}</p>}
            </figure>
          )}
        </div>
      </section>

      {/* Introduction */}
      <section className="container-site section grid-12 gap-y-6">
        <p className="col-span-12 font-display text-[clamp(26px,3vw,40px)] font-medium leading-[1.2] lg:col-span-9">{profile.intro}</p>
      </section>

      <div className="container-site space-y-14 pb-24 md:pb-32">
        {profile.philosophy && (
          <Block label="Creative philosophy">
            <p>{profile.philosophy}</p>
          </Block>
        )}
        {profile.approach && (
          <Block label="Editing approach">
            <p>{profile.approach}</p>
          </Block>
        )}
        {profile.experience && (
          <Block label="Professional journey">
            <p>{profile.experience}</p>
          </Block>
        )}
        {profile.difference && (
          <Block label="What's different">
            <p>{profile.difference}</p>
          </Block>
        )}
        {profile.software.length > 0 && (
          <Block label="Software">
            <SoftwareList software={profile.software} />
          </Block>
        )}
      </div>

      <div className="border-t border-line">
        <ContactCTA profile={profile} />
      </div>
    </>
  );
}
