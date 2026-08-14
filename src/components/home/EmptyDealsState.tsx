"use client";

import Link from "next/link";
import { Compass, MapPin } from "lucide-react";
import { useT } from "@/i18n/LocaleProvider";

interface EmptyDealsStateProps {
  title: string;
  description: string;
}

/**
 * Polished empty state for country/filter combinations with no matching deals
 * (e.g. Südtirol). Replaces the old dashed placeholder box.
 */
export function EmptyDealsState({ title, description }: EmptyDealsStateProps) {
  const t = useT();
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-white px-6 py-12 text-center sm:px-10 sm:py-16">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-500">
        <MapPin className="h-6 w-6" aria-hidden="true" />
      </div>
      <h3 className="mt-5 text-xl font-bold tracking-tight text-ink sm:text-2xl">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-body sm:text-base">
        {description}
      </p>
      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/reiseziele"
          className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
        >
          <Compass className="h-4 w-4" aria-hidden="true" />
          {t("deals.emptyOther")}
        </Link>
        <Link
          href="/angebote"
          className="inline-flex items-center rounded-xl border border-line bg-white px-5 py-3 text-sm font-semibold text-ink transition hover:border-brand-200 hover:bg-brand-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
        >
          {t("deals.emptyAll")}
        </Link>
      </div>
    </div>
  );
}
