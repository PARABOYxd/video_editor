import { PROCESS } from "@/config/content";
import Section from "@/components/ui/Section";
import SectionHeader from "@/components/ui/SectionHeader";

/** Four steps: a vertical timeline on phones and tablets, horizontal on desktop. */
export default function Process() {
  return (
    <Section id="process" bleed className="border-y border-line bg-surface" aria-labelledby="process-title">
      <SectionHeader
        id="process-title"
        eyebrow="How we work"
        title={
          <>
            From brief to <em className="t-italic">final</em> cut.
          </>
        }
      />
      <ol data-reveal-group className="mt-14 grid lg:grid-cols-4">
        {PROCESS.map((step, i) => (
          <li key={step.title} className="group/step relative pb-10 pl-16 last:pb-0 lg:pb-0 lg:pl-0 lg:pr-8 lg:pt-20">
            <span
              aria-hidden
              className="absolute bottom-0 left-5 top-10 w-px bg-line group-last/step:hidden lg:bottom-auto lg:left-10 lg:right-0 lg:top-5 lg:h-px lg:w-auto lg:group-last/step:block"
            />
            <span aria-hidden className="t-meta absolute left-0 top-0 grid h-10 w-10 place-items-center rounded-full border border-ink bg-surface">
              {i + 1}
            </span>
            <h3 className="t-h4 pt-1 uppercase stretch-condensed lg:pt-0">{step.title}</h3>
            <p className="mt-3 max-w-measure text-body-sm text-secondary">{step.text}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
