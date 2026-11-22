import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

/** With fewer projects than this, grids end on a "coming soon" card. */
export const FEW_PROJECTS = 4;

const CORNER = "pointer-events-none absolute h-4 w-4 border-muted";

/** Fills out a short portfolio: a viewfinder frame with an invitation to get in touch. */
export default function ComingSoonCard({ as: Heading = "h3", wide = false }: { as?: "h2" | "h3"; wide?: boolean }) {
  return (
    <Card
      padding="none"
      className={`relative flex h-full min-w-0 flex-col items-start justify-center p-10 sm:p-12 ${wide ? "min-h-80 md:p-20" : "min-h-80"}`}
      data-coming-soon
    >
      <span aria-hidden className={`${CORNER} left-4 top-4 border-l border-t`} />
      <span aria-hidden className={`${CORNER} right-4 top-4 border-r border-t`} />
      <span aria-hidden className={`${CORNER} bottom-4 left-4 border-b border-l`} />
      <span aria-hidden className={`${CORNER} bottom-4 right-4 border-b border-r`} />

      <p className="t-meta text-secondary">In the edit</p>
      <Heading className="t-h3 mt-4">
        New work <em className="t-italic">coming soon</em>.
      </Heading>
      <p className="mt-4 max-w-md text-body text-secondary">
        We&apos;re preparing our next case studies. Tell us what you&apos;re making and we&apos;ll talk through how we&apos;d edit it.
      </p>
      <Button href="/contact" arrow className="mt-8">
        Discuss your project
      </Button>
    </Card>
  );
}
