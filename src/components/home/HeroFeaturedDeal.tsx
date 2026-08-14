"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import type { Deal } from "@/types";
import { cn, formatEuro } from "@/lib/utils";
import { localeTag } from "@/i18n/config";
import { useLocale, useT } from "@/i18n/LocaleProvider";
import { mealPlanLabel, nightLabel, regionDisplay, tx } from "@/i18n/content";
import { RevealMount, easePremium, motion, useReducedMotion } from "@/components/motion/Reveal";

export function topFeaturedDeals(deals: Deal[], count = 3) {
  return [...deals]
    .sort((a, b) => b.discountPercent - a.discountPercent || b.reviewPercent - a.reviewPercent)
    .slice(0, count);
}

function formatHeroEuro(value: number, locale: "de" | "en") {
  if (Number.isInteger(value)) {
    return `${new Intl.NumberFormat(localeTag(locale), { maximumFractionDigits: 0 }).format(value)} €`;
  }
  return formatEuro(value, locale);
}

export function HeroFeaturedDeal({ deals, onDark = false }: { deals: Deal[]; onDark?: boolean }) {
  const t = useT();
  const { locale } = useLocale();
  const reduce = useReducedMotion();
  const slides = topFeaturedDeals(deals);
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const deal = slides[slide] ?? slides[0];

  useEffect(() => {
    if (paused || slides.length < 2) return;
    const timer = window.setInterval(() => {
      setSlide((current) => (current + 1) % slides.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [paused, slides.length]);

  if (!deal) return null;

  return (
    <RevealMount className="min-w-0" delay={0.12}>
      <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
        <motion.article
          whileHover={reduce ? undefined : { y: -4 }}
          transition={{ duration: 0.4, ease: easePremium }}
          className={cn(
            "relative overflow-hidden rounded-[1.75rem] bg-ink shadow-[0_24px_60px_rgba(15,26,43,0.18)]",
            onDark && "ring-1 ring-white/20"
          )}
        >
          <div className="relative aspect-4/5 sm:aspect-5/4 lg:aspect-4/5 xl:aspect-5/4">
            {slides.map((item, index) => (
              <Image
                key={item.id}
                src={item.images[0]}
                alt={item.name}
                fill
                priority={index === 0}
                sizes="(min-width: 1024px) 42vw, 100vw"
                className={cn(
                  "object-cover transition-opacity duration-700",
                  index === slide ? "opacity-100" : "opacity-0"
                )}
              />
            ))}
            <div
              className="absolute inset-0 bg-linear-to-t from-black/80 via-black/25 to-black/10"
              aria-hidden="true"
            />

            <span className="absolute left-4 top-4 rounded-full bg-brand-500 px-3 py-1 text-[11px] font-bold text-white shadow-sm">
              {t("home.heroTopDeal")}
            </span>
            <span className="absolute right-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[11px] font-extrabold italic text-ink">
              {deal.provider}
            </span>

            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
              <span
                className="inline-flex items-center gap-0.5 text-star"
                aria-label={t("deal.stars", { count: deal.stars })}
              >
                {Array.from({ length: deal.stars }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-star" aria-hidden="true" />
                ))}
              </span>
              <p className="mt-2 text-sm text-white/85">{regionDisplay(deal.destinationRegion, locale)}</p>
              <p className="mt-1 text-2xl font-extrabold leading-tight tracking-tight text-white sm:text-[1.85rem]">
                {deal.name}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-white/90">{tx(deal.summary, locale)}</p>

              <div className="mt-5 flex flex-wrap items-end justify-between gap-3">
                <p className="text-white">
                  {deal.oldPrice > deal.currentPrice && (
                    <span className="mr-2 text-sm text-white/60 line-through">
                      {formatHeroEuro(deal.oldPrice, locale)}
                    </span>
                  )}
                  <span className="text-2xl font-extrabold tracking-tight">
                    {t("deal.from")} {formatHeroEuro(deal.currentPrice, locale)}
                  </span>
                  <span className="ml-1 text-sm text-white/80">{t("deal.perPerson")}</span>
                </p>
                <Link
                  href={`/angebot/${deal.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-brand-600"
                >
                  {t("deal.viewOffer")}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
              <p className="sr-only">
                {nightLabel(deal.nights, locale)} · {mealPlanLabel(deal.mealPlan, locale)}
              </p>
            </div>
          </div>
        </motion.article>

        {slides.length > 1 && (
          <div className="mt-4 flex justify-center gap-2" role="tablist" aria-label={t("home.heroFeatured")}>
            {slides.map((item, index) => (
              <motion.button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={index === slide}
                aria-label={item.name}
                onClick={() => setSlide(index)}
                layout
                transition={{ duration: 0.35, ease: easePremium }}
                className={cn(
                  "h-1 rounded-full",
                  index === slide
                    ? onDark
                      ? "w-8 bg-white"
                      : "w-8 bg-ink"
                    : onDark
                      ? "w-4 bg-white/40 hover:bg-white/70"
                      : "w-4 bg-line hover:bg-muted"
                )}
              />
            ))}
          </div>
        )}
      </div>
    </RevealMount>
  );
}
