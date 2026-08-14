import type { Locale } from "@/i18n/config";
import { destinationName, tx } from "@/i18n/content";
import { destinationFilterPath, destinationPath } from "@/lib/destinationPaths";
import { DESTINATION_FILTER_KEYS } from "@/data/filters";
import { destinations } from "@/data/destinations";
import { deals } from "@/data/deals";
import { getDealRegionLabel } from "@/lib/ortFilter";
import type { FilterKey } from "@/types";

export type HeroTab = "all" | "packages" | "cities" | "wellness";

export function normalizeSearch(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

type Match = { slug: string; ort?: string; score: number };

function scoreMatch(haystack: string, needle: string) {
  const hay = normalizeSearch(haystack);
  if (!hay || !needle) return 0;
  if (hay === needle) return 100;
  if (hay.startsWith(needle)) return 80;
  if (hay.includes(needle)) return 60;
  return 0;
}

function allowedFilterPath(slug: string, filter: FilterKey) {
  return DESTINATION_FILTER_KEYS[slug]?.includes(filter)
    ? destinationFilterPath(slug, filter)
    : null;
}

/** Resolve the hero search to an existing destination, category, or deals URL. */
export function resolveHeroSearch(query: string, tab: HeroTab, locale: Locale): string {
  const needle = normalizeSearch(query);
  const matches: Match[] = [];

  if (needle.length >= 2) {
    for (const destination of destinations) {
      const nameScore = Math.max(
        scoreMatch(destination.name, needle),
        scoreMatch(destinationName(destination.slug, locale), needle),
        scoreMatch(destination.slug.replace(/-/g, " "), needle)
      );
      if (nameScore) matches.push({ slug: destination.slug, score: nameScore + 8 });

      for (const spot of destination.popularSpots ?? []) {
        const spotScore = Math.max(scoreMatch(spot.name, needle), scoreMatch(tx(spot.name, locale), needle));
        if (spotScore) matches.push({ slug: destination.slug, ort: spot.name, score: spotScore + 4 });
      }
    }

    for (const deal of deals) {
      const region = getDealRegionLabel(deal);
      const regionScore = Math.max(scoreMatch(region, needle), scoreMatch(tx(region, locale), needle));
      if (!regionScore) continue;
      const slug =
        destinations.find((destination) => destination.name === deal.destinationCountry)?.slug ?? "staedtereisen";
      matches.push({ slug, ort: region, score: regionScore });
    }
  }

  matches.sort((a, b) => b.score - a.score);
  const best = matches[0];

  if (best) {
    const withOrt = (path: string) =>
      best.ort ? `${path}?ort=${encodeURIComponent(best.ort)}` : path;

    if (tab === "wellness") {
      return withOrt(allowedFilterPath(best.slug, "wellness") ?? destinationPath(best.slug));
    }
    if (tab === "packages") {
      return withOrt(allowedFilterPath(best.slug, "mit-flug") ?? destinationPath(best.slug));
    }
    if (tab === "cities" && !best.ort) {
      return destinationPath(best.slug === "staedtereisen" ? "staedtereisen" : best.slug);
    }
    return withOrt(destinationPath(best.slug));
  }

  if (tab === "packages") return "/pauschalreisen";
  if (tab === "cities") return "/staedtereisen";
  if (tab === "wellness") return "/wellness";
  return "/angebote";
}

export function heroSuggestionLabels(locale: Locale) {
  const labels = new Set<string>();
  for (const destination of destinations) {
    labels.add(destinationName(destination.slug, locale));
    for (const spot of destination.popularSpots ?? []) {
      labels.add(tx(spot.name, locale));
    }
  }
  for (const deal of deals) {
    labels.add(tx(getDealRegionLabel(deal), locale));
  }
  return [...labels].sort((a, b) => a.localeCompare(b, locale === "en" ? "en" : "de"));
}
