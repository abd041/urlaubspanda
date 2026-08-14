"use client";

import { Diamond } from "lucide-react";
import { formatEuro } from "@/lib/utils";
import { useLocale, useT } from "@/i18n/LocaleProvider";
import { localeTag } from "@/i18n/config";

interface PriceBlockProps {
  oldPrice: number;
  currentPrice: number;
  discountPercent: number;
}

/** Savings line drops trailing ",00" (e.g. "441 €"). */
function formatSavingsEuro(value: number, locale: "de" | "en") {
  if (Number.isInteger(value)) {
    return `${new Intl.NumberFormat(localeTag(locale), { maximumFractionDigits: 0 }).format(value)} €`;
  }
  return formatEuro(value, locale);
}

export function PriceBlock({ oldPrice, currentPrice, discountPercent }: PriceBlockProps) {
  const savings = Math.max(oldPrice - currentPrice, 0);
  const { locale } = useLocale();
  const t = useT();

  return (
    <div>
      {oldPrice > currentPrice && (
        <p className="text-[13px] text-muted line-through">{formatEuro(oldPrice, locale)}</p>
      )}
      <p className="mt-1 flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
        <span className="text-[13px] text-muted">{t("deal.from")}</span>
        <Diamond className="mb-0.5 h-2 w-2 shrink-0 fill-ink text-ink" aria-hidden="true" />
        <span className="text-[1.75rem] font-extrabold leading-none tracking-tight text-ink">
          {formatEuro(currentPrice, locale)}
        </span>
        <span className="text-[12px] text-muted">{t("deal.perPerson")}</span>
      </p>
      {savings > 0 && (
        <p className="mt-2.5 inline-flex items-center rounded-full bg-[#E8F6EE] px-2.5 py-0.5 text-[12px] font-medium text-success">
          {t("deal.youSave", { amount: formatSavingsEuro(savings, locale) })}
          {discountPercent > 0 ? ` (−${discountPercent}%)` : ""}
        </p>
      )}
    </div>
  );
}
