"use client";

import { useState } from "react";
import Image from "next/image";
import { CalendarDays, ChevronRight, CreditCard, ShieldCheck, Utensils } from "lucide-react";
import { calculateStayPrice } from "@/lib/pricingEngine";
import type { BookingOffer, ChildPricingRule, RoomCategoryDetail } from "@/types";
import type { RoomSelection } from "@/hooks/useBookingState";
import { FavoriteButton } from "@/components/offer/FavoriteButton";
import { ShareButton } from "@/components/offer/ShareButton";
import { ProviderLogo } from "@/components/booking/ProviderLogo";
import { PriceBreakdown } from "@/components/booking/PriceBreakdown";
import { FreeCancellationBadge } from "@/components/booking/FreeCancellationBadge";
import { cn } from "@/lib/utils";
import { hasFreeCancellation } from "@/lib/freeCancellation";
import { useLocale, useT } from "@/i18n/LocaleProvider";
import { localeTag } from "@/i18n/config";
import { mealPlanLabel, nightLabel, tx } from "@/i18n/content";

interface OfferBookingCardProps {
  offer: BookingOffer;
  room: RoomCategoryDetail;
  occupancy: RoomSelection;
  arrival: Date;
  nights: number;
  childPricingRules: ChildPricingRule[];
  ctaLabel: string;
  dealId: string;
  shareUrl: string;
  onShowRoomDetails: () => void;
  /** Called with the offer card's current (locally staged) meal-plan/cancellation choice once the customer commits by clicking the CTA. */
  onBook: (mealPlanId: string, cancellationSelected: boolean) => void;
}

