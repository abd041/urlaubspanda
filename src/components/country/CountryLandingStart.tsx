"use client";

import { CountryBreadcrumb } from "@/components/country/CountryBreadcrumb";
import { destinationH1Localized, destinationName, filterLabel } from "@/i18n/content";
import { useLocale, useT } from "@/i18n/LocaleProvider";
import type { FilterKey } from "@/types";

/** Compact landing chrome after the hero is removed: breadcrumb + SEO h1. */
export function CountryLandingStart({
  slug,
  filterKey,
}: {
  slug: string;
  filterKey?: FilterKey;
}) {
  const { locale } = useLocale();
  const t = useT();
  const name = destinationName(slug, locale);
  const heading = filterKey
    ? `${filterLabel(filterKey, locale)} ${t("country.in")} ${name}`
    : destinationH1Localized(slug, locale);

  return (
    <div className="bg-surface">
      <CountryBreadcrumb slug={slug} filterKey={filterKey} />
      <h1 className="sr-only">{heading}</h1>
    </div>
  );
}
