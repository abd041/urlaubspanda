"use client";

import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { destinationsInDisplayOrder } from "@/data/destinations";
import { Container } from "@/components/layout/Container";
import { Carousel } from "@/components/ui/Carousel";
import { DestinationCard } from "@/components/home/DestinationCard";
import { cn } from "@/lib/utils";
import { useT } from "@/i18n/LocaleProvider";
import { Reveal } from "@/components/motion/Reveal";

const orderedDestinations = destinationsInDisplayOrder();

const arrowButtonClass =
  "flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(15,23,42,0.10)] bg-white text-[#0F172A] shadow-[0_1px_3px_rgba(15,26,43,0.06)] transition-[border-color,background-color,opacity] duration-200 hover:border-[rgba(15,23,42,0.18)] hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 disabled:pointer-events-none disabled:opacity-35";

export function PopularDestinations() {
  const t = useT();
  return (
    <section
      aria-labelledby="beliebte-reiseziele-heading"
      className="bg-surface pt-14 pb-12 sm:pt-16 sm:pb-14 lg:pt-[4.5rem] lg:pb-16"
    >
      <Container>
        <Reveal fade>
          <Carousel
            ariaLabel={t("home.popularTitle")}
            itemsPerPageDesktop={5}
            showDots={false}
            overlayArrows={false}
            trackClassName="gap-3 pt-1.5 pb-8 md:gap-5 xl:gap-6"
            header={({ canScrollPrev, canScrollNext, scrollPrev, scrollNext }) => (
              <div className="mb-8 flex flex-col gap-5 sm:mb-9 sm:flex-row sm:items-end sm:justify-between sm:gap-8 lg:mb-10">
                <div className="min-w-0">
                  <h2
                    id="beliebte-reiseziele-heading"
                    className="text-[1.75rem] font-medium tracking-[-0.03em] text-ink sm:text-[2.125rem] xl:text-[2.5rem] xl:leading-[1.08]"
                  >
                    {t("home.popularTitle")}
                  </h2>
                  <p className="mt-2 text-[15px] font-normal leading-relaxed text-body">
                    {t("home.popularSubtitle")}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-4 sm:pb-1">
                  <Link
                    href="/reiseziele"
                    className="group inline-flex w-fit items-center gap-1.5 text-[13px] font-medium text-brand-500 transition-colors duration-200 hover:text-brand-600"
                  >
                    {t("home.allDestinations")}
                    <ArrowRight
                      className="h-3.5 w-3.5 shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-0.75"
                      strokeWidth={1.6}
                    />
                  </Link>
                  <div className="hidden items-center gap-2 md:flex">
                    <button
                      type="button"
                      onClick={scrollPrev}
                      disabled={!canScrollPrev}
                      aria-label={t("home.prevDestinations")}
                      className={cn(arrowButtonClass)}
                    >
                      <ChevronLeft className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={scrollNext}
                      disabled={!canScrollNext}
                      aria-label={t("home.nextDestinations")}
                      className={cn(arrowButtonClass)}
                    >
                      <ChevronRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          >
            {orderedDestinations.map((destination, index) => (
              <DestinationCard
                key={destination.id}
                destination={destination}
                priority={index < 5}
              />
            ))}
          </Carousel>
        </Reveal>
      </Container>
    </section>
  );
}
