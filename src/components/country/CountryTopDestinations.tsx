"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import type { PopularSpot } from "@/types";
import { Container } from "@/components/layout/Container";
import { Carousel } from "@/components/ui/Carousel";
import { Reveal } from "@/components/motion/Reveal";
import { useLocale, useT } from "@/i18n/LocaleProvider";
import { tx } from "@/i18n/content";

interface CountryTopDestinationsProps {
  countryName: string;
  spots: PopularSpot[];
  selectedOrt: string | null;
  onSelectOrt: (ort: string) => void;
  onClearOrt: () => void;
}

/** “Top-Destinationen für {country}” — click filters deals by Ort. */
export function CountryTopDestinations({
  countryName,
  spots,
  selectedOrt,
  onSelectOrt,
  onClearOrt,
}: CountryTopDestinationsProps) {
  const t = useT();
  const { locale } = useLocale();
  if (spots.length === 0) return null;

  return (
    <section
      className="bg-surface pt-10 pb-2 sm:pt-12"
      aria-labelledby="country-top-destinations-heading"
    >
      <Container>
        <Reveal>
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
            <button
              type="button"
              onClick={() => {
                onClearOrt();
                document.getElementById("deals")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="shrink-0 text-[13px] font-medium text-brand-500 transition hover:text-brand-600"
            >
              {t("country.allDeals")}
            </button>
          </div>
        </Reveal>

        <div className="mt-6 sm:mt-8">
          <Carousel
            ariaLabel={t("country.topFor", { name: countryName })}
            itemsPerPageDesktop={6}
            showDots={spots.length > 6}
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
                    document.getElementById("deals")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className={cn(
                    "group relative block aspect-3/4 w-[42%] shrink-0 snap-start overflow-hidden rounded-[12px] bg-ink text-left shadow-[0_8px_24px_rgba(15,23,42,0.12)] transition-[transform,box-shadow] duration-500 ease-out hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(15,23,42,0.16)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 sm:w-[28%] md:w-[22%] lg:w-[calc((100%-5*1rem)/6)]",
                    active && "ring-2 ring-brand-500 ring-offset-2 ring-offset-surface"
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
      </Container>
    </section>
  );
}
