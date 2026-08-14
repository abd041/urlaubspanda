"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { filterOptions } from "@/data/filters";
import type { FilterKey } from "@/types";
import { useLocale, useT } from "@/i18n/LocaleProvider";
import { filterLabel, tx } from "@/i18n/content";

interface CountryFilterSidebarProps {
  filterKeys: FilterKey[];
  isSelected: (key: FilterKey) => boolean;
  toggle: (key: FilterKey) => void;
  /** Active Ort from Top-Destinationen — shown as LOCATION chip (not a full list). */
  selectedOrt?: string | null;
  onClearOrt?: () => void;
  className?: string;
}

/** Left FILTER checkbox panel (urlaubshamster country landing style). */
export function CountryFilterSidebar({
  filterKeys,
  isSelected,
  toggle,
  selectedOrt = null,
  onClearOrt,
  className,
}: CountryFilterSidebarProps) {
  const t = useT();
  const { locale } = useLocale();
  const options = filterOptions.filter((option) => filterKeys.includes(option.key));
  const ortLabel = selectedOrt ? tx(selectedOrt, locale) : "";

  return (
    <div className={cn("space-y-3", className)}>
      <aside className="h-fit rounded-2xl border border-[#E8EDF3] bg-white p-4 shadow-[0_2px_10px_rgba(15,26,43,0.04)] sm:p-5">
        <h2 className="text-xs font-bold uppercase tracking-[0.08em] text-muted">{t("filter.title")}</h2>
        <ul className="mt-4 space-y-1">
          {options.map((option) => {
            const checked = isSelected(option.key);
            return (
              <li key={option.key}>
                <label className="flex cursor-pointer items-center gap-3 rounded-lg px-1 py-2 transition hover:bg-surface">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggle(option.key)}
                    className="h-4 w-4 shrink-0 rounded border-line text-brand-500 accent-brand-500 focus:ring-brand-500"
                  />
                  <span className={cn("text-sm", checked ? "font-semibold text-ink" : "text-body")}>
                    {filterLabel(option.key, locale)}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      </aside>

      {selectedOrt && onClearOrt && (
        <div
          className="flex items-center gap-2 rounded-xl border border-brand-200 bg-brand-50 px-3 py-2.5"
          role="status"
          aria-label={`${t("country.location")}: ${ortLabel}`}
        >
          <span className="text-[11px] font-bold uppercase tracking-[0.06em] text-brand-600">
            {t("country.location")}
          </span>
          <span className="min-w-0 flex-1 truncate text-sm font-bold text-ink">{ortLabel}</span>
          <button
            type="button"
            onClick={onClearOrt}
            aria-label={t("country.removeOrt", { name: ortLabel })}
            className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-ink transition hover:bg-brand-100"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
