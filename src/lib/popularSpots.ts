import type { Deal, Destination, PopularSpot } from "@/types";
import { getDealRegionLabel } from "@/lib/ortFilter";

/**
 * Top-Destinationen / Ort list for a country page.
 * Only regions that exist in this country’s deals — no curated extras.
 * Curated `popularSpots` only enrich image (and keep name) when they match a deal region.
 */
export function resolvePopularSpots(
  destination: Destination | undefined,
  deals: Deal[]
): PopularSpot[] {
  const curatedByName = new Map(
    (destination?.popularSpots ?? []).map((spot) => [spot.name.toLowerCase(), spot])
  );

  const byRegion = new Map<string, PopularSpot>();

  for (const deal of deals) {
    const name = getDealRegionLabel(deal);
    if (!name) continue;

    const existing = byRegion.get(name);
    const curated = curatedByName.get(name.toLowerCase());
    const image = curated?.image || deal.images[0] || destination?.image || "";
    const fromPrice = existing
      ? Math.min(existing.fromPrice, deal.currentPrice)
      : deal.currentPrice;

    byRegion.set(name, { name, image, fromPrice });
  }

  return Array.from(byRegion.values()).sort((a, b) => a.fromPrice - b.fromPrice);
}
