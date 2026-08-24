"use client";

import type { ComponentType } from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useT } from "@/i18n/LocaleProvider";

interface CounterStepperProps {
  label: string;
  sublabel?: string;
  icon?: ComponentType<{ className?: string }>;
  iconClassName?: string;
  /** Tighter label-to-controls grouping for desktop room rows. */
  compact?: boolean;
  value: number;
  min: number;
  max: number;
  onChange: (next: number) => void;
}

/** Shared "−  2  +" occupancy counter used for adults/children throughout step 1. */
export function CounterStepper({
  label,
  sublabel,
  icon: Icon,
  iconClassName,
  compact = false,
  value,
  min,
  max,
  onChange,
}: CounterStepperProps) {
  const t = useT();
  const btnClass = compact
    ? "flex h-8 w-8 items-center justify-center rounded-full border border-brand-500 text-brand-500 transition hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
    : "flex h-10 w-10 items-center justify-center rounded-full border border-brand-500 text-brand-500 transition hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 sm:h-9 sm:w-9";

  return (
    <div
      className={cn(
        "flex min-w-0 items-center",
        compact ? "w-auto gap-3" : "w-full justify-between gap-2"
      )}
    >
      <div className={cn("flex min-w-0 items-center gap-1.5 overflow-hidden", !compact && "flex-1")}>
        {Icon && (
          <span
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-500",
              iconClassName
            )}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
          </span>
        )}
        <div className="min-w-0 overflow-hidden">
          <p className="text-sm font-semibold leading-tight text-ink">{label}</p>
          {sublabel && <p className="text-xs leading-snug text-muted">{sublabel}</p>}
        </div>
      </div>
      <div className={cn("flex shrink-0 items-center", compact ? "gap-0" : "gap-0.5 sm:gap-1")}>
        <button
          type="button"
          onClick={() => onChange(Math.max(value - 1, min))}
          disabled={value <= min}
          aria-label={t("booking.decrease", { label })}
          className={btnClass}
        >
          <Minus className="h-4 w-4" aria-hidden="true" />
        </button>
        <span
          className={cn(
            "text-center font-bold tabular-nums text-ink",
            compact ? "w-5 text-sm" : "min-w-[1.25rem] px-0.5 text-base"
          )}
          aria-live="polite"
        >
          {value}
        </span>
        <button
          type="button"
          onClick={() => onChange(Math.min(value + 1, max))}
          disabled={value >= max}
          aria-label={t("booking.increase", { label })}
          className={btnClass}
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
