"use client";

import { useMemo, useState, type ReactNode } from "react";
import Image from "next/image";
import {
  BedDouble,
  CalendarRange,
  Car,
  Check,
  CheckCircle2,
  CreditCard,
  Landmark,
  Lock,
  MapPin,
  Moon,
  Phone,
  ShieldCheck,
  Star,
  Users,
  Wallet,
} from "lucide-react";
import { calculateStayPrice } from "@/lib/pricingEngine";
import type { BookingOffer, ChildPricingRule, Deal, RoomCategoryDetail } from "@/types";
import type { RoomSelection } from "@/hooks/useBookingState";
import { useLocale, useT } from "@/i18n/LocaleProvider";
import { localeTag } from "@/i18n/config";
import { countryDisplayName, mealPlanLabel, nightLabel, tx } from "@/i18n/content";
import { cn, formatEuro } from "@/lib/utils";
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

type PaymentMethod = "invoice" | "card" | "paypal";
type ProtectionTier = "none" | "basic" | "gold";

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
  "mt-1.5 h-11 w-full rounded-lg border border-[#d8dce3] bg-white px-3 text-sm text-ink transition placeholder:text-muted/70 focus-visible:border-[#1B63EB] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500";

const cardClass = "rounded-2xl border border-[#e8eaef] bg-white p-5 shadow-[0_4px_16px_rgba(15,26,43,0.06)] sm:p-6";

function FieldLabel({ children }: { children: ReactNode }) {
  return <span className="block text-[13px] font-semibold text-ink">{children}</span>;
}

