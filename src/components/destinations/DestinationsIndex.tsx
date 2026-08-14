"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Destination } from "@/types";
import { Container } from "@/components/layout/Container";
import { DestinationCard, destinationImagePosition } from "@/components/home/DestinationCard";
import { BreadcrumbNav } from "@/components/i18n/PageChrome";
import {
  RevealGroup,
  RevealItem,
  RevealMount,
  RevealMountGroup,
  easePremium,
  motion,
  useReducedMotion,
} from "@/components/motion/Reveal";
import { destinationPath } from "@/lib/destinationPaths";
import { cn } from "@/lib/utils";
import { localeTag } from "@/i18n/config";
import { useLocale, useT } from "@/i18n/LocaleProvider";
import { destinationName, destinationSubtitle } from "@/i18n/content";

export type DestinationIndexItem = {
  destination: Destination;
  offerCount: number;
  fromPrice: number | null;
};

function formatFromPrice(value: number, locale: "de" | "en") {
  return `${new Intl.NumberFormat(localeTag(locale), { maximumFractionDigits: 0 }).format(value)} €`;
}

export function DestinationsIndex({ items }: { items: DestinationIndexItem[] }) {
  const t = useT();
  const { locale } = useLocale();
  const reduce = useReducedMotion();
  const dealTotal = items.reduce((sum, item) => sum + item.offerCount, 0);
  const slides = items.slice(0, 3);
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const featured = slides[slide] ?? slides[0];

  useEffect(() => {
    if (paused || slides.length < 2) return;
    const timer = window.setInterval(() => {
      setSlide((current) => (current + 1) % slides.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [paused, slides.length]);

  return (
    <>
      <section
        aria-labelledby="reiseziele-heading"
        className="relative overflow-hidden border-b border-line bg-[linear-gradient(180deg,#eef4ff_0%,#f7f9fc_42%,#ffffff_100%)]"
      >
        <div
          className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-brand-100/70 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -right-16 top-24 h-64 w-64 rounded-full bg-brand-50/80 blur-3xl"
          aria-hidden="true"
        />

        <Container className="relative pt-4 pb-10 sm:pt-6 sm:pb-14 lg:pb-16">
          <BreadcrumbNav
            contained={false}
            items={[
              { href: "/", labelKey: "nav.home" },
              { href: "/reiseziele", labelKey: "nav.destinations" },
            ]}
          />

          <div className="mt-8 grid items-center gap-10 sm:mt-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14">
            <RevealMountGroup className="min-w-0">
              <RevealItem as="p" className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-600">
                {t("pages.destinationsEyebrow")}
              </RevealItem>
              <RevealItem>
                <h1
                  id="reiseziele-heading"
                  className="mt-4 max-w-xl text-[2.15rem] font-extrabold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-[3.35rem] lg:leading-[1.05]"
                >
                  {t("pages.destinationsTitleBefore")}{" "}
                  <em className="bg-[linear-gradient(transparent_58%,var(--color-brand-100)_58%)] pr-1 font-extrabold italic text-brand-600">
                    {t("pages.destinationsTitleHighlight")}
                  </em>
                </h1>
              </RevealItem>
              <RevealItem as="p" className="mt-5 max-w-lg text-[15px] leading-relaxed text-body sm:text-base">
                {t("pages.destinationsIntro")}
              </RevealItem>
              <RevealItem>
                <p className="mt-5 text-[13px] text-muted">
                  {t("pages.destinationsStats", {
                    destinations: items.length,
                    deals: dealTotal,
                  })}
                </p>
                <Link
                  href="/angebote"
                  className="group mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-brand-500 transition hover:text-brand-600"
                >
                  {t("pages.destinationsAllDeals")}
                  <ArrowRight
                    className="h-3.5 w-3.5 shrink-0 transition-transform duration-300 group-hover:translate-x-0.75"
                    strokeWidth={1.6}
                    aria-hidden="true"
                  />
                </Link>
              </RevealItem>
            </RevealMountGroup>

            {featured && (
              <RevealMount className="min-w-0" delay={0.12}>
                <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
                  <motion.article
                    whileHover={reduce ? undefined : { y: -4 }}
                    transition={{ duration: 0.4, ease: easePremium }}
                    className="relative overflow-hidden rounded-[1.75rem] bg-ink shadow-[0_24px_60px_rgba(15,26,43,0.18)]"
                  >
                    <div className="relative aspect-4/5 sm:aspect-5/4 lg:aspect-4/5 xl:aspect-5/4">
                      {slides.map((item, index) => {
                        const name = destinationName(item.destination.slug, locale);
                        return (
                          <Image
                            key={item.destination.id}
                            src={item.destination.image}
                            alt={name}
                            fill
                            priority={index === 0}
                            sizes="(min-width: 1024px) 42vw, 100vw"
                            className={cn(
                              "object-cover transition-opacity duration-700",
                              destinationImagePosition[item.destination.slug] ?? "object-center",
                              index === slide ? "opacity-100" : "opacity-0"
                            )}
                          />
                        );
                      })}
                      <div
                        className="absolute inset-0 bg-linear-to-t from-black/80 via-black/25 to-black/10"
                        aria-hidden="true"
                      />

                      <span className="absolute left-4 top-4 rounded-full bg-brand-500 px-3 py-1 text-[11px] font-bold text-white shadow-sm">
                        {t("pages.destinationsFeatured")}
                      </span>
                      <span className="absolute right-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[11px] font-extrabold italic text-ink">
                        {destinationSubtitle(featured.destination.slug, locale)}
                      </span>

                      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                        <p className="text-sm text-white/85">
                          {featured.offerCount > 0
                            ? t("pages.destinationsOfferCount", {
                                count: featured.offerCount,
                                word:
                                  featured.offerCount === 1 ? t("deals.offer") : t("deals.offers"),
                              })
                            : t("pages.destinationsSoon")}
                        </p>
                        <h2 className="mt-1 text-2xl font-extrabold leading-tight tracking-tight text-white sm:text-[1.85rem]">
                          {destinationName(featured.destination.slug, locale)}
                        </h2>

                        <div className="mt-5 flex flex-wrap items-end justify-between gap-3">
                          <p className="text-white">
                            {featured.fromPrice != null && (
                              <>
                                <span className="text-2xl font-extrabold tracking-tight">
                                  {t("deal.from")} {formatFromPrice(featured.fromPrice, locale)}
                                </span>
                                <span className="ml-1 text-sm text-white/80">{t("deal.perPerson")}</span>
                              </>
                            )}
                          </p>
                          <Link
                            href={destinationPath(featured.destination.slug)}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-brand-600"
                          >
                            {t("pages.destinationsView")}
                            <ArrowRight className="h-4 w-4" aria-hidden="true" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.article>

                  {slides.length > 1 && (
                    <div
                      className="mt-4 flex justify-center gap-2"
                      role="tablist"
                      aria-label={t("pages.destinationsFeaturedList")}
                    >
                      {slides.map((item, index) => (
                        <motion.button
                          key={item.destination.id}
                          type="button"
                          role="tab"
                          aria-selected={index === slide}
                          aria-label={destinationName(item.destination.slug, locale)}
                          onClick={() => setSlide(index)}
                          layout
                          transition={{ duration: 0.35, ease: easePremium }}
                          className={cn(
                            "h-1 rounded-full",
                            index === slide ? "w-8 bg-ink" : "w-4 bg-line hover:bg-muted"
                          )}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </RevealMount>
            )}
          </div>
        </Container>
      </section>

      <section aria-labelledby="reiseziele-heading" className="bg-surface pt-14 pb-12 sm:pt-16 sm:pb-14 lg:pt-[4.5rem] lg:pb-16">
        <Container>
          <RevealGroup
            as="ul"
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6"
          >
            {items.map((item, index) => (
              <RevealItem as="li" key={item.destination.id} className="min-w-0">
                <DestinationCard
                  destination={item.destination}
                  variant="grid"
                  priority={index < 3}
                  offerCount={item.offerCount}
                  fromPrice={item.fromPrice}
                />
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </section>
    </>
  );
}
