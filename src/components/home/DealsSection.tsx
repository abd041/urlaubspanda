"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown, Loader2 } from "lucide-react";
import type { Deal } from "@/types";
import { Container } from "@/components/layout/Container";
import { DealGrid } from "@/components/home/DealGrid";
import { useT } from "@/i18n/LocaleProvider";
import { Reveal, easePremium, motion, useReducedMotion } from "@/components/motion/Reveal";

/**
 * Deals render in batches instead of all at once, so a large future result
 * set never dumps hundreds of cards (and their images) into the DOM on
 * first load. Matches the "no loading of hundreds of deals at once" note in
 * the client's homepage spec.
 */
const PAGE_SIZE = 6;

type SortOption = "beliebtheit" | "rabatt" | "preis" | "bewertung";

const sortOptionKeys: { value: SortOption; labelKey: string }[] = [
  { value: "beliebtheit", labelKey: "deals.sortPopularity" },
  { value: "rabatt", labelKey: "deals.sortDiscount" },
  { value: "preis", labelKey: "deals.sortPrice" },
  { value: "bewertung", labelKey: "deals.sortRating" },
];

function sortDeals(deals: Deal[], sort: SortOption): Deal[] {
  const sorted = [...deals];
  switch (sort) {
    case "rabatt":
      return sorted.sort((a, b) => b.discountPercent - a.discountPercent);
    case "preis":
      return sorted.sort((a, b) => a.currentPrice - b.currentPrice);
    case "bewertung":
      return sorted.sort((a, b) => b.reviewScore - a.reviewScore);
    default:
      return sorted;
  }
}

interface DealsSectionProps {
  deals: Deal[];
  /** Section heading. Defaults to the homepage copy. */
  title?: string;
  /** "Alle anzeigen" link target; omit to hide the link entirely (e.g. on a country page that has no separate all-deals page). */
  allDealsHref?: string;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function DealsSection({
  deals,
  title,
  allDealsHref = "/angebote",
  emptyTitle,
  emptyDescription,
}: DealsSectionProps) {
  const t = useT();
  const reduce = useReducedMotion();
  const heading = title ?? t("home.dealsTitle");
  const [sort, setSort] = useState<SortOption>("beliebtheit");
  const sortedDeals = useMemo(() => sortDeals(deals, sort), [deals, sort]);

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Stable identity for the current result set so we can reset pagination
  // after filters/sort change without setState-during-render (which can
  // cascade into hydration / DOM insertBefore errors).
  const dealsKey = useMemo(() => deals.map((deal) => deal.id).join(","), [deals]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
    setIsLoadingMore(false);
  }, [dealsKey, sort]);

  const visibleDeals = sortedDeals.slice(0, visibleCount);
  const remainingCount = sortedDeals.length - visibleDeals.length;

  function handleLoadMore() {
    setIsLoadingMore(true);
    window.setTimeout(() => {
      setVisibleCount((count) => count + PAGE_SIZE);
      setIsLoadingMore(false);
    }, 350);
  }

  return (
    <section id="deals" aria-labelledby="top-angebote-heading" className="mt-8 scroll-mt-24 pb-4 sm:mt-10 sm:pb-6">
      <Container>
        <Reveal className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
          <div className="min-w-0">
            <div className="flex items-center justify-between gap-3 sm:block">
              <h2
                id="top-angebote-heading"
                className="min-w-0 text-[1.75rem] font-medium tracking-[-0.03em] text-ink sm:text-[2.125rem] xl:text-[2.375rem] xl:leading-[1.12]"
              >
                {heading}
              </h2>
              {allDealsHref && (
                <Link
                  href={allDealsHref}
                  className="group inline-flex shrink-0 items-center gap-1 whitespace-nowrap text-[13px] font-medium text-brand-500 transition hover:text-brand-600 sm:hidden"
                >
                  {t("deals.showAll")}
                  <ArrowRight className="h-3.5 w-3.5 shrink-0 transition-transform duration-300 group-hover:translate-x-0.75" />
                </Link>
              )}
            </div>
            <p className="mt-2 text-[15px] font-normal leading-relaxed text-body">
              {t("deals.showing", {
                visible: visibleDeals.length,
                total: sortedDeals.length,
                word: sortedDeals.length === 1 ? t("deals.offer") : t("deals.offers"),
              })}
            </p>
          </div>

          <div className="flex items-center justify-between gap-3 sm:justify-end sm:pb-0.5">
            <label className="hidden items-center gap-2.5 text-sm text-body sm:flex">
              {t("deals.sort")}
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value as SortOption)}
                className="rounded-lg border border-[rgba(15,23,42,0.08)] bg-white px-3 py-2 text-sm font-medium text-ink transition focus:border-brand-500 focus:outline-none focus-visible:outline-2 focus-visible:outline-brand-500"
              >
                {sortOptionKeys.map((option) => (
                  <option key={option.value} value={option.value}>
                    {t(option.labelKey)}
                  </option>
                ))}
              </select>
            </label>

            {allDealsHref && (
              <Link
                href={allDealsHref}
                className="group hidden shrink-0 items-center gap-1.5 text-[13px] font-medium text-brand-500 transition hover:text-brand-600 sm:inline-flex"
              >
                {t("deals.showAll")}
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.75" />
              </Link>
            )}
          </div>
        </Reveal>

        <div className="mt-9 sm:mt-10">
          <DealGrid deals={visibleDeals} emptyTitle={emptyTitle} emptyDescription={emptyDescription} />
        </div>

        {remainingCount > 0 && (
          <Reveal className="mt-10 flex justify-center">
            <motion.button
              type="button"
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              aria-busy={isLoadingMore}
              whileTap={reduce || isLoadingMore ? undefined : { scale: 0.98 }}
              transition={{ duration: 0.15, ease: easePremium }}
              className="inline-flex items-center gap-2 rounded-full border border-[rgba(15,23,42,0.08)] bg-white px-6 py-2.5 text-sm font-medium text-ink shadow-[0_1px_3px_rgba(15,23,42,0.04)] transition hover:border-[rgba(15,23,42,0.14)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoadingMore ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <ChevronDown className="h-4 w-4" aria-hidden="true" />
              )}
              <span>{isLoadingMore ? t("deals.loading") : t("deals.loadMore")}</span>
              {!isLoadingMore && (
                <span className="text-muted">
                  {t("deals.moreCount", { count: Math.min(remainingCount, PAGE_SIZE) })}
                </span>
              )}
            </motion.button>
          </Reveal>
        )}
      </Container>
    </section>
  );
}
