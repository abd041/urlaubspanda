"use client";

import { ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocale, useT } from "@/i18n/LocaleProvider";
import { localeTag } from "@/i18n/config";

interface ReviewBadgeProps {
  reviewPercent: number;
  reviewScore: number;
  reviewMaxScore: number;
  reviewCount: number;
  /** When set, the review count links to this hash/URL (offer page). */
  href?: string;
  size?: "sm" | "md";
  className?: string;
  /** Override for the review-count link/text (e.g. sidebar uses ink instead of brand blue). */
  countClassName?: string;
}

/**
 * Recommendation % + score pill + review count, matching the HolidayCheck-style
 * badge used on offer cards and the offer detail header.
 */
export function ReviewBadge({
  reviewPercent,
  reviewScore,
  reviewMaxScore,
  reviewCount,
  href,
  size = "sm",
  className,
  countClassName,
}: ReviewBadgeProps) {
  const { locale } = useLocale();
  const t = useT();
  const countFormatter = new Intl.NumberFormat(localeTag(locale));
  const scoreFormatter = new Intl.NumberFormat(localeTag(locale), {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
  const compact = size === "sm";
  const reviewsLabel = t("deal.reviews", { count: countFormatter.format(reviewCount) });
  const score = scoreFormatter.format(reviewScore);

  const countClass = cn(
    "font-medium",
    countClassName ?? "text-brand-500",
    compact ? "text-[13px]" : "text-sm",
    href && (countClassName ? "transition hover:underline" : "transition hover:text-brand-600 hover:underline")
  );

  return (
    <div
      className={cn("flex flex-wrap items-center gap-2", className)}
      aria-label={`${reviewPercent}%, ${score} / ${reviewMaxScore}, ${reviewsLabel}`}
    >
      <span className="inline-flex items-stretch overflow-hidden rounded-md">
        <span
          className={cn(
            "inline-flex items-center gap-1 bg-brand-500 font-bold text-white",
            compact ? "px-2 py-1 text-[13px]" : "px-2.5 py-1.5 text-sm"
          )}
        >
          <ThumbsUp
            className={cn(compact ? "h-3.5 w-3.5" : "h-4 w-4")}
            aria-hidden="true"
            strokeWidth={2.4}
          />
          {reviewPercent}%
        </span>
        <span
          className={cn(
            "inline-flex items-center gap-1.5 border border-l-0 border-line bg-white text-ink",
            compact ? "px-2 py-1 text-[13px]" : "px-2.5 py-1.5 text-sm"
          )}
        >
          <span
            className={cn(
              "shrink-0 rounded-full bg-[linear-gradient(180deg,#ffd24a_0%,#f5a623_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]",
              compact ? "h-3.5 w-3.5" : "h-4 w-4"
            )}
            aria-hidden="true"
          />
          <span>
            <span className="font-bold">{score}</span>
            <span className="font-normal text-body"> / {reviewMaxScore}</span>
          </span>
        </span>
      </span>
      {href ? (
        <a href={href} className={countClass}>
          {reviewsLabel}
        </a>
      ) : (
        <span className={countClass}>{reviewsLabel}</span>
      )}
    </div>
  );
}
