"use client";

import { Suspense } from "react";
import { DealsExplorer, DealsExplorerFallback } from "@/components/home/DealsExplorer";
import { CategoryIndex } from "@/components/home/CategoryIndex";
import { TrustStrip } from "@/components/home/TrustStrip";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, dealsItemListJsonLd } from "@/lib/structuredData";
import { getCategoryDealsBySlug, getTravelCategory } from "@/data/travelCategories";
import { useT } from "@/i18n/LocaleProvider";

export function TravelCategoryPage({ slug }: { slug: string }) {
  const category = getTravelCategory(slug);
  if (!category) return null;

  const categoryDeals = getCategoryDealsBySlug(slug);
  const path = `/${category.slug}`;
  const t = useT();
  const name = t(`category.${category.slug}.name`);

  return (
    <main className="pb-10 sm:pb-16">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: t("nav.home"), path: "/" },
          { name: category.name, path },
        ])}
      />
      <JsonLd data={dealsItemListJsonLd(categoryDeals)} />

      <CategoryIndex slug={category.slug} name={name} deals={categoryDeals} />

      <Suspense
        fallback={
          <DealsExplorerFallback
            deals={categoryDeals}
            sectionTitleKey={`category.${category.slug}.section`}
            showAllDealsLink={false}
          />
        }
      >
        <DealsExplorer
          deals={categoryDeals}
          sectionTitleKey={`category.${category.slug}.section`}
          showAllDealsLink={false}
        />
      </Suspense>

      <TrustStrip />
    </main>
  );
}
