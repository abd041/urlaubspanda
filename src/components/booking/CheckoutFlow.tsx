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
  const offerHref = `/angebot/${deal.slug}`;
  const ready = Boolean(booking.arrival) && booking.allRoomsConfirmed;

  useEffect(() => {
    if (!ready) router.replace(hotelHref);
  }, [ready, hotelHref, router]);

  if (!booking.arrival || !ready) {
    return (
      <main className="min-h-screen bg-surface">
        <div className="mx-auto w-[calc(100%-2rem)] max-w-[840px] animate-pulse py-10 sm:w-[calc(100%-3rem)]">
          <div className="h-64 rounded-2xl bg-white shadow-sm" />
        </div>
      </main>
    );
  }

  return (
    <main className="w-full min-w-0 overflow-x-clip bg-surface pb-8 lg:pb-12">
      <div className="mx-auto w-[calc(100%-2rem)] max-w-[840px] pt-4 sm:w-[calc(100%-3rem)] sm:pt-5">
        <Link
          href={offerHref}
          className="inline-flex items-center gap-1 text-sm font-medium text-brand-500 transition hover:text-brand-600"
        >
          <ChevronLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
          {t("booking.backToOfferList")}
        </Link>
      </div>

      <div className="mx-auto mt-4 w-[calc(100%-2rem)] max-w-[840px] sm:mt-5 sm:w-[calc(100%-3rem)]">
        <BookingSummarySection
          deal={deal}
          rooms={booking.rooms}
          roomCategories={config.roomCategories}
          offers={config.offers}
          arrival={booking.arrival}
          nights={booking.nights}
          childPricingRules={config.childPricingRules}
          offerHref={offerHref}
          addons={config.addons ?? []}
        />
      </div>
    </main>
  );
}
