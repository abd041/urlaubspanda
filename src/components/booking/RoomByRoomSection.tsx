"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Deal, HotelBookingConfig } from "@/types";
import type { UseBookingStateReturn } from "@/hooks/useBookingState";
import { RoomCategorySection } from "@/components/booking/RoomCategorySection";
import { OfferListSection } from "@/components/booking/OfferListSection";
import { RoomConfirmedSummary } from "@/components/booking/RoomConfirmedSummary";
import { useT } from "@/i18n/LocaleProvider";
import { SITE_URL } from "@/lib/site";

interface RoomByRoomSectionProps {
  deal: Deal;
  config: HotelBookingConfig;
  booking: UseBookingStateReturn;
}

/**
 * Guides the customer through room configuration one room at a time when
 * more than one room was requested (spec: "Multiple Rooms"). Earlier rooms
 * collapse into a confirmed summary; only the room currently being
 * configured shows the full room-category + offer selection.
 */
export function RoomByRoomSection({ deal, config, booking }: RoomByRoomSectionProps) {
  const t = useT();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.toString();
  const shareUrl = `${SITE_URL}${pathname}${query ? `?${query}` : ""}`;
  const { rooms, nights, arrival, departure, activeRoomIndex, setRoomCategory, confirmRoomOffer, editRoom } = booking;
  if (!arrival || !departure) return null;

  return (
    <div className="space-y-4">
      {rooms.map((room, index) => {
        if (index < activeRoomIndex) {
          const category = config.roomCategories.find((r) => r.id === room.roomCategoryId);
          const offer = config.offers.find((o) => o.id === room.offerId);
          if (!category || !offer) return null;
          return (
            <RoomConfirmedSummary
              key={index}
              roomIndex={index}
              totalRooms={rooms.length}
              room={category}
              offer={offer}
              occupancy={room}
              arrival={arrival}
              nights={nights}
              childPricingRules={config.childPricingRules}
              onEdit={() => editRoom(index)}
            />
          );
        }

        if (index !== activeRoomIndex) return null;

        const ctaLabel = rooms.length > 1 ? t("booking.selectRoomN", { n: index + 1 }) : t("booking.toBooking");

        return (
          <div key={index} className="w-full space-y-6 rounded-2xl border border-[#eeeef2] bg-white p-4 shadow-[0_8px_24px_rgba(15,26,43,0.08)] sm:p-6 lg:p-8">
            {rooms.length > 1 && (
              <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1.5 text-xs font-bold text-brand-600">
                {t("booking.roomOf", { n: index + 1, total: rooms.length })}
              </div>
            )}
            <RoomCategorySection
              roomCategories={config.roomCategories}
              occupancy={room}
              arrival={arrival}
              nights={nights}
              childPricingRules={config.childPricingRules}
              selectedRoomCategoryId={room.roomCategoryId}
              onSelect={(roomCategoryId) => setRoomCategory(index, roomCategoryId)}
            />
            <OfferListSection
              offers={config.offers}
              roomCategories={config.roomCategories}
              selectedRoomCategoryId={room.roomCategoryId}
              occupancy={room}
              arrival={arrival}
              departure={departure}
              nights={nights}
              childPricingRules={config.childPricingRules}
              ctaLabel={ctaLabel}
              dealId={deal.id}
              shareUrl={shareUrl}
              onBook={(offerId, roomCategoryId, mealPlanId, cancellationSelected) =>
                confirmRoomOffer(index, roomCategoryId, offerId, mealPlanId, cancellationSelected)
              }
            />
          </div>
        );
      })}

      {activeRoomIndex >= rooms.length && (
        <Link
          href={`/hotel/${deal.slug}/checkout${query ? `?${query}` : ""}`}
          className="inline-flex h-14 w-full items-center justify-center gap-1.5 rounded-xl bg-brand-500 text-sm font-bold text-white shadow-[0_8px_20px_rgba(27,99,235,0.22)] transition hover:bg-brand-600"
        >
          {t("booking.toBooking")}
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}
