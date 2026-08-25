"use client";

import { useT } from "@/i18n/LocaleProvider";
import { cn } from "@/lib/utils";

/** Accepted payment marks shown under “Mögliche Zahlungsarten”. */
export function PaymentMethodBadges({ className }: { className?: string }) {
  const t = useT();

  return (
    <div
      className={cn("mt-2 flex flex-wrap items-center gap-3.5", className)}
      aria-label={t("booking.paymentMethodsLabel")}
    >
      <MastercardMark />
      <VisaMark />
      <span className="text-[15px] font-medium leading-none text-[#8a93a3]">
        {t("booking.paymentInvoiceShort")}
      </span>
    </div>
  );
}

function MastercardMark() {
  return (
    <svg
      viewBox="0 0 38 24"
      width={38}
      height={24}
      aria-label="Mastercard"
      role="img"
      className="shrink-0"
    >
      <circle cx="14" cy="12" r="9" fill="#EB001B" />
      <circle cx="24" cy="12" r="9" fill="#F79E1B" />
      <path d="M19 5.4a9 9 0 0 1 0 13.2 9 9 0 0 1 0-13.2Z" fill="#FF5F00" />
    </svg>
  );
}

function VisaMark() {
  return (
    <span
      aria-label="VISA"
      className="inline-flex items-center text-[15px] font-extrabold italic leading-none tracking-[0.04em] text-[#1A1F71]"
    >
      VISA
    </span>
  );
}
