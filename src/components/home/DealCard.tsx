"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  MapPin,
  Moon,
  Plane,
  Star,
  Utensils,
} from "lucide-react";
import type { Deal } from "@/types";
import { DealImageSlider } from "@/components/home/DealImageSlider";
import { ReviewBadge } from "@/components/home/ReviewBadge";
import { PriceBlock } from "@/components/home/PriceBlock";
import { useLocale, useT } from "@/i18n/LocaleProvider";
import { mealPlanLabel, nightLabel, regionDisplay, tx } from "@/i18n/content";

const chipClass =
  "inline-flex items-center gap-1.5 rounded-full bg-[#F1F5F9] px-2.5 py-1 text-[12px] font-medium text-ink";

export function DealCard({ deal, priority = false }: { deal: Deal; priority?: boolean }) {
  const router = useRouter();
  const detailHref = `/angebot/${deal.slug}`;
  const { locale } = useLocale();
  const t = useT();

  return (
    <article
      onClick={() => router.push(detailHref)}
      className="group/card flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-[#eeeef2] bg-white shadow-[0_8px_24px_rgba(15,26,43,0.08)] transition-[transform,box-shadow] duration-150 ease-out hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(15,26,43,0.12)]"
    >
      <DealImageSlider
        images={deal.images}
        alt={deal.name}
        discountPercent={deal.discountPercent}
        provider={deal.provider}
        dealId={deal.id}
        priority={priority}
      />

      <div className="flex flex-1 flex-col px-5 py-5 sm:px-6">
        <h3 className="text-[1.35rem] font-extrabold leading-[1.15] tracking-[-0.03em] text-ink">
          <Link
            href={detailHref}
            onClick={(e) => e.stopPropagation()}
            className="hover:text-brand-600 focus-visible:outline-none focus-visible:underline"
          >
            {deal.name}
          </Link>
        </h3>

        <p className="mt-2 inline-flex min-w-0 items-center gap-1.5 text-[13px] text-body">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-muted" aria-hidden="true" />
          <span className="min-w-0 break-words">{regionDisplay(deal.destinationRegion, locale)}</span>
        </p>

        <span
          className="mt-2 inline-flex items-center gap-0.5 text-star"
          aria-label={t("deal.stars", { count: deal.stars })}
        >
          {Array.from({ length: deal.stars }).map((_, i) => (
            <Star key={i} className="h-3.5 w-3.5 fill-star" aria-hidden="true" />
          ))}
        </span>

        {deal.reviewEnabled && (
          <div className="mt-2.5">
            <ReviewBadge
              reviewPercent={deal.reviewPercent}
              reviewScore={deal.reviewScore}
              reviewMaxScore={deal.reviewMaxScore}
              reviewCount={deal.reviewCount}
            />
          </div>
        )}

        <p className="mt-4 text-[13px] leading-relaxed text-body">{tx(deal.summary, locale)}</p>

        <dl className="mt-3.5 flex flex-wrap gap-1.5">
          <div className={chipClass}>
            <Moon className="h-3.5 w-3.5 shrink-0 text-muted" aria-hidden="true" strokeWidth={1.6} />
            <dt className="sr-only">{t("deal.nightsLabel")}</dt>
            <dd>{nightLabel(deal.nights, locale)}</dd>
          </div>
          <div className={chipClass}>
            <Utensils className="h-3.5 w-3.5 shrink-0 text-muted" aria-hidden="true" strokeWidth={1.6} />
            <dt className="sr-only">{t("deal.meal")}</dt>
            <dd>{mealPlanLabel(deal.mealPlan, locale)}</dd>
          </div>
          <div className={chipClass}>
            <Plane className="h-3.5 w-3.5 shrink-0 text-muted" aria-hidden="true" strokeWidth={1.6} />
            <dt className="sr-only">{t("deal.flight")}</dt>
            <dd>{deal.flightIncluded ? t("deal.flightIncluded") : t("deal.noFlight")}</dd>
          </div>
        </dl>

        <p className="mt-3 inline-flex items-center gap-1.5 text-[13px] text-body">
          <Calendar className="h-3.5 w-3.5 shrink-0 text-muted" aria-hidden="true" strokeWidth={1.6} />
          {deal.dateRange}
        </p>

        <div className="mt-auto border-t border-[rgba(15,23,42,0.06)] pt-4">
          <PriceBlock
            oldPrice={deal.oldPrice}
            currentPrice={deal.currentPrice}
            discountPercent={deal.discountPercent}
            action={
              <Link
                href={detailHref}
                onClick={(e) => e.stopPropagation()}
                className="inline-flex h-9 shrink-0 items-center gap-1 rounded-lg bg-brand-500 px-3 text-[13px] font-semibold text-white shadow-sm transition hover:bg-brand-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
              >
                {t("deal.viewOffer")}
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            }
          />
        </div>
      </div>
    </article>
  );
}
