"use client";

import type { OfferContentSection } from "@/types";
import { useLocale } from "@/i18n/LocaleProvider";
import { tx } from "@/i18n/content";

/** Stacked H2 article body (urlaubshamster offer description sections). */
export function OfferContentSections({
  sections,
  fallbackHeading,
  fallbackParagraphs,
}: {
  sections?: OfferContentSection[];
  fallbackHeading: string;
  fallbackParagraphs: string[];
}) {
  const { locale } = useLocale();
  const blocks =
    sections && sections.length > 0
      ? sections
      : [{ heading: fallbackHeading, paragraphs: fallbackParagraphs }];

  return (
    <div id="beschreibung" className="scroll-mt-24 space-y-8 sm:space-y-10">
      {blocks.map((block) => (
        <section key={block.heading} aria-labelledby={`section-${block.heading}`}>
          <h2
            id={`section-${block.heading}`}
            className="text-[1.75rem] font-medium tracking-[-0.03em] text-ink sm:text-[2.125rem]"
          >
            {tx(block.heading, locale)}
          </h2>
          <div className="mt-3 space-y-3 sm:mt-4">
            {block.paragraphs.map((paragraph) => (
              <p
                key={paragraph.slice(0, 48)}
                className="text-[15px] leading-relaxed text-body sm:leading-7"
              >
                {tx(paragraph, locale)}
              </p>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
