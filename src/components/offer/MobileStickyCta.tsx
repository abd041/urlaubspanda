"use client";

import { useEffect, useState } from "react";
import type { CtaMode, OfferBookingUrls } from "@/types";
import { cn } from "@/lib/utils";
import { OfferCtaButton } from "@/components/offer/OfferCtaButton";

interface MobileStickyCtaProps {
  slug: string;
  ctaMode: CtaMode;
  bookingUrl?: string;
  bookingUrls?: OfferBookingUrls;
}

/**
 * Appears only once the original in-page CTA (#mobile-cta-anchor) has
 * scrolled above the viewport, and disappears again once it's back in
 * view. Never shown together with the original button (spec requirement).
 */
export function MobileStickyCta({ slug, ctaMode, bookingUrl, bookingUrls }: MobileStickyCtaProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const anchor = document.getElementById("mobile-cta-anchor");
    if (!anchor) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const scrolledPastAnchor = !entry.isIntersecting && entry.boundingClientRect.top < 0;
        setVisible(scrolledPastAnchor);
      },
      { threshold: 0 }
    );

    observer.observe(anchor);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      aria-hidden={!visible}
      className={cn(
        "fixed inset-x-0 top-[68px] z-30 border-b border-line bg-white/95 px-4 py-2.5 shadow-[0_8px_24px_rgba(15,26,43,0.08)] backdrop-blur transition-transform duration-200 ease-out sm:top-[76px] lg:hidden",
        visible ? "translate-y-0" : "pointer-events-none -translate-y-full"
      )}
    >
      <OfferCtaButton
        slug={slug}
        ctaMode={ctaMode}
        bookingUrl={bookingUrl}
        bookingUrls={bookingUrls}
        className="h-16 text-base"
      />
    </div>
  );
}
