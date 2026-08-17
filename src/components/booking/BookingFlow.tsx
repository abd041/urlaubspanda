"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Deal, HotelBookingConfig } from "@/types";
import { useBookingState } from "@/hooks/useBookingState";
import { getCheapestRoom } from "@/lib/pricingEngine";
import { Container } from "@/components/layout/Container";
import { TravelerRoomSelector } from "@/components/booking/TravelerRoomSelector";
import { NightsSelector } from "@/components/booking/NightsSelector";
import { BookingCalendar } from "@/components/booking/BookingCalendar";
import { HotelSummarySidebar } from "@/components/booking/HotelSummarySidebar";
import { RoomByRoomSection } from "@/components/booking/RoomByRoomSection";
import { BookingSummarySection } from "@/components/booking/BookingSummarySection";
import { useT } from "@/i18n/LocaleProvider";

interface BookingFlowProps {
  deal: Deal;
  config: HotelBookingConfig;
}

export function BookingFlow({ deal, config }: BookingFlowProps) {
  const booking = useBookingState();
  const cheapestRoom = getCheapestRoom(config.roomCategories);
  const t = useT();
  const [step1Continued, setStep1Continued] = useState(false);

  const scrollToRoomSelection = () => {
    setStep1Continued(true);
    document.getElementById("zimmer-wahl")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="w-full min-w-0 overflow-x-clip bg-surface pb-24 lg:pb-16">
      <Container className="max-w-[1180px] pt-4 sm:pt-6">
        <Link
          href={`/angebot/${deal.slug}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-body transition hover:text-brand-500"
        >
          <ChevronLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
          {t("booking.back")}
        </Link>
      </Container>

      <Container className="mt-5 max-w-[1180px]">
        <div className="flex w-full min-w-0 flex-col lg:flex-row lg:items-start lg:gap-8">
          <div className="order-last w-full min-w-0 max-w-full flex-1 space-y-6 lg:order-none">
            <section className="w-full min-w-0 max-w-full [contain:inline-size] lg:rounded-2xl lg:border lg:border-[#eeeef2] lg:bg-white lg:p-7 lg:shadow-[0_8px_24px_rgba(15,26,43,0.08)]">
              <h1 className="text-[1.35rem] font-extrabold leading-snug tracking-tight text-ink sm:text-2xl">{t("booking.step1")}</h1>
              <p className="mt-1 max-w-full text-sm leading-relaxed break-words text-muted">
                {t("booking.step1Text")}
              </p>

              <div className="mt-5 rounded-2xl border border-[#eeeef2] bg-white p-3 shadow-[0_8px_24px_rgba(15,26,43,0.08)] sm:p-4 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">
                <TravelerRoomSelector
                  rooms={booking.rooms}
                  onRoomOccupancyChange={booking.setRoomOccupancy}
                  onRoomsCountChange={booking.setRoomsCount}
                />
              </div>

              <div className="mt-6">
                <NightsSelector
                  nights={booking.nights}
                  minStay={config.minStayNights}
                  maxStay={config.maxStayNights}
                  rooms={booking.rooms}
                  cheapestRoom={cheapestRoom}
                  childPricingRules={config.childPricingRules}
                  onChange={booking.setNights}
                />
              </div>

              <div className="mt-6">
                <BookingCalendar
                  arrival={booking.arrival}
                  departure={booking.departure}
                  nights={booking.nights}
                  rooms={booking.rooms}
                  cheapestRoom={cheapestRoom}
                  childPricingRules={config.childPricingRules}
                  onSelectArrival={booking.setArrival}
                  onContinue={scrollToRoomSelection}
                />
              </div>
            </section>

            {booking.arrival && booking.departure && (
              <div id="zimmer-wahl">
                <RoomByRoomSection deal={deal} config={config} booking={booking} />
              </div>
            )}

            {booking.allRoomsConfirmed && booking.arrival && (
              <section className="rounded-2xl border border-[#eeeef2] bg-surface p-4 sm:p-6">
                <BookingSummarySection
                  deal={deal}
                  rooms={booking.rooms}
                  roomCategories={config.roomCategories}
                  offers={config.offers}
                  arrival={booking.arrival}
                  nights={booking.nights}
                  childPricingRules={config.childPricingRules}
                />
              </section>
            )}
          </div>

          <aside className="order-first mb-6 w-full min-w-0 shrink-0 lg:order-none lg:mb-0 lg:sticky lg:top-24 lg:w-[340px]">
            <HotelSummarySidebar
              deal={deal}
              config={config}
              nights={booking.nights}
              arrival={booking.arrival}
              departure={booking.departure}
              rooms={booking.rooms}
            />
          </aside>
        </div>
      </Container>

      {!booking.allRoomsConfirmed && !step1Continued && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white p-3 lg:hidden">
          <button
            type="button"
            onClick={scrollToRoomSelection}
            disabled={!booking.arrival}
            className="inline-flex h-14 w-full items-center justify-center gap-1.5 rounded-xl bg-brand-500 text-sm font-bold text-white shadow-[0_8px_20px_rgba(27,99,235,0.22)] transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {t("booking.selectRoom")}
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      )}
    </main>
  );
}
