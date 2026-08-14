"use client";

import { useState } from "react";
import type { BookingOffer, ChildPricingRule, RoomCategoryDetail } from "@/types";
import type { RoomSelection } from "@/hooks/useBookingState";
import { OfferBookingCard } from "@/components/booking/OfferBookingCard";
import { RoomDetailsModal } from "@/components/booking/RoomDetailsModal";
import { formatDateLocale } from "@/lib/pricingEngine";
import { useLocale, useT } from "@/i18n/LocaleProvider";
import { nightLabel } from "@/i18n/content";

interface OfferListSectionProps {
  offers: BookingOffer[];
  roomCategories: RoomCategoryDetail[];
  selectedRoomCategoryId: string | null;
  occupancy: RoomSelection;
  arrival: Date;
  departure: Date;
  nights: number;
  childPricingRules: ChildPricingRule[];
  ctaLabel: string;
  dealId: string;
  shareUrl: string;
  onBook: (offerId: string, roomCategoryId: string, mealPlanId: string, cancellationSelected: boolean) => void;
}

export function OfferListSection({
  offers,
  roomCategories,
  selectedRoomCategoryId,
  occupancy,
  arrival,
  departure,
  nights,
  childPricingRules,
  ctaLabel,
  dealId,
  shareUrl,
  onBook,
}: OfferListSectionProps) {
  const t = useT();
  const { locale } = useLocale();
  const [detailsRoom, setDetailsRoom] = useState<RoomCategoryDetail | null>(null);
  const visibleOffers = selectedRoomCategoryId
    ? offers.filter((offer) => offer.roomCategoryId === selectedRoomCategoryId)
    : offers;

  return (
    <div>
      <h3 className="text-lg font-bold text-ink">{t("booking.step4")}</h3>
      <p className="mt-1 text-sm text-muted">
        {t("booking.step4Text", {
          from: formatDateLocale(arrival, locale),
          to: formatDateLocale(departure, locale),
          duration: nightLabel(nights, locale),
        })}
      </p>

      <div className="mt-4 space-y-3">
        {visibleOffers.length === 0 && (
          <p className="rounded-xl border border-dashed border-line p-6 text-center text-sm text-muted">
            {t("booking.noOffer")} {t("booking.noOfferHint")}
          </p>
        )}
        {visibleOffers.map((offer) => {
          const room = roomCategories.find((r) => r.id === offer.roomCategoryId);
          if (!room) return null;
          return (
            <OfferBookingCard
              key={offer.id}
              offer={offer}
              room={room}
              occupancy={occupancy}
              arrival={arrival}
              nights={nights}
              childPricingRules={childPricingRules}
              ctaLabel={ctaLabel}
              dealId={dealId}
              shareUrl={shareUrl}
              onShowRoomDetails={() => setDetailsRoom(room)}
              onBook={(mealPlanId, cancellationSelected) =>
                onBook(offer.id, room.id, mealPlanId, cancellationSelected)
              }
            />
          );
        })}
      </div>
      <RoomDetailsModal room={detailsRoom} onClose={() => setDetailsRoom(null)} />
    </div>
  );
}
