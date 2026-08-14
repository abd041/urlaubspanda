"use client";

import { useState } from "react";
import { calculateStayPrice } from "@/lib/pricingEngine";
import type { ChildPricingRule, RoomCategoryDetail } from "@/types";
import type { RoomSelection } from "@/hooks/useBookingState";
import { RoomCategoryCard, ShowAllRoomsCard } from "@/components/booking/RoomCategoryCard";
import { RoomDetailsModal } from "@/components/booking/RoomDetailsModal";
import { Carousel } from "@/components/ui/Carousel";
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

      <div className="mt-4 lg:hidden">
        <Carousel
          ariaLabel={t("booking.step3")}
          itemsPerPageDesktop={1}
          overlayArrows
          overlayArrowsOnMobile
          trackClassName="gap-3"
        >
          {renderCards()}
        </Carousel>
        <ShowAllRoomsCard layout="row" onClick={() => onSelect(null)} />
      </div>

      <div className="mt-4 hidden gap-4 lg:grid lg:grid-cols-4">
        {renderCards()}
        <ShowAllRoomsCard onClick={() => onSelect(null)} />
      </div>

      <RoomDetailsModal room={detailsRoom} onClose={() => setDetailsRoom(null)} />
    </div>
  );
}
