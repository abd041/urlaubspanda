"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Deal } from "@/types";
import { Container } from "@/components/layout/Container";
import { BreadcrumbNav } from "@/components/i18n/PageChrome";
import { HeroFeaturedDeal } from "@/components/home/HeroFeaturedDeal";
import { RevealItem, RevealMountGroup } from "@/components/motion/Reveal";
import { localeTag } from "@/i18n/config";
import { useLocale, useT } from "@/i18n/LocaleProvider";

export function DealsIndex({ deals }: { deals: Deal[] }) {
  const t = useT();
  const { locale } = useLocale();
  const count = new Intl.NumberFormat(localeTag(locale)).format(deals.length);

  return (
    <section
      aria-labelledby="angebote-heading"
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
            { href: "/angebote", labelKey: "nav.deals" },
          ]}
        />

        <div className="mt-8 grid items-center gap-10 sm:mt-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14">
          <RevealMountGroup className="min-w-0">
            <RevealItem as="p" className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-600">
              {t("pages.dealsEyebrow")}
            </RevealItem>
            <RevealItem>
              <h1
                id="angebote-heading"
                className="mt-4 max-w-xl text-[2.15rem] font-extrabold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-[3.35rem] lg:leading-[1.05]"
              >
                {t("pages.dealsTitleBefore")}{" "}
                <em className="bg-[linear-gradient(transparent_58%,var(--color-brand-100)_58%)] pr-1 font-extrabold italic text-brand-600">
                  {t("pages.dealsTitleHighlight")}
                </em>
              </h1>
            </RevealItem>
            <RevealItem as="p" className="mt-5 max-w-lg text-[15px] leading-relaxed text-body sm:text-base">
              {t("pages.dealsIntro")}
            </RevealItem>
            <RevealItem>
              <p className="mt-5 text-[13px] text-muted">{t("pages.dealsStats", { count })}</p>
              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
                <a
                  href="#deals"
                  className="group inline-flex items-center gap-1.5 text-[13px] font-medium text-brand-500 transition hover:text-brand-600"
                >
                  {t("pages.dealsBrowse")}
                  <ArrowRight
                    className="h-3.5 w-3.5 shrink-0 transition-transform duration-300 group-hover:translate-x-0.75"
                    strokeWidth={1.6}
                    aria-hidden="true"
                  />
                </a>
                <Link
                  href="/reiseziele"
                  className="group inline-flex items-center gap-1.5 text-[13px] font-medium text-body transition hover:text-brand-600"
                >
                  {t("home.allDestinations")}
                  <ArrowRight
                    className="h-3.5 w-3.5 shrink-0 transition-transform duration-300 group-hover:translate-x-0.75"
                    strokeWidth={1.6}
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </RevealItem>
          </RevealMountGroup>

          <HeroFeaturedDeal deals={deals} />
        </div>
      </Container>
    </section>
  );
}
