"use client";

import type { Deal, OfferDetail } from "@/types";
import { formatEuro } from "@/lib/utils";
import { OfferCtaButton } from "@/components/offer/OfferCtaButton";
import { useOfferCountdown } from "@/components/offer/useOfferCountdown";
import { useLocale, useT } from "@/i18n/LocaleProvider";
import { nightLabel } from "@/i18n/content";

interface MobileStickyCtaProps {
  deal: Deal;
  detail: OfferDetail;
}

/**
 * Always-on mobile bottom bar: optional countdown, prices, Urlaubspanda-blue CTA.
 * Original price is red; current price is black.
 */
export function MobileStickyCta({ deal, detail }: MobileStickyCtaProps) {
  const t = useT();
  const { locale } = useLocale();
  const countdown = useOfferCountdown(detail.countdownEndsAt);
  const totalTwoAdults = deal.currentPrice * 2;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 px-4 pt-3 shadow-[0_-8px_24px_rgba(15,26,43,0.1)] backdrop-blur lg:hidden pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      {countdown && (
        <p className="mb-2 inline-flex rounded-md bg-danger px-2 py-0.5 text-[11px] font-bold tracking-wide text-white">
          {t("offer.limitedOffer", { time: countdown })}
        </p>
      )}

      <div className="flex items-end justify-between gap-3">
        <div className="min-w-0">
          {deal.oldPrice > deal.currentPrice && (
            <p className="text-[13px] font-semibold text-danger line-through">
              {formatEuro(deal.oldPrice, locale)}
            </p>
          )}
          <p className="flex flex-wrap items-baseline gap-x-1.5">
            <span className="text-[11px] text-muted">{t("deal.from")}</span>
            <span className="text-[1.45rem] font-extrabold leading-none tracking-tight text-ink">
              {formatEuro(deal.currentPrice, locale)}
            </span>
            <span className="text-[11px] text-muted">
              {t("deal.perPerson")} · {nightLabel(deal.nights, locale)}
            </span>
          </p>
          <p className="mt-1 text-[11px] font-medium text-ink">
            {t("offer.totalTwoAdults", { price: formatEuro(totalTwoAdults, locale) })}
          </p>
        </div>
      </div>

      <div className="mt-2.5">
        <OfferCtaButton
          slug={deal.slug}
          ctaMode={detail.ctaMode}
          bookingUrl={detail.bookingUrl}
          bookingUrls={detail.bookingUrls}
          className="h-12 text-sm"
        />
      </div>
    </div>
  );
}
