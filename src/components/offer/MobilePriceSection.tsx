"use client";

import { ChevronDown } from "lucide-react";
import type { Deal, OfferDetail } from "@/types";
import { hasInternalBooking } from "@/lib/bookingRoute";
import { OfferCtaButton } from "@/components/offer/OfferCtaButton";
import { OfferPriceSummary } from "@/components/offer/OfferPriceSummary";
import { useT } from "@/i18n/LocaleProvider";

/**
 * Mobile price card + CTA. Anchor id kept for MobileStickyCta observer.
 */
export function MobilePriceSection({ deal, detail }: { deal: Deal; detail: OfferDetail }) {
  const t = useT();

  return (
    <div className="lg:hidden">
      <div className="overflow-hidden rounded-[1.25rem] border border-[rgba(15,23,42,0.07)] bg-white p-5 shadow-[0_8px_24px_rgba(15,26,43,0.06)] sm:p-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-600">
          {t("offer.bestPriceToday")}
        </p>
        <p className="mt-1 text-sm text-body">{deal.provider}</p>
        <div className="mt-4">
          <OfferPriceSummary deal={deal} size="lg" />
        </div>
      </div>

      <div id="mobile-cta-anchor" className="mt-5">
        <OfferCtaButton
          slug={deal.slug}
          ctaMode={detail.ctaMode}
          bookingUrl={detail.bookingUrl}
          bookingUrls={detail.bookingUrls}
          className="h-16 text-base"
        />
      </div>

      <p className="mt-2.5 px-1 text-center text-xs leading-relaxed text-muted">
        {hasInternalBooking(deal.slug) ? t("offer.ctaHint") : t("offer.affiliateHint")}
      </p>

      <a
        href="#beschreibung"
        className="mt-4 flex items-center justify-center gap-1 text-center text-sm font-medium text-brand-500 transition hover:text-brand-600"
      >
        {t("offer.moreInfo")}
        <ChevronDown className="h-4 w-4" aria-hidden="true" />
      </a>
    </div>
  );
}
