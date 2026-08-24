"use client";

import Image from "next/image";
import Link from "next/link";
import { BedDouble, CircleCheck, Info, Utensils } from "lucide-react";
import type { TravelerPriceLine } from "@/lib/pricingEngine";
import type { BookingOffer, Deal, RoomCategoryDetail } from "@/types";
import { ProviderLogo } from "@/components/booking/ProviderLogo";
import { ReviewBadge } from "@/components/home/ReviewBadge";
import { CHECKOUT_TOURIST_TAX_PER_ROOM } from "@/components/booking/checkoutHelpers";
import { formatCheckoutCancellationDeadline, hasFreeCancellation } from "@/lib/freeCancellation";
import { formatEuro } from "@/lib/utils";
import { useLocale, useT } from "@/i18n/LocaleProvider";
import { localeTag } from "@/i18n/config";
import { countryDisplayName, mealPlanLabel, nightLabel, regionDisplay, tx } from "@/i18n/content";

export type CheckoutBreakdownRow = {
  roomIndex: number;
  category: RoomCategoryDetail;
  offer: BookingOffer;
  mealPlan: BookingOffer["mealPlans"][number] | undefined;
  total: number;
  lines: TravelerPriceLine[];
};

interface CheckoutTravelSummaryProps {
  deal: Deal;
  rows: CheckoutBreakdownRow[];
  arrival: Date;
  departure: Date;
  nights: number;
  totalAdults: number;
  totalChildren: number;
  hotelPrice: number;
  offerHref: string;
}

const cardClass =
  "rounded-2xl border border-[#e8eaef] bg-white p-4 shadow-[0_4px_16px_rgba(15,26,43,0.06)] sm:p-5";

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h3 className="text-sm font-extrabold text-ink">{children}</h3>;
}

function groupRoomCategories(rows: CheckoutBreakdownRow[], locale: "de" | "en") {
  const groups: { id: string; name: string; count: number }[] = [];
  const indexById = new Map<string, number>();

  for (const row of rows) {
    const existingIndex = indexById.get(row.category.id);
    if (existingIndex !== undefined) {
      groups[existingIndex].count += 1;
    } else {
      indexById.set(row.category.id, groups.length);
      groups.push({ id: row.category.id, name: tx(row.category.name, locale), count: 1 });
    }
  }

  return groups;
}

function formatRoomGroupLabel(count: number, name: string) {
  return count > 1 ? `${count} ${name}` : name;
}

function PaymentMethodBadges() {
  return (
    <div className="mt-2 flex flex-wrap items-center gap-2" aria-hidden="true">
      <span className="rounded border border-[#d8dce3] bg-white px-2.5 py-1 text-[10px] font-extrabold tracking-wide text-[#1A1F71]">
        VISA
      </span>
      <span className="rounded border border-[#d8dce3] bg-white px-2.5 py-1 text-[10px] font-extrabold tracking-wide text-[#EB001B]">
        Mastercard
      </span>
    </div>
  );
}

function CheckoutCancellationSummary({ arrival }: { arrival: Date }) {
  const t = useT();
  const { locale } = useLocale();

  if (!hasFreeCancellation()) return null;

  const deadline = formatCheckoutCancellationDeadline(arrival, locale);

  return (
    <div>
      <p className="flex flex-wrap items-center gap-1.5 text-sm font-extrabold text-success">
        <CircleCheck className="h-4 w-4 shrink-0" aria-hidden="true" strokeWidth={2.4} />
        {t("booking.cancelFreeCancellable")}
        <Info className="h-3.5 w-3.5 shrink-0 text-success/80" aria-hidden="true" />
      </p>
      <p className="mt-0.5 text-sm text-success">{t("booking.cancelUntilDate", { date: deadline })}</p>
    </div>
  );
}

