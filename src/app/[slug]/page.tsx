import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { DealsExplorer, DealsExplorerFallback } from "@/components/home/DealsExplorer";
import { TrustStrip } from "@/components/home/TrustStrip";
import { CountryLandingStart } from "@/components/country/CountryLandingStart";
import { CountrySeoContent } from "@/components/country/CountrySeoContent";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, dealsItemListJsonLd } from "@/lib/structuredData";
import { destinationPath } from "@/lib/destinationPaths";
import { countrySearchShouldNoIndex } from "@/lib/countryFilterUrl";
import { destinations } from "@/data/destinations";
import { deals } from "@/data/deals";
import { DESTINATION_FILTER_KEYS } from "@/data/filters";

function getDestination(slug: string) {
  return destinations.find((destination) => destination.slug === slug);
}

/** Prerender every known country/category landing at `/oesterreich` etc. */
export function generateStaticParams() {
  return destinations.map((destination) => ({ slug: destination.slug }));
}

export async function generateMetadata({
  params,
  searchParams,
}: PageProps<"/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const query = await searchParams;
  const destination = getDestination(slug);
  if (!destination) return {};

  const title = `${destination.name} Urlaub – Angebote & Pauschalreisen | Urlaubspanda`;
  const description =
    destination.intro ??
    `Entdecke geprüfte ${destination.name}-Angebote zu Top-Preisen, ehrlich verglichen mit Urlaubspanda.`;
  const path = destinationPath(destination.slug);
  const noindex = countrySearchShouldNoIndex(query);

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path },
    twitter: { title, description },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}

export default async function CountryPage({ params }: PageProps<"/[slug]">) {
  const { slug } = await params;
  const destination = getDestination(slug);
  if (!destination) notFound();

  const countryDeals = deals.filter(
    (deal) => deal.destinationCountry === destination.name
  );
  const hasNoDealsAtAll = countryDeals.length === 0;
  const filterKeys = DESTINATION_FILTER_KEYS[destination.slug];
  const path = destinationPath(destination.slug);

  const emptyTitle = hasNoDealsAtAll
    ? `Aktuell keine Angebote für ${destination.name}`
    : undefined;
  const emptyDescription = hasNoDealsAtAll
    ? `Wir arbeiten an einer Auswahl geprüfter ${destination.name}-Deals. Schau bald wieder vorbei oder entdecke andere Reiseziele.`
    : undefined;

  return (
    <main className="pb-10 sm:pb-16">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Startseite", path: "/" },
          { name: "Reiseziele", path: "/reiseziele" },
          { name: destination.name, path },
        ])}
      />
      {!hasNoDealsAtAll && <JsonLd data={dealsItemListJsonLd(countryDeals)} />}

      <CountryLandingStart slug={destination.slug} />

      <Suspense
        fallback={
          <DealsExplorerFallback
            deals={countryDeals}
            showAllDealsLink={false}
            filterKeys={filterKeys ?? []}
            destinationSlug={destination.slug}
            countryName={destination.name}
            emptyTitle={emptyTitle}
            emptyDescription={emptyDescription}
          />
        }
      >
        <DealsExplorer
          deals={countryDeals}
          showAllDealsLink={false}
          filterKeys={filterKeys ?? []}
          destinationSlug={destination.slug}
          countryName={destination.name}
          emptyTitle={emptyTitle}
          emptyDescription={emptyDescription}
          popularSpots={destination.popularSpots}
        />
      </Suspense>

      {(destination.seoContent?.length ||
        destination.overviewFacts?.length ||
        destination.faqs?.length) && (
        <CountrySeoContent
          countrySlug={destination.slug}
          blocks={destination.seoContent ?? []}
          overviewFacts={destination.overviewFacts}
          faqs={destination.faqs}
        />
      )}

      <TrustStrip />
    </main>
  );
}
