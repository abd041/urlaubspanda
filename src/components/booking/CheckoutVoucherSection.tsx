"use client";

import { Check, X } from "lucide-react";
import { checkoutInputClass } from "@/components/booking/BillingContactSection";
import { useLocale, useT } from "@/i18n/LocaleProvider";
import { localeTag } from "@/i18n/config";
import { cn } from "@/lib/utils";

const cardClass = "rounded-2xl border border-[#e8eaef] bg-white p-4 shadow-[0_4px_16px_rgba(15,26,43,0.06)] sm:p-5";

interface CheckoutVoucherSectionProps {
  input: string;
  onInputChange: (value: string) => void;
  appliedCode: string;
  discountAmount: number;
  error: boolean;
  onApply: () => void;
  onClear: () => void;
}

/** Part 6 — optional voucher / promo code (frontend validation for now). */
export function CheckoutVoucherSection({
  input,
  onInputChange,
  appliedCode,
  discountAmount,
  error,
  onApply,
  onClear,
}: CheckoutVoucherSectionProps) {
  const t = useT();
  const { locale } = useLocale();
  const priceFormatter = new Intl.NumberFormat(localeTag(locale), {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const hasApplied = Boolean(appliedCode) && !error && discountAmount > 0;

  return (
    <section className={cardClass}>
      <h2 className="text-base font-extrabold text-ink sm:text-lg">{t("booking.voucherTitle")}</h2>
      <p className="mt-1 text-sm text-body">{t("booking.voucherOptionalHint")}</p>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-end">
        <label className="block min-w-0 flex-1">
          <span className="block text-[13px] font-semibold text-ink">{t("booking.voucherPlaceholder")}</span>
          <input
            type="text"
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onApply();
              }
            }}
            className={cn(checkoutInputClass, "mt-1.5", error && "border-danger focus-visible:border-danger focus-visible:outline-danger")}
            placeholder={t("booking.voucherPlaceholder")}
            autoComplete="off"
            aria-invalid={error || undefined}
            aria-describedby={error ? "voucher-error" : hasApplied ? "voucher-success" : undefined}
          />
        </label>
        <button
          type="button"
          onClick={onApply}
          className="h-11 shrink-0 rounded-lg border border-brand-500 bg-white px-5 text-sm font-bold text-brand-500 transition hover:bg-[#F4F8FF]"
        >
          {t("booking.voucherApply")}
        </button>
      </div>

      {hasApplied && (
        <div
          id="voucher-success"
          role="status"
          className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[#b7e4c7] bg-[#e8f8ee] px-3 py-2.5"
        >
          <p className="flex items-start gap-2 text-sm font-medium text-success">
            <Check className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" strokeWidth={2.4} />
            <span>
              {t("booking.voucherApplied", { code: appliedCode })}
              <span className="mt-0.5 block font-semibold tabular-nums">
                {t("booking.voucherDiscountAmount", { amount: priceFormatter.format(discountAmount) })}
              </span>
            </span>
          </p>
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-1 text-sm font-semibold text-body transition hover:text-ink"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
            {t("booking.voucherRemove")}
          </button>
        </div>
      )}

      {error && (
        <p id="voucher-error" role="alert" className="mt-2 text-sm font-medium text-danger">
          {t("booking.voucherInvalid")}
        </p>
      )}
    </section>
  );
}
