"use client";

import Image from "next/image";
import { Info } from "lucide-react";
import type { Deal, OfferDetail } from "@/types";
import { useLocale, useT } from "@/i18n/LocaleProvider";
import { countryDisplayName, tx } from "@/i18n/content";

function resolveImpressionTags(
  deal: Deal,
  detail: OfferDetail,
  t: ReturnType<typeof useT>,
  locale: ReturnType<typeof useLocale>["locale"]
): string[] {
  const tags: string[] = [];
  const country = countryDisplayName(deal.destinationCountry, locale);

  if (detail.badge) tags.push(tx(detail.badge, locale));
  else if (deal.tags.includes("adults-only")) tags.push(t("offer.hotelAdults"));
  else if (deal.tags.includes("familienhotel")) tags.push(t("offer.hotelFamily"));
  else if (deal.tags.includes("wellness")) tags.push(t("offer.hotelWellness"));

  tags.push(deal.provider.toUpperCase());

  if (deal.tags.includes("direkte-strandlage")) tags.push(t("offer.beachfront"));
  else if (deal.tags.includes("thermenurlaub")) tags.push(t("offer.spaIn", { country }));
  else if (deal.tags.includes("wellness")) tags.push(t("offer.wellnessIn", { country }));
  else tags.push(country);

  return [...new Set(tags)].slice(0, 3);
}

/**
 * Impressionen — photo strip + tags + affiliate note (urlaubshamster).
 */
export function OfferImpressions({
  deal,
  detail,
}: {
  deal: Deal;
  detail: OfferDetail;
}) {
  const t = useT();
  const { locale } = useLocale();
  const photos = deal.images.slice(0, 4);
  const tags = resolveImpressionTags(deal, detail, t, locale);

  return (
    <section id="impressionen" className="scroll-mt-24" aria-labelledby="impressionen-heading">
      <h2
        id="impressionen-heading"
        className="text-[1.75rem] font-medium tracking-[-0.03em] text-ink sm:text-[2.125rem]"
      >
        {tx("Impressionen", locale)}
      </h2>
      <p className="mt-1.5 text-sm text-body sm:text-[15px]">{t("offer.impressions")}</p>

      <ul className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
        {photos.map((src, i) => (
          <li
            key={src}
            className="relative aspect-[4/3] overflow-hidden rounded-[1.25rem] bg-surface"
          >
            <Image
              src={src}
              alt={t("offer.impressionN", { name: deal.name, n: i + 1 })}
              fill
              sizes="(min-width: 640px) 25vw, 50vw"
              className="object-cover"
            />
          </li>
        ))}
      </ul>

      {tags.length > 0 && (
        <div className="mt-6">
          <ul className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <li key={tag}>
                <span className="inline-flex rounded-full border border-line bg-white px-3.5 py-1.5 text-sm text-ink">
                  {tag}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-5 flex gap-3 text-sm leading-relaxed text-body">
        <span
          className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted/25 text-muted"
          aria-hidden="true"
        >
          <Info className="h-3 w-3" />
        </span>
        <p>{t("offer.affiliateNote")}</p>
      </div>
    </section>
  );
}
