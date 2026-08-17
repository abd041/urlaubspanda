"use client";

import type { Deal } from "@/types";
import { localeTag } from "@/i18n/config";
import { useLocale, useT } from "@/i18n/LocaleProvider";

function formatOfferEuro(value: number, locale: "de" | "en") {
  const whole = Number.isInteger(value);
  return `${new Intl.NumberFormat(localeTag(locale), {
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: whole ? 0 : 2,
  }).format(value)} €`;
}

/** Shared offer price stack: old → current → savings. Used by sidebar + mobile. */
export function OfferPriceSummary({ deal, size = "default" }: { deal: Deal; size?: "default" | "lg" }) {
  const t = useT();
  const { locale } = useLocale();
  const savings = Math.max(deal.oldPrice - deal.currentPrice, 0);
  const large = size === "lg";

  return (
    <div>
      {deal.oldPrice > deal.currentPrice && (
        <p className="text-[13px] font-semibold text-danger line-through">{formatOfferEuro(deal.oldPrice, locale)}</p>
      )}
      <p className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
        <span className="text-[13px] text-muted">{t("deal.from")}</span>
        <span
          className={
            large
              ? "text-[2.15rem] font-extrabold leading-none tracking-tight text-ink"
              : "text-[1.85rem] font-extrabold leading-none tracking-tight text-ink"
          }
        >
          {formatOfferEuro(deal.currentPrice, locale)}
        </span>
        <span className="text-[12px] text-muted">{t("deal.perPerson")}</span>
      </p>
      {savings > 0 && (
        <p className="mt-2.5 inline-flex items-center rounded-full bg-[#E8F6EE] px-2.5 py-0.5 text-[12px] font-medium text-success">
          {t("deal.youSave", { amount: formatOfferEuro(savings, locale) })}
          {deal.discountPercent > 0 ? ` (−${deal.discountPercent}%)` : ""}
        </p>
      )}
      <p className="mt-2 text-[12px] font-medium text-ink">
        {t("offer.totalTwoAdults", { price: formatOfferEuro(deal.currentPrice * 2, locale) })}
      </p>
    </div>
  );
}
