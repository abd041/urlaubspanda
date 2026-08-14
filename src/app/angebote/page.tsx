import type { Metadata } from "next";
import { Suspense } from "react";
import { DealsExplorer, DealsExplorerFallback } from "@/components/home/DealsExplorer";
import { DealsIndex } from "@/components/home/DealsIndex";
import { TrustStrip } from "@/components/home/TrustStrip";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, dealsItemListJsonLd } from "@/lib/structuredData";
import { deals } from "@/data/deals";

const title = "Alle Angebote – Pauschalreisen & Last-Minute-Deals | Urlaubspanda";
const description =
  "Alle geprüften Urlaubspanda-Angebote auf einen Blick: Pauschalreisen, Last-Minute-Deals, Wellness und mehr – filtere nach deinen Wünschen und finde dein Traumhotel.";
const path = "/angebote";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: { title, description, url: path },
  twitter: { title, description },
};

export default function AllDealsPage() {
  return (
    <main className="pb-10 sm:pb-16">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Startseite", path: "/" },
          { name: "Angebote", path: "/angebote" },
        ])}
      />
      <JsonLd data={dealsItemListJsonLd(deals)} />

      <DealsIndex deals={deals} />

      <Suspense
        fallback={
          <DealsExplorerFallback
            deals={deals}
            sectionTitleKey="pages.dealsSection"
            showAllDealsLink={false}
          />
        }
      >
        <DealsExplorer deals={deals} sectionTitleKey="pages.dealsSection" showAllDealsLink={false} />
      </Suspense>

      <TrustStrip />
    </main>
  );
}
