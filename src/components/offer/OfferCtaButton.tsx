"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { CtaMode, OfferBookingUrls } from "@/types";
import { cn } from "@/lib/utils";
import { hasInternalBooking, internalBookingPath } from "@/lib/bookingRoute";
import { CountrySelectionModal } from "@/components/offer/CountrySelectionModal";
import { useT } from "@/i18n/LocaleProvider";

interface OfferCtaButtonProps {
  /** Offer slug — used to open the existing /hotel/[slug] booking UI when available. */
  slug: string;
  ctaMode: CtaMode;
  bookingUrl?: string;
  bookingUrls?: OfferBookingUrls;
  className?: string;
  /** Defaults to Homepage-details CTA copy. */
  label?: string;
  /** Primary = sticky/mobile booking CTA. Quiet = compare-row partner link. */
  variant?: "primary" | "quiet";
}

/**
 * Main booking CTA. Prefers the existing internal booking page when a mock
 * booking config exists for this slug. Otherwise keeps affiliate redirect /
 * country-selection behaviour. Does not change booking-flow logic.
 */
export function OfferCtaButton({
  slug,
  ctaMode,
  bookingUrl,
  bookingUrls,
  className,
  label,
  variant = "primary",
}: OfferCtaButtonProps) {
  const [countryModalOpen, setCountryModalOpen] = useState(false);
  const bookingPath = hasInternalBooking(slug) ? internalBookingPath(slug) : null;
  const t = useT();
  const ctaLabel = label ?? t("offer.showDates");

  const classNames = cn(
    "group/cta inline-flex w-full items-center justify-center gap-2 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600",
    variant === "primary" &&
      "h-[60px] rounded-xl bg-brand-500 text-[15px] font-bold text-white shadow-[0_8px_20px_rgba(27,99,235,0.22)] hover:bg-brand-600 sm:text-base",
    variant === "quiet" &&
      "h-11 rounded-xl border border-[rgba(15,23,42,0.1)] bg-white px-4 text-[13px] font-semibold text-ink hover:border-brand-500 hover:bg-[#F4F8FF] hover:text-brand-600",
    className
  );

  if (bookingPath) {
    return (
      <Link href={bookingPath} className={classNames}>
        {ctaLabel}
        <ArrowRight className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover/cta:translate-x-0.5" aria-hidden="true" />
      </Link>
    );
  }

  const handleClick = () => {
    if (ctaMode === "direct" && bookingUrl) {
      window.open(bookingUrl, "_blank", "noopener,noreferrer");
      return;
    }
    setCountryModalOpen(true);
  };

  return (
    <>
      <button type="button" onClick={handleClick} className={classNames}>
        {ctaLabel}
        <ArrowRight className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover/cta:translate-x-0.5" aria-hidden="true" />
      </button>

      {ctaMode === "country_selection" && bookingUrls && (
        <CountrySelectionModal
          open={countryModalOpen}
          onClose={() => setCountryModalOpen(false)}
          bookingUrls={bookingUrls}
        />
      )}
    </>
  );
}
