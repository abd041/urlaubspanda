"use client";

import { Heart, MapPin, Star } from "lucide-react";
import type { Deal, OfferDetail } from "@/types";
import { ShareButton } from "@/components/offer/ShareButton";
import { FavoriteButton } from "@/components/offer/FavoriteButton";
import { localeTag } from "@/i18n/config";
import { useLocale, useT } from "@/i18n/LocaleProvider";
import { regionDisplay, tx } from "@/i18n/content";

function scoreLabel(score: number, max: number, t: ReturnType<typeof useT>): string {
  const ratio = score / max;
  if (ratio >= 0.9) return t("offer.scoreExcellent");
  if (ratio >= 0.8) return t("offer.scoreOutstanding");
  if (ratio >= 0.7) return t("offer.scoreVeryGood");
  return t("offer.scoreGood");
}

function resolveBadge(deal: Deal, detail: OfferDetail, t: ReturnType<typeof useT>): string | undefined {
  if (detail.badge) return detail.badge;
  if (deal.tags.includes("adults-only")) return t("offer.hotelAdults");
  if (deal.tags.includes("familienhotel")) return t("offer.hotelFamily");
  if (deal.tags.includes("wellness")) return t("offer.hotelWellness");
  return undefined;
}

/**
 * Offer page top header — meta + H1/summary + share/merken near title.
 */
export function OfferHeroHeader({
  deal,
  detail,
  offerUrl,
}: {
  deal: Deal;
  detail: OfferDetail;
  offerUrl: string;
}) {
  const t = useT();
  const { locale } = useLocale();
  const countFormatter = new Intl.NumberFormat(localeTag(locale));
  const scoreFormatter = new Intl.NumberFormat(localeTag(locale), {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
  const label = scoreLabel(deal.reviewScore, deal.reviewMaxScore, t);
  const badge = resolveBadge(deal, detail, t);
  const superior = detail.starsSuperior === true;

  return (
    <header className="mt-5 sm:mt-6">
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
        <div className="flex min-w-0 flex-wrap items-start gap-x-3 gap-y-2">
          <span
            className="inline-flex items-center gap-0.5 text-star"
            aria-label={`${t("deal.stars", { count: deal.stars })}${superior ? ", Superior" : ""}`}
          >
            {Array.from({ length: deal.stars }).map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-star" aria-hidden="true" />
            ))}
            {superior && (
              <span className="ml-0.5 text-sm font-extrabold leading-none" aria-hidden="true">
                S
              </span>
            )}
          </span>

          <span className="inline-flex min-w-0 max-w-full items-start gap-1 text-sm leading-snug text-ink">
            <MapPin
              className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted"
              aria-hidden="true"
              fill="currentColor"
            />
            <span className="min-w-0 break-words">{regionDisplay(deal.destinationRegion, locale)}</span>
          </span>

          {badge && (
            <span className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-line bg-white px-2.5 py-1 text-xs font-medium leading-snug text-ink">
              <Heart className="h-3 w-3 shrink-0 text-brand-500" aria-hidden="true" />
              <span className="min-w-0 break-words">{tx(badge, locale)}</span>
            </span>
          )}
        </div>

        {deal.reviewEnabled && (
          <a
            href="#bewertungen"
            className="flex shrink-0 items-center gap-3 rounded-[1.15rem] border border-[rgba(15,23,42,0.07)] bg-white py-2 pr-3.5 pl-2 shadow-[0_1px_2px_rgba(15,26,43,0.04)] transition hover:border-brand-500/20"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F4F8FF] text-sm font-extrabold tabular-nums text-brand-600">
              {scoreFormatter.format(deal.reviewScore)}
            </span>
            <span className="leading-tight">
              <span className="block text-sm font-semibold text-ink">{label}</span>
              <span className="mt-0.5 block text-xs text-muted">
                {t("deal.reviews", { count: countFormatter.format(deal.reviewCount) })}
                {detail.reviewSource ? ` · ${detail.reviewSource}` : null}
              </span>
            </span>
          </a>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-3 sm:mt-5">
        <h1 className="min-w-0 flex-1 text-[1.75rem] font-extrabold leading-[1.12] tracking-tight text-ink sm:text-4xl lg:text-[2.5rem] lg:leading-[1.08]">
          {deal.name}
        </h1>
        <div className="flex shrink-0 items-center gap-2">
          <ShareButton url={offerUrl} title={deal.name} />
          <FavoriteButton dealId={deal.id} />
        </div>
      </div>
      <p className="mt-2 max-w-3xl text-base leading-relaxed text-body sm:text-lg">
        {tx(deal.summary, locale)}
      </p>
    </header>
  );
}