function TravelPricePanel({
  rows,
  hotelPrice,
  locale,
}: {
  rows: CheckoutBreakdownRow[];
  hotelPrice: number;
  locale: "de" | "en";
}) {
  const t = useT();
  const priceFormatter = new Intl.NumberFormat(localeTag(locale), {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const lineLabel = (line: TravelerPriceLine) => {
    if (line.kind === "adult") return t("booking.summaryAdultLine");
    return t("booking.summaryChildLine", {
      age: line.age === 0 ? t("booking.underOne") : t("booking.years", { n: line.age ?? 0 }),
    });
  };

  return (
    <div className="min-w-0 space-y-5">
      {rows.map((row) => (
        <div key={row.roomIndex} className="space-y-1.5">
          <div className="flex items-baseline justify-between gap-3">
            <p className="min-w-0 text-sm font-extrabold leading-snug text-ink">
              {tx(row.category.name, locale)}
            </p>
            <span className="shrink-0 text-sm font-extrabold tabular-nums text-ink">
              {priceFormatter.format(row.total)} €
            </span>
          </div>
          <ul className="space-y-1">
            {row.lines.map((line) => (
              <li key={`${line.kind}-${line.index}`} className="flex justify-between gap-3 text-sm">
                <span className="min-w-0 text-body">{lineLabel(line)}</span>
                <span className="shrink-0 tabular-nums text-ink">{priceFormatter.format(line.amount)} €</span>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <div className="border-t border-line pt-4">
        <div className="flex items-end justify-between gap-3">
          <span className="text-sm font-extrabold text-ink sm:text-base">{t("booking.yourTravelPrice")}</span>
          <span className="text-[1.85rem] font-extrabold leading-none tabular-nums tracking-tight text-ink">
            {formatEuro(hotelPrice, locale)}
          </span>
        </div>
      </div>

      <ul className="space-y-1 text-sm">
        {rows.map((row) => (
          <li key={`tax-${row.roomIndex}`} className="flex justify-between gap-3">
            <span className="min-w-0 text-body">{t("booking.touristTaxLine")}</span>
            <span className="shrink-0 tabular-nums text-ink">
              {priceFormatter.format(CHECKOUT_TOURIST_TAX_PER_ROOM)} €
            </span>
          </li>
        ))}
      </ul>

      <p className="text-xs leading-relaxed text-muted">{t("booking.checkoutTaxDisclaimer")}</p>

      <div>
        <p className="text-sm font-extrabold text-ink">{t("booking.paymentMethodsLabel")}</p>
        <PaymentMethodBadges />
      </div>
    </div>
  );
}

function TravelSummaryDetails({
  rows,
  arrival,
  nights,
  totalAdults,
  totalChildren,
  hotelPrice,
  offerHref,
  locale,
  uniqueMealPlans,
  primaryProvider,
  layout,
}: {
  rows: CheckoutBreakdownRow[];
  arrival: Date;
  nights: number;
  totalAdults: number;
  totalChildren: number;
  hotelPrice: number;
  offerHref: string;
  locale: "de" | "en";
  uniqueMealPlans: (BookingOffer["mealPlans"][number] | undefined)[];
  primaryProvider: string | undefined;
  layout: "desktop" | "mobile";
}) {
  const t = useT();
  const groupedRooms = groupRoomCategories(rows, locale);

  const leftColumn = (
    <div className="min-w-0 space-y-5">
      <div>
        <SectionHeading>{t("booking.travelers")}</SectionHeading>
        <ul className="mt-2 space-y-1 text-sm text-ink">
          <li>{t("booking.adultsCount", { count: totalAdults })}</li>
          {totalChildren > 0 && <li>{t("booking.childrenCount", { count: totalChildren })}</li>}
        </ul>
      </div>

      <div>
        <SectionHeading>{t("booking.roomsLabel")}</SectionHeading>
        <ul className="mt-2 space-y-3">
          {groupedRooms.map((group) => (
            <li key={group.id} className="text-sm">
              <p className="font-semibold text-ink">{formatRoomGroupLabel(group.count, group.name)}</p>
              <p className="mt-1 flex items-center gap-1.5 text-body">
                <BedDouble className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                {t("booking.overnightsCount", { count: nights })}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {uniqueMealPlans.length > 0 && (
        <div>
          <SectionHeading>{t("booking.checkoutServicesLabel")}</SectionHeading>
          <ul className="mt-2 space-y-1.5">
            {uniqueMealPlans.map((plan) =>
              plan ? (
                <li key={plan.id} className="flex items-center gap-1.5 text-sm text-body">
                  <Utensils className="h-3.5 w-3.5 shrink-0 text-ink" aria-hidden="true" />
                  {mealPlanLabel(plan.label, locale)}
                </li>
              ) : null
            )}
          </ul>
        </div>
      )}

      <CheckoutCancellationSummary arrival={arrival} />

      <Link
        href={offerHref}
        className="inline-block text-sm font-semibold text-brand-500 underline-offset-2 hover:underline"
      >
        {t("booking.offerDetailsLink")}
      </Link>

      {primaryProvider && (
        <div className="flex items-center gap-2">
          <ProviderLogo name={primaryProvider} />
          <Info className="h-3.5 w-3.5 shrink-0 text-muted" aria-hidden="true" />
        </div>
      )}
    </div>
  );

  const rightColumn = <TravelPricePanel rows={rows} hotelPrice={hotelPrice} locale={locale} />;

  if (layout === "desktop") {
    return (
      <div className="mt-5 hidden gap-8 lg:grid lg:grid-cols-2">
        {leftColumn}
        <div className="min-w-0 border-l border-line pl-6">{rightColumn}</div>
      </div>
    );
  }

  return (
    <div className="mt-5 space-y-5 lg:hidden">
      {leftColumn}
      <div className="border-t border-line pt-5">{rightColumn}</div>
    </div>
  );
}

/** Part 1 — compact travel summary matching desktop checkout reference. */
export function CheckoutTravelSummary({
  deal,
  rows,
  arrival,
  departure,
  nights,
  totalAdults,
  totalChildren,
  hotelPrice,
  offerHref,
}: CheckoutTravelSummaryProps) {
  const t = useT();
  const { locale } = useLocale();
  const dateFormatter = new Intl.DateTimeFormat(localeTag(locale), {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const locationLabel = regionDisplay(deal.destinationRegion, locale);
  const country = countryDisplayName(deal.destinationCountry, locale);
  const addressLine = [locationLabel, country].filter(Boolean).join(", ");
  const primaryProvider = rows[0]?.offer.provider;
  const uniqueMealPlans = rows
    .map((row) => row.mealPlan)
    .filter((plan, index, list) => plan && list.findIndex((p) => p?.id === plan.id) === index);

  const travelPeriodLine = t("booking.travelPeriodLine", {
    duration: nightLabel(nights, locale),
    from: dateFormatter.format(arrival),
    to: dateFormatter.format(departure),
  });

  const sharedDetailsProps = {
    rows,
    arrival,
    nights,
    totalAdults,
    totalChildren,
    hotelPrice,
    offerHref,
    locale,
    uniqueMealPlans,
    primaryProvider,
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2.5 rounded-xl border border-[#b7e4c7] bg-[#e8f8ee] px-3.5 py-3 text-sm font-semibold leading-snug text-[#1b4332]">
        <CircleCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#2d6a4f]" aria-hidden="true" strokeWidth={2.4} />
        {t("booking.offerGoodChoiceBanner")}
      </div>

      <section className={cardClass}>
        <div className="flex gap-4">
          <div className="relative h-[5.5rem] w-[7.5rem] shrink-0 overflow-hidden rounded-xl bg-surface sm:h-[6.25rem] sm:w-[8.5rem]">
            <Image src={deal.images[0]} alt={deal.name} fill sizes="136px" className="object-cover" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-base font-extrabold leading-snug text-ink sm:text-[1.05rem]">{deal.name}</h1>
            <div className="mt-1.5 flex items-center gap-1">
              <span className="flex items-center gap-0.5" aria-label={t("deal.stars", { count: deal.stars })}>
                {Array.from({ length: deal.stars }).map((_, i) => (
                  <span key={i} className="h-2 w-2 rounded-full bg-ink" aria-hidden="true" />
                ))}
              </span>
              <Info className="h-3.5 w-3.5 shrink-0 text-muted" aria-hidden="true" />
            </div>
            {addressLine && <p className="mt-1.5 text-xs leading-snug text-muted sm:text-sm">{addressLine}</p>}
            {deal.reviewEnabled && (
              <div className="mt-2">
                <ReviewBadge
                  reviewPercent={deal.reviewPercent}
                  reviewScore={deal.reviewScore}
                  reviewMaxScore={deal.reviewMaxScore}
                  reviewCount={deal.reviewCount}
                  size="sm"
                  showReviewCount={false}
                  countClassName="text-ink"
                />
              </div>
            )}
          </div>
        </div>

        <div className="mt-5 border-t border-line pt-5">
          <h2 className="text-base font-extrabold text-ink sm:text-lg">{t("booking.yourTravelData")}</h2>
          <p className="mt-2 text-sm font-extrabold text-ink">{travelPeriodLine}</p>

          <TravelSummaryDetails {...sharedDetailsProps} layout="desktop" />
          <TravelSummaryDetails {...sharedDetailsProps} layout="mobile" />
        </div>
      </section>
    </div>
  );
}
