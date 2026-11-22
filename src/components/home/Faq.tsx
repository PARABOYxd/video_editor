import { FAQ } from "@/config/content";
import { faqJsonLd } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";
import Button from "@/components/ui/Button";
import Eyebrow from "@/components/ui/Eyebrow";
import Section from "@/components/ui/Section";
import Accordion from "./Accordion";

export default function Faq() {
  const items = FAQ.filter((f) => f.question.trim() && f.answer.trim());
  if (!items.length) return null;

  return (
    <Section id="faq" className="grid-12 gap-y-10" aria-labelledby="faq-title">
      <JsonLd data={faqJsonLd(items)} />
      <div data-reveal className="col-span-12 lg:col-span-4">
        <Eyebrow>FAQ</Eyebrow>
        <h2 id="faq-title" className="t-h2 mt-5">
          Before you <em className="t-italic">ask.</em>
        </h2>
        <p className="mt-6 max-w-sm text-body text-secondary">Anything else? Send it with your brief and we&apos;ll answer in our reply.</p>
        <Button href="/contact" variant="link" arrow className="mt-6">
          Ask a question
        </Button>
      </div>
      <div data-reveal className="col-span-12 lg:col-span-7 lg:col-start-6">
        <Accordion items={items} />
      </div>
    </Section>
  );
}
