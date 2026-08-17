"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { Deal, HotelBookingConfig } from "@/types";
import { useBookingState } from "@/hooks/useBookingState";
import { getCheapestRoom } from "@/lib/pricingEngine";
import { TravelerRoomSelector } from "@/components/booking/TravelerRoomSelector";
import { NightsSelector } from "@/components/booking/NightsSelector";
import { BookingCalendar } from "@/components/booking/BookingCalendar";
import { HotelSummarySidebar } from "@/components/booking/HotelSummarySidebar";
import { RoomByRoomSection } from "@/components/booking/RoomByRoomSection";
import { useT } from "@/i18n/LocaleProvider";

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function isMobileViewport() {
  return typeof window !== "undefined" && window.matchMedia("(max-width: 1023px)").matches;
}

interface BookingFlowProps {
  deal: Deal;
  config: HotelBookingConfig;
}

export function BookingFlow({ deal, config }: BookingFlowProps) {
  const booking = useBookingState();
  const cheapestRoom = getCheapestRoom(config.roomCategories);
  const t = useT();

  const scrollToRoomSelection = () => {
    window.setTimeout(() => scrollToId("zimmer-wahl"), 180);
  };

  const handleNightsChange = (nights: number) => {
    booking.setNights(nights);
    if (isMobileViewport()) {
      window.setTimeout(() => scrollToId("buchungs-kalender"), 180);
    }
  };

  return (
    <main className="w-full min-w-0 overflow-x-clip bg-surface pb-16">
      <div className="mx-auto w-[calc(100%-2rem)] max-w-[1240px] pt-4 sm:w-[calc(100%-3rem)] sm:pt-6 lg:w-[calc(100%-4rem)]">
        <Link
          href={`/angebot/${deal.slug}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-body transition hover:text-brand-500"
        >
          <ChevronLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
          {t("booking.back")}
        </Link>
      </div>

      <div className="mx-auto mt-5 w-[calc(100%-2rem)] max-w-[1240px] sm:w-[calc(100%-3rem)] lg:w-[calc(100%-4rem)]">
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
                  onChange={handleNightsChange}
                />
              </div>

              <div id="buchungs-kalender" className="mt-6 scroll-mt-24">
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
              <div id="zimmer-wahl" className="scroll-mt-24">
                <RoomByRoomSection deal={deal} config={config} booking={booking} />
              </div>
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
      </div>
    </main>
  );
}
