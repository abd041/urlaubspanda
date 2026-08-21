"use client";

import type { Deal, Destination } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";
import { DealCard } from "@/components/home/DealCard";
import { EmptyDealsState } from "@/components/home/EmptyDealsState";
import { destinationImagePosition } from "@/components/home/DestinationCard";
import { cn } from "@/lib/utils";
import { destinations, destinationsInDisplayOrder } from "@/data/destinations";
import { destinationPath } from "@/lib/destinationPaths";
import { useLocale, useT } from "@/i18n/LocaleProvider";
import { countryDisplayName, destinationName, destinationSubtitle } from "@/i18n/content";

interface DealGridProps {
  deals: Deal[];
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
}

export function DealGrid({
  deals,
  emptyTitle,
  emptyDescription,
  className,
}: DealGridProps) {
  const t = useT();
  const { locale } = useLocale();

  if (deals.length === 0) {
    return (
      <EmptyDealsState
        title={emptyTitle ?? t("deals.emptyTitle")}
        description={emptyDescription ?? t("deals.emptyDescription")}
      />
    );
  }

  if (deals.length === 1) {
    const deal = deals[0];
    const country = countryDisplayName(deal.destinationCountry, locale);
    const destination = destinations.find((item) => item.name === deal.destinationCountry);
    const otherDestinations = destinationsInDisplayOrder()
      .filter((item) => item.slug !== destination?.slug)
      .slice(0, 2);

    return (
      <div className={cn("grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-stretch lg:gap-6", className)}>
        <div className="h-full min-w-0">
          <DealCard deal={deal} priority />
        </div>
        <div className="h-full min-w-0 lg:col-span-2">
          {destination ? (
            <MoreDealsPanel
              country={country}
              destination={destination}
              others={otherDestinations}
            />
          ) : (
            <aside className="flex h-full flex-col justify-center rounded-2xl border border-[#eeeef2] bg-white px-6 py-10 shadow-[0_8px_24px_rgba(15,26,43,0.08)] lg:px-12">
              <p className="text-lg font-semibold tracking-tight text-ink">
                {t("deal.moreForCountry", { country })}
              </p>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-body sm:text-base">
                {t("deal.moreForCountryText", { country })}
              </p>
              <div className="mt-5">
                <Link
                  href="/reiseziele"
                  className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-600"
                >
                  <Compass className="h-4 w-4" aria-hidden="true" />
                  {t("deals.emptyOther")}
                </Link>
              </div>
            </aside>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6", className)}>
      {deals.map((deal, index) => (
        <div key={deal.id} className="h-full min-w-0">
          <DealCard deal={deal} priority={index < 3} />
        </div>
      ))}
    </div>
  );
}

function MoreDealsPanel({
  country,
  destination,
  others,
}: {
  country: string;
  destination: Destination;
  others: Destination[];
}) {
  const t = useT();
  const { locale } = useLocale();
  const name = destinationName(destination.slug, locale);
  const subtitle = destinationSubtitle(destination.slug, locale);

  return (
    <aside className="relative isolate flex h-full min-h-[380px] overflow-hidden rounded-2xl bg-ink shadow-[0_8px_24px_rgba(15,26,43,0.08)] sm:min-h-[440px]">
      <Image
        src={destination.image}
        alt={`${name} – ${subtitle}`}
        fill
        sizes="(min-width: 1024px) 66vw, 100vw"
        className={cn(
          "object-cover",
          destinationImagePosition[destination.slug] ?? "object-center"
        )}
      />
      <div
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,12,20,0.18)_0%,rgba(8,12,20,0.28)_42%,rgba(8,12,20,0.78)_100%)]"
        aria-hidden="true"
      />

      <div className="relative z-10 mt-auto flex w-full flex-col gap-6 p-5 sm:p-7 lg:flex-row lg:items-end lg:justify-between lg:gap-10 lg:p-8">
        <div className="min-w-0 max-w-lg">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/75">
            {t("pages.destinationsSoon")}
          </p>
          <p className="mt-2 text-[1.65rem] font-extrabold leading-[1.12] tracking-tight text-white sm:text-3xl">
            {t("deal.moreForCountry", { country })}
          </p>
          <p className="mt-2 text-[15px] leading-relaxed text-white/85 sm:text-base">
            {t("deal.moreForCountryText", { country })}
          </p>
          <div className="mt-5 flex flex-wrap gap-2.5">
            <Link
              href="/reiseziele"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-ink transition hover:bg-white/92"
            >
              <Compass className="h-4 w-4" aria-hidden="true" />
              {t("deals.emptyOther")}
            </Link>
            <Link
              href="/angebote"
              className="group inline-flex items-center gap-1.5 rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/16"
            >
              {t("deals.emptyAll")}
              <ArrowRight
                className="h-3.5 w-3.5 shrink-0 transition-transform duration-300 group-hover:translate-x-0.75"
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>

        {others.length > 0 && (
          <div className="shrink-0">
            <p className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-white/70">
              {t("deal.alsoDiscover")}
            </p>
            <div className="flex gap-3">
              {others.map((item) => {
                const otherName = destinationName(item.slug, locale);
                return (
                  <Link
                    key={item.slug}
                    href={destinationPath(item.slug)}
                    className="group relative block aspect-3/4 w-[6.75rem] overflow-hidden rounded-[12px] shadow-[0_8px_24px_rgba(8,12,20,0.28)] ring-1 ring-white/15 transition hover:-translate-y-0.5 sm:w-[7.5rem]"
                  >
                    <Image
                      src={item.image}
                      alt={otherName}
                      fill
                      sizes="120px"
                      className={cn(
                        "object-cover transition-transform duration-700 group-hover:scale-[1.04]",
                        destinationImagePosition[item.slug] ?? "object-center"
                      )}
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                    <span className="absolute inset-x-0 bottom-0 p-2.5 text-sm font-bold leading-tight text-white">
                      {otherName}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
