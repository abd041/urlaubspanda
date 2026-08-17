"use client";

import { cn } from "@/lib/utils";
import { localeTag } from "@/i18n/config";
import { useLocale, useT } from "@/i18n/LocaleProvider";

interface PriceHierarchyProps {
  perPerson: number;
  total: number;
  size?: "sm" | "md" | "lg";
  invert?: boolean;
  className?: string;
}

/** Lead with p.P., then Gesamtpreis — client price hierarchy. */
export function PriceHierarchy({
  perPerson,
  total,
  size = "md",
  invert = false,
  className,
}: PriceHierarchyProps) {
  const t = useT();
  const { locale } = useLocale();
  const priceFormatter = new Intl.NumberFormat(localeTag(locale), {
    minimumFractionDigits: size === "sm" ? 0 : 2,
    maximumFractionDigits: size === "sm" ? 0 : 2,
  });

  return (
    <div className={cn(className)}>
      <p
        className={cn(
          "font-extrabold leading-tight tracking-tight",
          size === "lg" && "text-[1.75rem]",
          size === "md" && "text-[1.5rem]",
          size === "sm" && "text-sm",
          invert ? "text-white" : "text-ink"
        )}
      >
        {t("booking.ppAmount", { price: priceFormatter.format(perPerson) })}
      </p>
      <p className={cn("mt-1 leading-snug", size === "sm" ? "text-[11px]" : "text-sm", invert ? "text-white/75" : "text-muted")}>
        {t("booking.gesamtpreisLine", { price: priceFormatter.format(total) })}
      </p>
    </div>
  );
}
