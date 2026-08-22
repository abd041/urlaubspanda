"use client";

import { useLayoutEffect } from "react";

/** Offer pages always open at the hotel title + Teilen/Merken block. */
export function OfferOpenAtTop() {
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash) return;

    const html = document.documentElement;
    const previous = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
    html.scrollTop = 0;
    document.body.scrollTop = 0;
    html.style.scrollBehavior = previous;

    const t = window.setTimeout(() => {
      window.scrollTo(0, 0);
    }, 50);
    return () => window.clearTimeout(t);
  }, []);

  return null;
}
