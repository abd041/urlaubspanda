"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import type { Deal, OfferDetail } from "@/types";
import { SITE_URL } from "@/lib/site";
import { hasInternalBooking } from "@/lib/bookingRoute";
import { OfferCtaButton } from "@/components/offer/OfferCtaButton";
import { OfferPriceSummary } from "@/components/offer/OfferPriceSummary";
import { FavoriteButton } from "@/components/offer/FavoriteButton";
import { ShareButton } from "@/components/offer/ShareButton";
import { FreeCancellationBadge } from "@/components/booking/FreeCancellationBadge";
import { localeTag } from "@/i18n/config";
import { useLocale, useT } from "@/i18n/LocaleProvider";
import { mealPlanLabel, nightLabel, tx } from "@/i18n/content";
import { hasFreeCancellation } from "@/lib/freeCancellation";

/**
 * Sticky desktop price card. Hierarchy: old price → current → savings → CTA.
 * `self-start` is required so sticky works inside the offer flex row.
 */
export function PriceSidebar({ deal, detail }: { deal: Deal; detail: OfferDetail }) {
  const t = useT();
  const { locale } = useLocale();
  const countFormatter = new Intl.NumberFormat(localeTag(locale));
  const offerUrl = `${SITE_URL}/angebot/${deal.slug}`;
  const superior = detail.starsSuperior === true;
  const internal = hasInternalBooking(deal.slug);
  const holidayCheck =
    deal.reviewEnabled && deal.reviewCount > 0
      ? t("offer.reviewsFrom", {
          percent: deal.reviewPercent,
          count: countFormatter.format(deal.reviewCount),
        })
      : null;
  const cover = deal.images[0];

  const infoRows: { label: string; value: ReactNode }[] = [
    { label: t("offer.travelTime"), value: deal.dateRange },
    { label: t("offer.duration"), value: nightLabel(deal.nights, locale) },
    { label: t("offer.hotelName"), value: deal.name },
    { label: t("offer.meal"), value: mealPlanLabel(deal.mealPlan, locale) },
    {
      label: t("offer.starRating"),
      value: (
        <span className="inline-flex items-center gap-0.5" aria-label={t("deal.stars", { count: deal.stars })}>
          {Array.from({ length: deal.stars }).map((_, i) => (
            <Star key={i} className="h-3.5 w-3.5 fill-star text-star" aria-hidden="true" />
          ))}
          {superior ? <span className="ml-0.5 text-[11px] font-bold text-ink">S</span> : null}
        </span>
      ),
    },
  ];

  if (holidayCheck && detail.reviewSource) {
    infoRows.push({ label: detail.reviewSource, value: holidayCheck });
  }

  if (detail.tripadvisorSummary) {
    infoRows.push({ label: "Tripadvisor", value: tx(detail.tripadvisorSummary, locale) });
  }

  return (
    <aside className="mt-8 hidden lg:sticky lg:top-24 lg:mt-0 lg:block lg:w-[320px] lg:shrink-0 lg:self-start xl:w-[340px]">
      <div className="overflow-hidden rounded-[1.25rem] border border-[rgba(15,23,42,0.07)] bg-white shadow-[0_16px_40px_rgba(15,26,43,0.1)]">
        {cover && (
          <div className="relative h-28 bg-surface">
            <Image
              src={cover}
              alt={deal.name}
              fill
              sizes="340px"
              className="object-cover"
            />
            <div
              className="absolute inset-0 bg-linear-to-t from-white via-white/20 to-transparent"
              aria-hidden="true"
            />
          </div>
        )}

        <div className="px-6 pb-6 pt-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-600">
            {t("offer.bestPriceToday")}
          </p>

          <div className="mt-3">
            <OfferPriceSummary deal={deal} size="lg" />
          </div>

          {hasFreeCancellation() && (
            <div className="mt-3">
              <FreeCancellationBadge variant="inline" size="md" />
            </div>
          )}

          <div className="mt-6">
            <OfferCtaButton
              slug={deal.slug}
              ctaMode={detail.ctaMode}
              bookingUrl={detail.bookingUrl}
              bookingUrls={detail.bookingUrls}
              ctaOptions={detail.ctaOptions}
              countrySelectionNotice={detail.countrySelectionNotice}
            />
          </div>

          {detail.importantNotice && (
            <div className="mt-4 rounded-xl border border-cal/40 bg-[#FFF8E8] px-3.5 py-2.5 text-sm font-medium text-ink">
              {tx(detail.importantNotice, locale)}
            </div>
          )}

          <p className="mt-3 text-center text-xs leading-relaxed text-muted">
            {internal ? t("offer.ctaHint") : t("offer.affiliateHint")}
          </p>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <FavoriteButton
              dealId={deal.id}
              className="h-10 w-full justify-center gap-1 rounded-xl px-1.5 py-0 text-xs shadow-none [&_svg]:h-3.5 [&_svg]:w-3.5"
              alwaysShowLabel
            />
            <ShareButton
              url={offerUrl}
              title={deal.name}
              className="h-10 w-full justify-center gap-1 rounded-xl px-1.5 py-0 text-xs shadow-none [&_svg]:h-3.5 [&_svg]:w-3.5"
              alwaysShowLabel
            />
          </div>
        </div>

        <div className="border-t border-[rgba(15,23,42,0.06)] bg-surface/80 px-6 py-5">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted">
            {t("offer.offerInfo")}
          </h2>

          <dl className="mt-3 space-y-2.5">
            {infoRows.map((row) => (
              <div
                key={row.label}
                className="flex items-start justify-between gap-3 text-[13px] leading-[1.4]"
              >
                <dt className="shrink-0 text-muted">{row.label}</dt>
                <dd className="min-w-0 text-right font-medium text-ink">{row.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-5 border-t border-[rgba(15,23,42,0.06)] pt-4">
            <p className="text-[13px] text-ink">{t("offer.notRight")}</p>
            <Link
              href="#aehnliche-deals"
              className="mt-0.5 inline-block text-[13px] font-medium text-brand-500 transition hover:text-brand-600"
            >
              {t("offer.similar")}
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
