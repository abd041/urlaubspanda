"use client";

import { BreadcrumbNav } from "@/components/i18n/PageChrome";
import { useLocale } from "@/i18n/LocaleProvider";
import { countryDisplayName, tx } from "@/i18n/content";
import { destinationPath } from "@/lib/destinationPaths";

export function OfferBreadcrumb({
  country,
  countrySlug,
  region,
  hotelName,
}: {
  country: string;
  countrySlug?: string;
  region: string;
  hotelName: string;
}) {
  const { locale } = useLocale();
  const countryLabel = countryDisplayName(country, locale);
  const regionLabel = tx(region, locale);

  return (
    <BreadcrumbNav
      items={[
        { href: "/", labelKey: "nav.home" },
        countrySlug
          ? { href: destinationPath(countrySlug), label: countryLabel }
          : { label: countryLabel },
        { label: regionLabel },
        { label: hotelName },
      ]}
    />
  );
}
