"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Deal } from "@/types";
import { DealCard } from "@/components/home/DealCard";
import { Container } from "@/components/layout/Container";
import { destinationPath } from "@/lib/destinationPaths";
import { destinations } from "@/data/destinations";
import { useT } from "@/i18n/LocaleProvider";

/** Up to 3 similar deals from the same country (exclude current). */
export function OfferSimilarDeals({
  current,
  candidates,
}: {
  current: Deal;
  candidates: Deal[];
}) {
  const t = useT();
  const similar = candidates
    .filter(
      (deal) =>
        deal.id !== current.id && deal.destinationCountry === current.destinationCountry
    )
    .slice(0, 3);

  if (similar.length === 0) return null;

  const country = destinations.find((d) => d.name === current.destinationCountry);
  const allHref = country ? destinationPath(country.slug) : "/angebote";

  return (
    <section
      id="aehnliche-deals"
      className="mt-12 scroll-mt-24 border-t border-line bg-surface py-10 sm:mt-16 sm:py-12"
      aria-labelledby="aehnliche-deals-heading"
    >
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2
            id="aehnliche-deals-heading"
            className="text-[1.75rem] font-medium tracking-[-0.03em] text-ink sm:text-[2.125rem]"
          >
            {t("offer.similarDeals")}
          </h2>
          <Link
            href={allHref}
            className="inline-flex items-center gap-1 text-sm font-semibold text-brand-500 transition hover:text-brand-600"
          >
            {t("offer.allDealsCategory")}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {similar.map((deal, index) => (
            <DealCard key={deal.id} deal={deal} priority={index === 0} />
          ))}
        </div>
      </Container>
    </section>
  );
}
