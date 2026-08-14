"use client";

import { ThumbsUp } from "lucide-react";
import { useLocale, useT } from "@/i18n/LocaleProvider";
import { localeTag } from "@/i18n/config";

interface ReviewBadgeProps {
  reviewPercent: number;
  reviewScore: number;
  reviewMaxScore: number;
  reviewCount: number;
}

/**
 * One composed review line so percent, score, and count scan as a single unit.
 */
export function ReviewBadge({
  reviewPercent,
  reviewScore,
  reviewMaxScore,
  reviewCount,
}: ReviewBadgeProps) {
  const { locale } = useLocale();
  const t = useT();
  const countFormatter = new Intl.NumberFormat(localeTag(locale));
  const scoreFormatter = new Intl.NumberFormat(localeTag(locale), {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px]">
      <span className="inline-flex items-center gap-1 font-semibold text-brand-500">
        <ThumbsUp className="h-3.5 w-3.5" aria-hidden="true" strokeWidth={1.8} />
        {reviewPercent}%
      </span>
      <span className="font-medium text-ink">
        {scoreFormatter.format(reviewScore)} / {reviewMaxScore}
      </span>
      <span className="text-muted">{t("deal.reviews", { count: countFormatter.format(reviewCount) })}</span>
    </div>
  );
}
