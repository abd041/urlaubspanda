"use client";

import { useEffect } from "react";
import { recordDealClick } from "@/lib/dealClicks";

/**
 * Records one popularity click when a deal detail page is opened
 * (card, search, similar deals, or direct URL). Frontend-only store.
 * Short debounce avoids React Strict Mode double-mount double-counts.
 */
export function OfferClickTracker({ dealId }: { dealId: string }) {
  useEffect(() => {
    if (!dealId || typeof window === "undefined") return;

    const key = `urlaubspanda-click-guard:${dealId}`;
    try {
      const last = Number(window.sessionStorage.getItem(key) ?? 0);
      if (Date.now() - last < 1500) return;
      window.sessionStorage.setItem(key, String(Date.now()));
    } catch {
      // private mode — still record
    }

    recordDealClick(dealId);
  }, [dealId]);

  return null;
}
