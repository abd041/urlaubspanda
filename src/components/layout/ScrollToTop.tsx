"use client";

import { useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { takeListingScrollTopSkip } from "@/lib/listingScrollRestore";

const FILTER_SEGMENT_RE =
  /\/(mit-flug|all-inclusive|direkte-strandlage|adults-only|familienhotel|thermenurlaub|wellness|urlaub-am-see|urlaub-am-meer|in-den-bergen|skiurlaub|ab-85-weiterempfehlung|fruehbucher|last-minute|zentrale-lage)$/;

function stripFilterSegment(path: string) {
  return path.replace(FILTER_SEGMENT_RE, "") || "/";
}

/** Same country/category landing, only the SEO filter segment changed. */
function isFilterToggleNavigation(prev: string, next: string) {
  return stripFilterSegment(prev) === stripFilterSegment(next);
}

function resetWindowScroll() {
  if (typeof window === "undefined") return;
  // Keep intentional hash / in-page anchors.
  if (window.location.hash) return;

  const html = document.documentElement;
  const previousBehavior = html.style.scrollBehavior;
  html.style.scrollBehavior = "auto";

  window.scrollTo(0, 0);
  html.scrollTop = 0;
  document.body.scrollTop = 0;

  html.style.scrollBehavior = previousBehavior;
}

/**
 * New pages (including offer pages) always start at the top.
 * Query-only updates do not reset scroll.
 * Country filter path toggles (/kroatien ↔ /kroatien/all-inclusive) keep scroll.
 * Returning to an offer listing after opening a deal restores the prior position
 * (see listingScrollRestore) — skip the forced top reset in that case.
 */
export function ScrollToTop() {
  const pathname = usePathname();
  const previousPathname = useRef<string | null>(null);

  useLayoutEffect(() => {
    const prev = previousPathname.current;
    previousPathname.current = pathname;

    if (prev === null || prev === pathname) return;
    if (isFilterToggleNavigation(prev, pathname)) return;

    const search = typeof window !== "undefined" ? window.location.search : "";
    if (takeListingScrollTopSkip(pathname, search)) return;

    resetWindowScroll();

    const raf = window.requestAnimationFrame(resetWindowScroll);
    const t0 = window.setTimeout(resetWindowScroll, 0);
    const t1 = window.setTimeout(resetWindowScroll, 50);
    const t2 = window.setTimeout(resetWindowScroll, 150);

    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(t0);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [pathname]);

  return null;
}
