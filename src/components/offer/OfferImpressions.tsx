"use client";

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
 * Offer meta chips + affiliate note (Impressionen photo strip removed).
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
  const tags = resolveImpressionTags(deal, detail, t, locale);

  if (tags.length === 0) {
    return (
      <div className="flex gap-3 text-sm leading-relaxed text-body">
        <span
          className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted/25 text-muted"
          aria-hidden="true"
        >
          <Info className="h-3 w-3" />
        </span>
        <p>{t("offer.affiliateNote")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <ul className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <li key={tag}>
            <span className="inline-flex rounded-full border border-line bg-white px-3.5 py-1.5 text-sm text-ink">
              {tag}
            </span>
          </li>
        ))}
      </ul>

      <div className="flex gap-3 text-sm leading-relaxed text-body">
        <span
          className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted/25 text-muted"
          aria-hidden="true"
        >
          <Info className="h-3 w-3" />
        </span>
        <p>{t("offer.affiliateNote")}</p>
      </div>
    </div>
  );
}
