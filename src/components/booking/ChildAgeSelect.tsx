"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useT } from "@/i18n/LocaleProvider";

/** Ages 0–17 (under 18). Exact age is confirmed at checkout. */
const AGE_OPTIONS = Array.from({ length: 18 }, (_, age) => age);

interface ChildAgeSelectProps {
  index: number;
  age: number | undefined;
  onChange: (age: number) => void;
}

function ageLabel(age: number, t: ReturnType<typeof useT>) {
  return age === 0 ? t("booking.underOne") : t("booking.years", { n: age });
}

/** Custom age picker — matches site dropdowns; avoids native OS select chrome. */
export function ChildAgeSelect({ index, age, onChange }: ChildAgeSelectProps) {
  const t = useT();
  const listId = useId();
  const labelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const hasValue = typeof age === "number";

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-lg bg-surface px-3 py-2.5">
      <span id={labelId} className="shrink-0 text-sm leading-snug text-body">
        {t("booking.childAge", { n: index + 1 })}
      </span>

      <div ref={rootRef} className="relative w-[10.25rem] max-w-full shrink-0">
        <button
          type="button"
          aria-labelledby={labelId}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          onClick={() => setOpen((prev) => !prev)}
          className={cn(
            "flex h-10 w-full items-center justify-between gap-2 rounded-xl border bg-white py-2 pl-3 pr-2.5 text-left text-sm font-semibold text-ink transition",
            open
              ? "border-brand-500 shadow-[0_0_0_3px_rgba(27,99,235,0.14)]"
              : "border-[rgba(15,23,42,0.10)] hover:border-brand-300 hover:shadow-[0_2px_8px_rgba(15,26,43,0.06)]",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
          )}
        >
          <span className={cn("min-w-0 truncate", !hasValue && "font-medium text-muted")}>
            {hasValue ? ageLabel(age, t) : t("booking.chooseAge")}
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 text-brand-500 transition-transform duration-200",
              open && "rotate-180"
            )}
            aria-hidden="true"
          />
        </button>

        {open && (
          <ul
            id={listId}
            role="listbox"
            aria-labelledby={labelId}
            className="absolute left-0 top-[calc(100%+0.4rem)] z-50 max-h-60 w-[11.5rem] overflow-y-auto overscroll-contain rounded-xl border border-[rgba(15,23,42,0.08)] bg-white py-1.5 shadow-[0_16px_40px_rgba(15,26,43,0.16)]"
          >
            {AGE_OPTIONS.map((value) => {
              const selected = age === value;
              return (
                <li key={value} role="option" aria-selected={selected}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(value);
                      setOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left text-sm transition",
                      selected
                        ? "bg-[#F4F8FF] font-semibold text-brand-600"
                        : "font-medium text-ink hover:bg-surface"
                    )}
                  >
                    <span className="min-w-0 truncate">{ageLabel(value, t)}</span>
                    {selected && (
                      <Check className="h-4 w-4 shrink-0 text-brand-500" aria-hidden="true" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