/**
 * HolidayCheck-style checkout (frontend demo — mock submit, no real payments).
 * Urlaubspanda branding: blue primary CTA, brand colors, existing type scale.
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
  const priceFormatter = new Intl.NumberFormat(localeTag(locale), {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const [submitted, setSubmitted] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [newsletter, setNewsletter] = useState(false);
  const [payment, setPayment] = useState<PaymentMethod>("invoice");
  const [protection, setProtection] = useState<ProtectionTier>("gold");
  const [parking, setParking] = useState(false);
  const [flexOption, setFlexOption] = useState(false);
  const [voucher, setVoucher] = useState("");
  const [voucherNote, setVoucherNote] = useState(false);
  const [bookForOthers, setBookForOthers] = useState(false);

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
        const mealSupplement = mealPlan?.supplementTotal ?? 0;
        const cancellationSupplement = room.cancellationSelected ? offer.cancellation?.supplementTotal ?? 0 : 0;
        const total = baseStay.total + mealSupplement + cancellationSupplement;
        return {
          roomIndex: i,
          category,
          offer,
          mealPlan,
          total,
          travelerCount: baseStay.travelerCount,
          perPerson: total / Math.max(baseStay.travelerCount, 1),
          lines: baseStay.lines,
          mealSupplement,
          cancellationSupplement,
        };
      }),
    [rooms, roomCategories, offers, arrival, nights, childPricingRules]
  );

  const validRows = breakdown.filter((row): row is NonNullable<typeof row> => row !== null);
  const hotelPrice = validRows.reduce((sum, row) => sum + row.total, 0);
  const protectionFee = protection === "gold" ? 49 : protection === "basic" ? 29 : 0;
  const parkingFee = parking ? 39 : 0;
  const flexFee = flexOption ? 25 : 0;
  const totalPrice = hotelPrice + protectionFee + parkingFee + flexFee;
  const totalTravelers = validRows.reduce((sum, row) => sum + row.travelerCount, 0);
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

  const tripFacts = [
    {
      icon: CalendarRange,
      label: t("booking.period"),
      text: `${dateFormatter.format(arrival)} – ${dateFormatter.format(departure)}`,
    },
    { icon: Moon, label: t("booking.duration"), text: nightLabel(nights, locale) },
    {
      icon: Users,
      label: t("booking.travelers"),
      text: t("booking.travelersSummary", {
        adults: totalAdults,
        children: totalChildren,
        rooms: rooms.length,
      }),
    },
    ...validRows.map((row) => ({
      icon: BedDouble,
      label: t("booking.roomLine", { n: row.roomIndex + 1 }),
      text: `${tx(row.category.name, locale)}${row.mealPlan ? ` · ${mealPlanLabel(row.mealPlan.label, locale)}` : ""}`,
    })),
  ];

  const paymentOptions: {
    id: PaymentMethod;
    label: string;
    hint: string;
    icon: typeof Landmark;
  }[] = [
    { id: "invoice", label: t("booking.paymentInvoice"), hint: t("booking.bankNote"), icon: Landmark },
    { id: "card", label: t("booking.paymentCard"), hint: t("booking.paymentCardHint"), icon: CreditCard },
    { id: "paypal", label: t("booking.paymentPaypal"), hint: t("booking.paymentPaypalHint"), icon: Wallet },
  ];

  const protectionOptions: {
    id: ProtectionTier;
    title: string;
    price: string;
    features: string[];
    recommended?: boolean;
  }[] = [
    {
      id: "gold",
      title: t("booking.protectionGold"),
      price: t("booking.protectionGoldPrice"),
      recommended: true,
      features: [
        t("booking.protectionFeat1"),
        t("booking.protectionFeat2"),
        t("booking.protectionFeat3"),
        t("booking.protectionFeat4"),
      ],
    },
    {
      id: "basic",
      title: t("booking.protectionBasic"),
      price: t("booking.protectionBasicPrice"),
      features: [t("booking.protectionFeat1"), t("booking.protectionFeat2")],
    },
    {
      id: "none",
      title: t("booking.protectionNone"),
      price: "0,00 €",
      features: [],
    },
  ];

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
        <div className={cardClass}>
          <p className="text-sm font-semibold text-muted">{t("booking.totalPriceLabel")}</p>
          <p className="mt-1 text-2xl font-extrabold tabular-nums text-ink">{formatEuro(totalPrice, locale)}</p>
          <p className="mt-2 text-sm text-body">
            {dateFormatter.format(arrival)} – {dateFormatter.format(departure)} · {nightLabel(nights, locale)} ·{" "}
            {t("booking.travelersSummary", { adults: totalAdults, children: totalChildren, rooms: rooms.length })}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-28 lg:pb-4">
      {/* Progress */}
      <ol className="mb-5 flex items-center overflow-x-auto rounded-2xl border border-[#e8eaef] bg-white px-4 py-3.5 shadow-[0_4px_16px_rgba(15,26,43,0.06)] sm:px-5">
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
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold sm:h-8 sm:w-8 sm:text-sm",
                    step.done && "bg-success text-white",
                    current && "bg-brand-500 text-white",
                    !step.done && !current && "bg-line text-muted"
                  )}
                >
                  {step.done ? <Check className="h-3.5 w-3.5" strokeWidth={2.75} aria-hidden="true" /> : index + 1}
                </span>
                <span
                  className={cn(
                    "whitespace-nowrap text-[12px] leading-none sm:text-sm",
                    current ? "font-bold text-ink" : "font-medium text-muted"
                  )}
                >
                  {step.label}
                </span>
              </span>
              {index < steps.length - 1 && (
                <span className="mx-2 h-px min-w-3 flex-1 bg-line sm:mx-4" aria-hidden="true" />
              )}
            </li>
          );
        })}
      </ol>

      {/* Availability banner */}
      <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-[#b7e4c7] bg-[#e8f8ee] px-4 py-3 text-sm font-semibold text-[#1b4332]">
        <CheckCircle2 className="h-5 w-5 shrink-0 text-[#2d6a4f]" aria-hidden="true" />
        {t("booking.offerStillAvailable")}
      </div>

      {/* Trip summary header (HolidayCheck top block) */}
      <section className={cn(cardClass, "mb-5")}>
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(14rem,17rem)] lg:items-start">
          <div className="flex gap-4">
            <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-surface sm:h-24 sm:w-28">
              <Image src={deal.images[0]} alt={deal.name} fill sizes="112px" className="object-cover" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg font-extrabold leading-snug tracking-tight text-ink sm:text-xl">{deal.name}</h1>
              <span
                className="mt-1 flex items-center gap-0.5 text-[#FDB919]"
                aria-label={t("deal.stars", { count: deal.stars })}
              >
                {Array.from({ length: deal.stars }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-[#FDB919]" aria-hidden="true" />
                ))}
              </span>
              {deal.reviewEnabled && (
                <div className="mt-2">
                  <ReviewBadge
                    reviewPercent={deal.reviewPercent}
                    reviewScore={deal.reviewScore}
                    reviewMaxScore={deal.reviewMaxScore}
                    reviewCount={deal.reviewCount}
                    size="sm"
                    countClassName="text-ink"
                  />
                </div>
              )}
              <p className="mt-2 flex items-center gap-1.5 text-sm text-body">
                <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                {region}, {country}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-[#e8eaef] bg-[#f7f8fb] p-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted">{t("booking.totalPriceLabel")}</p>
            <p className="mt-1 text-2xl font-extrabold tabular-nums text-ink">{formatEuro(totalPrice, locale)}</p>
            <p className="mt-1 text-xs text-muted">
              {t("booking.avgPp", { price: priceFormatter.format(totalPrice / Math.max(totalTravelers, 1)) })}
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5" aria-hidden="true">
              {["Visa", "MC", "PayPal", "SEPA"].map((logo) => (
                <span
                  key={logo}
                  className="rounded border border-[#d8dce3] bg-white px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-muted"
                >
                  {logo}
                </span>
              ))}
            </div>
          </div>
        </div>

        <ul className="mt-5 grid gap-3 border-t border-line pt-5 sm:grid-cols-2 lg:grid-cols-4">
          {tripFacts.slice(0, 4).map((fact) => (
            <li key={fact.label + fact.text} className="flex items-start gap-2.5 text-sm">
              <fact.icon className="mt-0.5 h-4 w-4 shrink-0 text-ink" aria-hidden="true" />
              <span>
                <span className="block text-[11px] font-semibold uppercase tracking-wide text-muted">{fact.label}</span>
                <span className="font-medium text-ink">{fact.text}</span>
              </span>
            </li>
          ))}
        </ul>
        {tripFacts.length > 4 && (
          <ul className="mt-3 space-y-2 border-t border-line pt-3">
            {tripFacts.slice(4).map((fact) => (
              <li key={fact.label + fact.text} className="flex items-start gap-2.5 text-sm text-ink">
                <fact.icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <span>
                  <span className="font-semibold">{fact.label}: </span>
                  {fact.text}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Personal consultation strip */}
      <section className="mb-5 flex flex-col gap-3 rounded-2xl border border-[#d6e4ff] bg-[#f0f6ff] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#1B63EB]/15 text-[#1B63EB]">
            <Phone className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-extrabold text-ink">{t("booking.callUs")}</p>
            <p className="mt-0.5 text-sm text-body">{t("booking.callUsHint")}</p>
          </div>
        </div>
        <a
          href="tel:+498000000000"
          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-[#1B63EB] bg-white px-4 text-sm font-bold text-[#1B63EB] transition hover:bg-[#1B63EB] hover:text-white"
        >
          <Phone className="h-4 w-4" aria-hidden="true" />
          {t("booking.callUsCta")}
        </a>
      </section>

      <form
        id="checkout-form"
        onSubmit={(e) => {
          e.preventDefault();
          if (accepted) setSubmitted(true);
        }}
        className="space-y-5"
      >
        {/* Who books */}
        <section className={cardClass}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <h2 className="text-lg font-extrabold tracking-tight text-ink">{t("booking.whoBooks")}</h2>
            <label className="flex items-center gap-2 text-sm text-body">
              <input
                type="checkbox"
                checked={bookForOthers}
                onChange={(e) => setBookForOthers(e.target.checked)}
                className="h-4 w-4 accent-brand-500"
              />
              {t("booking.bookForOthers")}
            </label>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <FieldLabel>{t("booking.salutation")}</FieldLabel>
              <select required className={inputClass} defaultValue="">
                <option value="" disabled>
                  {t("booking.salutation")}
                </option>
                <option value="mr">{t("booking.salutationMr")}</option>
                <option value="ms">{t("booking.salutationMs")}</option>
                <option value="diverse">{t("booking.salutationDiverse")}</option>
              </select>
            </label>
            <div className="hidden sm:block" aria-hidden="true" />
            <label className="block">
              <FieldLabel>{t("booking.firstName")}</FieldLabel>
              <input type="text" required autoComplete="given-name" className={inputClass} />
            </label>
            <label className="block">
              <FieldLabel>{t("booking.lastName")}</FieldLabel>
              <input type="text" required autoComplete="family-name" className={inputClass} />
            </label>
            <label className="block sm:col-span-2">
              <FieldLabel>{t("booking.email")}</FieldLabel>
              <input type="email" required autoComplete="email" className={inputClass} />
            </label>
            <label className="block sm:col-span-2">
              <FieldLabel>{t("booking.phone")}</FieldLabel>
              <input type="tel" required autoComplete="tel" className={inputClass} />
            </label>
            <label className="block sm:col-span-1">
              <FieldLabel>{t("booking.street")}</FieldLabel>
              <input type="text" required autoComplete="street-address" className={inputClass} />
            </label>
            <label className="block sm:col-span-1">
              <FieldLabel>{t("booking.houseNumber")}</FieldLabel>
              <input type="text" required autoComplete="off" className={inputClass} />
            </label>
            <label className="block">
              <FieldLabel>{t("booking.zip")}</FieldLabel>
              <input type="text" required autoComplete="postal-code" className={inputClass} />
            </label>
            <label className="block">
              <FieldLabel>{t("booking.city")}</FieldLabel>
              <input type="text" required autoComplete="address-level2" className={inputClass} />
            </label>
            <label className="block sm:col-span-2">
              <FieldLabel>{t("booking.country")}</FieldLabel>
              <select required className={inputClass} defaultValue="DE">
                <option value="DE">{t("booking.countryDE")}</option>
                <option value="AT">{t("booking.countryAT")}</option>
                <option value="CH">{t("booking.countryCH")}</option>
              </select>
            </label>
          </div>
        </section>

        {/* Who travels */}
        <section className={cardClass}>
          <h2 className="text-lg font-extrabold tracking-tight text-ink">{t("booking.whoTravels")}</h2>
          <div className="mt-5 space-y-5">
            {guests.map((guest, index) => (
              <fieldset key={guest.key} className="rounded-xl border border-[#e8eaef] bg-[#fafbfc] p-4 sm:p-5">
                <legend className="sr-only">{t(guest.labelKey, { n: guest.n })}</legend>
                <p className="mb-4 text-sm font-extrabold text-ink">
                  {t("booking.travellerPerson", { n: index + 1 })}
                  <span className="ml-2 font-medium text-muted">({t(guest.labelKey, { n: guest.n })})</span>
                </p>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <label className="block">
                    <FieldLabel>{t("booking.salutation")}</FieldLabel>
                    <select required className={inputClass} defaultValue="">
                      <option value="" disabled>
                        {t("booking.salutation")}
                      </option>
                      <option value="mr">{t("booking.salutationMr")}</option>
                      <option value="ms">{t("booking.salutationMs")}</option>
                      <option value="diverse">{t("booking.salutationDiverse")}</option>
                    </select>
                  </label>
                  <label className="block">
                    <FieldLabel>{t("booking.firstName")}</FieldLabel>
                    <input type="text" required className={inputClass} />
                  </label>
                  <label className="block">
                    <FieldLabel>{t("booking.lastName")}</FieldLabel>
                    <input type="text" required className={inputClass} />
                  </label>
                  <label className="block">
                    <FieldLabel>{t("booking.dateOfBirth")}</FieldLabel>
                    <input type="date" required className={inputClass} />
                  </label>
                </div>
              </fieldset>
            ))}
          </div>
        </section>

        {/* Travel protection comparison */}
        <section className={cardClass}>
          <h2 className="text-lg font-extrabold tracking-tight text-ink">{t("booking.chooseProtection")}</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {protectionOptions.map((option) => {
              const selected = protection === option.id;
              return (
                <div
                  key={option.id}
                  className={cn(
                    "flex flex-col rounded-xl border-2 p-4 transition",
                    selected ? "border-[#1B63EB] bg-[#F4F8FF]" : "border-[#e8eaef] bg-white"
                  )}
                >
                  {option.recommended && (
                    <span className="mb-2 w-fit rounded-md bg-[#1B63EB] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                      Top
                    </span>
                  )}
                  <p className="text-sm font-extrabold text-ink">{option.title}</p>
                  <p className="mt-1 text-lg font-extrabold tabular-nums text-ink">{option.price}</p>
                  {option.features.length > 0 && (
                    <ul className="mt-3 flex-1 space-y-1.5">
                      {option.features.map((feat) => (
                        <li key={feat} className="flex items-start gap-1.5 text-xs text-body">
                          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" aria-hidden="true" />
                          {feat}
                        </li>
                      ))}
                    </ul>
                  )}
                  <button
                    type="button"
                    onClick={() => setProtection(option.id)}
                    className={cn(
                      "mt-4 h-10 w-full rounded-lg text-sm font-bold transition",
                      selected
                        ? "bg-[#1B63EB] text-white"
                        : "border border-[#1B63EB] bg-white text-[#1B63EB] hover:bg-[#F4F8FF]"
                    )}
                  >
                    {selected ? t("booking.protectionSelected") : t("booking.protectionSelect")}
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* Extras */}
        <section className={cardClass}>
          <h2 className="text-lg font-extrabold tracking-tight text-ink">{t("booking.extrasTitle")}</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-xl border-2 p-4 transition",
                parking ? "border-[#1B63EB] bg-[#F4F8FF]" : "border-[#e8eaef] hover:border-brand-200"
              )}
            >
              <input
                type="checkbox"
                checked={parking}
                onChange={(e) => setParking(e.target.checked)}
                className="mt-1 h-4 w-4 accent-brand-500"
              />
              <span className="min-w-0">
                <span className="flex items-center gap-2 text-sm font-extrabold text-ink">
                  <Car className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {t("booking.extraParking")}
                </span>
                <span className="mt-1 block text-xs text-muted">{t("booking.extraParkingHint")}</span>
                <span className="mt-1 block text-sm font-semibold tabular-nums text-ink">+ 39,00 €</span>
              </span>
            </label>
            <label
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-xl border-2 p-4 transition",
                flexOption ? "border-[#1B63EB] bg-[#F4F8FF]" : "border-[#e8eaef] hover:border-brand-200"
              )}
            >
              <input
                type="checkbox"
                checked={flexOption}
                onChange={(e) => setFlexOption(e.target.checked)}
                className="mt-1 h-4 w-4 accent-brand-500"
              />
              <span className="min-w-0">
                <span className="flex items-center gap-2 text-sm font-extrabold text-ink">
                  <ShieldCheck className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {t("booking.extraFlex")}
                </span>
                <span className="mt-1 block text-xs text-muted">{t("booking.extraFlexHint")}</span>
                <span className="mt-1 block text-sm font-semibold tabular-nums text-ink">+ 25,00 €</span>
              </span>
            </label>
          </div>
        </section>

        {/* Voucher */}
        <section className={cardClass}>
          <h2 className="text-lg font-extrabold tracking-tight text-ink">{t("booking.voucherTitle")}</h2>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-end">
            <label className="block min-w-0 flex-1">
              <FieldLabel>{t("booking.voucherPlaceholder")}</FieldLabel>
              <input
                type="text"
                value={voucher}
                onChange={(e) => {
                  setVoucher(e.target.value);
                  setVoucherNote(false);
                }}
                className={inputClass}
                placeholder={t("booking.voucherPlaceholder")}
                autoComplete="off"
              />
            </label>
            <button
              type="button"
              onClick={() => {
                if (voucher.trim()) setVoucherNote(true);
              }}
              className="h-11 shrink-0 rounded-lg border border-[#1B63EB] bg-white px-5 text-sm font-bold text-[#1B63EB] transition hover:bg-[#F4F8FF]"
            >
              {t("booking.voucherApply")}
            </button>
          </div>
          {voucherNote && <p className="mt-2 text-sm font-medium text-success">{t("booking.voucherApplied")}</p>}
        </section>

        {/* Payment */}
        <section className={cardClass}>
          <h2 className="text-lg font-extrabold tracking-tight text-ink">{t("booking.howToPay")}</h2>
          <div className="mt-5 space-y-2.5">
            {paymentOptions.map((option) => {
              const selected = payment === option.id;
              return (
                <label
                  key={option.id}
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-xl border-2 p-4 transition",
                    selected ? "border-[#1B63EB] bg-[#F4F8FF]" : "border-[#e8eaef] bg-white hover:border-brand-200"
                  )}
                >
                  <input
                    type="radio"
                    name="payment-method"
                    value={option.id}
                    checked={selected}
                    onChange={() => setPayment(option.id)}
                    className="mt-1 h-4 w-4 shrink-0 accent-[#1B63EB]"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2 text-sm font-extrabold text-ink">
                      <option.icon className="h-4 w-4 shrink-0 text-[#1B63EB]" aria-hidden="true" />
                      {option.label}
                    </span>
                    {selected && (
                      <span className="mt-1.5 block text-sm leading-relaxed text-muted">{option.hint}</span>
                    )}
                  </span>
                </label>
              );
            })}
          </div>
        </section>

        {/* Final price + terms + CTA */}
        <section className={cardClass}>
          <h2 className="text-lg font-extrabold tracking-tight text-ink">{t("booking.priceBreakdown")}</h2>
          <div className="mt-4 space-y-4">
            {validRows.map((row) => (
              <div key={row.roomIndex} className="rounded-xl border border-[#e8eaef] bg-[#f7f8fb] p-3.5 sm:p-4">
                <p className="text-sm font-extrabold text-ink">
                  {t("booking.roomLine", { n: row.roomIndex + 1 })} · {tx(row.category.name, locale)}
                </p>
                <ul className="mt-2.5 space-y-1.5 text-sm">
                  {row.lines.map((line) => (
                    <li key={`${line.kind}-${line.index}`} className="flex justify-between gap-3">
                      <span className="text-body">
                        {line.kind === "adult"
                          ? t("booking.adultPriceLine", { n: line.index })
                          : t("booking.childPriceLine", {
                              n: line.index,
                              age:
                                line.age === 0
                                  ? t("booking.underOne")
                                  : t("booking.years", { n: line.age ?? 0 }),
                            })}
                      </span>
                      <span className="shrink-0 font-semibold tabular-nums text-ink">
                        {priceFormatter.format(line.amount)} €
                      </span>
                    </li>
                  ))}
                  {row.mealSupplement > 0 && row.mealPlan && (
                    <li className="flex justify-between gap-3">
                      <span className="text-body">{mealPlanLabel(row.mealPlan.label, locale)}</span>
                      <span className="shrink-0 font-semibold tabular-nums text-ink">
                        +{priceFormatter.format(row.mealSupplement)} €
                      </span>
                    </li>
                  )}
                  {row.cancellationSupplement > 0 && row.offer.cancellation && (
                    <li className="flex justify-between gap-3">
                      <span className="text-body">{tx(row.offer.cancellation.label, locale)}</span>
                      <span className="shrink-0 font-semibold tabular-nums text-ink">
                        +{priceFormatter.format(row.cancellationSupplement)} €
                      </span>
                    </li>
                  )}
                </ul>
                <div className="mt-2.5 space-y-1 border-t border-dashed border-line pt-2.5 text-sm">
                  <div className="flex justify-between gap-3">
                    <span className="text-muted">{t("booking.roomPpLine")}</span>
                    <span className="font-semibold tabular-nums text-ink">
                      {priceFormatter.format(row.perPerson)} €
                    </span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="font-bold text-ink">{t("booking.roomTotalLine")}</span>
                    <span className="font-extrabold tabular-nums text-ink">
                      {priceFormatter.format(row.total)} €
                    </span>
                  </div>
                </div>
              </div>
            ))}

            <ul className="space-y-2.5 text-sm">
              {protectionFee > 0 && (
                <li className="flex justify-between gap-3">
                  <span className="text-body">{t("booking.protectionLine")}</span>
                  <span className="font-semibold tabular-nums text-ink">
                    {priceFormatter.format(protectionFee)} €
                  </span>
                </li>
              )}
              {parkingFee > 0 && (
                <li className="flex justify-between gap-3">
                  <span className="text-body">{t("booking.extraParking")}</span>
                  <span className="font-semibold tabular-nums text-ink">
                    {priceFormatter.format(parkingFee)} €
                  </span>
                </li>
              )}
              {flexFee > 0 && (
                <li className="flex justify-between gap-3">
                  <span className="text-body">{t("booking.extraFlex")}</span>
                  <span className="font-semibold tabular-nums text-ink">{priceFormatter.format(flexFee)} €</span>
                </li>
              )}
            </ul>
          </div>
          <div className="mt-4 flex items-end justify-between gap-3 border-t border-line pt-4">
            <span className="text-base font-extrabold text-ink">{t("booking.totalPriceLabel")}</span>
            <span className="text-2xl font-extrabold tabular-nums text-ink">{formatEuro(totalPrice, locale)}</span>
          </div>

          <label className="mt-5 flex items-start gap-3 text-sm leading-relaxed text-body">
            <input
              type="checkbox"
              checked={newsletter}
              onChange={(e) => setNewsletter(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-brand-500"
            />
            {t("booking.newsletterOptIn")}
          </label>

          <label className="mt-3 flex items-start gap-3 text-sm leading-relaxed text-body">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              required
              className="mt-0.5 h-4 w-4 shrink-0 accent-brand-500"
            />
            {t("booking.acceptTerms")}
          </label>

          <p className="mt-3 text-xs leading-relaxed text-muted">{t("booking.termsHint")}</p>

          <button
            type="submit"
            className="mt-5 hidden h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#1B63EB] text-sm font-bold text-white shadow-[0_8px_20px_rgba(27,99,235,0.22)] transition hover:bg-[#0F52D6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 lg:flex"
          >
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            {t("booking.bookNow")}
          </button>
          <p className="mt-3 hidden items-center justify-center gap-1.5 text-xs text-muted lg:flex">
            <Lock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {t("booking.checkoutSecure")}
          </p>
        </section>
      </form>

      {/* Mobile sticky book bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 px-4 py-3 shadow-[0_-8px_24px_rgba(15,26,43,0.1)] backdrop-blur lg:hidden pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="mx-auto flex max-w-lg items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-extrabold tabular-nums text-ink">{formatEuro(totalPrice, locale)}</p>
            <p className="truncate text-[11px] text-muted">
              {t("booking.gesamtpreisLine", { price: priceFormatter.format(totalPrice) })}
            </p>
          </div>
          <button
            type="submit"
            form="checkout-form"
            className="inline-flex h-12 shrink-0 items-center justify-center gap-1.5 rounded-xl bg-[#1B63EB] px-4 text-sm font-bold text-white shadow-[0_8px_20px_rgba(27,99,235,0.22)]"
          >
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            {t("booking.bookNow")}
          </button>
        </div>
      </div>
    </div>
  );
}
