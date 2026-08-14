"use client";

import { useState } from "react";
import Image from "next/image";
import { CalendarDays, ChevronDown, ChevronRight, CreditCard, Info, ShieldCheck, Utensils } from "lucide-react";
import { calculateStayPrice } from "@/lib/pricingEngine";
import type { BookingOffer, ChildPricingRule, RoomCategoryDetail } from "@/types";
import type { RoomSelection } from "@/hooks/useBookingState";
import { FavoriteButton } from "@/components/offer/FavoriteButton";
import { ShareButton } from "@/components/offer/ShareButton";
import { ProviderLogo } from "@/components/booking/ProviderLogo";
import { cn } from "@/lib/utils";
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
  const [detailsOpen, setDetailsOpen] = useState(false);

  const defaultMealPlan = offer.mealPlans.find((plan) => plan.includedInBase) ?? offer.mealPlans[0];
  const [activeMealPlanId, setActiveMealPlanId] = useState(defaultMealPlan?.id ?? "");
  const [cancellationSelected, setCancellationSelected] = useState(false);
  const [priceDetailsOpen, setPriceDetailsOpen] = useState(false);
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
  const perPerson = total / baseStay.travelerCount;

  const travelerLabel =
    occupancy.childAges.length > 0
      ? t("booking.whoMixed", {
          adults: occupancy.adults,
          children: occupancy.childAges.length,
          childWord: occupancy.childAges.length === 1 ? t("booking.childOne") : t("booking.children"),
        })
      : t("booking.adultsCount", { count: occupancy.adults });

  const mealFieldset = offer.mealPlans.length > 0 && (
    <fieldset>
      <legend className="flex items-center gap-1.5 text-xs font-semibold text-muted">
        <Utensils className="h-3.5 w-3.5" aria-hidden="true" />
        {t("booking.mealFor", { who: travelerLabel })}
      </legend>
      <div className="mt-1.5 space-y-1.5">
        {offer.mealPlans.map((plan) => (
          <label key={plan.id} className="flex items-center justify-between gap-2 text-sm">
            <span className="flex items-center gap-2">
              <input
                type="radio"
                name={`mealplan-${offer.id}`}
                checked={activeMealPlanId === plan.id}
                onChange={() => setActiveMealPlanId(plan.id)}
                className="h-4 w-4 accent-brand-500"
              />
              <span className="text-body">{mealPlanLabel(plan.label, locale)}</span>
            </span>
            <span className={cn("text-xs font-semibold", plan.includedInBase ? "text-success" : "text-ink")}>
              {plan.includedInBase ? t("booking.incl") : `+${priceFormatter.format(plan.supplementTotal)} €`}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );

  const cancellationField = offer.cancellation && (
    <div>
      <p className="flex items-center gap-1.5 text-xs font-semibold text-muted">
        <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
        {t("booking.stayFlexible")}
      </p>
      {offer.cancellation.includedInBase ? (
        <p className="mt-1.5 flex items-center justify-between text-sm">
          <span className="text-body">{tx(offer.cancellation.label, locale)}</span>
          <span className="text-xs font-semibold text-success">{t("booking.incl")}</span>
        </p>
      ) : (
        <label className="mt-1.5 flex items-center justify-between gap-2 text-sm">
          <span className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={cancellationSelected}
              onChange={(e) => setCancellationSelected(e.target.checked)}
              className="h-4 w-4 accent-brand-500"
            />
            <span className="text-body">{tx(offer.cancellation.label, locale)}</span>
          </span>
          <span className="text-xs font-semibold text-ink">+{priceFormatter.format(offer.cancellation.supplementTotal)} €</span>
        </label>
      )}
    </div>
  );

  const offerDetailsToggle = (
    <>
      <button
        type="button"
        onClick={() => setDetailsOpen((v) => !v)}
        aria-expanded={detailsOpen}
        className="mt-1.5 flex items-center gap-1 text-xs font-semibold text-brand-500 hover:underline"
      >
        {t("booking.offerDetails")}
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", detailsOpen && "rotate-180")} aria-hidden="true" />
      </button>
      {detailsOpen && (
        <p className="mt-1.5 rounded-lg bg-surface px-3 py-2 text-xs text-body">
          {t("booking.arrivalDep", {
            from: arrival.toLocaleDateString(localeTag(locale)),
            to: departure.toLocaleDateString(localeTag(locale)),
          })}
        </p>
      )}
    </>
  );

  return (
    <article className="overflow-hidden rounded-2xl border border-[#eeeef2] bg-white shadow-[0_8px_24px_rgba(15,26,43,0.08)]">
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

      <div className="flex flex-col p-4 sm:p-5 lg:flex-row lg:items-start lg:gap-5">
        <div className="flex min-w-0 gap-3 lg:contents">
          <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-surface sm:h-20 sm:w-24 lg:h-auto lg:min-h-[11rem] lg:w-[200px] lg:rounded-xl">
            <Image
              src={room.images[0]}
              alt={tx(room.name, locale)}
              fill
              sizes="(min-width: 1024px) 200px, 96px"
              className="object-cover"
            />
          </div>

          <div className="min-w-0 flex-1 lg:w-[13.5rem] lg:flex-none">
            <span className="mb-2 hidden items-center gap-1.5 text-xs font-semibold text-success lg:inline-flex">
              <span className="h-2 w-2 rounded-full bg-success" aria-hidden="true" />
              {t("booking.offerAvailable")}
            </span>
            <div className="flex items-start justify-between gap-2">
              <h4 className="text-[15px] font-bold text-ink">{tx(room.name, locale)}</h4>
              <ProviderLogo name={offer.provider} />
            </div>
            <button
              type="button"
              onClick={onShowRoomDetails}
              className="mt-1 text-xs font-semibold text-brand-500 hover:underline"
            >
              {t("booking.roomDetails")}
            </button>
            <p className="mt-2 flex items-center gap-1.5 text-xs text-body">
              <CalendarDays className="h-3.5 w-3.5 shrink-0 text-brand-500" aria-hidden="true" />
              {nightLabel(nights, locale)}
              <span className="text-muted">·</span>
              {arrival.toLocaleDateString(localeTag(locale))} – {departure.toLocaleDateString(localeTag(locale))}
            </p>
            {offerDetailsToggle}
          </div>
        </div>

        <div className="mt-4 min-w-0 flex-1 space-y-4 lg:mt-0">
          {mealFieldset}
          {cancellationField}
        </div>

        <div className="mt-4 flex flex-col gap-3 border-t border-[rgba(15,23,42,0.06)] pt-4 lg:mt-0 lg:w-[13.5rem] lg:shrink-0 lg:border-t-0 lg:border-l lg:pl-5 lg:pt-0">
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
          <div className="flex items-end justify-between gap-3 lg:block">
            <p className="text-xs text-muted">{t("booking.priceFor", { who: travelerLabel })}</p>
            <p className="text-[1.65rem] font-extrabold leading-none tracking-tight text-ink">
              {priceFormatter.format(total)} €
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-1">
            <button
              type="button"
              onClick={() => setPriceDetailsOpen((v) => !v)}
              className="text-xs font-semibold text-brand-500 hover:underline"
            >
              {t("booking.priceDetails")}
            </button>
            <span className="inline-flex items-center gap-1 text-xs text-muted">
              {priceFormatter.format(perPerson)} € {t("deal.perPerson")}
              <Info className="h-3 w-3" aria-hidden="true" />
            </span>
          </div>
          {priceDetailsOpen && (
            <dl className="space-y-1 rounded-lg bg-surface px-3 py-2 text-xs text-body">
              <div className="flex items-center justify-between gap-2">
                <dt>{t("booking.nightsPersons", { count: baseStay.travelerCount })}</dt>
                <dd className="font-semibold text-ink">{priceFormatter.format(baseStay.total)} €</dd>
              </div>
              {mealSupplement > 0 && (
                <div className="flex items-center justify-between gap-2">
                  <dt>{selectedMealPlan ? mealPlanLabel(selectedMealPlan.label, locale) : ""}</dt>
                  <dd className="font-semibold text-ink">+{priceFormatter.format(mealSupplement)} €</dd>
                </div>
              )}
              {cancellationSupplement > 0 && (
                <div className="flex items-center justify-between gap-2">
                  <dt>{offer.cancellation ? tx(offer.cancellation.label, locale) : ""}</dt>
                  <dd className="font-semibold text-ink">+{priceFormatter.format(cancellationSupplement)} €</dd>
                </div>
              )}
            </dl>
          )}
          <button
            type="button"
            onClick={() => onBook(activeMealPlanId, cancellationSelected)}
            className="inline-flex h-14 w-full items-center justify-center gap-1.5 rounded-xl bg-brand-500 px-4 text-sm font-bold text-white shadow-[0_8px_20px_rgba(27,99,235,0.22)] transition hover:bg-brand-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
          >
            {ctaLabel}
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
          <p className="flex items-center justify-center gap-1.5 text-[11px] text-muted">
            <CreditCard className="h-3.5 w-3.5" aria-hidden="true" />
            {t("booking.payments")}
          </p>
        </div>
      </div>
    </article>
  );
}
