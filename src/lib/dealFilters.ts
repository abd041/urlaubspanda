import type { Deal, FilterKey } from "@/types";
import { ATTRIBUTE_FILTER_KEYS } from "@/data/filters";

/** Whether a deal matches one filter key (tag or attribute). */
export function dealMatchesFilter(deal: Deal, key: FilterKey): boolean {
  if (ATTRIBUTE_FILTER_KEYS.has(key)) {
    switch (key) {
      case "bis-300":
        return deal.currentPrice <= 300;
      case "top-bewertung":
        return deal.reviewEnabled && deal.reviewPercent >= 90;
      case "fuenf-sterne":
        return deal.stars >= 5;
      case "kurztrips":
        return deal.nights <= 4;
      default:
        return false;
    }
  }
  return deal.tags.includes(key);
}

/** Deal must match every selected filter (AND). */
export function dealMatchesAllFilters(deal: Deal, selected: FilterKey[]): boolean {
  if (selected.length === 0) return true;
  return selected.every((key) => dealMatchesFilter(deal, key));
}
