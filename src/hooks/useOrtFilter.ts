"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ORT_QUERY_KEY } from "@/lib/ortFilter";

/**
 * Country-page location (Ort) filter, backed by `?ort=Hurghada`.
 * Clicking a Top-Destination card sets this; deals below filter by region.
 */
export function useOrtFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedOrt = searchParams.get(ORT_QUERY_KEY);

  const setOrt = useCallback(
    (ort: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (!ort) {
        params.delete(ORT_QUERY_KEY);
      } else {
        params.set(ORT_QUERY_KEY, ort);
      }
      const query = params.toString();
      router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const toggleOrt = useCallback(
    (ort: string) => {
      setOrt(selectedOrt === ort ? null : ort);
    },
    [selectedOrt, setOrt]
  );

  const clearOrt = useCallback(() => setOrt(null), [setOrt]);

  return useMemo(
    () => ({
      selectedOrt,
      setOrt,
      toggleOrt,
      clearOrt,
      isOrtSelected: (ort: string) => selectedOrt === ort,
    }),
    [selectedOrt, setOrt, toggleOrt, clearOrt]
  );
}
