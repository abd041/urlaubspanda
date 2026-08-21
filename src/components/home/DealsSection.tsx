"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown, Loader2 } from "lucide-react";
import type { Deal } from "@/types";
import { Container } from "@/components/layout/Container";
import { DealGrid } from "@/components/home/DealGrid";
import { useT } from "@/i18n/LocaleProvider";
import { easePremium, motion, useReducedMotion } from "@/components/motion/Reveal";
import { getAllDealClickCounts, getServerDealClickCounts } from "@/lib/dealClicks";

const PAGE_SIZE = 6;

type SortOption = "beliebtheit" | "rabatt" | "preis" | "bewertung";

const sortOptionKeys: { value: SortOption; labelKey: string }[] = [
  { value: "beliebtheit", labelKey: "deals.sortPopularity" },
  { value: "rabatt", labelKey: "deals.sortDiscount" },
  { value: "preis", labelKey: "deals.sortPrice" },
  { value: "bewertung", labelKey: "deals.sortRating" },
];

function sortDeals(deals: Deal[], sort: SortOption, clicks: Record<string, number>): Deal[] {
  const sorted = [...deals];
  switch (sort) {
    case "rabatt":
      return sorted.sort((a, b) => b.discountPercent - a.discountPercent);
    case "preis":
      return sorted.sort((a, b) => a.currentPrice - b.currentPrice);
    case "bewertung":
      return sorted.sort((a, b) => b.reviewScore - a.reviewScore);
    case "beliebtheit":
    default:
      return sorted.sort((a, b) => {
        const clickDiff = (clicks[b.id] ?? 0) - (clicks[a.id] ?? 0);
        if (clickDiff !== 0) return clickDiff;
        return (b.bookingCount ?? 0) - (a.bookingCount ?? 0);
      });
  }
}

function subscribeClicks(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("urlaubspanda:deal-click", onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener("urlaubspanda:deal-click", onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

interface DealsSectionProps {
  deals: Deal[];
  title?: string;
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
  const clicks = useSyncExternalStore(subscribeClicks, getAllDealClickCounts, getServerDealClickCounts);
  const sortedDeals = useMemo(() => sortDeals(deals, sort, clicks), [deals, sort, clicks]);

  const dealsKey = useMemo(() => deals.map((deal) => deal.id).join(","), [deals]);
  const pageKey = `${dealsKey}:${sort}`;
  const [visibleByKey, setVisibleByKey] = useState<Record<string, number>>({});
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const visibleCount = visibleByKey[pageKey] ?? PAGE_SIZE;

  const visibleDeals = sortedDeals.slice(0, visibleCount);
  const remainingCount = sortedDeals.length - visibleDeals.length;

  function handleLoadMore() {
    setIsLoadingMore(true);
    window.setTimeout(() => {
      setVisibleByKey((prev) => ({
        ...prev,
        [pageKey]: (prev[pageKey] ?? PAGE_SIZE) + PAGE_SIZE,
      }));
      setIsLoadingMore(false);
    }, 50);
  }

  return (
    <section id="deals" aria-labelledby="top-angebote-heading" className="mt-1 scroll-mt-24 pb-4 sm:mt-2 sm:pb-6">
      <Container>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
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

          <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-end sm:pb-0.5">
            <label className="flex min-w-0 flex-1 items-center gap-2.5 text-sm text-body sm:flex-none">
              <span className="shrink-0">{t("deals.sort")}</span>
              <span className="relative min-w-0 flex-1 sm:min-w-44">
                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value as SortOption)}
                  className="h-10 w-full appearance-none rounded-lg border border-[rgba(15,23,42,0.08)] bg-white py-2 pl-3 pr-9 text-sm font-medium text-ink transition focus:border-brand-500 focus:outline-none focus-visible:outline-2 focus-visible:outline-brand-500"
                >
                  {sortOptionKeys.map((option) => (
                    <option key={option.value} value={option.value}>
                      {t(option.labelKey)}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink"
                  aria-hidden="true"
                />
              </span>
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
        </div>

        <div className="mt-4 sm:mt-5">
          <DealGrid deals={visibleDeals} emptyTitle={emptyTitle} emptyDescription={emptyDescription} />
        </div>

        {remainingCount > 0 && (
          <div className="mt-10 flex justify-center">
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
          </div>
        )}
      </Container>
    </section>
  );
}
