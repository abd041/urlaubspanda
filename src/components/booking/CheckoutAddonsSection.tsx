"use client";

import { Minus, Plus } from "lucide-react";
import type { CheckoutAddon } from "@/types";
import { checkoutInputClass } from "@/components/booking/BillingContactSection";
import { useLocale, useT } from "@/i18n/LocaleProvider";
import { localeTag } from "@/i18n/config";
import { tx } from "@/i18n/content";
import { cn } from "@/lib/utils";

const cardClass = "rounded-2xl border border-[#e8eaef] bg-white p-4 shadow-[0_4px_16px_rgba(15,26,43,0.06)] sm:p-5";

export type AddonSelectionState = Record<string, { selected: boolean; quantity: number }>;

interface CheckoutAddonsSectionProps {
  addons: CheckoutAddon[];
  selection: AddonSelectionState;
  onChange: (next: AddonSelectionState) => void;
}

function maxQty(addon: CheckoutAddon) {
  return Math.max(1, addon.maxQuantity ?? 5);
}

/** Part 5 — optional per-offer add-ons (“Brauchst du noch etwas?”). */
export function CheckoutAddonsSection({ addons, selection, onChange }: CheckoutAddonsSectionProps) {
  const t = useT();
  const { locale } = useLocale();
  const priceFormatter = new Intl.NumberFormat(localeTag(locale), {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  if (addons.length === 0) return null;

  const toggle = (addon: CheckoutAddon, selected: boolean) => {
    onChange({
      ...selection,
      [addon.id]: {
        selected,
        quantity: selection[addon.id]?.quantity ?? 1,
      },
    });
  };

  const setQuantity = (addon: CheckoutAddon, quantity: number) => {
    const nextQty = Math.min(maxQty(addon), Math.max(1, quantity));
    onChange({
      ...selection,
      [addon.id]: {
        selected: true,
        quantity: nextQty,
      },
    });
  };

  return (
    <section className={cardClass}>
      <h2 className="text-base font-extrabold text-ink sm:text-lg">{t("booking.extrasTitle")}</h2>
      <p className="mt-1 text-sm text-body">{t("booking.extrasOptionalHint")}</p>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {addons.map((addon) => {
          const state = selection[addon.id];
          const selected = Boolean(state?.selected);
          const quantity = state?.quantity ?? 1;
          const lineTotal = addon.price * quantity;

          return (
            <div
              key={addon.id}
              className={cn(
                "rounded-xl border-2 p-3.5 transition",
                selected ? "border-brand-500 bg-[#F4F8FF]" : "border-[#e8eaef] bg-white"
              )}
            >
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={(e) => toggle(addon, e.target.checked)}
                  className="mt-1 h-4 w-4 shrink-0 accent-brand-500"
                />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-extrabold text-ink">{tx(addon.name, locale)}</span>
                  {addon.description && (
                    <span className="mt-1 block text-xs leading-relaxed text-muted">
                      {tx(addon.description, locale)}
                    </span>
                  )}
                  <span className="mt-1.5 block text-sm font-semibold tabular-nums text-ink">
                    {selected && quantity > 1
                      ? `+ ${priceFormatter.format(lineTotal)} €`
                      : `+ ${priceFormatter.format(addon.price)} €`}
                    {addon.allowQuantity && (
                      <span className="ml-1 font-normal text-muted">
                        {t("booking.addonPerUnit", { price: priceFormatter.format(addon.price) })}
                      </span>
                    )}
                  </span>
                </span>
              </label>

              {selected && addon.allowQuantity && (
                <div className="mt-3 flex items-center gap-2 pl-7">
                  <span className="text-xs font-semibold text-muted">{t("booking.addonQuantity")}</span>
                  <div className="inline-flex items-center gap-1">
                    <button
                      type="button"
                      aria-label={t("booking.addonQuantityDecrease")}
                      onClick={() => setQuantity(addon, quantity - 1)}
                      disabled={quantity <= 1}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#d8dce3] bg-white text-ink transition hover:bg-surface disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Minus className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                    <input
                      type="number"
                      min={1}
                      max={maxQty(addon)}
                      value={quantity}
                      onChange={(e) => setQuantity(addon, Number(e.target.value) || 1)}
                      className={cn(checkoutInputClass, "h-8 w-14 appearance-none px-1 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none")}
                    />
                    <button
                      type="button"
                      aria-label={t("booking.addonQuantityIncrease")}
                      onClick={() => setQuantity(addon, quantity + 1)}
                      disabled={quantity >= maxQty(addon)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#d8dce3] bg-white text-ink transition hover:bg-surface disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

/** Resolve selected add-ons into priced lines for totals / confirmation. */
export function resolveSelectedAddonLines(
  addons: CheckoutAddon[],
  selection: AddonSelectionState,
  locale: "de" | "en"
) {
  return addons
    .filter((addon) => selection[addon.id]?.selected)
    .map((addon) => {
      const quantity = Math.max(1, selection[addon.id]?.quantity ?? 1);
      return {
        id: addon.id,
        label: tx(addon.name, locale),
        amount: addon.price * quantity,
        quantity,
        unitPrice: addon.price,
      };
    });
}
