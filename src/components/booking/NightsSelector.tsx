"use client";

import { calculateAggregateStayPrice } from "@/lib/pricingEngine";
import type { ChildPricingRule, RoomCategoryDetail } from "@/types";
import type { RoomSelection } from "@/hooks/useBookingState";
import { cn } from "@/lib/utils";
import { localeTag } from "@/i18n/config";
import { useLocale, useT } from "@/i18n/LocaleProvider";
import { nightLabel } from "@/i18n/content";

interface NightsSelectorProps {
  nights: number;
  minStay: number;
  maxStay: number;
  rooms: RoomSelection[];
  cheapestRoom: Pick<RoomCategoryDetail, "weekdayRate" | "weekendRate">;
  childPricingRules: ChildPricingRule[];
  onChange: (nights: number) => void;
}

/** A representative near-future date used only to estimate a realistic weekday/weekend mix before an arrival date is chosen. */
function referenceDate() {
  const date = new Date();
  date.setDate(date.getDate() + 21);
  return date;
}

export function NightsSelector({
  nights,
  minStay,
  maxStay,
  rooms,
  cheapestRoom,
  childPricingRules,
  onChange,
}: NightsSelectorProps) {
  const t = useT();
  const { locale } = useLocale();
  const options = Array.from({ length: maxStay - minStay + 1 }, (_, i) => minStay + i);
  const ref = referenceDate();

  return (
    <div>
      <h3 className="text-sm font-bold text-ink">{t("booking.nightsTitle")}</h3>
      <div className="mt-3 grid min-w-0 grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-6">
        {options.map((n) => {
          const { perPerson } = calculateAggregateStayPrice(rooms, cheapestRoom, ref, n, childPricingRules);
          const selected = n === nights;
          return (
            <button
              key={n}
              type="button"
              onClick={() => onChange(n)}
              aria-pressed={selected}
              className={cn(
                "flex min-h-11 min-w-0 flex-col items-center justify-center gap-0.5 overflow-hidden rounded-lg px-1.5 py-2.5 text-center transition duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 sm:px-2 sm:py-3",
                selected
                  ? "z-[1] border-[2.5px] border-[#F5A623] bg-[#FDB919] text-black shadow-[0_4px_14px_rgba(253,185,25,0.45),0_2px_4px_rgba(15,26,43,0.12)] ring-2 ring-[#FDB919]/55"
                  : "border border-line bg-white text-black shadow-none hover:border-[#FDB919] hover:shadow-sm"
              )}
            >
              <span className="text-xs font-bold leading-snug text-black sm:text-sm">
                {nightLabel(n, locale)}
              </span>
              <span className="text-xs font-semibold leading-snug text-black sm:text-[13px]">
                {t("booking.fromPrice", {
                  price: Math.round(perPerson).toLocaleString(localeTag(locale)),
                })}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
