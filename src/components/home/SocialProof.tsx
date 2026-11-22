import { CLIENT_LOGOS, STATS, type Stat } from "@/config/content";
import Container from "@/components/ui/Container";
import CountUp from "./CountUp";
import LogoMarquee from "./LogoMarquee";

const isFilled = (s: Stat): s is Stat & { value: number } => typeof s.value === "number";

/** Stats and client logos from src/config/content.ts. Hidden until real ones are filled in. */
export default function SocialProof() {
  const stats = STATS.filter(isFilled);
  if (!stats.length && !CLIENT_LOGOS.length) return null;

  return (
    <section data-social-proof aria-label="The studio in numbers" className="border-y border-line py-10 md:py-12">
      {stats.length > 0 && (
        <Container as="dl" className="grid grid-cols-2 gap-x-6 gap-y-8 md:flex md:justify-between">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col-reverse gap-2">
              <dt className="t-meta text-secondary">{s.label}</dt>
              <dd className="t-h2 tabular-nums">
                <CountUp value={s.value} suffix={s.suffix} />
              </dd>
            </div>
          ))}
        </Container>
      )}
      {CLIENT_LOGOS.length > 0 && <LogoMarquee logos={CLIENT_LOGOS} />}
    </section>
  );
}
