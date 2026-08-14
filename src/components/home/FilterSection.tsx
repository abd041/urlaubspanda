"use client";

import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import {
  filterOptions,
  HOMEPAGE_FILTER_KEYS,
  HOMEPAGE_MOBILE_PREVIEW_KEYS,
} from "@/data/filters";
import { Container } from "@/components/layout/Container";
import { FilterChip } from "@/components/home/FilterChip";
import { FilterModal } from "@/components/home/FilterModal";
import { cn } from "@/lib/utils";
import type { FilterKey } from "@/types";
import { useLocale, useT } from "@/i18n/LocaleProvider";
import { filterLabel } from "@/i18n/content";
import { AnimatePresence, Reveal, easePremium, motion } from "@/components/motion/Reveal";

interface FilterSectionProps {
  selected: FilterKey[];
  isSelected: (key: FilterKey) => boolean;
  toggle: (key: FilterKey) => void;
  remove: (key: FilterKey) => void;
  reset: () => void;
  /** Scoped subset of filters to display, e.g. destination-specific filters on country pages. Defaults to the full homepage set. */
  filterKeys?: FilterKey[];
}

export function FilterSection({
  selected,
  isSelected,
  toggle,
  remove,
  reset,
  filterKeys = HOMEPAGE_FILTER_KEYS,
}: FilterSectionProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const visibleOptions = filterOptions.filter((option) => filterKeys.includes(option.key));
  const t = useT();
  const { locale } = useLocale();
  const collapseOnMobile = visibleOptions.length > 8;

  return (
    <section aria-labelledby="reisearten-heading" className="py-12 sm:py-14 lg:py-16">
      <Container>
        <Reveal className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
          <div className="min-w-0 max-w-2xl">
            <h2
              id="reisearten-heading"
              className="text-[1.75rem] font-medium tracking-[-0.03em] text-ink sm:text-[2.125rem] xl:text-[2.375rem] xl:leading-[1.12]"
            >
              {t("home.travelTypesTitle")}
            </h2>
            <p className="mt-2 text-[15px] font-normal leading-relaxed text-body sm:text-base">
              {t("home.travelTypesSubtitle")}
            </p>
          </div>
          {selected.length > 0 && (
            <button
              type="button"
              onClick={reset}
              className="shrink-0 text-sm font-semibold text-brand-500 underline-offset-4 transition hover:text-brand-600 hover:underline"
            >
              {t("filter.reset")}
            </button>
          )}
        </Reveal>

        <Reveal className="mt-8 sm:mt-9">
          <div className="no-scrollbar flex snap-x-mandatory gap-3 overflow-x-auto pb-1 lg:flex-wrap lg:overflow-visible">
            {visibleOptions.map((option) => {
              const mobileHidden =
                collapseOnMobile && !HOMEPAGE_MOBILE_PREVIEW_KEYS.includes(option.key);
              return (
                <FilterChip
                  key={option.key}
                  label={filterLabel(option.key, locale)}
                  icon={option.icon}
                  selected={isSelected(option.key)}
                  onToggle={() => toggle(option.key)}
                  className={cn("snap-start", mobileHidden && "max-md:hidden")}
                />
              );
            })}
          </div>
        </Reveal>

        {collapseOnMobile && (
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2.5 text-sm font-semibold text-ink shadow-[0_6px_18px_rgba(15,26,43,0.05)] transition hover:border-brand-200 hover:text-brand-600 md:hidden"
          >
            <SlidersHorizontal className="h-4 w-4 text-brand-500" aria-hidden="true" />
            {t("filter.showAll")}
          </button>
        )}

        <AnimatePresence initial={false}>
          {selected.length > 0 && (
            <motion.div
              key="selected-filters"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.28, ease: easePremium }}
              className="overflow-hidden"
            >
              <div className="mt-6 flex flex-wrap items-center gap-2">
                <AnimatePresence initial={false} mode="popLayout">
                  {selected.map((key) => {
                    const option = filterOptions.find((item) => item.key === key);
                    if (!option) return null;
                    return (
                      <motion.span
                        key={key}
                        layout
                        initial={{ opacity: 0, scale: 0.94 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.94 }}
                        transition={{ duration: 0.22, ease: easePremium }}
                        className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 py-1 pl-3 pr-1 text-xs font-semibold text-brand-700"
                      >
                        {filterLabel(key, locale)}
                        <button
                          type="button"
                          onClick={() => remove(key)}
                          aria-label={t("filter.remove", { label: filterLabel(key, locale) })}
                          className={cn(
                            "flex h-6 w-6 items-center justify-center rounded-full text-brand-500 transition hover:bg-white hover:text-ink"
                          )}
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </motion.span>
                    );
                  })}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>

      <FilterModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        isSelected={isSelected}
        toggle={toggle}
        reset={reset}
        selectedCount={selected.length}
        filterKeys={filterKeys}
      />
    </section>
  );
}
