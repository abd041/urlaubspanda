/** Scroll to the travel-types / filters section headline (above the chips). */
export function scrollToOffersFiltersHeadline(options?: {
  behavior?: ScrollBehavior;
  /** Wait before first attempt (lets layout / ScrollToTop settle). */
  delayMs?: number;
}) {
  if (typeof window === "undefined") return;

  const behavior = options?.behavior ?? "smooth";
  const delayMs = options?.delayMs ?? 120;

  const run = () => {
    const el = document.getElementById("filters");
    if (!el) return false;
    const header = document.querySelector("header");
    const headerOffset = header?.getBoundingClientRect().height ?? 72;
    const top = window.scrollY + el.getBoundingClientRect().top - headerOffset;
    window.scrollTo({ top: Math.max(0, Math.round(top)), behavior });
    return true;
  };

  window.setTimeout(() => {
    if (run()) return;

    let attempts = 0;
    const id = window.setInterval(() => {
      attempts += 1;
      if (run() || attempts >= 20) window.clearInterval(id);
    }, 50);
  }, delayMs);
}

/**
 * Campaign / deep-link scroll: only use when a city/destination is already
 * selected via `?ort=…`. Waits for `#filters` and settles past initial layout.
 */
export function scrollToOffersFiltersAfterOrtReady() {
  scrollToOffersFiltersHeadline({ behavior: "smooth", delayMs: 250 });
}
