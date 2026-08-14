"use client";

import type { OfferBookingUrls } from "@/types";
import { Modal } from "@/components/ui/Modal";
import { useT } from "@/i18n/LocaleProvider";

interface CountrySelectionModalProps {
  open: boolean;
  onClose: () => void;
  bookingUrls: OfferBookingUrls;
}

/**
 * "Wo wohnst du?" step shown before redirecting, for offers whose booking
 * link differs by the customer's country of residence.
 */
export function CountrySelectionModal({ open, onClose, bookingUrls }: CountrySelectionModalProps) {
  const t = useT();
  const countries = [
    { code: "AT" as const, flag: "🇦🇹", label: t("dest.oesterreich.name") },
    { code: "DE" as const, flag: "🇩🇪", label: t("dest.deutschland.name") },
    { code: "CH" as const, flag: "🇨🇭", label: t("offer.switzerland") },
  ];

  const handleSelect = (code: keyof OfferBookingUrls) => {
    onClose();
    window.open(bookingUrls[code], "_blank", "noopener,noreferrer");
  };

  return (
    <Modal open={open} onClose={onClose} ariaLabelledBy="country-modal-heading">
      <div className="px-6 pt-6 text-center sm:px-8">
        <h2 id="country-modal-heading" className="text-lg font-bold text-ink">
          {t("offer.whereLive")}
        </h2>
        <p className="mt-1.5 text-sm text-body">{t("offer.chooseCountry")}</p>
      </div>
      <div className="space-y-2.5 px-5 py-6 sm:px-6">
        {countries.map((country) => (
          <button
            key={country.code}
            type="button"
            onClick={() => handleSelect(country.code)}
            className="flex w-full items-center gap-3 rounded-xl border border-line px-4 py-4 text-left transition hover:border-brand-500 hover:bg-brand-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
          >
            <span className="text-2xl" aria-hidden="true">
              {country.flag}
            </span>
            <span className="text-base font-semibold text-ink">{country.label}</span>
          </button>
        ))}
      </div>
    </Modal>
  );
}
