"use client";

import type { OfferContentSection } from "@/types";
import { useLocale, useT } from "@/i18n/LocaleProvider";
import { tx } from "@/i18n/content";
import { OfferDescriptionParagraph } from "@/components/offer/OfferRichText";

const ABOUT_HEADING_DE = "Über dieses Angebot";

/**
 * Single premium card: “Über dieses Angebot” + hotel description + optional
 * in-card subheadings. Typography matches the offer-detail reference.
 */
export function OfferContentSections({
  sections,
  fallbackParagraphs,
}: {
  sections?: OfferContentSection[];
  /** @deprecated First heading is always “Über dieses Angebot”. */
  fallbackHeading?: string;
  fallbackParagraphs: string[];
}) {
  const t = useT();
  const { locale } = useLocale();

  const extraSections = (sections ?? []).filter(
    (section, index) => !(index === 0 && section.heading === ABOUT_HEADING_DE)
  );

  const aboutParagraphs =
    fallbackParagraphs.length > 0
      ? fallbackParagraphs
      : sections?.[0]?.paragraphs?.length
        ? sections[0].paragraphs
        : [];

  if (aboutParagraphs.length === 0 && extraSections.length === 0) return null;

  return (
    <section
      id="beschreibung"
      aria-labelledby="ueber-dieses-angebot"
      className="scroll-mt-24 rounded-2xl border border-[rgba(15,23,42,0.08)] bg-white p-5 shadow-[0_1px_2px_rgba(15,26,43,0.04),0_10px_28px_rgba(15,26,43,0.05)] sm:p-7 lg:p-8"
    >
      {/* Keep line length readable on wide desktops within the content column */}
      <div className="w-full max-w-[40rem] xl:max-w-[42rem]">
        <h2
          id="ueber-dieses-angebot"
          className="text-[24px] font-bold leading-tight tracking-[-0.02em] text-ink sm:text-[25px]"
        >
          {t("offer.aboutThisOffer")}
        </h2>

        {aboutParagraphs.length > 0 && (
          <div className="mt-5 space-y-4 sm:mt-6 sm:space-y-5">
            {aboutParagraphs.map((paragraph) => (
              <OfferDescriptionParagraph
                key={paragraph.slice(0, 64)}
                text={paragraph}
                locale={locale}
              />
            ))}
          </div>
        )}

        {extraSections.map((block) => (
          <div key={block.heading} className="mt-8 sm:mt-10">
            <h3 className="text-[23px] font-bold leading-tight tracking-[-0.02em] text-ink sm:text-[24px]">
              {tx(block.heading, locale)}
            </h3>
            <div className="mt-4 space-y-4 sm:mt-5 sm:space-y-5">
              {block.paragraphs.map((paragraph) => (
                <OfferDescriptionParagraph
                  key={paragraph.slice(0, 64)}
                  text={paragraph}
                  locale={locale}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
