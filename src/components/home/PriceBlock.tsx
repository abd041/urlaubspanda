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

export function PriceBlock({ oldPrice, currentPrice, discountPercent, action }: PriceBlockProps) {
  const savings = Math.max(oldPrice - currentPrice, 0);
  const { locale } = useLocale();
  const t = useT();

  return (
    <div className="flex flex-col items-center text-center">
      {savings > 0 && (
        <p className="text-[13px] font-semibold text-success">
          {t("deal.youSave", { amount: formatSavingsEuro(savings, locale) })}
          {discountPercent > 0 ? ` (−${discountPercent}%)` : ""}
        </p>
      )}
      {oldPrice > currentPrice && (
        <p className="mt-0.5 text-[13px] font-semibold text-danger line-through">
          {formatEuro(oldPrice, locale)}
        </p>
      )}
      <p className="mt-1 flex flex-wrap items-baseline justify-center gap-x-1.5 gap-y-0.5">
        <span className="text-[13px] text-muted">{t("deal.from")}</span>
        <span className="text-[1.75rem] font-extrabold leading-none tracking-tight text-ink">
          {formatEuro(currentPrice, locale)}
        </span>
        <span className="text-[12px] text-muted">{t("deal.perPerson")}</span>
      </p>
      {action ? <div className="mt-3 flex w-full justify-center">{action}</div> : null}
    </div>
  );
}
