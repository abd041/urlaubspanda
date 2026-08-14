"use client";

import { useMemo, useState } from "react";
import { Check, CheckCircle2, Landmark, ShieldCheck } from "lucide-react";
import { calculateStayPrice } from "@/lib/pricingEngine";
import type { BookingOffer, ChildPricingRule, Deal, RoomCategoryDetail } from "@/types";
import type { RoomSelection } from "@/hooks/useBookingState";
import { useLocale, useT } from "@/i18n/LocaleProvider";
import { localeTag } from "@/i18n/config";
import { mealPlanLabel, nightLabel, tx } from "@/i18n/content";
import { cn } from "@/lib/utils";

interface BookingSummarySectionProps {
  deal: Deal;
  rooms: RoomSelection[];
  roomCategories: RoomCategoryDetail[];
  offers: BookingOffer[];
  arrival: Date;
  nights: number;
  childPricingRules: ChildPricingRule[];
}

function guestsFromRooms(rooms: RoomSelection[]) {
  const guests: { key: string; labelKey: "booking.adultN" | "booking.childN"; n: number }[] = [];
  let adultN = 0;
  let childN = 0;
  rooms.forEach((room, roomIndex) => {
    for (let i = 0; i < room.adults; i += 1) {
      adultN += 1;
      guests.push({ key: `r${roomIndex}-a${i}`, labelKey: "booking.adultN", n: adultN });
    }
    room.childAges.forEach((_, i) => {
      childN += 1;
      guests.push({ key: `r${roomIndex}-c${i}`, labelKey: "booking.childN", n: childN });
    });
  });
  return guests;
}

/**
 * Final booking-data step. Visual checkout only — no payment gateway.
 * Invoicing for v1 is by e-mail / bank transfer.
 */
