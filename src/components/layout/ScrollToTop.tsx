"use client";

import { useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";

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
 */
export function ScrollToTop() {
  const pathname = usePathname();
  const previousPathname = useRef<string | null>(null);

  useLayoutEffect(() => {
    const prev = previousPathname.current;
    previousPathname.current = pathname;

    if (prev === null || prev === pathname) return;

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
