"use client";

import Image from "next/image";
import { ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PopularSpot } from "@/types";
import { Container } from "@/components/layout/Container";
import { Carousel } from "@/components/ui/Carousel";
import { useLocale, useT } from "@/i18n/LocaleProvider";
import { tx } from "@/i18n/content";
import { scrollToOffersFiltersHeadline } from "@/lib/scrollToOffersFilters";

interface CountryTopDestinationsProps {
  countryName: string;
  spots: PopularSpot[];
  selectedOrt: string | null;
  onSelectOrt: (ort: string) => void;
  onClearOrt: () => void;
  showViewAllDeals?: boolean;
}

/** “Top-Destinationen für {country}” — click filters deals by Ort (`?ort=`). */
export function CountryTopDestinations({
  countryName,
  spots,
  selectedOrt,
  onSelectOrt,
  onClearOrt,
  showViewAllDeals = true,
}: CountryTopDestinationsProps) {
  const t = useT();
  const { locale } = useLocale();
  if (spots.length === 0) return null;

  const handleViewAllDeals = () => {
    onClearOrt();
    scrollToOffersFiltersHeadline();
  };

  return (
    <section
      className="bg-surface pt-4 pb-8 sm:pt-5 sm:pb-10"
      aria-labelledby="country-top-destinations-heading"
    >
      <Container>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-600">
            {t("country.popularSpots")}
          </p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
            <h2
              id="country-top-destinations-heading"
              className="text-[1.75rem] font-medium tracking-[-0.03em] text-ink sm:text-[2.125rem] xl:text-[2.375rem] xl:leading-[1.12]"
            >
              {t("country.topFor", { name: countryName })}
            </h2>
            {showViewAllDeals && (
              <button
                type="button"
                onClick={handleViewAllDeals}
                className="shrink-0 text-[13px] font-semibold text-brand-500 transition hover:text-brand-600"
              >
                {t("country.viewAllDeals")}
              </button>
            )}
          </div>
        </div>

        <div className="mt-5 sm:mt-6">
          <Carousel
            ariaLabel={t("country.topFor", { name: countryName })}
            itemsPerPageDesktop={6}
            showDots={spots.length > 6}
            trackClassName="gap-4 py-3"
          >
            {spots.map((spot, index) => {
              const active = selectedOrt === spot.name;
              const spotName = tx(spot.name, locale);
              return (
                <button
                  key={spot.name}
                  type="button"
                  data-carousel-item
                  aria-pressed={active}
                  onClick={() => {
                    onSelectOrt(spot.name);
                  }}
                  className={cn(
                    "group relative block aspect-3/4 w-[9.75rem] shrink-0 snap-start overflow-hidden rounded-[12px] border-[3px] bg-ink text-left shadow-[0_8px_24px_rgba(15,23,42,0.12)] transition-[transform,box-shadow,border-color] duration-500 ease-out hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(15,23,42,0.16)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 sm:w-[10.5rem] md:w-[11rem] lg:w-[calc((100%-5*1rem)/6)]",
                    active ? "border-brand-500" : "border-transparent"
                  )}
                >
                  <Image
                    src={spot.image}
                    alt={`${spotName} – ${countryName}`}
                    fill
                    sizes="(min-width: 1024px) 16vw, (min-width: 640px) 28vw, 42vw"
                    priority={index < 3}
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-3 sm:p-3.5">
                    <h3 className="truncate text-base font-bold text-white sm:text-lg">{spotName}</h3>
                    <p className="mt-0.5 truncate text-xs text-white/90 sm:text-sm">
                      {t("country.fromPrice", { price: Math.round(spot.fromPrice) })}
                    </p>
                  </div>
                </button>
              );
            })}
          </Carousel>
        </div>

        {showViewAllDeals && (
          <div className="mt-6 flex justify-center pb-2 sm:mt-8 sm:pb-3">
            <button
              type="button"
              onClick={handleViewAllDeals}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand-500 px-6 text-sm font-bold text-white shadow-[0_8px_20px_rgba(27,99,235,0.18)] transition hover:bg-brand-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
            >
              {t("country.viewAllDeals")}
              <ArrowDown className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        )}
      </Container>
    </section>
  );
}
