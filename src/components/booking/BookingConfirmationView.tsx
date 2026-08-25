"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BedDouble,
  Check,
  CheckCircle2,
  CreditCard,
  Info,
  Landmark,
  Printer,
  Utensils,
} from "lucide-react";
import type { BookingConfirmationSnapshot } from "@/lib/bookingConfirmation";
import { formatContactAddress, formatGuestName } from "@/lib/bookingConfirmation";
import { formatCheckoutCancellationDeadline, hasFreeCancellation } from "@/lib/freeCancellation";
import { CHECKOUT_TOURIST_TAX_PER_ROOM, PHONE_PREFIX } from "@/components/booking/checkoutHelpers";
import { ProviderLogo } from "@/components/booking/ProviderLogo";
import { ReviewBadge } from "@/components/home/ReviewBadge";
import { useLocale, useT } from "@/i18n/LocaleProvider";
import { localeTag } from "@/i18n/config";
import { nightLabel } from "@/i18n/content";
import { deals } from "@/data/deals";
import { formatEuro } from "@/lib/utils";

const cardClass = "rounded-2xl border border-[#e8eaef] bg-white p-4 shadow-[0_4px_16px_rgba(15,26,43,0.06)] sm:p-5";

interface BookingConfirmationViewProps {
  snapshot: BookingConfirmationSnapshot;
}

