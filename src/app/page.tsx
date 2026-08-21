import { Suspense } from "react";
import { HomeHero } from "@/components/home/HomeHero";
import { PopularDestinations } from "@/components/home/PopularDestinations";
import { DealsExplorer, DealsExplorerFallback } from "@/components/home/DealsExplorer";
import { TrustStrip } from "@/components/home/TrustStrip";
import { JsonLd } from "@/components/seo/JsonLd";
import { dealsItemListJsonLd } from "@/lib/structuredData";
import { deals } from "@/data/deals";

export default function Home() {
  return (
    <main className="bg-surface pb-8 sm:pb-12">
      <JsonLd data={dealsItemListJsonLd(deals)} />
      <HomeHero />
      <PopularDestinations />
      <Suspense fallback={<DealsExplorerFallback deals={deals} />}>
        <DealsExplorer deals={deals} />
      </Suspense>
      <TrustStrip />
    </main>
  );
}
