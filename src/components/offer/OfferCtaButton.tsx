"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { CtaMode, OfferBookingUrls, OfferCtaOption } from "@/types";
import { cn } from "@/lib/utils";
import { hasInternalBooking, internalBookingPath } from "@/lib/bookingRoute";
import { CountrySelectionModal } from "@/components/offer/CountrySelectionModal";
import { useT } from "@/i18n/LocaleProvider";

interface OfferCtaButtonProps {
  slug: string;
  ctaMode: CtaMode;
  bookingUrl?: string;
  bookingUrls?: OfferBookingUrls;
  /** Custom popup choices with optional emoji/flags (admin/data configurable). */
  ctaOptions?: OfferCtaOption[];
  className?: string;
  label?: string;
  variant?: "primary" | "quiet";
  /**
   * When true, skip the internal /hotel booking route and always use
   * affiliate direct/popup behaviour from offerDetails.
   */
  forceExternal?: boolean;
}

function hasExternalCtaConfig(
  ctaMode: CtaMode,
  bookingUrl?: string,
  bookingUrls?: OfferBookingUrls,
  ctaOptions?: OfferCtaOption[]
) {
  if (ctaMode === "direct") return Boolean(bookingUrl);
  if (ctaMode === "country_selection") {
    return Boolean(bookingUrls) || (ctaOptions?.length ?? 0) > 0;
  }
  return false;
}

/**
 * “Termine & Preise anzeigen” — behaviour comes from offerDetails (frontend stand-in for admin):
 * - `direct`: open `bookingUrl` immediately
 * - `country_selection`: popup with flag/emoji choices, then redirect
 * Falls back to the internal booking flow only when no external CTA is configured.
 */
export function OfferCtaButton({
  slug,
  ctaMode,
  bookingUrl,
  bookingUrls,
  ctaOptions,
  className,
  label,
  variant = "primary",
  forceExternal = false,
}: OfferCtaButtonProps) {
  const [countryModalOpen, setCountryModalOpen] = useState(false);
  const t = useT();
  const ctaLabel = label ?? t("offer.showDates");

  const externalConfigured = hasExternalCtaConfig(ctaMode, bookingUrl, bookingUrls, ctaOptions);
  const useExternal = forceExternal || externalConfigured;
  const bookingPath =
    !useExternal && hasInternalBooking(slug) ? internalBookingPath(slug) : null;

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

  const showModal =
    ctaMode === "country_selection" &&
    (Boolean(bookingUrls) || (ctaOptions?.length ?? 0) > 0);

  return (
    <>
      <button type="button" onClick={handleClick} className={classNames}>
        {ctaLabel}
        <ArrowRight className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover/cta:translate-x-0.5" aria-hidden="true" />
      </button>

      {showModal && (
        <CountrySelectionModal
          open={countryModalOpen}
          onClose={() => setCountryModalOpen(false)}
          bookingUrls={bookingUrls}
          ctaOptions={ctaOptions}
        />
      )}
    </>
  );
}
