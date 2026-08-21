/**
 * Client-side click popularity for “Sort by popularity”.
 * Counts are stored in localStorage so refreshes and sessions keep ranking.
 * In production this would be replaced by a server-side analytics endpoint.
 *
 * Snapshots are referentially stable for useSyncExternalStore.
 */

const STORAGE_KEY = "urlaubspanda-deal-clicks";

type ClickMap = Record<string, number>;

/** Stable empty map for SSR / first paint — must not be a new object each call. */
export const EMPTY_CLICK_COUNTS: ClickMap = Object.freeze({});

let cachedRaw: string | null = null;
let cachedMap: ClickMap = EMPTY_CLICK_COUNTS;

function readClicks(): ClickMap {
  if (typeof window === "undefined") return EMPTY_CLICK_COUNTS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      cachedRaw = null;
      cachedMap = EMPTY_CLICK_COUNTS;
      return cachedMap;
    }
    if (raw === cachedRaw) return cachedMap;
    const parsed = JSON.parse(raw) as ClickMap;
    cachedRaw = raw;
    cachedMap = parsed && typeof parsed === "object" ? parsed : EMPTY_CLICK_COUNTS;
    return cachedMap;
  } catch {
    cachedRaw = null;
    cachedMap = EMPTY_CLICK_COUNTS;
    return cachedMap;
  }
}

function writeClicks(map: ClickMap) {
  if (typeof window === "undefined") return;
  try {
    const raw = JSON.stringify(map);
    window.localStorage.setItem(STORAGE_KEY, raw);
    cachedRaw = raw;
    cachedMap = map;
  } catch {
    // Quota / private mode — ignore.
  }
}

export function getDealClickCount(dealId: string): number {
  return readClicks()[dealId] ?? 0;
}

export function getAllDealClickCounts(): ClickMap {
  return readClicks();
}

export function getServerDealClickCounts(): ClickMap {
  return EMPTY_CLICK_COUNTS;
}

export function recordDealClick(dealId: string) {
  if (!dealId) return;
  const current = readClicks();
  const map = { ...current, [dealId]: (current[dealId] ?? 0) + 1 };
  writeClicks(map);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("urlaubspanda:deal-click", { detail: { dealId } }));
  }
}
