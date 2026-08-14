"use client";

import { BreadcrumbNav } from "@/components/i18n/PageChrome";
import { destinationPath } from "@/lib/destinationPaths";
import { useLocale } from "@/i18n/LocaleProvider";
import { destinationName, filterLabel } from "@/i18n/content";
import type { FilterKey } from "@/types";

export function CountryBreadcrumb({
  slug,
  filterKey,
  contained = true,
  tone = "default",
}: {
  slug: string;
  filterKey?: FilterKey;
  contained?: boolean;
  tone?: "default" | "onDark";
}) {
  const { locale } = useLocale();
  const items: { href?: string; labelKey?: string; label?: string }[] = [
    { href: "/", labelKey: "nav.home" },
    { href: "/reiseziele", labelKey: "nav.destinations" },
    {
      href: destinationPath(slug),
      label: destinationName(slug, locale),
    },
  ];
  if (filterKey) {
    items.push({ label: filterLabel(filterKey, locale) });
  }
  return <BreadcrumbNav items={items} contained={contained} tone={tone} />;
}
