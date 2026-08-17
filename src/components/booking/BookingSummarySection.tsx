"use client";

import { useMemo, useState, type ReactNode } from "react";
import Image from "next/image";
import { BedDouble, CalendarRange, Check, CheckCircle2, Landmark, Lock, MapPin, Moon, ShieldCheck, Star, Users } from "lucide-react";
import { calculateStayPrice } from "@/lib/pricingEngine";
import type { BookingOffer, ChildPricingRule, Deal, RoomCategoryDetail } from "@/types";
import type { RoomSelection } from "@/hooks/useBookingState";
import { useLocale, useT } from "@/i18n/LocaleProvider";
import { localeTag } from "@/i18n/config";
import { countryDisplayName, mealPlanLabel, nightLabel, tx } from "@/i18n/content";
import { cn } from "@/lib/utils";
import { PriceHierarchy } from "@/components/booking/PriceHierarchy";
import { ReviewBadge } from "@/components/home/ReviewBadge";

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

const inputClass =
  "mt-1.5 h-12 w-full rounded-xl border border-line bg-white px-3.5 text-sm text-ink transition focus-visible:border-[#1B63EB] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500";

function SectionTitle({ n, children }: { n: number; children: ReactNode }) {
  return (
    <h2 className="flex items-center gap-3 text-base font-extrabold tracking-tight text-ink">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1B63EB] text-sm font-bold text-white">
        {n}
      </span>
      {children}
    </h2>
  );
}