export function BookingSummarySection({
  deal,
  rooms,
  roomCategories,
  offers,
  arrival,
  nights,
  childPricingRules,
}: BookingSummarySectionProps) {
  const t = useT();
  const { locale } = useLocale();
  const priceFormatter = new Intl.NumberFormat(localeTag(locale), {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const dateFormatter = new Intl.DateTimeFormat(localeTag(locale), {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const [submitted, setSubmitted] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const guests = useMemo(() => guestsFromRooms(rooms), [rooms]);
  const departure = useMemo(() => {
    const next = new Date(arrival);
    next.setDate(next.getDate() + nights);
    return next;
  }, [arrival, nights]);

  const breakdown = useMemo(
    () =>
      rooms.map((room, i) => {
        const category = roomCategories.find((r) => r.id === room.roomCategoryId);
        const offer = offers.find((o) => o.id === room.offerId);
        if (!category || !offer) return null;
        const mealPlan = offer.mealPlans.find((plan) => plan.id === room.mealPlanId);
        const baseStay = calculateStayPrice({
          room: category,
          arrival,
          nights,
          adults: room.adults,
          childAges: room.childAges,
          childPricingRules,
        });
        const total =
          baseStay.total +
          (mealPlan?.supplementTotal ?? 0) +
          (room.cancellationSelected ? offer.cancellation?.supplementTotal ?? 0 : 0);
        return { roomIndex: i, category, offer, mealPlan, total, travelerCount: baseStay.travelerCount };
      }),
    [rooms, roomCategories, offers, arrival, nights, childPricingRules]
  );

  const validRows = breakdown.filter((row): row is NonNullable<typeof row> => row !== null);
  const totalPrice = validRows.reduce((sum, row) => sum + row.total, 0);
  const totalTravelers = validRows.reduce((sum, row) => sum + row.travelerCount, 0);
  const averagePerPerson = totalPrice / Math.max(totalTravelers, 1);
  const inputClass =
    "mt-1 w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500";
  const requestRef = `UP-${arrival.getFullYear()}${String(arrival.getMonth() + 1).padStart(2, "0")}${String(arrival.getDate()).padStart(2, "0")}-${nights}`;

  const steps = [
    { n: 1, label: t("booking.checkoutStep1"), done: true },
    { n: 2, label: t("booking.checkoutStep2"), done: true },
    { n: 3, label: t("booking.checkoutStep3"), done: submitted },
  ];

  const priceCard = (
    <div className="overflow-hidden rounded-2xl border border-[#eeeef2] bg-white shadow-[0_8px_24px_rgba(15,26,43,0.08)]">
      <div className="border-b border-line px-4 py-3">
        <p className="text-sm font-bold text-ink">{deal.name}</p>
        <p className="mt-1 text-xs text-muted">
          {dateFormatter.format(arrival)} – {dateFormatter.format(departure)} · {nightLabel(nights, locale)}
        </p>
      </div>
      <div className="space-y-2 px-4 py-3">
        {validRows.map((row) => (
          <div key={row.roomIndex} className="flex items-start justify-between gap-3 text-sm">
            <div className="min-w-0">
              <p className="font-semibold text-ink">
                {t("booking.roomNamed", { n: row.roomIndex + 1, name: tx(row.category.name, locale) })}
              </p>
              <p className="text-xs text-muted">{row.mealPlan ? mealPlanLabel(row.mealPlan.label, locale) : ""}</p>
            </div>
            <p className="shrink-0 font-bold text-ink">{priceFormatter.format(row.total)} €</p>
          </div>
        ))}
      </div>
      <div className="bg-ink px-4 py-4 text-white">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold">{t("booking.totalBooking")}</p>
            <p className="text-xs text-white/70">{t("booking.avgPp", { price: priceFormatter.format(averagePerPerson) })}</p>
          </div>
          <p className="text-xl font-extrabold">{priceFormatter.format(totalPrice)} €</p>
        </div>
      </div>
    </div>
  );

  if (submitted) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-success/30 bg-white p-6 text-center shadow-[0_8px_24px_rgba(15,26,43,0.08)] sm:p-8">
          <CheckCircle2 className="mx-auto h-12 w-12 text-success" aria-hidden="true" />
          <h3 className="mt-3 text-xl font-bold text-ink">{t("booking.received")}</h3>
          <p className="mt-1 text-sm font-semibold text-brand-600">{t("booking.requestNo", { ref: requestRef })}</p>
          <p className="mx-auto mt-3 max-w-md text-sm text-body">{t("booking.thanks", { name: deal.name })}</p>
        </div>
        {priceCard}
        <div className="rounded-2xl border border-[#eeeef2] bg-white p-5">
          <h4 className="text-sm font-bold text-ink">{t("booking.nextSteps")}</h4>
          <ul className="mt-3 space-y-2 text-sm text-body">
            <li className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
              {t("booking.nextStepEmail")}
            </li>
            <li className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
              {t("booking.nextStepInvoice")}
            </li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ol className="mb-6 flex gap-2 overflow-x-auto pb-1">
        {steps.map((step, index) => (
          <li key={step.n} className="flex min-w-0 flex-1 items-center gap-2">
            <span
              className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                index < 2 ? "bg-success text-white" : "bg-brand-500 text-white"
              )}
            >
              {index < 2 ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : step.n}
            </span>
            <span className={cn("truncate text-xs font-semibold", index === 2 ? "text-ink" : "text-muted")}>
              {step.label}
            </span>
          </li>
        ))}
      </ol>

      <h3 className="text-lg font-bold text-ink">{t("booking.step5")}</h3>
      <p className="mt-1 text-sm text-muted">{t("booking.checkoutLead")}</p>

      <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,18rem)] lg:items-start">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (accepted) setSubmitted(true);
          }}
          className="space-y-5"
        >
          {guests.map((guest) => (
            <fieldset key={guest.key} className="rounded-2xl border border-[#eeeef2] bg-white p-4 sm:p-5">
              <legend className="px-1 text-sm font-bold text-ink">{t(guest.labelKey, { n: guest.n })}</legend>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block text-xs font-semibold text-muted">
                  {t("booking.salutation")}
                  <select required className={inputClass} defaultValue="">
                    <option value="" disabled>
                      {t("booking.salutation")}
                    </option>
                    <option value="mr">{t("booking.salutationMr")}</option>
                    <option value="ms">{t("booking.salutationMs")}</option>
                    <option value="diverse">{t("booking.salutationDiverse")}</option>
                  </select>
                </label>
                <label className="block text-xs font-semibold text-muted">
                  {t("booking.dateOfBirth")}
                  <input type="date" required className={inputClass} />
                </label>
                <label className="block text-xs font-semibold text-muted">
                  {t("booking.firstName")}
                  <input type="text" required autoComplete="given-name" className={inputClass} />
                </label>
                <label className="block text-xs font-semibold text-muted">
                  {t("booking.lastName")}
                  <input type="text" required autoComplete="family-name" className={inputClass} />
                </label>
              </div>
            </fieldset>
          ))}

          <fieldset className="rounded-2xl border border-[#eeeef2] bg-white p-4 sm:p-5">
            <legend className="px-1 text-sm font-bold text-ink">{t("booking.contact")}</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block text-xs font-semibold text-muted sm:col-span-2">
                {t("booking.email")}
                <input type="email" required autoComplete="email" className={inputClass} />
              </label>
              <label className="block text-xs font-semibold text-muted sm:col-span-2">
                {t("booking.phone")}
                <input type="tel" required autoComplete="tel" className={inputClass} />
              </label>
              <label className="block text-xs font-semibold text-muted sm:col-span-2">
                {t("booking.specialRequests")}
                <textarea rows={3} className={`${inputClass} resize-y`} />
              </label>
            </div>
          </fieldset>

          <p className="flex items-center gap-2 rounded-xl bg-white px-3 py-2.5 text-xs text-body">
            <Landmark className="h-4 w-4 shrink-0 text-brand-500" aria-hidden="true" />
            {t("booking.bankNote")}
          </p>

          <label className="flex items-start gap-2 text-xs text-body">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              required
              className="mt-0.5 h-4 w-4 accent-brand-500"
            />
            {t("booking.acceptTerms")}
          </label>

          <button
            type="submit"
            className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-brand-500 text-sm font-bold text-white shadow-[0_8px_20px_rgba(27,99,235,0.22)] transition hover:bg-brand-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
          >
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            {t("booking.bookNow")}
          </button>
        </form>

        <div className="lg:sticky lg:top-24">{priceCard}</div>
      </div>
    </div>
  );
}
