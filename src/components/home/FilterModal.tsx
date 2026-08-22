"use client";

import { useEffect, useRef, useState } from "react";
import { X, SlidersHorizontal } from "lucide-react";
import { filterOptions, HOMEPAGE_FILTER_KEYS } from "@/data/filters";
import { FilterChip } from "@/components/home/FilterChip";
import type { FilterKey } from "@/types";
import { useLocale, useT } from "@/i18n/LocaleProvider";
import { filterLabel } from "@/i18n/content";
import { AnimatePresence, easePremium, motion, useReducedMotion } from "@/components/motion/Reveal";

interface FilterModalProps {
  open: boolean;
  onClose: () => void;
  /** Currently applied filters (from URL). Copied into draft when the modal opens. */
  selected: FilterKey[];
  /** Apply draft selection and close — only called from “Anzeigen”. */
  onApply: (next: FilterKey[]) => void;
  filterKeys?: FilterKey[];
}

/**
 * Mobile “Alle Filter” sheet. Chip taps only update a local draft so the
 * modal stays open for multi-select; URL updates when the user confirms.
 */
export function FilterModal({
  open,
  onClose,
  selected,
  onApply,
  filterKeys = HOMEPAGE_FILTER_KEYS,
}: FilterModalProps) {
  const visibleOptions = filterOptions.filter((option) => filterKeys.includes(option.key));
  const panelRef = useRef<HTMLDivElement>(null);
  const t = useT();
  const { locale } = useLocale();
  const reduce = useReducedMotion();
  const [draft, setDraft] = useState<FilterKey[]>(selected);

  useEffect(() => {
    if (open) setDraft(selected);
  }, [open, selected]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const toggleDraft = (key: FilterKey) => {
    setDraft((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  };

  const handleApply = () => {
    onApply(draft);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="filter-modal"
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0.15 : 0.28, ease: easePremium }}
        >
          <button
            type="button"
            aria-label={t("filter.close")}
            onClick={onClose}
            className="absolute inset-0 bg-ink/50 backdrop-blur-[1px]"
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="filter-modal-heading"
            tabIndex={-1}
            className="relative flex max-h-[85vh] w-full flex-col rounded-t-3xl bg-white shadow-2xl outline-none sm:max-w-2xl sm:rounded-3xl"
            initial={reduce ? { opacity: 1 } : { y: 28, scale: 0.98 }}
            animate={reduce ? { opacity: 1 } : { y: 0, scale: 1 }}
            transition={{ duration: reduce ? 0.15 : 0.4, ease: easePremium }}
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-4 sm:px-6">
              <h2
                id="filter-modal-heading"
                className="flex items-center gap-2 text-lg font-semibold text-ink"
              >
                <SlidersHorizontal className="h-5 w-5 text-brand-500" aria-hidden="true" />
                {t("filter.all")}
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label={t("offer.close")}
                className="rounded-full p-2 text-body transition hover:bg-surface hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-wrap gap-3 overflow-y-auto px-5 py-5 sm:px-6">
              {visibleOptions.map((option) => (
                <FilterChip
                  key={option.key}
                  label={filterLabel(option.key, locale)}
                  icon={option.icon}
                  selected={draft.includes(option.key)}
                  onToggle={() => toggleDraft(option.key)}
                />
              ))}
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-line px-5 py-4 sm:px-6">
              <button
                type="button"
                onClick={() => setDraft([])}
                disabled={draft.length === 0}
                className="text-sm font-semibold text-body underline-offset-2 transition hover:text-ink hover:underline disabled:pointer-events-none disabled:opacity-40"
              >
                {t("filter.reset")}
              </button>
              <button
                type="button"
                onClick={handleApply}
                className="rounded-full bg-brand-500 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
              >
                {draft.length > 0
                  ? t("filter.applyCount", { count: draft.length })
                  : t("filter.apply")}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
