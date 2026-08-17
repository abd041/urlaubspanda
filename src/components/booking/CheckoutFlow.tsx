"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import type { Deal, HotelBookingConfig } from "@/types";
import { useBookingState } from "@/hooks/useBookingState";
import { BookingSummarySection } from "@/components/booking/BookingSummarySection";
import { useT } from "@/i18n/LocaleProvider";

interface CheckoutFlowProps {
  deal: Deal;
  config: HotelBookingConfig;
}

export function CheckoutFlow({ deal, config }: CheckoutFlowProps) {
  const booking = useBookingState();
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useT();
  const query = searchParams.toString();
  const hotelHref = `/hotel/${deal.slug}${query ? `?${query}` : ""}`;
  const ready = Boolean(booking.arrival) && booking.allRoomsConfirmed;

  useEffect(() => {
    if (!ready) router.replace(hotelHref);
  }, [ready, hotelHref, router]);

  if (!booking.arrival || !ready) {
    return (
      <main className="min-h-screen bg-surface">
        <div className="mx-auto w-[calc(100%-2rem)] max-w-[1240px] animate-pulse py-10 sm:w-[calc(100%-3rem)] lg:w-[calc(100%-4rem)]">
          <div className="h-64 rounded-2xl bg-white shadow-sm" />
        </div>
      </main>
    );
  }

  return (
    <main className="w-full min-w-0 overflow-x-clip bg-surface pb-16">
      <div className="mx-auto w-[calc(100%-2rem)] max-w-[1240px] pt-4 sm:w-[calc(100%-3rem)] sm:pt-6 lg:w-[calc(100%-4rem)]">
        <Link
          href={hotelHref}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-body transition hover:text-brand-500"
        >
          <ChevronLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
          {t("booking.backToRooms")}
        </Link>
      </div>

      <div className="mx-auto mt-5 w-[calc(100%-2rem)] max-w-[1240px] sm:w-[calc(100%-3rem)] lg:w-[calc(100%-4rem)]">
        <BookingSummarySection
          deal={deal}
          rooms={booking.rooms}
          roomCategories={config.roomCategories}
          offers={config.offers}
          arrival={booking.arrival}
          nights={booking.nights}
          childPricingRules={config.childPricingRules}
        />
      </div>
    </main>
  );
}
