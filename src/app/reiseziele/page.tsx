import type { Metadata } from "next";
import { TrustStrip } from "@/components/home/TrustStrip";
import { DestinationsIndex } from "@/components/destinations/DestinationsIndex";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, destinationsItemListJsonLd } from "@/lib/structuredData";
import { destinationsInDisplayOrder } from "@/data/destinations";
import { deals } from "@/data/deals";

const title = "Alle Reiseziele – Länder & Regionen im Überblick | Urlaubspanda";
const description =
  "Entdecke alle Urlaubspanda-Reiseziele auf einen Blick: von Österreich und Deutschland bis Griechenland, Ägypten und Städtereisen – finde geprüfte Angebote für dein nächstes Reiseziel.";
const path = "/reiseziele";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: { title, description, url: path },
  twitter: { title, description },
};

export default function AllDestinationsPage() {
  const destinations = destinationsInDisplayOrder();
  const items = destinations.map((destination) => {
    const countryDeals = deals.filter((deal) => deal.destinationCountry === destination.name);
    const fromPrice =
      countryDeals.length > 0
        ? Math.min(...countryDeals.map((deal) => deal.currentPrice))
        : null;
    return {
      destination,
      offerCount: countryDeals.length,
      fromPrice,
    };
  });

  return (
    <main className="pb-10 sm:pb-16">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Startseite", path: "/" },
          { name: "Reiseziele", path: "/reiseziele" },
        ])}
      />
      <JsonLd data={destinationsItemListJsonLd(destinations)} />

      <DestinationsIndex items={items} />
      <TrustStrip />
    </main>
  );
}