export function OfferBookingCard({
  offer,
  room,
  occupancy,
  arrival,
  nights,
  childPricingRules,
  ctaLabel,
  dealId,
  shareUrl,
  onShowRoomDetails,
  onBook,
}: OfferBookingCardProps) {
  const t = useT();
  const { locale } = useLocale();
  const priceFormatter = new Intl.NumberFormat(localeTag(locale), {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const defaultMealPlan = offer.mealPlans.find((plan) => plan.includedInBase) ?? offer.mealPlans[0];
  const [activeMealPlanId, setActiveMealPlanId] = useState(defaultMealPlan?.id ?? "");
  const [cancellationSelected, setCancellationSelected] = useState(false);
  const selectedMealPlan = offer.mealPlans.find((plan) => plan.id === activeMealPlanId) ?? defaultMealPlan;

  const departure = new Date(arrival);
  departure.setDate(departure.getDate() + nights);

  const baseStay = calculateStayPrice({
    room,
    arrival,
    nights,
    adults: occupancy.adults,
    childAges: occupancy.childAges,
    childPricingRules,
  });

  const mealSupplement = selectedMealPlan?.supplementTotal ?? 0;
  const cancellationSupplement = cancellationSelected ? offer.cancellation?.supplementTotal ?? 0 : 0;
  const total = baseStay.total + mealSupplement + cancellationSupplement;

  const travelerLabel =
    occupancy.childAges.length > 0
      ? t("booking.whoMixed", {
          adults: occupancy.adults,
          children: occupancy.childAges.length,
          childWord: occupancy.childAges.length === 1 ? t("booking.childOne") : t("booking.children"),
        })
      : t("booking.adultsCount", { count: occupancy.adults });

  const mealFieldset = offer.mealPlans.length > 0 && (
    <fieldset className="min-w-0">
      <legend className="flex items-center gap-1.5 text-xs font-semibold text-muted">
        <Utensils className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <span>{t("booking.mealFor", { who: travelerLabel })}</span>
      </legend>
      <div className="mt-2 space-y-2">
        {offer.mealPlans.map((plan) => (
          <label key={plan.id} className="flex items-start gap-2 text-sm">
            <input
              type="radio"
              name={`mealplan-${offer.id}`}
              checked={activeMealPlanId === plan.id}
              onChange={() => setActiveMealPlanId(plan.id)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-brand-500"
            />
            <span className="min-w-0 flex-1 leading-snug text-body">{mealPlanLabel(plan.label, locale)}</span>
            <span
              className={cn(
                "shrink-0 pt-0.5 text-xs font-semibold tabular-nums",
                plan.includedInBase ? "text-success" : "text-ink"
              )}
            >
              {plan.includedInBase ? t("booking.incl") : `+${priceFormatter.format(plan.supplementTotal)} €`}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );

  const cancellationField = offer.cancellation && (
    <div className="min-w-0">
      <p className="flex items-center gap-1.5 text-xs font-semibold text-muted">
        <ShieldCheck className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        {t("booking.stayFlexible")}
      </p>
      {offer.cancellation.includedInBase ? (
        <p className="mt-2 flex items-start gap-2 text-sm">
          <span className="min-w-0 flex-1 leading-snug text-body">{tx(offer.cancellation.label, locale)}</span>
          <span className="shrink-0 text-xs font-semibold text-success">{t("booking.incl")}</span>
        </p>
      ) : (
        <label className="mt-2 flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            checked={cancellationSelected}
            onChange={(e) => setCancellationSelected(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-brand-500"
          />
          <span className="min-w-0 flex-1 leading-snug text-body">{tx(offer.cancellation.label, locale)}</span>
          <span className="shrink-0 pt-0.5 text-xs font-semibold tabular-nums text-ink">
            +{priceFormatter.format(offer.cancellation.supplementTotal)} €
          </span>
        </label>
      )}
    </div>
  );

  return (
    <article className="overflow-hidden rounded-2xl border border-cal bg-white shadow-[0_8px_24px_rgba(15,26,43,0.08)]">
      <div className="flex items-center justify-between gap-3 bg-[#EAF8F0] px-4 py-2.5 lg:hidden">
        <span className="flex items-center gap-1.5 text-xs font-semibold text-success">
          <span className="h-2 w-2 rounded-full bg-success" aria-hidden="true" />
          {t("booking.offerAvailable")}
        </span>
        <div className="flex items-center gap-1">
          <FavoriteButton
            dealId={dealId}
            alwaysShowLabel
            className="h-8 gap-1 rounded-full px-2.5 py-0 text-xs shadow-none [&_svg]:h-3.5 [&_svg]:w-3.5"
          />
          <ShareButton
            url={shareUrl}
            title={room.name}
            alwaysShowLabel
            className="h-8 gap-1 rounded-full px-2.5 py-0 text-xs shadow-none [&_svg]:h-3.5 [&_svg]:w-3.5"
          />
        </div>
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-5 p-4 sm:p-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)_19rem] lg:items-start lg:gap-6">
        <div className="flex min-w-0 gap-3">
          <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-surface sm:h-20 sm:w-24 lg:h-[7.5rem] lg:w-[7.5rem] lg:rounded-xl">
            <Image
              src={room.images[0]}
              alt={tx(room.name, locale)}
              fill
              sizes="(min-width: 1024px) 120px, 96px"
              className="object-cover"
            />
          </div>

          <div className="min-w-0 flex-1">
            <span className="mb-1.5 hidden items-center gap-1.5 text-xs font-semibold text-success lg:inline-flex">
              <span className="h-2 w-2 shrink-0 rounded-full bg-success" aria-hidden="true" />
              {t("booking.offerAvailable")}
            </span>
            <div className="flex flex-wrap items-start gap-2">
              <h4 className="text-[15px] font-bold leading-snug text-ink">{tx(room.name, locale)}</h4>
              <ProviderLogo name={offer.provider} />
            </div>
            <button
              type="button"
              onClick={onShowRoomDetails}
              className="mt-1 text-xs font-semibold text-brand-500 hover:underline"
            >
              {t("booking.roomDetails")}
            </button>
            <p className="mt-2 flex items-start gap-1.5 text-xs leading-snug text-body">
              <CalendarDays className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-500" aria-hidden="true" />
              <span>
                {nightLabel(nights, locale)}
                <span className="text-muted"> · </span>
                {arrival.toLocaleDateString(localeTag(locale))} – {departure.toLocaleDateString(localeTag(locale))}
              </span>
            </p>
          </div>
        </div>

        <div className="min-w-0 space-y-4 lg:border-l lg:border-[rgba(15,23,42,0.06)] lg:pl-6">
          {mealFieldset}
          {cancellationField}
        </div>

        <div className="flex min-w-0 flex-col gap-3 border-t border-[rgba(15,23,42,0.06)] pt-4 lg:border-t-0 lg:border-l lg:pl-6 lg:pt-0">
          <div className="hidden items-center justify-end gap-1 lg:flex">
            <FavoriteButton
              dealId={dealId}
              alwaysShowLabel
              className="h-8 gap-1 rounded-full px-2.5 py-0 text-xs shadow-none [&_svg]:h-3.5 [&_svg]:w-3.5"
            />
            <ShareButton
              url={shareUrl}
              title={room.name}
              alwaysShowLabel
              className="h-8 gap-1 rounded-full px-2.5 py-0 text-xs shadow-none [&_svg]:h-3.5 [&_svg]:w-3.5"
            />
          </div>
          <PriceBreakdown
            lines={baseStay.lines}
            extras={[
              ...(mealSupplement > 0 && selectedMealPlan
                ? [{ label: mealPlanLabel(selectedMealPlan.label, locale), amount: mealSupplement }]
                : []),
              ...(cancellationSupplement > 0 && offer.cancellation
                ? [{ label: tx(offer.cancellation.label, locale), amount: cancellationSupplement }]
                : []),
            ]}
            total={total}
            size="md"
          />
          {hasFreeCancellation() && arrival && (
            <FreeCancellationBadge arrival={arrival} size="sm" />
          )}
          <button
            type="button"
            onClick={() => onBook(activeMealPlanId, cancellationSelected)}
            className="inline-flex min-h-12 w-full items-center justify-center gap-1.5 rounded-xl bg-brand-500 px-3 py-2.5 text-center text-sm font-bold leading-snug text-white shadow-[0_8px_20px_rgba(27,99,235,0.22)] transition hover:bg-brand-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
          >
            <span className="text-balance">{ctaLabel}</span>
            <ChevronRight className="h-4 w-4 shrink-0" aria-hidden="true" />
          </button>
          <p className="flex items-center justify-center gap-1.5 text-[11px] leading-snug text-muted">
            <CreditCard className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>{t("booking.payments")}</span>
          </p>
        </div>
      </div>
    </article>
  );
}
