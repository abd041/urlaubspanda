"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { getAmenityIcon } from "@/components/offer/amenityIcons";
import { useLocale, useT } from "@/i18n/LocaleProvider";
import { tx } from "@/i18n/content";

const VISIBLE_COUNT = 6;

export function OfferAmenities({ amenities }: { amenities: string[] }) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? amenities : amenities.slice(0, VISIBLE_COUNT);
  const hiddenCount = amenities.length - VISIBLE_COUNT;
  const t = useT();
  const { locale } = useLocale();

  if (amenities.length === 0) return null;

  return (
    <section aria-labelledby="ausstattung-heading">
      <h2
        id="ausstattung-heading"
        className="text-[1.75rem] font-medium tracking-[-0.03em] text-ink sm:text-[2.125rem]"
      >
        {t("offer.amenities")}
      </h2>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {visible.map((amenity) => {
          const Icon = getAmenityIcon(amenity);
          return (
            <li
              key={amenity}
              className="flex items-center gap-3 rounded-[1.25rem] border border-[rgba(15,23,42,0.07)] bg-white p-4 shadow-[0_1px_2px_rgba(15,26,43,0.04),0_8px_20px_rgba(15,26,43,0.045)] sm:p-5"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[rgba(27,99,235,0.12)] bg-[#F4F8FF] text-brand-500">
                <Icon className="h-[18px] w-[18px]" aria-hidden="true" strokeWidth={1.5} />
              </span>
              <span className="text-[15px] font-medium leading-snug text-ink">{tx(amenity, locale)}</span>
            </li>
          );
        })}
      </ul>

      {!expanded && hiddenCount > 0 && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-500 hover:text-brand-600"
        >
          {t("offer.showMore")}
          <ChevronDown className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
    </section>
  );
}
