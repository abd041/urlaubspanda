"use client";

import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { calculateStayPrice } from "@/lib/pricingEngine";
import type { BookingOffer, ChildPricingRule, RoomCategoryDetail } from "@/types";
import type { RoomSelection } from "@/hooks/useBookingState";
import { useLocale, useT } from "@/i18n/LocaleProvider";
import { mealPlanLabel, tx } from "@/i18n/content";
import { PriceHierarchy } from "@/components/booking/PriceHierarchy";

interface RoomConfirmedSummaryProps {
  roomIndex: number;
  totalRooms: number;
  room: RoomCategoryDetail;
  offer: BookingOffer;
  occupancy: RoomSelection;
  arrival: Date;
  nights: number;
  childPricingRules: ChildPricingRule[];
  onEdit: () => void;
}

/** Collapsed "done" card shown for a room once its offer/upgrades are confirmed, while later rooms are still being configured. */
export function RoomConfirmedSummary({
  roomIndex,
  totalRooms,
  room,
  offer,
  occupancy,
  arrival,
  nights,
  childPricingRules,
  onEdit,
}: RoomConfirmedSummaryProps) {
  const t = useT();
  const { locale } = useLocale();
  const mealPlan = offer.mealPlans.find((plan) => plan.id === occupancy.mealPlanId) ?? offer.mealPlans[0];
  const baseStay = calculateStayPrice({
    room,
    arrival,
    nights,
    adults: occupancy.adults,
    childAges: occupancy.childAges,
    childPricingRules,
  });
  const total =
    baseStay.total +
    (mealPlan?.supplementTotal ?? 0) +
    (occupancy.cancellationSelected ? offer.cancellation?.supplementTotal ?? 0 : 0);
  const perPerson = total / Math.max(baseStay.travelerCount, 1);

  const occupancyLine = [
    t("booking.adultsCount", { count: occupancy.adults }),
    occupancy.childAges.length > 0 ? t("booking.childrenCount", { count: occupancy.childAges.length }) : null,
    mealPlan ? mealPlanLabel(mealPlan.label, locale) : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-success/30 bg-success/5 p-4">
      <div className="relative h-14 w-16 shrink-0 overflow-hidden rounded-lg">
        <Image src={room.images[0]} alt={tx(room.name, locale)} fill sizes="64px" className="object-cover" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-1.5 text-xs font-semibold text-success">
          <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
          {totalRooms > 1
            ? t("booking.roomSelectedOf", { n: roomIndex + 1, total: totalRooms })
            : t("booking.roomSelected")}
        </p>
        <p className="truncate text-sm font-bold text-ink">{tx(room.name, locale)}</p>
        <p className="truncate text-xs text-muted">{occupancyLine}</p>
      </div>
      <div className="text-right">
        <PriceHierarchy perPerson={perPerson} total={total} size="sm" className="text-right" />
        <button type="button" onClick={onEdit} className="mt-1 text-xs font-semibold text-brand-500 hover:underline">
          {t("booking.edit")}
        </button>
      </div>
    </div>
  );
}
