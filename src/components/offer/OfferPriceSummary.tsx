"use client";

import type { Deal } from "@/types";
import { localeTag } from "@/i18n/config";
import { useLocale, useT } from "@/i18n/LocaleProvider";
import { cn } from "@/lib/utils";

function formatOfferEuro(value: number, locale: "de" | "en") {
  const whole = Number.isInteger(value);
  return `${new Intl.NumberFormat(localeTag(locale), {
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: whole ? 0 : 2,
  }).format(value)} €`;
}

/** Shared offer price stack: savings → old → current. */
export function OfferPriceSummary({ deal, size = "default" }: { deal: Deal; size?: "default" | "lg" }) {
  const t = useT();
  const { locale } = useLocale();
  const savings = Math.max(deal.oldPrice - deal.currentPrice, 0);
  const large = size === "lg";

  return (
    <div className="text-center lg:text-left">
      {savings > 0 && (
        <p className="text-[13px] font-semibold text-success">
          {t("deal.youSave", { amount: formatOfferEuro(savings, locale) })}
          {deal.discountPercent > 0 ? ` (−${deal.discountPercent}%)` : ""}
        </p>
      )}
      {deal.oldPrice > deal.currentPrice && (
        <p className="mt-1 text-[13px] font-semibold text-danger line-through">
          {formatOfferEuro(deal.oldPrice, locale)}
        </p>
      )}
      <p className="mt-1 flex flex-wrap items-baseline justify-center gap-x-2 gap-y-0.5 md:flex-nowrap lg:justify-start">
        <span className="shrink-0 text-[13px] text-muted">{t("deal.from")}</span>
        <span className="inline-flex shrink-0 items-baseline whitespace-nowrap">
          <span
            className={cn(
              "font-extrabold leading-none tracking-tight text-ink",
              large ? "text-[1.85rem]" : "text-[1.65rem]"
            )}
          >
            {formatOfferEuro(deal.currentPrice, locale)}
          </span>
          <span className="ml-1.5 shrink-0 text-[12px] font-normal leading-none text-muted">
            {t("deal.perPerson")}
          </span>
        </span>
      </p>
      <p className="mt-2 text-[12px] font-medium text-ink">
        {t("offer.totalTwoAdults", { price: formatOfferEuro(deal.currentPrice * 2, locale) })}
      </p>
    </div>
  );
}
