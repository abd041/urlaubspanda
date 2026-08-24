"use client";

import Image from "next/image";
import { CalendarRange, Car, Lock, MapPin, Plane, Star, Users } from "lucide-react";
import type { ComponentType } from "react";
import type { Deal, HotelBookingConfig } from "@/types";
import type { RoomSelection } from "@/hooks/useBookingState";
import { FavoriteButton } from "@/components/offer/FavoriteButton";
import { ReviewBadge } from "@/components/home/ReviewBadge";
import { FreeCancellationBadge } from "@/components/booking/FreeCancellationBadge";
import { useLocale, useT } from "@/i18n/LocaleProvider";
import { localeTag } from "@/i18n/config";
import { countryDisplayName, nightLabel, tx } from "@/i18n/content";

interface HotelSummarySidebarProps {
  deal: Deal;
  config: HotelBookingConfig;
  nights: number;
  arrival: Date | null;
  departure: Date | null;
  rooms: RoomSelection[];
}

function formatPeriod(arrival: Date, departure: Date, locale: "de" | "en") {
  const weekday = new Intl.DateTimeFormat(localeTag(locale), { weekday: "short" });
  const dayMonth = new Intl.DateTimeFormat(localeTag(locale), { day: "2-digit", month: "2-digit" });
  const shortWeekday = (date: Date) => weekday.format(date).replace(/\.$/, "");
  return `${shortWeekday(arrival)} ${dayMonth.format(arrival)} – ${shortWeekday(departure)} ${dayMonth.format(departure)}`;
}

export function HotelSummarySidebar({
  deal,
  nights,
  arrival,
  departure,
  rooms,
}: HotelSummarySidebarProps) {
  const t = useT();
  const { locale } = useLocale();
  const totalAdults = rooms.reduce((sum, room) => sum + room.adults, 0);
  const totalChildren = rooms.reduce((sum, room) => sum + room.childAges.length, 0);
  const region = tx(deal.destinationRegion.split(" · ")[0] ?? deal.destinationRegion, locale);
  const country = countryDisplayName(deal.destinationCountry, locale);
  const ArrivalIcon = deal.flightIncluded ? Plane : Car;
  const arrivalLabel = deal.flightIncluded ? t("booking.fromAirport") : t("booking.arrival");
  const arrivalValue = deal.flightIncluded ? t("booking.fromAirports") : t("deal.ownArrival");

  const facts: { icon: ComponentType<{ className?: string }>; label: string; value: string }[] = [
    { icon: MapPin, label: t("booking.destinationHotel"), value: `${region}, ${country}` },
    {
      icon: ArrivalIcon,
      label: arrivalLabel,
      value: arrivalValue,
    },
    { icon: CalendarRange, label: t("booking.duration"), value: nightLabel(nights, locale) },
  ];
  if (arrival && departure) {
    facts.push({ icon: CalendarRange, label: t("booking.period"), value: formatPeriod(arrival, departure, locale) });
  }
  facts.push({
    icon: Users,
    label: t("booking.travelers"),
    value: t("booking.travelersSummary", {
      adults: totalAdults,
      children: totalChildren,
      rooms: rooms.length,
    }),
  });

  return (
    <div className="min-w-0 overflow-hidden rounded-2xl border border-[#eeeef2] bg-white shadow-[0_8px_24px_rgba(15,26,43,0.08)]">
      <div className="flex min-w-0 gap-3 p-3 lg:block lg:gap-0 lg:p-0">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl lg:h-44 lg:w-full lg:rounded-none">
          <Image src={deal.images[0]} alt={deal.name} fill sizes="(min-width: 1024px) 360px, 96px" className="object-cover" />
          <FavoriteButton
            dealId={deal.id}
            iconOnly
            className="absolute left-1.5 top-1.5 h-8 w-8 justify-center border-0 bg-white/90 px-0 py-0 shadow-sm lg:left-auto lg:right-3 lg:top-3 lg:h-9 lg:w-9"
          />
        </div>

        <div className="min-w-0 flex-1 lg:p-4">
          <h2 className="text-sm font-bold leading-snug text-ink lg:text-base">{deal.name}</h2>
          <span className="mt-1 flex items-center gap-0.5 text-[#FDB919]" aria-label={t("deal.stars", { count: deal.stars })}>
            {Array.from({ length: deal.stars }).map((_, i) => (
              <Star key={i} className="h-3.5 w-3.5 fill-[#FDB919] text-[#FDB919]" aria-hidden="true" />
            ))}
          </span>
          {deal.reviewEnabled && (
            <div className="mt-2">
              <ReviewBadge
                reviewPercent={deal.reviewPercent}
                reviewScore={deal.reviewScore}
                reviewMaxScore={deal.reviewMaxScore}
                reviewCount={deal.reviewCount}
                countClassName="text-black"
              />
            </div>
          )}
          <div className="mt-2 space-y-1 lg:hidden">
            <p className="flex items-center gap-1.5 text-xs text-body">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-black" aria-hidden="true" />
              {region}, {country}
            </p>
            <p className="flex items-center gap-1.5 text-xs text-body">
              <ArrivalIcon className="h-3.5 w-3.5 shrink-0 text-black" aria-hidden="true" />
              {arrivalValue}
            </p>
          </div>
        </div>
      </div>

      <div className="hidden min-w-0 px-3 pb-4 sm:px-4 lg:block">
        <ul className="divide-y divide-line">
          {facts.map((fact) => (
            <li key={fact.label} className="flex items-start gap-2.5 py-2.5">
              <fact.icon className="mt-0.5 h-4 w-4 shrink-0 text-black" aria-hidden="true" />
              <div className="min-w-0">
                <p className="text-xs font-medium text-muted">{fact.label}</p>
                <p className="text-sm font-semibold leading-snug text-ink">{fact.value}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="space-y-2 border-t border-line pt-3">
          <p className="flex items-start gap-2 text-xs font-medium leading-snug text-body">
            <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-black" aria-hidden="true" />
            {t("booking.lockPrices")}
          </p>
          <FreeCancellationBadge arrival={arrival} size="sm" />
        </div>
      </div>
    </div>
  );
}
