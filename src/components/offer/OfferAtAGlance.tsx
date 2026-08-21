"use client";

import { CalendarDays, MapPin, Moon, Star, UtensilsCrossed } from "lucide-react";
import type { Deal, OfferDetail } from "@/types";
import { useLocale, useT } from "@/i18n/LocaleProvider";
import { countryDisplayName, mealPlanLabel, nightLabel, tx } from "@/i18n/content";

type GlanceItem = {
  icon: typeof UtensilsCrossed;
  label: string;
  value: string;
};

/**
 * “Auf einen Blick” — two-column fact cards (last card full-width when odd).
 * Matches the client card-grid reference on desktop and mobile.
 */
export function OfferAtAGlance({
  deal,
  detail,
}: {
  deal: Deal;
  detail?: OfferDetail;
}) {
  const t = useT();
  const { locale } = useLocale();
  const place = tx(deal.destinationRegion.split(" · ")[0] ?? deal.destinationRegion, locale);
  const country = countryDisplayName(deal.destinationCountry, locale);
  const superior = detail?.starsSuperior === true;

  const items: GlanceItem[] = [
    {
      icon: UtensilsCrossed,
      label: t("offer.meal"),
      value: mealPlanLabel(deal.mealPlan, locale),
    },
    {
      icon: Moon,
      label: t("offer.duration"),
      value: nightLabel(deal.nights, locale),
    },
    {
      icon: CalendarDays,
      label: t("offer.travelTime"),
      value: deal.dateRange,
    },
    {
      icon: Star,
      label: t("offer.category"),
      value: superior
        ? t("offer.hotelSuperior", { stars: deal.stars })
        : t("offer.hotelStars", { stars: deal.stars }),
    },
    {
      icon: MapPin,
      label: t("offer.location"),
      value: `${place}, ${country}`,
    },
  ];

  return (
    <section aria-labelledby="auf-einen-blick-heading">
      <h2
        id="auf-einen-blick-heading"
        className="text-[1.75rem] font-medium tracking-[-0.03em] text-ink sm:text-[2.125rem]"
      >
        {t("offer.glance")}
      </h2>
      <ul className="mt-5 grid gap-3 sm:mt-6 sm:grid-cols-2">
        {items.map((item, index) => {
          const fullWidth = index === items.length - 1 && items.length % 2 === 1;
          return (
            <li
              key={item.label}
              className={
                fullWidth
                  ? "flex items-start gap-3 rounded-2xl border border-[rgba(15,23,42,0.07)] bg-white p-4 shadow-[0_1px_2px_rgba(15,26,43,0.04),0_8px_20px_rgba(15,26,43,0.045)] sm:col-span-2 sm:p-5"
                  : "flex items-start gap-3 rounded-2xl border border-[rgba(15,23,42,0.07)] bg-white p-4 shadow-[0_1px_2px_rgba(15,26,43,0.04),0_8px_20px_rgba(15,26,43,0.045)] sm:p-5"
              }
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[rgba(27,99,235,0.12)] bg-[#F4F8FF] text-brand-500">
                <item.icon className="h-[18px] w-[18px]" aria-hidden="true" strokeWidth={1.5} />
              </span>
              <span className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-600">
                  {item.label}
                </p>
                <p className="mt-1 text-[15px] font-semibold leading-snug text-ink">{item.value}</p>
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
