"use client";

import { useEffect, useLayoutEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function resetWindowScroll() {
  if (typeof window === "undefined") return;

  const html = document.documentElement;
  const previousBehavior = html.style.scrollBehavior;
  // CSS `scroll-behavior: smooth` can override scrollTo(behavior: "auto") in some browsers.
  html.style.scrollBehavior = "auto";

  window.scrollTo(0, 0);
  html.scrollTop = 0;
  document.body.scrollTop = 0;

  html.style.scrollBehavior = previousBehavior;
}

/**
 * Deal, category, and landing pages should always open at the very top.
 * Disables browser scroll restoration so previous page position (and back/forward)
 * does not leave the user mid-page (req 19).
 */
export function ScrollToTop() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.toString();
  // Ignore hash for the dependency key so we still reset; hash targets are rare on landings.
  const routeKey = `${pathname}?${query}`;

  useEffect(() => {
    if (typeof window === "undefined" || !("scrollRestoration" in window.history)) return;
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    return () => {
      window.history.scrollRestoration = previous;
    };
  }, []);

  useLayoutEffect(() => {
    resetWindowScroll();
  }, [routeKey]);

  useEffect(() => {
    resetWindowScroll();

    // Beat late restorations from the browser / App Router after paint & images.
    const raf = window.requestAnimationFrame(() => resetWindowScroll());
    const t1 = window.setTimeout(resetWindowScroll, 0);
    const t2 = window.setTimeout(resetWindowScroll, 50);
    const t3 = window.setTimeout(resetWindowScroll, 150);

    const onPageShow = (event: PageTransitionEvent) => {
      // bfcache back/forward
      if (event.persisted) resetWindowScroll();
    };
    const onPopState = () => resetWindowScroll();

    window.addEventListener("pageshow", onPageShow);
    window.addEventListener("popstate", onPopState);

    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      window.removeEventListener("pageshow", onPageShow);
      window.removeEventListener("popstate", onPopState);
    };
  }, [routeKey]);

  return null;
}
