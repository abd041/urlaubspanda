import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { destinationFilterPath, destinationPath } from "@/lib/destinationPaths";
import { destinations } from "@/data/destinations";
import { deals } from "@/data/deals";
import { travelCategories } from "@/data/travelCategories";
import { getDestinationFilterSeoParams } from "@/data/filters";

/** Homepage + country landings + offer pages for Milestone 1. */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/reiseziele`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/angebote`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/merkliste`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.4,
    },
    {
      url: `${SITE_URL}/impressum`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/datenschutz`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/agb`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    ...travelCategories.map((category) => ({
      url: `${SITE_URL}/${category.slug}`,
      lastModified,
      changeFrequency: "daily" as const,
      priority: 0.85,
    })),
    ...destinations.map((destination) => ({
      url: `${SITE_URL}${destinationPath(destination.slug)}`,
      lastModified,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
    // Important destination + single-filter SEO landings (indexable).
    ...getDestinationFilterSeoParams().map(({ slug, filter }) => ({
      url: `${SITE_URL}${destinationFilterPath(slug, filter)}`,
      lastModified,
      changeFrequency: "daily" as const,
      priority: 0.75,
    })),
    ...deals.map((deal) => ({
      url: `${SITE_URL}/angebot/${deal.slug}`,
      lastModified,
      changeFrequency: "daily" as const,
      priority: 0.7,
    })),
  ];
}
