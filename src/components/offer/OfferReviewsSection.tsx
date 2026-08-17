"use client";

import type { Deal, OfferDetail } from "@/types";
import { localeTag } from "@/i18n/config";
import { useLocale, useT } from "@/i18n/LocaleProvider";

function scoreLabel(score: number, max: number, t: ReturnType<typeof useT>): string {
  const ratio = score / max;
  if (ratio >= 0.9) return t("offer.scoreExcellent");
  if (ratio >= 0.8) return t("offer.scoreOutstanding");
  if (ratio >= 0.7) return t("offer.scoreVeryGood");
  return t("offer.scoreGood");
}

/** External ratings only (HolidayCheck / Tripadvisor). Customers do not review on-site. */
export function OfferReviewsSection({ deal, detail }: { deal: Deal; detail?: OfferDetail }) {
  const t = useT();
  const { locale } = useLocale();

  if (!deal.reviewEnabled || deal.reviewCount <= 0) return null;

  const countFormatter = new Intl.NumberFormat(localeTag(locale));
  const scoreFormatter = new Intl.NumberFormat(localeTag(locale), {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
  const officialLabel = scoreLabel(deal.reviewScore, deal.reviewMaxScore, t);

  return (
    <section id="bewertungen" className="scroll-mt-24" aria-labelledby="bewertungen-heading">
      <h2
        id="bewertungen-heading"
        className="mt-2 text-[1.75rem] font-medium tracking-[-0.03em] text-ink sm:text-[2.125rem]"
      >
        {t("offer.reviewsHeading")}
      </h2>

      <div className="mt-6 flex items-center gap-4 rounded-[1.25rem] border border-[rgba(15,23,42,0.07)] bg-white p-5 shadow-[0_1px_2px_rgba(15,26,43,0.04),0_8px_20px_rgba(15,26,43,0.045)] sm:p-6">
        <span className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl bg-[#F4F8FF] text-brand-600">
          <span className="text-[1.35rem] font-extrabold leading-none tabular-nums">
            {scoreFormatter.format(deal.reviewScore)}
          </span>
          <span className="mt-0.5 text-[10px] font-medium text-muted">/ {deal.reviewMaxScore}</span>
        </span>
        <div className="min-w-0">
          <p className="text-[15px] font-semibold text-ink">{officialLabel}</p>
          <p className="mt-1 text-sm text-muted">
            {detail?.reviewSource
              ? t("offer.officialFrom", {
                  source: detail.reviewSource,
                  count: countFormatter.format(deal.reviewCount),
                })
              : t("deal.reviews", { count: countFormatter.format(deal.reviewCount) })}
          </p>
        </div>
      </div>
    </section>
  );
}
