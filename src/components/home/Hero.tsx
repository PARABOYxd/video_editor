import { Fragment } from "react";
import type { Profile } from "@/lib/types";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";

const WORD_DELAY = 70;

/**
 * The h1 rises word by word. It's real text with real spaces (screen readers
 * hear one sentence), and it is painted from the first frame, so LCP isn't
 * held back. One word is set in italic, for editorial contrast.
 */
function Headline({ text }: { text: string }) {
  const words = text.split(" ");
  const pick = words.findIndex((w) => /^every$/i.test(w));
  return (
    <>
      {words.map((word, i) => (
        <Fragment key={i}>
          <span className="hero-word" style={{ animationDelay: `${i * WORD_DELAY}ms` }}>
            {i === pick ? <em className="t-italic">{word.toLowerCase()}</em> : word}
          </span>
          {i < words.length - 1 ? " " : ""}
        </Fragment>
      ))}
    </>
  );
}

export default function Hero({ profile }: { profile: Profile }) {
  return (
    <Container as="section" className="pb-block pt-page-top" aria-labelledby="hero-title">
      <div className="grid-12 gap-y-8">
        <div className="col-span-12 flex flex-wrap items-center justify-between gap-4">
          <Eyebrow>{profile.heroLabel}</Eyebrow>
          {profile.availability && (
            <p data-status className="t-meta inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-ink">
              <span aria-hidden className="status-dot h-2 w-2 rounded-full bg-success" />
              Available for projects
            </p>
          )}
        </div>

        <h1 id="hero-title" className="t-display col-span-12 max-w-headline lg:col-span-10">
          <Headline text={profile.heroHeadline} />
        </h1>

        <div className="col-span-12 flex flex-col gap-8 md:col-span-8 md:col-start-5 lg:col-span-5 lg:col-start-8">
          <p className="t-lead text-secondary">{profile.heroText}</p>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button href="/contact" variant="accent" size="lg" arrow>
              Start a project
            </Button>
            <Button href="/work" variant="secondary" size="lg" arrow>
              Explore our work
            </Button>
          </div>
        </div>

        <a href="#after-hero" data-scroll-cue className="t-meta col-span-12 hidden min-h-11 items-center gap-3 justify-self-start text-secondary hover:text-ink md:inline-flex">
          <span aria-hidden className="scroll-cue" />
          Scroll to explore
        </a>
      </div>
    </Container>
  );
}
