/**
 * Persist offer-listing view state (scroll, sort, load-more) so returning from
 * an offer detail (browser back or “Zurück”) lands on the same place.
 */

const VIEW_PREFIX = "up:listing-view:";
const PENDING_KEY = "up:listing-restore-pending";
/** Consumed by ScrollToTop so it can skip reset even if DealsSection already cleared PENDING. */
const SKIP_TOP_KEY = "up:listing-skip-scroll-top";
/** Brief flag while scroll/sort/load-more are being reapplied (blocks ort auto-scroll). */
const RESTORING_KEY = "up:listing-restoring";

export type ListingSortOption = "neueste" | "beliebtheit" | "rabatt" | "preis" | "bewertung";

export type ListingViewState = {
  scrollY: number;
  sort: ListingSortOption;
  /** visible count for the active pageKey at save time */
  visibleCount: number;
  pageKey: string;
  savedAt: number;
};

const SORT_OPTIONS: ListingSortOption[] = [
  "neueste",
  "beliebtheit",
  "rabatt",
  "preis",
  "bewertung",
];

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.sessionStorage !== "undefined";
}

/** Stable key for the current listing URL (path + query). */
export function listingViewKey(pathname?: string, search?: string): string {
  if (typeof window === "undefined") {
    return `${pathname ?? ""}${search ?? ""}`;
  }
  const path = pathname ?? window.location.pathname;
  const query = search ?? window.location.search;
  return `${path}${query}`;
}

export function saveListingViewState(key: string, state: Omit<ListingViewState, "savedAt">) {
  if (!canUseStorage()) return;
  try {
    const payload: ListingViewState = { ...state, savedAt: Date.now() };
    sessionStorage.setItem(VIEW_PREFIX + key, JSON.stringify(payload));
  } catch {
    /* quota / private mode */
  }
}

export function readListingViewState(key: string): ListingViewState | null {
  if (!canUseStorage()) return null;
  try {
    const raw = sessionStorage.getItem(VIEW_PREFIX + key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ListingViewState>;
    if (
      typeof parsed.scrollY !== "number" ||
      typeof parsed.visibleCount !== "number" ||
      typeof parsed.pageKey !== "string" ||
      !SORT_OPTIONS.includes(parsed.sort as ListingSortOption)
    ) {
      return null;
    }
    return {
      scrollY: Math.max(0, parsed.scrollY),
      sort: parsed.sort as ListingSortOption,
      visibleCount: Math.max(0, parsed.visibleCount),
      pageKey: parsed.pageKey,
      savedAt: typeof parsed.savedAt === "number" ? parsed.savedAt : Date.now(),
    };
  } catch {
    return null;
  }
}

/** Call when navigating from a listing card to an offer. */
export function markListingRestorePending(key = listingViewKey()) {
  if (!canUseStorage()) return;
  try {
    const existing = readListingViewState(key);
    if (existing) {
      saveListingViewState(key, {
        scrollY: window.scrollY,
        sort: existing.sort,
        visibleCount: existing.visibleCount,
        pageKey: existing.pageKey,
      });
    }
    sessionStorage.setItem(PENDING_KEY, key);
    sessionStorage.setItem(SKIP_TOP_KEY, key);
  } catch {
    /* ignore */
  }
}

export function peekListingRestorePending(): string | null {
  if (!canUseStorage()) return null;
  try {
    return sessionStorage.getItem(PENDING_KEY);
  } catch {
    return null;
  }
}

export function clearListingRestorePending() {
  if (!canUseStorage()) return;
  try {
    sessionStorage.removeItem(PENDING_KEY);
  } catch {
    /* ignore */
  }
}

/**
 * ScrollToTop: skip forced top reset when returning to the listing we left for an offer.
 * Safe to call before or after DealsSection consumes the pending restore flag.
 */
export function takeListingScrollTopSkip(pathname: string, search = ""): boolean {
  if (!canUseStorage()) return false;
  try {
    const skipFor = sessionStorage.getItem(SKIP_TOP_KEY);
    if (!skipFor) return false;

    const key = listingViewKey(pathname, search);
    if (skipFor === key) {
      sessionStorage.removeItem(SKIP_TOP_KEY);
      return true;
    }

    // User left the return path without restoring (e.g. home via nav).
    if (!pathname.startsWith("/angebot/")) {
      sessionStorage.removeItem(SKIP_TOP_KEY);
      clearListingRestorePending();
    }
    return false;
  } catch {
    return false;
  }
}

export function consumeListingRestore(key: string): ListingViewState | null {
  const pending = peekListingRestorePending();
  if (pending !== key) return null;
  const state = readListingViewState(key);
  clearListingRestorePending();
  if (state && canUseStorage()) {
    try {
      sessionStorage.setItem(RESTORING_KEY, "1");
    } catch {
      /* ignore */
    }
  }
  return state;
}

/** True while listing scroll/sort are being restored (skip competing auto-scrolls). */
export function isListingScrollRestoreActive(): boolean {
  if (!canUseStorage()) return false;
  try {
    return sessionStorage.getItem(RESTORING_KEY) === "1";
  } catch {
    return false;
  }
}

export function endListingScrollRestore() {
  if (!canUseStorage()) return;
  try {
    sessionStorage.removeItem(RESTORING_KEY);
  } catch {
    /* ignore */
  }
}

/** Instant scroll without smooth behavior (for restore). */
export function restoreWindowScroll(scrollY: number) {
  if (typeof window === "undefined") return;
  const y = Math.max(0, Math.round(scrollY));
  const html = document.documentElement;
  const previousBehavior = html.style.scrollBehavior;
  html.style.scrollBehavior = "auto";
  window.scrollTo(0, y);
  html.scrollTop = y;
  document.body.scrollTop = y;
  html.style.scrollBehavior = previousBehavior;
}
