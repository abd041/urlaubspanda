import type { Deal, Destination, OfferDetail } from "@/types";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { destinationPath } from "@/lib/destinationPaths";

function absoluteImage(src: string) {
  return src.startsWith("http://") || src.startsWith("https://") ? src : `${SITE_URL}${src}`;
}

/** Site-wide Organization schema, rendered once in the root layout. */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/opengraph-image`,
  };
}

/** Site-wide WebSite schema, rendered once in the root layout. */
export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: "de-AT",
  };
}

/**
 * Breadcrumb trail for a sub-page (e.g. a country landing page), so search
 * engines can render the breadcrumb path directly in search results.
 */
export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

/**
 * Homepage "Top Angebote" grid as an ItemList of Product/Offer entries, so
 * search engines can pick up price, rating and availability per deal.
 */
export function dealsItemListJsonLd(deals: Deal[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: deals.map((deal, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        "@id": `${SITE_URL}/angebot/${deal.slug}`,
        name: deal.name,
        image: deal.images.map(absoluteImage),
        description: deal.summary,
        ...(deal.reviewEnabled && {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: deal.reviewScore,
            bestRating: deal.reviewMaxScore,
            worstRating: 1,
            reviewCount: deal.reviewCount,
          },
        }),
        offers: {
          "@type": "Offer",
          url: `${SITE_URL}/angebot/${deal.slug}`,
          priceCurrency: "EUR",
          price: deal.currentPrice,
          availability: "https://schema.org/InStock",
        },
      },
    })),
  };
}

/**
 * Single-offer Product schema for the offer detail page, with the fuller
 * description and full gallery that the ItemList entries above intentionally
 * keep lightweight.
 */
export function offerDetailJsonLd(deal: Deal, detail: OfferDetail) {
  const path = `/angebot/${deal.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${SITE_URL}${path}`,
    name: deal.name,
    image: deal.images.map(absoluteImage),
    description: detail.descriptionParagraphs[0] ?? deal.summary,
    ...(deal.reviewEnabled && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: deal.reviewScore,
        bestRating: deal.reviewMaxScore,
        worstRating: 1,
        reviewCount: deal.reviewCount,
      },
    }),
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}${path}`,
      priceCurrency: "EUR",
      price: deal.currentPrice,
      availability: "https://schema.org/InStock",
    },
  };
}

/** Destinations overview (`/reiseziele`) as an ItemList of country landings. */
export function destinationsItemListJsonLd(items: Destination[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((destination, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${SITE_URL}${destinationPath(destination.slug)}`,
      name: destination.name,
    })),
  };
}
