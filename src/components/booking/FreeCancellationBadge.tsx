"use client";

import { Check, CircleCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocale, useT } from "@/i18n/LocaleProvider";
import {
  formatFreeCancellationDeadline,
  hasFreeCancellation,
} from "@/lib/freeCancellation";

interface FreeCancellationBadgeProps {
  /** When set, show exact deadline (room selection / checkout). */
  arrival?: Date | null;
  size?: "sm" | "md";
  className?: string;
  /** Compact inline text without the green box (e.g. deal cards). */
  variant?: "badge" | "inline" | "checkout";
}

/**
 * Green free-cancellation label. Generic on listings/offer detail;
 * deadline form when `arrival` is provided. Paid cancel upgrades stay separate.
 */
export function FreeCancellationBadge({
  arrival = null,
  size = "sm",
  className,
  variant = "badge",
}: FreeCancellationBadgeProps) {
  const t = useT();
  const { locale } = useLocale();

  if (!hasFreeCancellation()) return null;

  const label =
    arrival != null
      ? t("booking.cancelFreeUntilDate", {
          date: formatFreeCancellationDeadline(arrival, locale),
        })
      : null;

  if (variant === "inline") {
    return (
      <p
        className={cn(
          "inline-flex items-center gap-1 font-semibold text-success",
          size === "sm" ? "text-[12px]" : "text-sm",
          className
        )}
      >
        <Check className={cn("shrink-0", size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4")} aria-hidden="true" strokeWidth={2.4} />
        {label ?? t("booking.cancelFree")}
      </p>
    );
  }

  if (variant === "checkout") {
    if (arrival == null) return null;

    return (
      <div className={cn("flex items-start gap-2.5 text-success", className)}>
        <CircleCheck
          className={cn("shrink-0", size === "sm" ? "h-5 w-5" : "h-6 w-6")}
          aria-hidden="true"
          strokeWidth={2}
        />
        <div className="flex flex-col gap-0.5">
          <span className={cn("font-bold leading-snug", size === "sm" ? "text-sm" : "text-base")}>
            {t("booking.cancelFreeCancellable")}
          </span>
          <span className={cn("font-normal leading-snug", size === "sm" ? "text-sm" : "text-base")}>
            {t("booking.cancelFreeUntilExact", {
              date: formatFreeCancellationDeadline(arrival, locale),
            })}
          </span>
        </div>
      </div>
    );
  }

  return (
    <p
      className={cn(
        "flex items-start gap-2 rounded-lg bg-[#EAF8F0] leading-snug text-success",
        size === "sm" ? "px-2.5 py-2 text-xs" : "px-3 py-2.5 text-sm",
        className
      )}
    >
      <Check
        className={cn("mt-0.5 shrink-0 text-success", size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4")}
        aria-hidden="true"
        strokeWidth={2.4}
      />
      {label ? (
        <span className="font-bold">{label}</span>
      ) : (
        <span>
          <span className="font-bold">{t("booking.cancelFree")}</span> {t("booking.cancelFreeUntil")}
        </span>
      )}
    </p>
  );
}
