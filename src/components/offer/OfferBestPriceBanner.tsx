"use client";

import type { Deal, OfferDetail } from "@/types";
import { formatEuro } from "@/lib/utils";
import { OfferCtaButton } from "@/components/offer/OfferCtaButton";
import { useLocale, useT } from "@/i18n/LocaleProvider";

/**
 * Desktop conversion strip. Mobile uses MobilePriceSection instead.
 */
export function OfferBestPriceBanner({
  deal,
  detail,
}: {
  deal: Deal;
  detail: OfferDetail;
}) {
  const t = useT();
  const { locale } = useLocale();

  return (
    <div className="flex flex-col gap-4 border border-line bg-white px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6">
      <div className="min-w-0">
        <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted">
          {t("offer.bestPriceToday")}
        </span>
        <p className="mt-2 truncate text-base font-semibold leading-snug text-ink sm:text-lg">{deal.name}</p>
        <p className="mt-0.5 text-sm text-body">{deal.provider}</p>
      </div>

      <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
        <div>
          <p className="flex items-baseline gap-2 leading-none">
            <span className="text-sm text-muted">{t("deal.from")}</span>
            <span className="text-[1.75rem] font-semibold tracking-tight text-ink">
              {formatEuro(deal.currentPrice, locale)}
            </span>
          </p>
          <p className="mt-1 text-sm text-muted">{t("deal.perPerson")}</p>
        </div>

        <div className="hidden w-full sm:block sm:w-auto">
          <OfferCtaButton
            slug={deal.slug}
            ctaMode={detail.ctaMode}
            bookingUrl={detail.bookingUrl}
            bookingUrls={detail.bookingUrls}
            className="w-full py-3 text-sm sm:min-w-[11rem] sm:px-4"
          />
        </div>
      </div>
    </div>
  );
}
