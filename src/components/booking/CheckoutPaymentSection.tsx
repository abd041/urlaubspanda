"use client";

import { CreditCard, Info, Landmark } from "lucide-react";
import type { PaymentMethod } from "@/components/booking/checkoutHelpers";
import { useT } from "@/i18n/LocaleProvider";
import { cn } from "@/lib/utils";

const cardClass = "rounded-2xl border border-[#e8eaef] bg-white p-4 shadow-[0_4px_16px_rgba(15,26,43,0.06)] sm:p-5";

interface CheckoutPaymentSectionProps {
  value: PaymentMethod;
  onChange: (value: PaymentMethod) => void;
}

/**
 * Part 7 — payment method selection (frontend-only for v1).
 * No payment is collected in checkout; invoice details / card payment link
 * are sent after the booking is submitted.
 */
export function CheckoutPaymentSection({ value, onChange }: CheckoutPaymentSectionProps) {
  const t = useT();

  const options = [
    {
      id: "invoice" as const,
      label: t("booking.paymentInvoice"),
      summary: t("booking.paymentInvoiceSummary"),
      icon: Landmark,
    },
    {
      id: "card" as const,
      label: t("booking.paymentCard"),
      summary: t("booking.paymentCardSummary"),
      icon: CreditCard,
    },
  ];

  return (
    <section className={cardClass}>
      <h2 className="text-base font-extrabold text-ink sm:text-lg">{t("booking.howToPay")}</h2>
      <p className="mt-1 text-sm text-body">{t("booking.paymentNoImmediateHint")}</p>

      <div className="mt-3 space-y-2.5" role="radiogroup" aria-label={t("booking.howToPay")}>
        {options.map((option) => {
          const selected = value === option.id;
          const Icon = option.icon;
          return (
            <label
              key={option.id}
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-xl border-2 p-3.5 transition",
                selected ? "border-brand-500 bg-[#F4F8FF]" : "border-[#e8eaef] bg-white hover:border-brand-200"
              )}
            >
              <input
                type="radio"
                name="payment-method"
                value={option.id}
                checked={selected}
                onChange={() => onChange(option.id)}
                className="mt-1 h-4 w-4 shrink-0 accent-brand-500"
              />
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2 text-sm font-extrabold text-ink">
                  <Icon className="h-4 w-4 shrink-0 text-brand-500" aria-hidden="true" />
                  {option.label}
                </span>
                <span className="mt-1.5 block text-sm leading-relaxed text-muted">{option.summary}</span>
              </span>
            </label>
          );
        })}
      </div>

      {value === "card" && (
        <div
          role="status"
          className="mt-3 flex items-start gap-2.5 rounded-xl border border-[#c5d8f8] bg-[#F4F8FF] px-3.5 py-3 text-sm leading-relaxed text-ink"
        >
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" aria-hidden="true" />
          <p>
            <span className="font-extrabold">{t("booking.paymentCardLinkTitle")}</span>{" "}
            {t("booking.paymentCardNote")}
          </p>
        </div>
      )}

      {value === "invoice" && (
        <p className="mt-3 text-sm leading-relaxed text-muted">{t("booking.paymentInvoiceNote")}</p>
      )}
    </section>
  );
}