export function BookingConfirmationView({ snapshot }: BookingConfirmationViewProps) {
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

  const arrival = new Date(snapshot.arrivalIso);
  const departure = new Date(snapshot.arrivalIso);
  departure.setDate(departure.getDate() + snapshot.nights);

  const phonePrefix = snapshot.contact.country ? PHONE_PREFIX[snapshot.contact.country] : "";

  const travelPeriodLine = t("booking.travelPeriodLine", {
    duration: nightLabel(snapshot.nights, locale),
    from: dateFormatter.format(arrival),
    to: dateFormatter.format(departure),
  });

  const cancelDeadline = formatCheckoutCancellationDeadline(arrival, locale);
  const cancelDeadlineDisplay = cancelDeadline.includes(",")
    ? cancelDeadline.replace(", ", " (") + ")"
    : cancelDeadline;

  const mealPlans = Array.from(
    new Set(snapshot.rooms.map((room) => room.mealPlanLabel).filter(Boolean) as string[])
  );

  useEffect(() => {
    document.body.classList.add("booking-confirmation-active");
    return () => document.body.classList.remove("booking-confirmation-active");
  }, []);

  const paymentLabel =
    snapshot.payment === "card" ? t("booking.paymentCard") : t("booking.paymentInvoice");
  const paymentNote =
    snapshot.payment === "card" ? t("booking.paymentCardNote") : t("booking.paymentInvoiceNote");

  const tourOperator =
    snapshot.tourOperator ||
    deals.find((deal) => deal.slug === snapshot.slug)?.provider ||
    "";

  const nextSteps = [
    { n: 1, title: t("booking.confirmStep1Title"), text: t("booking.confirmStep1Text") },
    { n: 2, title: t("booking.confirmStep2Title"), text: t("booking.confirmStep2Text") },
    { n: 3, title: t("booking.confirmStep3Title"), text: t("booking.confirmStep3Text") },
  ];

  const travelDetailsColumn = (
    <div className="min-w-0 space-y-5">
      <div>
        <h3 className="text-sm font-extrabold text-ink">{t("booking.travelers")}</h3>
        <ul className="mt-2 space-y-1 text-sm text-ink">
          <li>{t("booking.adultsCount", { count: snapshot.travelers.adults })}</li>
          {snapshot.travelers.children > 0 && (
            <li>{t("booking.childrenCount", { count: snapshot.travelers.children })}</li>
          )}
        </ul>
      </div>

      <div>
        <h3 className="text-sm font-extrabold text-ink">{t("booking.roomsLabel")}</h3>
        <ul className="mt-2 space-y-2 text-sm">
          {snapshot.rooms.map((room) => (
            <li key={room.roomIndex}>
              <p className="font-semibold text-ink">{room.categoryName}</p>
              <p className="mt-1 flex items-center gap-1.5 text-body">
                <BedDouble className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                {t("booking.overnightsCount", { count: snapshot.nights })}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {mealPlans.length > 0 && (
        <div>
          <h3 className="text-sm font-extrabold text-ink">{t("booking.checkoutServicesLabel")}</h3>
          <ul className="mt-2 space-y-1.5">
            {mealPlans.map((plan) => (
              <li key={plan} className="flex items-center gap-1.5 text-sm text-body">
                <Utensils className="h-3.5 w-3.5 shrink-0 text-ink" aria-hidden="true" />
                {plan}
              </li>
            ))}
          </ul>
        </div>
      )}

      {hasFreeCancellation() && (
        <div>
          <p className="flex flex-wrap items-center gap-1.5 text-sm font-extrabold text-success">
            <Check className="h-4 w-4 shrink-0" aria-hidden="true" strokeWidth={2.4} />
            {t("booking.cancelFreeCancellable")}
            <Info className="h-3.5 w-3.5 shrink-0 text-success/80" aria-hidden="true" />
          </p>
          <p className="mt-0.5 text-sm text-success">
            {t("booking.cancelUntilDate", { date: cancelDeadline })}
          </p>
        </div>
      )}
    </div>
  );

  const priceColumn = (
    <div className="min-w-0 space-y-5">
      {snapshot.rooms.map((room) => (
        <div key={room.roomIndex} className="space-y-1.5">
          <div className="flex items-baseline justify-between gap-3">
            <p className="min-w-0 text-sm font-extrabold text-ink">{room.categoryName}</p>
            <span className="shrink-0 text-sm font-extrabold tabular-nums text-ink">
              {priceFormatter.format(room.total)} €
            </span>
          </div>
          <ul className="space-y-1 text-sm">
            {room.lines.map((line) => (
              <li key={`${line.kind}-${line.index}`} className="flex justify-between gap-2">
                <span className="text-body">
                  {line.kind === "adult"
                    ? t("booking.summaryAdultLine")
                    : t("booking.summaryChildLine", {
                        age: line.age === 0 ? t("booking.underOne") : t("booking.years", { n: line.age ?? 0 }),
                      })}
                </span>
                <span className="shrink-0 tabular-nums text-ink">{priceFormatter.format(line.amount)} €</span>
              </li>
            ))}
            {room.cancellationSupplement > 0 && room.cancellationLabel && (
              <li className="flex justify-between gap-2">
                <span className="text-body">{room.cancellationLabel}</span>
                <span className="shrink-0 tabular-nums text-ink">
                  +{priceFormatter.format(room.cancellationSupplement)} €
                </span>
              </li>
            )}
          </ul>
        </div>
      ))}

      {snapshot.extras.length > 0 && (
        <ul className="space-y-1.5 border-t border-line pt-4 text-sm">
          {snapshot.extras.map((extra) => (
            <li key={extra.id} className="flex justify-between gap-2">
              <span className="text-body">
                {extra.quantity && extra.quantity > 1
                  ? t("booking.addonQtyLabel", { label: extra.label, count: extra.quantity })
                  : extra.label}
              </span>
              <span className="shrink-0 tabular-nums text-ink">+{priceFormatter.format(extra.amount)} €</span>
            </li>
          ))}
        </ul>
      )}

      {snapshot.voucherDiscount > 0 && (
        <div className="flex justify-between gap-2 text-sm font-semibold text-success">
          <span>{t("booking.voucherDiscount")}</span>
          <span className="tabular-nums">−{priceFormatter.format(snapshot.voucherDiscount)} €</span>
        </div>
      )}

      <div className="flex items-end justify-between gap-3 border-t border-line pt-4">
        <span className="text-sm font-extrabold text-ink">{t("booking.yourTravelPrice")}</span>
        <span className="text-[1.85rem] font-extrabold leading-none tabular-nums tracking-tight text-ink">
          {formatEuro(snapshot.totalPrice, locale)}
        </span>
      </div>

      <ul className="space-y-1 text-sm">
        {snapshot.rooms.map((room) => (
          <li key={`tax-${room.roomIndex}`} className="flex justify-between gap-3">
            <span className="text-body">{t("booking.touristTaxLine")}</span>
            <span className="shrink-0 tabular-nums text-ink">
              {priceFormatter.format(CHECKOUT_TOURIST_TAX_PER_ROOM)} €
            </span>
          </li>
        ))}
      </ul>
      <p className="text-xs leading-relaxed text-muted">{t("booking.checkoutTaxDisclaimer")}</p>
    </div>
  );

  return (
    <>
      <style>{`
        @media print {
          header, footer, nav, .no-print { display: none !important; }
          body.booking-confirmation-active { background: #fff !important; }
          .confirmation-print-area { box-shadow: none !important; border: none !important; }
          .confirmation-print-area section { break-inside: avoid; box-shadow: none !important; }
        }
      `}</style>

      {/* Always a vertical stack of sections; multi-column only inside cards from lg+ */}
      <div id="confirmation-print" className="confirmation-print-area flex flex-col gap-4 pb-6">
        <section className="rounded-2xl border border-success/25 bg-[#e8f8ee] p-4 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-success/15 sm:h-14 sm:w-14">
              <CheckCircle2 className="h-7 w-7 text-success sm:h-8 sm:w-8" aria-hidden="true" />
            </span>
            <h1 className="min-w-0 text-xl font-extrabold tracking-tight text-ink sm:pt-2 sm:text-2xl">
              {t("booking.confirmThankYou")}
            </h1>
          </div>

          <div className="mt-5">
            <h2 className="text-base font-extrabold text-ink">{t("booking.confirmWhatNext")}</h2>
            <ol className="mt-3 flex flex-col gap-2.5 md:grid md:grid-cols-3 md:gap-3">
              {nextSteps.map((step) => (
                <li
                  key={step.n}
                  className="flex gap-3 rounded-xl border border-success/20 bg-white/70 px-3.5 py-3 md:flex-col md:gap-2"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-500 text-xs font-bold text-white">
                    {step.n}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-extrabold text-ink">{step.title}</p>
                    <p className="mt-1 text-[13px] leading-snug text-body">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-5 border-t border-success/20 pt-5">
            <p className="text-sm leading-relaxed text-body">{t("booking.confirmEmailSentLead")}</p>
            <p className="mt-1 break-all text-base font-extrabold text-ink">{snapshot.contact.email}</p>
            <p className="mt-3 text-sm font-bold text-brand-500">
              {t("booking.requestNo", { ref: snapshot.requestRef })}
            </p>

            {tourOperator ? (
              <div className="mt-5">
                <p className="text-sm font-extrabold text-ink">{t("booking.confirmTourOperator")}</p>
                <div className="mt-2.5">
                  <ProviderLogo name={tourOperator} size="lg" />
                </div>
              </div>
            ) : null}
          </div>

          <div className="no-print mt-5 flex w-full flex-col gap-2 sm:flex-row sm:flex-wrap">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-brand-500 bg-white px-4 text-sm font-bold text-brand-500 transition hover:bg-brand-50 sm:w-auto"
            >
              <Printer className="h-4 w-4" aria-hidden="true" />
              {t("booking.confirmPrint")}
            </button>
            <Link
              href="/"
              className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-brand-500 px-4 text-sm font-bold text-white transition hover:bg-brand-600 sm:w-auto"
            >
              {t("booking.confirmBackHome")}
            </Link>
          </div>
        </section>

        <section className={cardClass}>
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            {snapshot.hotel.image && (
              <div className="relative h-40 w-full shrink-0 overflow-hidden rounded-xl bg-surface sm:h-24 sm:w-28">
                <Image
                  src={snapshot.hotel.image}
                  alt={snapshot.hotel.name}
                  fill
                  sizes="(max-width: 640px) 100vw, 112px"
                  className="object-cover"
                />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h2 className="text-base font-extrabold leading-snug text-ink sm:text-lg">{snapshot.hotel.name}</h2>
              <div className="mt-1.5 flex items-center gap-1">
                <span className="flex items-center gap-0.5" aria-label={t("deal.stars", { count: snapshot.hotel.stars })}>
                  {Array.from({ length: snapshot.hotel.stars }).map((_, i) => (
                    <span key={i} className="h-2 w-2 rounded-full bg-ink" aria-hidden="true" />
                  ))}
                </span>
                <Info className="h-3.5 w-3.5 shrink-0 text-muted" aria-hidden="true" />
              </div>
              <p className="mt-1.5 text-sm leading-snug text-muted">
                {snapshot.hotel.region}, {snapshot.hotel.country}
              </p>
              {snapshot.hotel.reviewEnabled && (
                <div className="mt-2">
                  <ReviewBadge
                    reviewPercent={snapshot.hotel.reviewPercent}
                    reviewScore={snapshot.hotel.reviewScore}
                    reviewMaxScore={snapshot.hotel.reviewMaxScore}
                    reviewCount={snapshot.hotel.reviewCount}
                    size="sm"
                    showReviewCount={false}
                    countClassName="text-ink"
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        <section className={cardClass}>
          <h2 className="text-base font-extrabold text-ink sm:text-lg">{t("booking.yourTravelData")}</h2>
          <p className="mt-2 text-sm font-extrabold text-ink">{travelPeriodLine}</p>

          {/* Mobile: single column (details → price). Desktop: two columns. */}
          <div className="mt-5 flex flex-col gap-6 lg:grid lg:grid-cols-2 lg:gap-8">
            {travelDetailsColumn}
            <div className="min-w-0 border-t border-line pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
              {priceColumn}
            </div>
          </div>
        </section>

        <section className={cardClass}>
          <h2 className="text-base font-extrabold text-ink sm:text-lg">{t("booking.confirmYourDetails")}</h2>
          <div className="mt-4 flex flex-col gap-4">
            {snapshot.rooms.map((room) => (
              <div key={room.roomIndex} className="rounded-xl border border-[#e8eaef] bg-[#fafbfc] p-3.5">
                <p className="text-sm font-extrabold text-ink">
                  {room.roomIndex + 1}. {room.categoryName}
                </p>
                <p className="mt-1 text-xs text-muted">{room.occupancy}</p>
                <dl className="mt-3 grid gap-2 text-sm">
                  <div className="flex flex-col gap-0.5">
                    <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
                      {t("booking.confirmMainGuest")}
                    </dt>
                    <dd className="font-medium text-ink">{formatGuestName(room.mainGuest, t)}</dd>
                  </div>
                  {room.mealPlanLabel && (
                    <div className="flex flex-col gap-0.5">
                      <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
                        {t("booking.checkoutServicesLabel")}
                      </dt>
                      <dd className="font-medium text-ink">{room.mealPlanLabel}</dd>
                    </div>
                  )}
                </dl>
              </div>
            ))}
          </div>
        </section>

        <section className={cardClass}>
          <h2 className="text-base font-extrabold text-ink sm:text-lg">{t("booking.confirmContactDetails")}</h2>
          <dl className="mt-3 flex flex-col gap-3 text-sm">
            <div className="flex flex-col gap-0.5">
              <dt className="text-muted">{t("booking.contact")}</dt>
              <dd className="font-medium text-ink">
                {formatGuestName(
                  {
                    salutation: snapshot.contact.salutation,
                    firstName: snapshot.contact.firstName,
                    lastName: snapshot.contact.lastName,
                  },
                  t
                )}
              </dd>
            </div>
            <div className="flex flex-col gap-0.5">
              <dt className="text-muted">{t("booking.billingAddress")}</dt>
              <dd className="font-medium text-ink">{formatContactAddress(snapshot.contact, t)}</dd>
            </div>
            <div className="flex flex-col gap-0.5">
              <dt className="text-muted">{t("booking.phone")}</dt>
              <dd className="font-medium text-ink">
                {phonePrefix} {snapshot.contact.phoneLocal}
              </dd>
            </div>
            <div className="flex flex-col gap-0.5">
              <dt className="text-muted">{t("booking.email")}</dt>
              <dd className="break-all font-medium text-ink">{snapshot.contact.email}</dd>
            </div>
          </dl>

          <div className="mt-5 flex flex-col gap-4 border-t border-line pt-5">
            <div>
              <h3 className="text-sm font-extrabold text-ink">{t("booking.confirmPaymentMethod")}</h3>
              <p className="mt-2 inline-flex items-center gap-2 rounded-lg border border-[#d8dce3] bg-white px-3 py-2 text-sm font-semibold text-ink">
                {snapshot.payment === "card" ? (
                  <CreditCard className="h-4 w-4 shrink-0 text-brand-500" aria-hidden="true" />
                ) : (
                  <Landmark className="h-4 w-4 shrink-0 text-brand-500" aria-hidden="true" />
                )}
                {paymentLabel}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{paymentNote}</p>
            </div>

            <div>
              <h3 className="text-sm font-extrabold text-ink">{t("booking.confirmRemarks")}</h3>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-body">
                {snapshot.remarks?.trim() || t("booking.confirmNoRemarks")}
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
