"use client";

import type { TravelerPriceLine } from "@/lib/pricingEngine";
import { cn } from "@/lib/utils";
import { localeTag } from "@/i18n/config";
import { useLocale, useT } from "@/i18n/LocaleProvider";

interface PriceBreakdownProps {
  lines: TravelerPriceLine[];
  /** Extra rows after travelers (meal plan, cancellation, extras…). */
  extras?: { label: string; amount: number }[];
  total: number;
  /** Optional average p.P. shown above the traveler lines. */
  perPerson?: number;
  size?: "sm" | "md";
  className?: string;
}

/** Per-adult / per-child price list ending with the stay total. */
export function PriceBreakdown({
  lines,
  extras = [],
  total,
  perPerson,
  size = "md",
  className,
}: PriceBreakdownProps) {
  const t = useT();
  const { locale } = useLocale();
  const priceFormatter = new Intl.NumberFormat(localeTag(locale), {
    minimumFractionDigits: size === "sm" ? 0 : 2,
    maximumFractionDigits: size === "sm" ? 0 : 2,
  });

  const lineLabel = (line: TravelerPriceLine) => {
    if (line.kind === "adult") return t("booking.adultPriceLine", { n: line.index });
    return t("booking.childPriceLine", {
      n: line.index,
      age: line.age === 0 ? t("booking.underOne") : t("booking.years", { n: line.age ?? 0 }),
    });
  };

  return (
    <div className={cn(className)}>
      {perPerson != null && (
        <p
          className={cn(
            "font-extrabold leading-tight tracking-tight text-ink",
            size === "md" ? "text-[1.35rem]" : "text-sm"
          )}
        >
          {t("booking.ppAmount", { price: priceFormatter.format(perPerson) })}
        </p>
      )}

      <ul className={cn("space-y-1.5", perPerson != null ? "mt-2.5" : undefined)}>
        {lines.map((line) => (
          <li
            key={`${line.kind}-${line.index}`}
            className={cn(
              "flex items-baseline justify-between gap-3 leading-snug",
              size === "md" ? "text-sm" : "text-xs"
            )}
          >
            <span className="min-w-0 text-body">{lineLabel(line)}</span>
            <span className="shrink-0 font-semibold tabular-nums text-ink">
              {priceFormatter.format(line.amount)} €
            </span>
          </li>
        ))}
        {extras.map((extra) => (
          <li
            key={extra.label}
            className={cn(
              "flex items-baseline justify-between gap-3 leading-snug",
              size === "md" ? "text-sm" : "text-xs"
            )}
          >
            <span className="min-w-0 text-body">{extra.label}</span>
            <span className="shrink-0 font-semibold tabular-nums text-ink">
              +{priceFormatter.format(extra.amount)} €
            </span>
          </li>
        ))}
      </ul>

      <div
        className={cn(
          "mt-2.5 flex items-baseline justify-between gap-3 border-t border-line pt-2.5",
          size === "md" ? "text-sm" : "text-xs"
        )}
      >
        <span className="font-extrabold text-ink">{t("booking.totalPriceLabel")}</span>
        <span
          className={cn(
            "font-extrabold tabular-nums text-ink",
            size === "md" ? "text-lg" : "text-sm"
          )}
        >
          {priceFormatter.format(total)} €
        </span>
      </div>
    </div>
  );
}
