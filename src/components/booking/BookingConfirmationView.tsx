"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BedDouble,
  CalendarRange,
  Check,
  CheckCircle2,
  CreditCard,
  Landmark,
  MapPin,
  Moon,
  Printer,
  Star,
  Users,
} from "lucide-react";
import type { BookingConfirmationSnapshot } from "@/lib/bookingConfirmation";
import { formatContactAddress, formatGuestName } from "@/lib/bookingConfirmation";
import { formatFreeCancellationDeadline, hasFreeCancellation } from "@/lib/freeCancellation";
import { PHONE_PREFIX } from "@/components/booking/checkoutHelpers";
import { ReviewBadge } from "@/components/home/ReviewBadge";
import { useLocale, useT } from "@/i18n/LocaleProvider";
import { localeTag } from "@/i18n/config";
import { nightLabel } from "@/i18n/content";
import { cn, formatEuro } from "@/lib/utils";

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
  const childAgesLabel =
    snapshot.travelers.childAges.length > 0
      ? snapshot.travelers.childAges
          .map((age) => (age === 0 ? t("booking.underOne") : t("booking.years", { n: age })))
          .join(", ")
      : "";

  useEffect(() => {
    document.body.classList.add("booking-confirmation-active");
    return () => document.body.classList.remove("booking-confirmation-active");
  }, []);

  const paymentLabel =
    snapshot.payment === "card" ? t("booking.paymentCard") : t("booking.paymentInvoice");
  const paymentNote =
    snapshot.payment === "card" ? t("booking.paymentCardNote") : t("booking.paymentInvoiceNote");

  const nextSteps = [
    { n: 1, title: t("booking.confirmStep1Title"), text: t("booking.confirmStep1Text") },
    {
      n: 2,
      title: t("booking.confirmStep2Title"),
      text:
        snapshot.payment === "card"
          ? t("booking.confirmStep2Card")
          : t("booking.confirmStep2Invoice"),
    },
    { n: 3, title: t("booking.confirmStep3Title"), text: t("booking.confirmStep3Text") },
  ];

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

      <div id="confirmation-print" className="confirmation-print-area space-y-4 pb-6">
        <section className="rounded-2xl border border-success/25 bg-[#e8f8ee] p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-success/15">
              <CheckCircle2 className="h-8 w-8 text-success" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <h1 className="text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
                {t("booking.confirmThankYou")}
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-body">
                {t("booking.confirmEmailSent", { email: snapshot.contact.email })}
              </p>
              <p className="mt-2 text-sm font-bold text-brand-500">
                {t("booking.requestNo", { ref: snapshot.requestRef })}
              </p>
            </div>
          </div>
          <div className="no-print mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-brand-500 bg-white px-4 text-sm font-bold text-brand-500 transition hover:bg-brand-50"
            >
              <Printer className="h-4 w-4" aria-hidden="true" />
              {t("booking.confirmPrint")}
            </button>
            <Link
              href="/"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-brand-500 px-4 text-sm font-bold text-white transition hover:bg-brand-600"
            >
              {t("booking.confirmBackHome")}
            </Link>
          </div>
        </section>

        <section className={cardClass}>
          <h2 className="text-base font-extrabold text-ink sm:text-lg">{snapshot.hotel.name}</h2>
          <div className="mt-3 flex gap-3 sm:gap-4">
            {snapshot.hotel.image && (
              <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-surface sm:h-24 sm:w-28">
                <Image src={snapshot.hotel.image} alt={snapshot.hotel.name} fill sizes="112px" className="object-cover" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <span className="flex items-center gap-0.5 text-[#FDB919]" aria-label={t("deal.stars", { count: snapshot.hotel.stars })}>
                {Array.from({ length: snapshot.hotel.stars }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-[#FDB919]" aria-hidden="true" />
                ))}
              </span>
              {snapshot.hotel.reviewEnabled && (
                <div className="mt-1.5">
                  <ReviewBadge
                    reviewPercent={snapshot.hotel.reviewPercent}
                    reviewScore={snapshot.hotel.reviewScore}
                    reviewMaxScore={snapshot.hotel.reviewMaxScore}
                    reviewCount={snapshot.hotel.reviewCount}
                    size="sm"
                    countClassName="text-ink"
                  />
                </div>
              )}
              <p className="mt-2 flex items-start gap-1.5 text-sm text-body">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                {snapshot.hotel.region}, {snapshot.hotel.country}
              </p>
            </div>
          </div>
        </section>

        <section className={cardClass}>
          <h2 className="text-base font-extrabold text-ink sm:text-lg">{t("booking.yourTravelDetails")}</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <p className="flex items-center gap-2 text-sm">
              <Moon className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>
                <span className="block text-[11px] font-semibold uppercase tracking-wide text-muted">{t("booking.duration")}</span>
                {nightLabel(snapshot.nights, locale)}
              </span>
            </p>
            <p className="flex items-center gap-2 text-sm">
              <CalendarRange className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>
                <span className="block text-[11px] font-semibold uppercase tracking-wide text-muted">{t("booking.arrivalDate")}</span>
                {dateFormatter.format(arrival)}
              </span>
            </p>
            <p className="flex items-center gap-2 text-sm">
              <CalendarRange className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>
                <span className="block text-[11px] font-semibold uppercase tracking-wide text-muted">{t("booking.departureDate")}</span>
                {dateFormatter.format(departure)}
              </span>
            </p>
          </div>
          <div className="mt-4 border-t border-line pt-4">
            <p className="text-[11px] font-bold uppercase tracking-wide text-muted">{t("booking.travelers")}</p>
            <ul className="mt-2 space-y-1 text-sm text-ink">
              <li className="flex items-center gap-2">
                <Users className="h-4 w-4 shrink-0" aria-hidden="true" />
                {t("booking.adultsCount", { count: snapshot.travelers.adults })}
              </li>
              {snapshot.travelers.children > 0 && (
                <li className="flex items-center gap-2">
                  <Users className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {t("booking.childrenCount", { count: snapshot.travelers.children })}
                </li>
              )}
              {childAgesLabel && (
                <li className="text-body">{t("booking.confirmChildAges", { ages: childAgesLabel })}</li>
              )}
              <li className="flex items-center gap-2">
                <BedDouble className="h-4 w-4 shrink-0" aria-hidden="true" />
                {t("booking.roomsLabel")}: {snapshot.rooms.length}
              </li>
            </ul>
          </div>
        </section>

        <section className={cardClass}>
          <h2 className="text-base font-extrabold text-ink sm:text-lg">{t("booking.confirmBookingSummary")}</h2>
          <div className="mt-4 space-y-4">
            {snapshot.rooms.map((room) => (
              <div key={room.roomIndex} className="rounded-xl border border-[#e8eaef] bg-[#fafbfc] p-3.5">
                <p className="text-sm font-extrabold text-ink">{room.categoryName}</p>
                <p className="mt-1 text-xs text-muted">{room.occupancy}</p>
                <p className="mt-2 text-sm text-body">
                  <span className="font-semibold text-ink">{t("booking.confirmMainGuest")}: </span>
                  {formatGuestName(room.mainGuest, t)}
                </p>
                {room.mealPlanLabel && (
                  <p className="mt-1 text-sm text-body">
                    <span className="font-semibold text-ink">{t("booking.includedServices")}: </span>
                    {room.mealPlanLabel}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {hasFreeCancellation() && (
          <section className={cardClass}>
            <h2 className="text-base font-extrabold text-ink sm:text-lg">{t("booking.confirmCancellation")}</h2>
            <p className="mt-3 flex items-start gap-2 rounded-lg bg-[#EAF8F0] px-3 py-2.5 text-sm font-semibold leading-snug text-success">
              <Check className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" strokeWidth={2.4} />
              {t("booking.cancelNoRisk", { date: formatFreeCancellationDeadline(arrival, locale) })}
            </p>
          </section>
        )}

        {snapshot.extras.length > 0 && (
          <section className={cardClass}>
            <h2 className="text-base font-extrabold text-ink sm:text-lg">{t("booking.extrasTitle")}</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {snapshot.extras.map((extra) => (
                <li key={extra.id} className="flex justify-between gap-3">
                  <span className="text-body">
                    {extra.quantity && extra.quantity > 1
                      ? t("booking.addonQtyLabel", { label: extra.label, count: extra.quantity })
                      : extra.label}
                  </span>
                  <span className="shrink-0 font-semibold tabular-nums text-ink">+{priceFormatter.format(extra.amount)} €</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className={cardClass}>
          <h2 className="text-base font-extrabold text-ink sm:text-lg">{t("booking.confirmPaymentMethod")}</h2>
          <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-ink">
            {snapshot.payment === "card" ? (
              <CreditCard className="h-4 w-4 shrink-0 text-brand-500" aria-hidden="true" />
            ) : (
              <Landmark className="h-4 w-4 shrink-0 text-brand-500" aria-hidden="true" />
            )}
            {paymentLabel}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted">{paymentNote}</p>
        </section>

        <section className={cardClass}>
          <h2 className="text-base font-extrabold text-ink sm:text-lg">{t("booking.confirmContactDetails")}</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div>
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
            <div>
              <dt className="text-muted">{t("booking.email")}</dt>
              <dd className="font-medium text-ink break-all">{snapshot.contact.email}</dd>
            </div>
            <div>
              <dt className="text-muted">{t("booking.phone")}</dt>
              <dd className="font-medium text-ink">
                {phonePrefix} {snapshot.contact.phoneLocal}
              </dd>
            </div>
            <div>
              <dt className="text-muted">{t("booking.billingAddress")}</dt>
              <dd className="font-medium text-ink">{formatContactAddress(snapshot.contact, t)}</dd>
            </div>
          </dl>
        </section>

        {snapshot.remarks && (
          <section className={cardClass}>
            <h2 className="text-base font-extrabold text-ink sm:text-lg">{t("booking.confirmRemarks")}</h2>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-body">{snapshot.remarks}</p>
          </section>
        )}

        <section className={cardClass}>
          <h2 className="text-base font-extrabold text-ink sm:text-lg">{t("booking.priceBreakdown")}</h2>
          <div className="mt-3 space-y-3">
            {snapshot.rooms.map((room) => (
              <div key={room.roomIndex} className="rounded-xl border border-[#e8eaef] bg-[#f7f8fb] p-3.5">
                <p className="text-sm font-extrabold text-ink">
                  {t("booking.roomLine", { n: room.roomIndex + 1 })} · {room.categoryName}
                </p>
                <ul className="mt-2 space-y-1 text-sm">
                  {room.lines.map((line) => (
                    <li key={`${line.kind}-${line.index}`} className="flex justify-between gap-2">
                      <span className="text-body">
                        {line.kind === "adult"
                          ? t("booking.adultPriceLine", { n: line.index })
                          : t("booking.childPriceLine", {
                              n: line.index,
                              age: line.age === 0 ? t("booking.underOne") : t("booking.years", { n: line.age ?? 0 }),
                            })}
                      </span>
                      <span className="shrink-0 font-semibold tabular-nums text-ink">{priceFormatter.format(line.amount)} €</span>
                    </li>
                  ))}
                  {room.mealSupplement > 0 && room.mealPlanLabel && (
                    <li className="flex justify-between gap-2">
                      <span className="text-body">{room.mealPlanLabel}</span>
                      <span className="shrink-0 font-semibold tabular-nums text-ink">+{priceFormatter.format(room.mealSupplement)} €</span>
                    </li>
                  )}
                  {room.cancellationSupplement > 0 && room.cancellationLabel && (
                    <li className="flex justify-between gap-2">
                      <span className="text-body">{room.cancellationLabel}</span>
                      <span className="shrink-0 font-semibold tabular-nums text-ink">+{priceFormatter.format(room.cancellationSupplement)} €</span>
                    </li>
                  )}
                </ul>
                <div className="mt-2 flex justify-between gap-2 border-t border-dashed border-line pt-2 text-sm">
                  <span className="font-bold text-ink">{t("booking.roomTotalLine")}</span>
                  <span className="font-extrabold tabular-nums text-ink">{priceFormatter.format(room.total)} €</span>
                </div>
              </div>
            ))}
            {snapshot.extras.map((extra) => (
              <div key={extra.id} className="flex justify-between gap-2 text-sm">
                <span className="text-body">{extra.label}</span>
                <span className="font-semibold tabular-nums text-ink">+{priceFormatter.format(extra.amount)} €</span>
              </div>
            ))}
            {snapshot.voucherDiscount > 0 && (
              <div className="flex justify-between gap-2 text-sm text-success">
                <span>{t("booking.voucherDiscount")}</span>
                <span className="font-semibold tabular-nums">−{priceFormatter.format(snapshot.voucherDiscount)} €</span>
              </div>
            )}
          </div>
          <div className="mt-4 flex items-end justify-between gap-3 border-t-2 border-ink pt-4">
            <span className="text-base font-extrabold text-ink">{t("booking.totalPriceLabel")}</span>
            <span className="text-2xl font-extrabold tabular-nums text-ink sm:text-3xl">{formatEuro(snapshot.totalPrice, locale)}</span>
          </div>
          <p className="mt-2 text-xs text-muted">{t("booking.taxesIncluded")}</p>
          <p className="text-xs text-muted">{t("booking.touristTaxNote")}</p>
        </section>

        <section className={cardClass}>
          <h2 className="text-base font-extrabold text-ink sm:text-lg">{t("booking.confirmWhatNext")}</h2>
          <ol className="mt-4 grid gap-4 sm:grid-cols-3">
            {nextSteps.map((step) => (
              <li key={step.n} className="flex flex-col gap-2 rounded-xl border border-[#e8eaef] bg-[#fafbfc] p-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500 text-sm font-bold text-white">{step.n}</span>
                <p className="text-sm font-extrabold text-ink">{step.title}</p>
                <p className="text-xs leading-relaxed text-body sm:text-sm">{step.text}</p>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </>
  );
}
