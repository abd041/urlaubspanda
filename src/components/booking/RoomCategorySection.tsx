"use client";

import { useState } from "react";
import { calculateStayPrice } from "@/lib/pricingEngine";
import type { ChildPricingRule, RoomCategoryDetail } from "@/types";
import type { RoomSelection } from "@/hooks/useBookingState";
import { RoomCategoryCard } from "@/components/booking/RoomCategoryCard";
import { RoomDetailsModal } from "@/components/booking/RoomDetailsModal";
import { useT } from "@/i18n/LocaleProvider";

interface RoomCategorySectionProps {
  roomCategories: RoomCategoryDetail[];
  occupancy: RoomSelection;
  arrival: Date;
  nights: number;
  childPricingRules: ChildPricingRule[];
  selectedRoomCategoryId: string | null;
  onSelect: (roomCategoryId: string | null) => void;
}

/**
 * Room category picker. Mobile lists every room (no “Show more”); desktop grid.
 * Cards are fully tappable; selected border stays fully visible (req 14 + 18).
 */
export function RoomCategorySection({
  roomCategories,
  occupancy,
  arrival,
  nights,
  childPricingRules,
  selectedRoomCategoryId,
  onSelect,
}: RoomCategorySectionProps) {
  const [detailsRoom, setDetailsRoom] = useState<RoomCategoryDetail | null>(null);
  const t = useT();

  const travelerCount = occupancy.adults + occupancy.childAges.length;

  const renderCards = () =>
    roomCategories.map((room) => {
      const unavailable = travelerCount > room.maxOccupancy || travelerCount < room.minOccupancy;
      const stay = calculateStayPrice({
        room,
        arrival,
        nights,
        adults: occupancy.adults,
        childAges: occupancy.childAges,
        childPricingRules,
      });

      return (
        <RoomCategoryCard
          key={room.id}
          room={room}
          selected={selectedRoomCategoryId === room.id}
          unavailable={unavailable}
          unavailableReason={
            unavailable
              ? travelerCount > room.maxOccupancy || travelerCount < room.minOccupancy
                ? t("booking.unavailableFor")
                : t("booking.unavailablePeriod")
              : undefined
          }
          pricePerPerson={stay.perPerson}
          pricePerRoom={stay.total}
          onSelect={() => onSelect(selectedRoomCategoryId === room.id ? null : room.id)}
          onShowDetails={() => setDetailsRoom(room)}
        />
      );
    });

  return (
    <div>
      <h3 className="text-lg font-bold text-ink">{t("booking.step3")}</h3>
      <p className="mt-1 text-sm text-muted">{t("booking.step3Text")}</p>

      {/* Mobile: all rooms in a vertical list — no carousel / “show more” */}
      <div className="mt-4 space-y-4 px-0.5 py-1 lg:hidden">{renderCards()}</div>

      <div className="mt-5 hidden gap-5 overflow-visible py-1.5 lg:grid lg:grid-cols-2 xl:grid-cols-3 xl:gap-6">
        {renderCards()}
      </div>

      <RoomDetailsModal room={detailsRoom} onClose={() => setDetailsRoom(null)} />
    </div>
  );
}
