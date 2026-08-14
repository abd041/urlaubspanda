"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { Deal, FilterKey } from "@/types";
import { Container } from "@/components/layout/Container";
import { CountryBreadcrumb } from "@/components/country/CountryBreadcrumb";
import { HeroFeaturedDeal } from "@/components/home/HeroFeaturedDeal";
import { destinationImagePosition } from "@/components/home/DestinationCard";
import { RevealItem, RevealMount, RevealMountGroup } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";
import { localeTag } from "@/i18n/config";
import { useLocale, useT } from "@/i18n/LocaleProvider";
import { destinationName, destinationSubtitle, filterLabel, tx } from "@/i18n/content";

function formatFromPrice(value: number, locale: "de" | "en") {
  return `${new Intl.NumberFormat(localeTag(locale), { maximumFractionDigits: 0 }).format(value)} €`;
}

const headingClass =
  "mt-4 max-w-xl text-[2.15rem] font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.35rem] lg:leading-[1.05]";
const highlightClass =
  "bg-[linear-gradient(transparent_58%,rgba(255,255,255,0.28)_58%)] pr-1 font-extrabold italic";

export function CountryHero({
  slug,
  image,
  intro,
  deals = [],
  filterKey,
}: {
  slug: string;
  image: string;
  intro?: string;
  deals?: Deal[];
  filterKey?: FilterKey;
}) {
  const { locale } = useLocale();
  const t = useT();
  const name = destinationName(slug, locale);
  const subtitle = destinationSubtitle(slug, locale);
  const filterName = filterKey ? filterLabel(filterKey, locale) : null;
  const heading = filterName
    ? `${filterName} ${t("country.in")} ${name}`
    : slug === "staedtereisen"
      ? name
      : `${t("country.holidayInBefore")} ${name}`;
  const fromPrice =
    deals.length > 0 ? Math.min(...deals.map((deal) => deal.currentPrice)) : null;
  const count = new Intl.NumberFormat(localeTag(locale)).format(deals.length);
  const hasDeals = deals.length > 0;

  return (
    <section aria-labelledby="country-hero-heading" className="relative overflow-hidden bg-ink">
      <Image
        src={image}
        alt={heading}
        fill
        priority
        sizes="100vw"
        className={cn(
          "z-0 object-cover",
          destinationImagePosition[slug] ?? "object-center"
        )}
      />
      <div
        className="absolute inset-0 z-[1] bg-[linear-gradient(105deg,rgba(8,12,20,0.78)_0%,rgba(8,12,20,0.42)_46%,rgba(8,12,20,0.22)_100%)]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 z-[1] bg-linear-to-t from-black/55 via-transparent to-black/25"
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 bottom-0 z-[1] h-24 bg-linear-to-t from-surface to-transparent sm:h-32"
        aria-hidden="true"
      />

      <Container className="relative z-10 flex min-h-[420px] flex-col pt-4 pb-12 sm:min-h-[500px] sm:pt-6 sm:pb-16 lg:min-h-[560px] lg:pb-20">
        <CountryBreadcrumb slug={slug} filterKey={filterKey} contained={false} tone="onDark" />

        <div className="mt-8 grid flex-1 items-end gap-10 sm:mt-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14">
          <RevealMountGroup className="min-w-0">
            <RevealItem as="p" className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/75">
              {subtitle}
            </RevealItem>
            <RevealItem>
              <h1 id="country-hero-heading" className={headingClass}>
                {filterName ? (
                  <>
                    {filterName} {t("country.in")}{" "}
                    <em className={highlightClass}>{name}</em>
                  </>
                ) : slug === "staedtereisen" ? (
                  <em className={highlightClass}>{name}</em>
                ) : (
                  <>
                    {t("country.holidayInBefore")}{" "}
                    <em className={highlightClass}>{name}</em>
                  </>
                )}
              </h1>
            </RevealItem>
            {intro && (
              <RevealItem
                as="p"
                className="mt-5 max-w-lg text-[15px] leading-relaxed text-white/85 sm:text-base sm:leading-7"
              >
                {tx(intro, locale)}
              </RevealItem>
            )}
            <RevealItem>
              <div className="mt-6 flex flex-wrap gap-2">
                {hasDeals ? (
                  <>
                    <span className="rounded-full border border-white/20 bg-white/12 px-3.5 py-1.5 text-[13px] font-medium text-white backdrop-blur-sm">
                      {t("country.statOffers", { count })}
                    </span>
                    {fromPrice != null && (
                      <span className="rounded-full border border-white/20 bg-white/12 px-3.5 py-1.5 text-[13px] font-medium text-white backdrop-blur-sm">
                        {t("country.statFrom", { price: formatFromPrice(fromPrice, locale) })}
                      </span>
                    )}
                  </>
                ) : (
                  <span className="rounded-full border border-white/20 bg-white/12 px-3.5 py-1.5 text-[13px] font-medium text-white backdrop-blur-sm">
                    {t("pages.destinationsSoon")}
                  </span>
                )}
              </div>
              {hasDeals && (
                <a
                  href="#deals"
                  className="group mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-ink shadow-[0_8px_24px_rgba(8,12,20,0.18)] transition hover:bg-white/92"
                >
                  {t("country.browseDeals")}
                  <ArrowRight
                    className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-0.75"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                </a>
              )}
            </RevealItem>
          </RevealMountGroup>

          {hasDeals ? (
            <HeroFeaturedDeal deals={deals} onDark />
          ) : (
            <RevealMount className="min-w-0" delay={0.12}>
              <div className="flex min-h-[260px] flex-col justify-end rounded-[1.75rem] border border-white/15 bg-white/10 p-7 shadow-[0_24px_60px_rgba(15,26,43,0.18)] backdrop-blur-md sm:min-h-[300px] sm:p-8">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/70">
                  {t("pages.destinationsSoon")}
                </p>
                <p className="mt-3 max-w-sm text-lg font-semibold leading-snug text-white sm:text-xl">
                  {t("country.comingSoonBody", { name })}
                </p>
              </div>
            </RevealMount>
          )}
        </div>
      </Container>
    </section>
  );
}
