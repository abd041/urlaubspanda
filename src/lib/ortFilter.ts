import type { Deal } from "@/types";

export const ORT_QUERY_KEY = "ort";

/** Region label before “ · Country”, e.g. “Gardasee · Italien” → “Gardasee”. */
export function getDealRegionLabel(deal: Deal): string {
  return deal.destinationRegion.split(" · ")[0]?.trim() || deal.destinationRegion;
}

/**
 * Match a deal to a Top-Destination / Ort selection (urlaubshamster behaviour).
 * Compares against the region part of `destinationRegion`.
 */
export function dealMatchesOrt(deal: Deal, ort: string | null | undefined): boolean {
  if (!ort) return true;
  const region = getDealRegionLabel(deal).toLowerCase();
  const needle = ort.replace(/[….]/g, "").trim().toLowerCase();
  if (!needle) return true;
  return region === ort.toLowerCase() || region.includes(needle);
}
