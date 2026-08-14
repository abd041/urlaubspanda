"use client";

import { Check } from "lucide-react";
import type { Deal, OfferCompareOption, OfferDetail } from "@/types";
import { cn } from "@/lib/utils";
import { OfferCtaButton } from "@/components/offer/OfferCtaButton";
import { localeTag } from "@/i18n/config";
import { useLocale, useT } from "@/i18n/LocaleProvider";
import { mealPlanLabel, nightLabel } from "@/i18n/content";

function formatEuroWhole(value: number, locale: "de" | "en") {
  return `${new Intl.NumberFormat(localeTag(locale), {
    maximumFractionDigits: 0,
  }).format(Math.round(value))} €`;
}

function buildFallbackOffers(deal: Deal, detail: OfferDetail): OfferCompareOption[] {
  const secondPrice = Math.round(deal.currentPrice * 1.15);
  const cheaperPercent = Math.max(1, Math.round((1 - deal.currentPrice / secondPrice) * 100));

  return [
    {
      id: `${deal.id}-primary`,
      provider: deal.provider,
      nights: deal.nights,
      mealPlan: deal.mealPlan,
      oldPrice: deal.oldPrice > deal.currentPrice ? deal.oldPrice : undefined,
      currentPrice: deal.currentPrice,
      priceUpdatedAt: "14.08.2026, 10:25",
      bookingUrl: detail.bookingUrl,
      cheaperPercent,
    },
    {
      id: `${deal.id}-alt`,
      provider: "Secret Escapes",
      nights: deal.nights,
      mealPlan: deal.mealPlan,
      oldPrice: Math.round(secondPrice * 1.12),
      currentPrice: secondPrice,
      priceUpdatedAt: "14.08.2026, 09:40",
      bookingUrl: detail.bookingUrl,
    },
  ];
}

function CompareOfferRow({
  offer,
  detail,
  slug,
}: {
  offer: OfferCompareOption;
  detail: OfferDetail;
  slug: string;
}) {
  const t = useT();
  const { locale } = useLocale();
  const perNight = offer.currentPrice / Math.max(offer.nights, 1);
  const featured = offer.cheaperPercent != null && offer.cheaperPercent > 0;

  return (
    <article
      className={cn(
        "grid gap-4 px-5 py-5 sm:px-6 sm:py-5 lg:grid-cols-[minmax(0,1.2fr)_auto_auto] lg:items-center lg:gap-8",
        featured && "bg-[#F7FAFF]"
      )}
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          {featured && (
            <span className="rounded-full bg-[#E8F6EE] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-success">
              {t("offer.bestPriceBadge")}
            </span>
          )}
          <p className="text-[15px] font-semibold tracking-tight text-ink">{offer.provider}</p>
        </div>
        <p className="mt-1 text-[13px] text-muted">
          {nightLabel(offer.nights, locale)} · {mealPlanLabel(offer.mealPlan, locale)}
          {featured && offer.cheaperPercent ? ` · ${t("offer.cheaper", { percent: offer.cheaperPercent })}` : ""}
        </p>
      </div>

      <div className="lg:text-right">
        {offer.oldPrice != null && offer.oldPrice > offer.currentPrice && (
          <p className="text-[13px] text-muted line-through">{formatEuroWhole(offer.oldPrice, locale)}</p>
        )}
        <p className="flex items-baseline gap-1.5 leading-none lg:justify-end">
          <span className="text-[13px] text-muted">{t("deal.from")}</span>
          <span className="text-[1.5rem] font-extrabold tracking-tight text-ink">
            {formatEuroWhole(offer.currentPrice, locale)}
          </span>
        </p>
        <p className="mt-1 text-[12px] text-muted">
          {formatEuroWhole(perNight, locale)} {t("offer.perNight")}
        </p>
      </div>

      <div className="w-full lg:w-[11.5rem]">
        <OfferCtaButton
          slug={slug}
          ctaMode={detail.ctaMode}
          bookingUrl={offer.bookingUrl ?? detail.bookingUrl}
          bookingUrls={detail.bookingUrls}
          variant="quiet"
          label={t("offer.toOffer")}
        />
      </div>
    </article>
  );
}

/**
 * Price comparison — one table, quiet partner links. Primary CTA stays in the sidebar.
 */
export function OfferCompareCard({ deal, detail }: { deal: Deal; detail: OfferDetail }) {
  const t = useT();
  const offers =
    detail.compareOffers && detail.compareOffers.length > 0
      ? detail.compareOffers
      : buildFallbackOffers(deal, detail);

  const countLabel =
    offers.length === 1 ? t("offer.compareOne") : t("offer.compareMany", { count: offers.length });

  return (
    <section aria-labelledby="angebote-vergleichen-heading">
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-600">
        {t("offer.compare")}
      </p>
      <h2
        id="angebote-vergleichen-heading"
        className="mt-2 text-[1.75rem] font-medium tracking-[-0.03em] text-ink sm:text-[2.125rem]"
      >
        {countLabel}
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-body">{t("offer.compareIntro")}</p>

      <div className="mt-6 overflow-hidden rounded-[1.25rem] border border-[rgba(15,23,42,0.07)] bg-white shadow-[0_1px_2px_rgba(15,26,43,0.04),0_8px_20px_rgba(15,26,43,0.045)]">
        <div className="divide-y divide-[rgba(15,23,42,0.06)]">
          {offers.map((offer) => (
            <CompareOfferRow key={offer.id} offer={offer} detail={detail} slug={deal.slug} />
          ))}
        </div>
      </div>

      <ul className="mt-4 flex flex-col gap-2 text-xs text-muted sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-5 sm:gap-y-1">
        {[t("offer.checkDaily"), t("offer.clickPartner"), t("offer.noBookingHere")].map((item) => (
          <li key={item} className="flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5 shrink-0 text-success" aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
