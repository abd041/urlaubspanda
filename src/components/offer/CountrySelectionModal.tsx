"use client";

import { X } from "lucide-react";
import type { OfferBookingUrls, OfferCtaOption } from "@/types";
import { Modal } from "@/components/ui/Modal";
import {
  resolveCountrySelectionNotice,
  type CountrySelectionNoticeConfig,
} from "@/data/countrySelectionNotice";
import { useLocale, useT } from "@/i18n/LocaleProvider";
import { tx } from "@/i18n/content";

interface CountrySelectionModalProps {
  open: boolean;
  onClose: () => void;
  bookingUrls?: OfferBookingUrls;
  ctaOptions?: OfferCtaOption[];
  /** Per-offer override for the orange info box (admin stand-in). */
  notice?: Partial<CountrySelectionNoticeConfig> | null;
}

/**
 * Filter-style popup before redirect — custom options (emoji/flags) or default AT/DE/CH.
 * Configured per deal in offerDetails (frontend stand-in for admin).
 */
export function CountrySelectionModal({
  open,
  onClose,
  bookingUrls,
  ctaOptions,
  notice,
}: CountrySelectionModalProps) {
  const t = useT();
  const { locale } = useLocale();
  const noticeText = resolveCountrySelectionNotice(notice);

  const options: OfferCtaOption[] =
    ctaOptions && ctaOptions.length > 0
      ? ctaOptions
      : bookingUrls
        ? [
            { id: "AT", label: t("dest.oesterreich.name"), url: bookingUrls.AT, emoji: "🇦🇹" },
            { id: "DE", label: t("dest.deutschland.name"), url: bookingUrls.DE, emoji: "🇩🇪" },
            { id: "CH", label: t("offer.switzerland"), url: bookingUrls.CH, emoji: "🇨🇭" },
          ]
        : [];

  const handleSelect = (url: string) => {
    onClose();
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <Modal open={open} onClose={onClose} ariaLabelledBy="country-modal-heading">
      <div className="flex items-center justify-between border-b border-line px-5 py-4 sm:px-6">
        <div className="min-w-0 pr-3">
          <h2 id="country-modal-heading" className="text-lg font-bold text-ink">
            {t("offer.whereLive")}
          </h2>
          <p className="mt-0.5 text-sm text-body">{t("offer.chooseCountry")}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label={t("offer.close")}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted transition hover:bg-surface hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <div className="space-y-2.5 overflow-y-auto px-5 py-5 sm:px-6">
        {noticeText ? (
          <div
            role="note"
            className="rounded-xl border border-cal/40 bg-[#FFF8E8] px-3.5 py-2.5 text-sm font-medium leading-snug text-ink"
          >
            {tx(noticeText, locale)}
          </div>
        ) : null}

        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => handleSelect(option.url)}
            className="flex w-full items-center gap-3 rounded-xl border border-line bg-white px-4 py-3.5 text-left transition hover:border-brand-500 hover:bg-[#F4F8FF] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
          >
            {option.emoji ? (
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface text-2xl leading-none"
                aria-hidden="true"
              >
                {option.emoji}
              </span>
            ) : null}
            <span className="text-base font-semibold text-ink">{option.label}</span>
          </button>
        ))}
      </div>
    </Modal>
  );
}
