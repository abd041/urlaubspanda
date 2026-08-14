"use client";

import { ThumbsUp } from "lucide-react";
import { localeTag } from "@/i18n/config";
import { useLocale, useT } from "@/i18n/LocaleProvider";

interface OfferReviewRowProps {
  reviewPercent: number;
  reviewScore: number;
  reviewMaxScore: number;
  reviewCount: number;
  reviewSource?: string;
}

/**
 * Larger pill-style review summary for the offer detail hero, distinct from
 * the compact `ReviewBadge` used on deal cards. Hidden entirely when the
 * offer's `reviewEnabled` flag is off.
 */
export function OfferReviewRow({
  reviewPercent,
  reviewScore,
  reviewMaxScore,
  reviewCount,
  reviewSource,
}: OfferReviewRowProps) {
  const t = useT();
  const { locale } = useLocale();
  const countFormatter = new Intl.NumberFormat(localeTag(locale));
  const scoreFormatter = new Intl.NumberFormat(localeTag(locale), {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-500 px-3 py-1.5 font-bold text-white">
        <ThumbsUp className="h-4 w-4 fill-white" aria-hidden="true" />
        {reviewPercent}%
      </span>
      <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 font-semibold text-ink">
        <span className="h-2 w-2 rounded-full bg-star" aria-hidden="true" />
        {scoreFormatter.format(reviewScore)} / {reviewMaxScore}
      </span>
      <a href="#bewertungen" className="font-semibold text-brand-500 hover:text-brand-600">
        {t("deal.reviews", { count: countFormatter.format(reviewCount) })}
      </a>
      {reviewSource && <span className="text-body">{t("offer.onSource", { source: reviewSource })}</span>}
    </div>
  );
}
