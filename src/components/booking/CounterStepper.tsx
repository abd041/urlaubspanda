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
  value,
  min,
  max,
  onChange,
}: CounterStepperProps) {
  const t = useT();
  return (
    <div className="flex w-full min-w-0 items-center justify-between gap-3">
      <div className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden">
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
      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={() => onChange(Math.max(value - 1, min))}
          disabled={value <= min}
          aria-label={t("booking.decrease", { label })}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-500 text-brand-500 transition hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 sm:h-8 sm:w-8"
        >
          <Minus className="h-4 w-4" aria-hidden="true" />
        </button>
        <span className="w-6 text-center text-base font-bold tabular-nums text-ink" aria-live="polite">
          {value}
        </span>
        <button
          type="button"
          onClick={() => onChange(Math.min(value + 1, max))}
          disabled={value >= max}
          aria-label={t("booking.increase", { label })}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-500 text-brand-500 transition hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 sm:h-8 sm:w-8"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
