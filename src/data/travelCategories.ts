import type { Deal } from "@/types";
import { deals } from "@/data/deals";

export interface TravelCategory {
  slug: string;
  name: string;
  /** Full browser / SEO title */
  title: string;
  description: string;
  /** H1 on the page */
  heading: string;
  intro: string;
  /** DealsSection heading */
  sectionTitle: string;
  match: (deal: Deal) => boolean;
}

/**
 * Category landing pages linked from the header / footer "Reisearten" nav.
 * Each page shows a scoped subset of the mock deals for this UI milestone.
 */
export const travelCategories: TravelCategory[] = [
  {
    slug: "pauschalreisen",
    name: "Pauschalreisen",
    title: "Pauschalreisen – Flug & Hotel Angebote | Urlaubspanda",
    description:
      "Pauschalreisen mit Flug inklusive: Hotel, Flug und oft Transfer in einem Angebot – vergleiche Top-Deals bei Urlaubspanda.",
    heading: "Pauschalreisen",
    intro:
      "Alles in einem Paket: Flug, Hotel und oft Transfer. Hier findest du unsere besten Pauschalangebote mit Flug inklusive.",
    sectionTitle: "Pauschalreisen für deinen Traumurlaub",
    match: (deal) => deal.flightIncluded,
  },
  {
    slug: "wellness",
    name: "Wellness",
    title: "Wellness Urlaub – Spa & Thermen Angebote | Urlaubspanda",
    description:
      "Wellness-Urlaub mit Spa, Thermen und Entspannung: geprüfte Wellness-Hotels und Deals bei Urlaubspanda.",
    heading: "Wellness",
    intro:
      "Entspannen, aufladen, genießen – unsere Wellness-Angebote mit Spa, Thermen und erholsamen Hotels.",
    sectionTitle: "Wellness-Angebote für dich",
    match: (deal) => deal.tags.includes("wellness"),
  },
  {
    slug: "eigene-anreise",
    name: "Eigene Anreise",
    title: "Eigene Anreise – Hotel ohne Flug | Urlaubspanda",
    description:
      "Urlaub mit eigener Anreise: Hotels ohne Flug – ideal für Autoreisen und spontane Wochenenden bei Urlaubspanda.",
    heading: "Eigene Anreise",
    intro:
      "Du reist selbst an? Hier findest du Hotels und Angebote ohne Flug – perfekt für die Anreise mit dem Auto oder Zug.",
    sectionTitle: "Angebote mit eigener Anreise",
    match: (deal) => !deal.flightIncluded,
  },
  {
    slug: "last-minute",
    name: "Last Minute",
    title: "Last Minute Deals – Spontane Urlaubsangebote | Urlaubspanda",
    description:
      "Last-Minute-Deals und spontane Reiseangebote zu Top-Preisen – jetzt zuschlagen bei Urlaubspanda.",
    heading: "Last Minute",
    intro:
      "Spontan verreisen lohnt sich: aktuelle Last-Minute-Angebote mit starken Rabatten.",
    sectionTitle: "Last-Minute-Angebote",
    match: (deal) => deal.tags.includes("last-minute"),
  },
];

export function getTravelCategory(slug: string): TravelCategory | undefined {
  return travelCategories.find((category) => category.slug === slug);
}

export function getCategoryDeals(category: TravelCategory): Deal[] {
  return deals.filter(category.match);
}

export function getCategoryDealsBySlug(slug: string): Deal[] {
  const category = getTravelCategory(slug);
  return category ? getCategoryDeals(category) : [];
}
