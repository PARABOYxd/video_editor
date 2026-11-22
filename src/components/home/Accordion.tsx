"use client";

import { useId, useState } from "react";
import { Plus } from "lucide-react";

/**
 * Disclosure list: real buttons with aria-expanded. Closed answers stay in the
 * HTML for crawlers, and are inert so they can't take focus or be read out.
 */
export default function Accordion({ items }: { items: { question: string; answer: string }[] }) {
  const id = useId();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="border-t border-ink">
      {items.map((item, i) => {
        const on = open === i;
        return (
          <div key={item.question} className="border-b border-line">
            <h3>
              <button
                type="button"
                id={`${id}-q${i}`}
                aria-expanded={on}
                aria-controls={`${id}-a${i}`}
                onClick={() => setOpen(on ? null : i)}
                className="flex min-h-16 w-full items-center justify-between gap-6 py-5 pr-2 text-left font-display text-faq font-semibold transition-colors duration-base hover:text-accent"
              >
                {item.question}
                <Plus aria-hidden className={`h-5 w-5 shrink-0 transition-transform duration-slow ${on ? "rotate-45" : ""}`} />
              </button>
            </h3>
            <div
              id={`${id}-a${i}`}
              role="region"
              aria-labelledby={`${id}-q${i}`}
              inert={!on}
              className={`grid transition-[grid-template-rows,visibility] duration-slow ease-out-soft ${on ? "visible grid-rows-[1fr]" : "invisible grid-rows-[0fr]"}`}
            >
              <div className="overflow-hidden">
                <p className="max-w-measure pb-6 text-body text-secondary">{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
