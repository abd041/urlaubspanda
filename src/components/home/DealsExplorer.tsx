"use client";

import type { Deal, FilterKey, PopularSpot } from "@/types";
import { useFilterSelection } from "@/hooks/useFilterSelection";
import { useOrtFilter } from "@/hooks/useOrtFilter";
import { FilterSection } from "@/components/home/FilterSection";
import { DealsSection } from "@/components/home/DealsSection";
import { CountryTopDestinations } from "@/components/country/CountryTopDestinations";
import { NoIndexMeta } from "@/components/seo/NoIndexMeta";
import { HOMEPAGE_FILTER_KEYS } from "@/data/filters";
import { dealMatchesAllFilters } from "@/lib/dealFilters";
import { dealMatchesOrt } from "@/lib/ortFilter";
import { destinationDealsHeadingLocalized, destinationName } from "@/i18n/content";
import { useLocale, useT } from "@/i18n/LocaleProvider";
import { useMemo } from "react";

interface DealsExplorerProps {
  deals: Deal[];
  sectionTitle?: string;
  allDealsHref?: string;
  showAllDealsLink?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  filterKeys?: FilterKey[];
  destinationSlug?: string;
  countryName?: string;
  sectionTitleKey?: string;
  popularSpots?: PopularSpot[];
}

function useExplorerCopy({
  sectionTitle,
  sectionTitleKey,
  destinationSlug,
  emptyTitle,
  emptyDescription,
}: Pick<
  DealsExplorerProps,
  "sectionTitle" | "sectionTitleKey" | "destinationSlug" | "emptyTitle" | "emptyDescription"
>) {
  const { locale } = useLocale();
  const t = useT();

  const title = sectionTitleKey
    ? t(sectionTitleKey)
    : destinationSlug
      ? destinationDealsHeadingLocalized(destinationSlug, locale)
      : sectionTitle;

  const resolvedEmptyTitle =
    emptyTitle && destinationSlug
      ? t("deals.countryEmptyTitle", { name: destinationName(destinationSlug, locale) })
      : emptyTitle;
  const resolvedEmptyDescription =
    emptyDescription && destinationSlug
      ? t("deals.countryEmptyDescription", { name: destinationName(destinationSlug, locale) })
      : emptyDescription;

  return { title, resolvedEmptyTitle, resolvedEmptyDescription };
}

/**
 * Owns filter URL state + deals list. Homepage and country pages both use
 * icon-chip filters + a 3-up deal grid so the product feels like one site.
 */
export function DealsExplorer({
  deals,
  sectionTitle,
  allDealsHref,
  showAllDealsLink = true,
  emptyTitle,
  emptyDescription,
  filterKeys = HOMEPAGE_FILTER_KEYS,
  destinationSlug,
  sectionTitleKey,
  popularSpots,
}: DealsExplorerProps) {
  const { selected, isSelected, toggle, remove, reset, isMultiFilterQuery } =
    useFilterSelection({ destinationSlug });
  const { selectedOrt, toggleOrt, clearOrt } = useOrtFilter();
  const { locale } = useLocale();
  const t = useT();
  const localizedCountry = destinationSlug
    ? destinationName(destinationSlug, locale)
    : "";
  const { title, resolvedEmptyTitle, resolvedEmptyDescription } = useExplorerCopy({
    sectionTitle,
    sectionTitleKey,
    destinationSlug,
    emptyTitle,
    emptyDescription,
  });

  const filteredDeals = useMemo(
    () =>
      deals.filter(
        (deal) =>
          dealMatchesAllFilters(deal, selected) && dealMatchesOrt(deal, selectedOrt)
      ),
    [deals, selected, selectedOrt]
  );

  return (
    <>
      <NoIndexMeta active={isMultiFilterQuery || Boolean(selectedOrt)} />
      {popularSpots && popularSpots.length > 0 && localizedCountry ? (
        <CountryTopDestinations
          countryName={localizedCountry}
          spots={popularSpots}
          selectedOrt={selectedOrt}
          onSelectOrt={toggleOrt}
          onClearOrt={clearOrt}
        />
      ) : destinationSlug ? (
        <div className="bg-surface px-4 pb-2 pt-4 sm:px-6 sm:pt-5">
          <div className="mx-auto flex max-w-7xl justify-center">
            <button
              type="button"
              onClick={() => {
                clearOrt();
                window.requestAnimationFrame(() => {
                  document
                    .getElementById("filters")
                    ?.scrollIntoView({ behavior: "smooth", block: "start" });
                });
              }}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand-500 px-6 text-sm font-bold text-white shadow-[0_8px_20px_rgba(27,99,235,0.18)] transition hover:bg-brand-600"
            >
              {t("country.viewAllDeals")}
            </button>
          </div>
        </div>
      ) : null}
      <FilterSection
        selected={selected}
        isSelected={isSelected}
        toggle={toggle}
        remove={remove}
        reset={reset}
        filterKeys={filterKeys}
      />
      <DealsSection
        deals={filteredDeals}
        title={title}
        allDealsHref={showAllDealsLink ? allDealsHref : ""}
        emptyTitle={resolvedEmptyTitle}
        emptyDescription={resolvedEmptyDescription}
      />
    </>
  );
}

function noop() {}

export function DealsExplorerFallback({
  deals,
  sectionTitle,
  allDealsHref,
  showAllDealsLink = true,
  emptyTitle,
  emptyDescription,
  filterKeys = HOMEPAGE_FILTER_KEYS,
  destinationSlug,
  sectionTitleKey,
  initialSelected = [],
}: DealsExplorerProps & { initialSelected?: FilterKey[] }) {
  const previewDeals = deals.filter((deal) =>
    dealMatchesAllFilters(deal, initialSelected)
  );
  const { title, resolvedEmptyTitle, resolvedEmptyDescription } = useExplorerCopy({
    sectionTitle,
    sectionTitleKey,
    destinationSlug,
    emptyTitle,
    emptyDescription,
  });

  return (
    <>
      <FilterSection
        selected={initialSelected}
        isSelected={(key) => initialSelected.includes(key)}
        toggle={noop}
        remove={noop}
        reset={noop}
        filterKeys={filterKeys}
      />
      <DealsSection
        deals={previewDeals}
        title={title}
        allDealsHref={showAllDealsLink ? allDealsHref : ""}
        emptyTitle={resolvedEmptyTitle}
        emptyDescription={resolvedEmptyDescription}
      />
    </>
  );
}