/**
 * Dedicated checkout page: travellers → contact → payment → confirm.
 * Visual booking recap lives in the hotel card — no duplicate text list.
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
  const requestRef = `UP-${arrival.getFullYear()}${String(arrival.getMonth() + 1).padStart(2, "0")}${String(arrival.getDate()).padStart(2, "0")}-${nights}`;
  const totalAdults = rooms.reduce((sum, room) => sum + room.adults, 0);
  const totalChildren = rooms.reduce((sum, room) => sum + room.childAges.length, 0);
  const region = tx(deal.destinationRegion.split(" · ")[0] ?? deal.destinationRegion, locale);
  const country = countryDisplayName(deal.destinationCountry, locale);
  const steps = [
    { label: t("booking.checkoutStep1"), done: true },
    { label: t("booking.checkoutStep2"), done: true },
    { label: t("booking.checkoutStep3"), done: submitted },
  ];

  const facts = [
    {
      icon: CalendarRange,
      text: `${dateFormatter.format(arrival)} – ${dateFormatter.format(departure)}`,
    },
    { icon: Moon, text: nightLabel(nights, locale) },
    {
      icon: Users,
      text: t("booking.travelersSummary", {
        adults: totalAdults,
        children: totalChildren,
        rooms: rooms.length,
      }),
    },
    ...validRows.map((row) => ({
      icon: BedDouble,
      text: `${tx(row.category.name, locale)}${row.mealPlan ? ` · ${mealPlanLabel(row.mealPlan.label, locale)}` : ""}`,
    })),
  ];

  const hotelHeader = (
    <>
      <p className="text-lg font-extrabold leading-snug tracking-tight text-ink">{deal.name}</p>
      <span className="mt-1 flex items-center gap-0.5 text-[#FDB919]" aria-label={t("deal.stars", { count: deal.stars })}>
        {Array.from({ length: deal.stars }).map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-[#FDB919]" aria-hidden="true" />
        ))}
      </span>
      {deal.reviewEnabled && (
        <div className="mt-2.5">
          <ReviewBadge
            reviewPercent={deal.reviewPercent}
            reviewScore={deal.reviewScore}
            reviewMaxScore={deal.reviewMaxScore}
            reviewCount={deal.reviewCount}
            size="sm"
          />
        </div>
      )}
      <p className="mt-2.5 flex items-center gap-1.5 text-sm text-body">
        <MapPin className="h-4 w-4 shrink-0 text-[#1B63EB]" aria-hidden="true" />
        {region}, {country}
      </p>
    </>
  );

  const factList = (
    <ul className="grid gap-2.5 sm:grid-cols-2">
      {facts.map((fact) => (
        <li key={fact.text} className="flex items-start gap-2.5 text-sm text-ink">
          <fact.icon className="mt-0.5 h-4 w-4 shrink-0 text-[#1B63EB]" aria-hidden="true" />
          <span>{fact.text}</span>
        </li>
      ))}
    </ul>
  );

  const sidebarCard = (
    <aside className="overflow-hidden rounded-2xl border border-[#eeeef2] bg-white shadow-[0_8px_24px_rgba(15,26,43,0.08)]">
      <div className="relative h-40 w-full bg-surface">
        <Image src={deal.images[0]} alt={deal.name} fill sizes="360px" className="object-cover" />
      </div>
      <div className="p-5">
        {hotelHeader}
        <div className="mt-4 border-t border-line pt-4">
          <ul className="space-y-2.5">
            {facts.map((fact) => (
              <li key={fact.text} className="flex items-start gap-2.5 text-sm text-ink">
                <fact.icon className="mt-0.5 h-4 w-4 shrink-0 text-[#1B63EB]" aria-hidden="true" />
                <span>{fact.text}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-4 border-t border-line pt-4">
          <PriceHierarchy perPerson={averagePerPerson} total={totalPrice} size="lg" />
        </div>
      </div>
    </aside>
  );

  const recapCard = (
    <article className="overflow-hidden rounded-2xl border border-[#eeeef2] bg-white shadow-[0_8px_24px_rgba(15,26,43,0.08)]">
      <div className="grid md:grid-cols-[minmax(16rem,22rem)_minmax(0,1fr)]">
        <div className="relative h-48 bg-surface md:h-auto md:min-h-[17rem]">
          <Image src={deal.images[0]} alt={deal.name} fill sizes="(min-width: 768px) 352px, 100vw" className="object-cover" />
        </div>
        <div className="flex flex-col justify-between p-5 sm:p-6">
          <div>
            {hotelHeader}
            <div className="mt-4 border-t border-line pt-4">{factList}</div>
          </div>
          <div className="mt-5 border-t border-line pt-4">
            <PriceHierarchy perPerson={averagePerPerson} total={totalPrice} size="lg" />
          </div>
        </div>
      </div>
    </article>
  );

  if (submitted) {
    return (
      <div className="space-y-5">
        <div className="flex flex-col gap-4 rounded-2xl border border-success/20 bg-white p-5 shadow-[0_8px_24px_rgba(15,26,43,0.08)] sm:flex-row sm:items-center sm:gap-5 sm:p-6">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-success/10">
            <CheckCircle2 className="h-8 w-8 text-success" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h1 className="text-xl font-extrabold tracking-tight text-ink sm:text-2xl">{t("booking.received")}</h1>
            <p className="mt-1 text-sm font-bold text-[#1B63EB]">{t("booking.requestNo", { ref: requestRef })}</p>
            <p className="mt-1 text-sm leading-relaxed text-body">{t("booking.thanks", { name: deal.name })}</p>
          </div>
        </div>

        {recapCard}

        <div className="rounded-2xl border border-[#eeeef2] bg-white p-5 shadow-[0_8px_24px_rgba(15,26,43,0.08)] sm:p-6">
          <h2 className="text-base font-extrabold text-ink">{t("booking.nextSteps")}</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            <li className="flex items-start gap-3 rounded-xl bg-surface px-4 py-3 text-sm text-body">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/10">
                <Check className="h-3.5 w-3.5 text-success" aria-hidden="true" />
              </span>
              {t("booking.nextStepEmail")}
            </li>
            <li className="flex items-start gap-3 rounded-xl bg-surface px-4 py-3 text-sm text-body">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/10">
                <Check className="h-3.5 w-3.5 text-success" aria-hidden="true" />
              </span>
              {t("booking.nextStepInvoice")}
            </li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ol className="mb-6 flex items-center rounded-2xl border border-[#eeeef2] bg-white px-4 py-4 shadow-[0_8px_24px_rgba(15,26,43,0.08)] sm:px-6">
        {steps.map((step, index) => {
          const current = !step.done && (index === 0 || steps[index - 1]?.done);
          return (
            <li
              key={step.label}
              aria-current={current ? "step" : undefined}
              className={cn("flex items-center", index < steps.length - 1 && "min-w-0 flex-1")}
            >
              <span className="flex shrink-0 items-center gap-2 sm:gap-2.5">
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                    step.done && "bg-success text-white",
                    current && "bg-brand-500 text-white",
                    !step.done && !current && "bg-line text-muted"
                  )}
                >
                  {step.done ? <Check className="h-4 w-4" strokeWidth={2.75} aria-hidden="true" /> : index + 1}
                </span>
                <span
                  className={cn(
                    "whitespace-nowrap text-[13px] leading-none sm:text-sm",
                    current ? "font-bold text-ink" : "font-medium text-muted"
                  )}
                >
                  {step.label}
                </span>
              </span>
              {index < steps.length - 1 && (
                <span className="mx-2.5 h-px min-w-3 flex-1 bg-line sm:mx-5" aria-hidden="true" />
              )}
            </li>
          );
        })}
      </ol>

      <h1 className="text-[1.45rem] font-extrabold tracking-tight text-ink sm:text-2xl">{t("booking.checkoutTitle")}</h1>
      <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted">{t("booking.checkoutLead")}</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(18.5rem,21rem)] lg:items-start">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (accepted) setSubmitted(true);
          }}
          className="space-y-4"
        >
          <section className="space-y-3">
            <div className="px-1">
              <SectionTitle n={1}>{t("booking.checkoutTravellers")}</SectionTitle>
            </div>
            {guests.map((guest) => (
              <fieldset key={guest.key} className="rounded-2xl border border-[#eeeef2] bg-white p-5 shadow-[0_8px_24px_rgba(15,26,43,0.08)] sm:p-6">
                <legend className="sr-only">{t(guest.labelKey, { n: guest.n })}</legend>
                <p className="mb-4 text-sm font-extrabold text-ink">{t(guest.labelKey, { n: guest.n })}</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm font-semibold text-ink">
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
                  <label className="block text-sm font-semibold text-ink">
                    {t("booking.firstName")}
                    <input type="text" required autoComplete="given-name" className={inputClass} />
                  </label>
                  <label className="block text-sm font-semibold text-ink">
                    {t("booking.lastName")}
                    <input type="text" required autoComplete="family-name" className={inputClass} />
                  </label>
                  <label className="block text-sm font-semibold text-ink">
                    {t("booking.dateOfBirth")}
                    <input type="date" required className={inputClass} />
                  </label>
                </div>
              </fieldset>
            ))}
          </section>

          <section className="rounded-2xl border border-[#eeeef2] bg-white p-5 shadow-[0_8px_24px_rgba(15,26,43,0.08)] sm:p-6">
            <SectionTitle n={2}>{t("booking.contact")}</SectionTitle>
            <div className="mt-5 grid gap-4">
              <label className="block text-sm font-semibold text-ink">
                {t("booking.email")}
                <input type="email" required autoComplete="email" className={inputClass} />
              </label>
              <label className="block text-sm font-semibold text-ink">
                {t("booking.phone")}
                <input type="tel" required autoComplete="tel" className={inputClass} />
              </label>
            </div>
          </section>

          <section className="rounded-2xl border border-[#eeeef2] bg-white p-5 shadow-[0_8px_24px_rgba(15,26,43,0.08)] sm:p-6">
            <SectionTitle n={3}>{t("booking.checkoutPayment")}</SectionTitle>
            <label className="mt-5 flex cursor-default items-start gap-3 rounded-2xl border-2 border-[#1B63EB] bg-[#F4F8FF] p-4 sm:p-5">
              <input
                type="radio"
                name="payment-method"
                value="invoice"
                checked
                onChange={() => undefined}
                className="mt-1 h-4 w-4 shrink-0 accent-[#1B63EB]"
              />
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2 text-sm font-extrabold text-ink">
                  <Landmark className="h-4 w-4 shrink-0 text-[#1B63EB]" aria-hidden="true" />
                  {t("booking.invoicePay")}
                </span>
                <span className="mt-1.5 block text-sm leading-relaxed text-muted">{t("booking.bankNote")}</span>
              </span>
            </label>
          </section>

          <section className="rounded-2xl border border-[#eeeef2] bg-white p-5 shadow-[0_8px_24px_rgba(15,26,43,0.08)] sm:p-6">
            <SectionTitle n={4}>{t("booking.checkoutConfirm")}</SectionTitle>
            <label className="mt-5 flex items-start gap-3 text-sm leading-relaxed text-body">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                required
                className="mt-0.5 h-4 w-4 shrink-0 accent-brand-500"
              />
              {t("booking.acceptTerms")}
            </label>
            <button
              type="submit"
              className="mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#1B63EB] text-sm font-bold text-white shadow-[0_8px_20px_rgba(27,99,235,0.22)] transition hover:bg-[#0F52D6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
            >
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              {t("booking.bookNow")}
            </button>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted">
              <Lock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              {t("booking.checkoutSecure")}
            </p>
          </section>
        </form>

        <div className="lg:sticky lg:top-24">{sidebarCard}</div>
      </div>
    </div>
  );
}
