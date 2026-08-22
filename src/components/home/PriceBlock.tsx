"use client";

import type { ReactNode } from "react";
import { formatEuro } from "@/lib/utils";
import { useLocale, useT } from "@/i18n/LocaleProvider";
import { localeTag } from "@/i18n/config";

interface PriceBlockProps {
  oldPrice: number;
  currentPrice: number;
  discountPercent: number;
  action?: ReactNode;
}

/** Savings line drops trailing ",00" (e.g. "441 €"). */
function formatSavingsEuro(value: number, locale: "de" | "en") {
  if (Number.isInteger(value)) {
    return `${new Intl.NumberFormat(localeTag(locale), { maximumFractionDigits: 0 }).format(value)} €`;
  }
  return formatEuro(value, locale);
}

/** Deal-card price row: savings + struck price + “ab … p.P.” left, CTA right. */
export function PriceBlock({ oldPrice, currentPrice, discountPercent, action }: PriceBlockProps) {
  const savings = Math.max(oldPrice - currentPrice, 0);
  const { locale } = useLocale();
  const t = useT();

  return (
    <div className="flex items-center justify-between gap-3 sm:gap-4">
      <div className="min-w-0 flex-1 text-left">
        {savings > 0 && (
          <p className="text-[13px] font-semibold leading-snug text-success">
            {t("deal.youSave", { amount: formatSavingsEuro(savings, locale) })}
            {discountPercent > 0 ? ` (−${discountPercent}%)` : ""}
          </p>
        )}
        {oldPrice > currentPrice && (
          <p className="mt-0.5 text-[13px] font-semibold text-danger line-through">
            {formatEuro(oldPrice, locale)}
          </p>
        )}
        <p className="mt-1 flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
          <span className="text-[13px] font-normal text-muted">{t("deal.from")}</span>
          <span className="text-[1.65rem] font-extrabold leading-none tracking-tight text-ink sm:text-[1.75rem]">
            {formatEuro(currentPrice, locale)}
          </span>
          <span className="text-[12px] font-normal text-muted">{t("deal.perPerson")}</span>
        </p>
      </div>
      {action ? <div className="shrink-0 self-center">{action}</div> : null}
    </div>
  );
}
