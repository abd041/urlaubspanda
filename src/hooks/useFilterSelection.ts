"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ATTRIBUTE_FILTER_KEYS, filterOptions } from "@/data/filters";
import { buildCountryFilterHref } from "@/lib/countryFilterUrl";
import { destinationPath } from "@/lib/destinationPaths";
import type { FilterKey } from "@/types";

const VALID_KEYS = new Set<string>(filterOptions.map((option) => option.key));

const FILTER_SEGMENT_RE =
  /\/(mit-flug|all-inclusive|direkte-strandlage|adults-only|familienhotel|thermenurlaub|wellness|urlaub-am-see|urlaub-am-meer|in-den-bergen|skiurlaub|ab-85-weiterempfehlung|fruehbucher|last-minute|zentrale-lage)$/;

function isPathEligible(key: FilterKey): boolean {
  return !ATTRIBUTE_FILTER_KEYS.has(key);
}

function parseQueryFilters(searchParams: URLSearchParams): FilterKey[] {
  const keys: FilterKey[] = [];
  for (const [key, value] of searchParams.entries()) {
    if (value === "1" && VALID_KEYS.has(key)) {
      keys.push(key as FilterKey);
    }
  }
  return keys;
}

function stripFilterQuery(searchParams: URLSearchParams): URLSearchParams {
  const params = new URLSearchParams(searchParams.toString());
  VALID_KEYS.forEach((key) => params.delete(key));
  return params;
}

export interface UseFilterSelectionOptions {
  /**
   * When set (country landing pages), a single filter uses the dedicated
   * SEO path `/{slug}/{filter}`; multiple filters stay on `/{slug}?a=1&b=1`.
   */
  destinationSlug?: string;
}

/**
 * Owns the "selected travel-type filters" state, backed by the URL.
 *
 * - Homepage / Angebote: `?mit-flug=1&wellness=1`
 * - Country pages: one filter → `/{slug}/{filter}`; several → `/{slug}?…`
 */
export function useFilterSelection(options: UseFilterSelectionOptions = {}) {
  const { destinationSlug } = options;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pathFilter = useMemo(() => {
    if (!destinationSlug) return null;
    const prefix = `${destinationPath(destinationSlug)}/`;
    if (!pathname.startsWith(prefix)) return null;
    const rest = pathname.slice(prefix.length).split("/")[0];
    if (!VALID_KEYS.has(rest)) return null;
    const key = rest as FilterKey;
    return isPathEligible(key) ? key : null;
  }, [destinationSlug, pathname]);

  const selected = useMemo(() => {
    const fromQuery = parseQueryFilters(searchParams);
    if (pathFilter) {
      return Array.from(new Set<FilterKey>([pathFilter, ...fromQuery]));
    }
    return fromQuery;
  }, [pathFilter, searchParams]);

  const applySelection = useCallback(
    (next: FilterKey[]) => {
      if (destinationSlug) {
        router.push(buildCountryFilterHref(destinationSlug, next, searchParams), {
          scroll: false,
        });
        return;
      }

      const basePath = pathname.replace(FILTER_SEGMENT_RE, "") || "/";
      const params = stripFilterQuery(searchParams);
      next.forEach((key) => params.set(key, "1"));
      const query = params.toString();
      router.push(query ? `${basePath}?${query}` : basePath, { scroll: false });
    },
    [destinationSlug, pathname, router, searchParams]
  );

  const toggle = useCallback(
    (key: FilterKey) => {
      applySelection(
        selected.includes(key) ? selected.filter((k) => k !== key) : [...selected, key]
      );
    },
    [selected, applySelection]
  );

  const remove = useCallback(
    (key: FilterKey) => {
      applySelection(selected.filter((k) => k !== key));
    },
    [selected, applySelection]
  );

  const reset = useCallback(() => applySelection([]), [applySelection]);

  const isSelected = useCallback((key: FilterKey) => selected.includes(key), [selected]);

  return useMemo(
    () => ({
      selected,
      toggle,
      remove,
      reset,
      isSelected,
      /** True when 2+ filters are active (should be noindex). */
      isMultiFilterQuery: selected.length > 1,
    }),
    [selected, toggle, remove, reset, isSelected]
  );
}
