import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { DealsExplorer, DealsExplorerFallback } from "@/components/home/DealsExplorer";
import { TrustStrip } from "@/components/home/TrustStrip";
import { CountryHero } from "@/components/country/CountryHero";
import { CountrySeoContent } from "@/components/country/CountrySeoContent";
import { CountryIntro } from "@/components/country/CountryIntro";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, dealsItemListJsonLd } from "@/lib/structuredData";
import { destinationFilterPath, destinationPath } from "@/lib/destinationPaths";
import { countrySearchShouldNoIndex } from "@/lib/countryFilterUrl";
import { destinations } from "@/data/destinations";
import { deals } from "@/data/deals";
import {
  DESTINATION_FILTER_KEYS,
  getDestinationFilterSeoParams,
  getFilterOption,
} from "@/data/filters";
import type { FilterKey } from "@/types";

function getDestination(slug: string) {
  return destinations.find((destination) => destination.slug === slug);
}

/** Prerender every destination × relevant single-filter SEO URL (`/oesterreich/wellness`). */
export function generateStaticParams() {
  return getDestinationFilterSeoParams();
}

export async function generateMetadata({
  params,
  searchParams,
}: PageProps<"/[slug]/[filter]">): Promise<Metadata> {
  const { slug, filter } = await params;
  const query = await searchParams;
  const destination = getDestination(slug);
  const filterOption = getFilterOption(filter);
  const filterKey = filter as FilterKey;
  const allowed = DESTINATION_FILTER_KEYS[slug]?.includes(filterKey);
  if (!destination || !filterOption || !allowed) return {};

  const title = `${filterOption.label} in ${destination.name} – Angebote | Urlaubspanda`;
  const description = `Geprüfte ${filterOption.label}-Angebote in ${destination.name} zu Top-Preisen – ehrlich verglichen mit Urlaubspanda.`;
  const path = destinationFilterPath(destination.slug, filterOption.key);
  const noindex = countrySearchShouldNoIndex(query, filterKey);

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path },
    twitter: { title, description },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}

/**
 * SEO filter landing — same country chrome as `/{slug}` (full-bleed hero +
 * intro) so the layout never “breaks” vs the base country page.
 */
export default async function CountryFilterPage({
  params,
}: PageProps<"/[slug]/[filter]">) {
  const { slug, filter } = await params;
  const destination = getDestination(slug);
  const filterOption = getFilterOption(filter);
  const filterKey = filter as FilterKey;
  const allowed = DESTINATION_FILTER_KEYS[slug]?.includes(filterKey);

  if (!destination || !filterOption || !allowed) notFound();

  const countryDeals = deals.filter(
    (deal) => deal.destinationCountry === destination.name
  );
  const filteredDeals = countryDeals.filter((deal) => deal.tags.includes(filterKey));
  const filterKeys = DESTINATION_FILTER_KEYS[destination.slug];
  const countryPath = destinationPath(destination.slug);
  const path = destinationFilterPath(destination.slug, filterOption.key);

  const seoBlocks =
    destination.seoContent && destination.seoContent.length > 0
      ? destination.seoContent
      : [
          {
            heading: `${filterOption.label} in ${destination.name}`,
            paragraphs: [
              `Hier findest du geprüfte ${filterOption.label}-Angebote für ${destination.name}.`,
            ],
          },
        ];

  return (
    <main className="pb-10 sm:pb-16">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Startseite", path: "/" },
          { name: "Reiseziele", path: "/reiseziele" },
          { name: destination.name, path: countryPath },
          { name: filterOption.label, path },
        ])}
      />
      {filteredDeals.length > 0 && <JsonLd data={dealsItemListJsonLd(filteredDeals)} />}

      <CountryHero
        slug={destination.slug}
        image={destination.image}
        intro={destination.intro}
        deals={filteredDeals}
        filterKey={filterKey}
      />

      <CountryIntro kurzgesagt={destination.kurzgesagt} />

      <Suspense
        fallback={
          <DealsExplorerFallback
            deals={countryDeals}
            showAllDealsLink={false}
            filterKeys={filterKeys ?? []}
            destinationSlug={destination.slug}
            countryName={destination.name}
            initialSelected={[filterKey]}
          />
        }
      >
        <DealsExplorer
          deals={countryDeals}
          showAllDealsLink={false}
          filterKeys={filterKeys ?? []}
          destinationSlug={destination.slug}
          countryName={destination.name}
          popularSpots={destination.popularSpots}
        />
      </Suspense>

      <CountrySeoContent
        countrySlug={destination.slug}
        blocks={destination.seoContent?.length ? destination.seoContent : seoBlocks}
        overviewFacts={destination.overviewFacts}
        faqs={destination.faqs}
      />
      <TrustStrip />
    </main>
  );
}
