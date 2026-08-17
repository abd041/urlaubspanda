"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import type { Deal } from "@/types";
import { Container } from "@/components/layout/Container";
import { cn } from "@/lib/utils";
import { localeTag } from "@/i18n/config";
import { useLocale, useT } from "@/i18n/LocaleProvider";
import { heroSuggestionLabels, resolveHeroSearch, type HeroTab } from "@/lib/heroSearch";
import { HeroFeaturedDeal } from "@/components/home/HeroFeaturedDeal";
import {
  LayoutGroup,
  RevealItem,
  RevealMountGroup,
  easePremium,
  motion,
  useReducedMotion,
} from "@/components/motion/Reveal";

const TABS: { id: HeroTab; labelKey: string }[] = [
  { id: "all", labelKey: "home.heroTabAll" },
  { id: "packages", labelKey: "home.heroTabPackages" },
  { id: "cities", labelKey: "home.heroTabCities" },
  { id: "wellness", labelKey: "home.heroTabWellness" },
];

export function HomeHero({ deals }: { deals: Deal[] }) {
  const t = useT();
  const { locale } = useLocale();
  const router = useRouter();
  const reduce = useReducedMotion();
  const suggestions = useMemo(() => heroSuggestionLabels(locale), [locale]);
  const [tab, setTab] = useState<HeroTab>("all");
  const [query, setQuery] = useState("");

  const today = new Intl.DateTimeFormat(localeTag(locale), {
    day: "numeric",
    month: "long",
  }).format(new Date());

  const count = new Intl.NumberFormat(localeTag(locale)).format(deals.length);

  const onSearch = (event: FormEvent) => {
    event.preventDefault();
    router.push(resolveHeroSearch(query, tab, locale));
  };

  return (
    <section
      aria-labelledby="home-hero-heading"
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

      <Container className="relative py-10 sm:py-14 lg:py-16">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14">
          <RevealMountGroup className="min-w-0">
            <RevealItem as="p" className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-600">
              <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-brand-500" aria-hidden="true" />
              {t("home.heroEyebrow", { date: today })}
            </RevealItem>
            <RevealItem>
              <h1
                id="home-hero-heading"
                className="mt-4 max-w-xl text-[2.15rem] font-extrabold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-[3.35rem] lg:leading-[1.05]"
              >
                {t("home.heroTitleBefore")}{" "}
                <em className="bg-[linear-gradient(transparent_58%,var(--color-brand-100)_58%)] pr-1 font-extrabold italic text-brand-600">
                  {t("home.heroTitleHighlight")}
                </em>{" "}
                {t("home.heroTitleAfter")}
              </h1>
            </RevealItem>
            <RevealItem as="p" className="mt-5 max-w-lg text-[15px] leading-relaxed text-body sm:text-base">
              {t("home.heroSub")}
            </RevealItem>

            <RevealItem>
              <form
                onSubmit={onSearch}
                className="mt-7 rounded-[1.35rem] border border-white bg-white p-3 shadow-[0_18px_50px_rgba(15,26,43,0.08)] sm:p-4"
              >
                <LayoutGroup id="hero-search-tabs">
                  <div role="tablist" aria-label={t("home.heroTabs")} className="flex flex-wrap gap-1">
                    {TABS.map((item) => {
                      const active = tab === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          role="tab"
                          aria-selected={active}
                          onClick={() => setTab(item.id)}
                          className={cn(
                            "relative rounded-full px-3 py-1.5 text-sm font-semibold transition",
                            active ? "text-white" : "text-body hover:text-ink"
                          )}
                        >
                          {active && (
                            <motion.span
                              layoutId={reduce ? undefined : "hero-search-tab"}
                              className="absolute inset-0 rounded-full bg-ink"
                              transition={{ duration: 0.32, ease: easePremium }}
                            />
                          )}
                          <span className="relative z-10">{t(item.labelKey)}</span>
                        </button>
                      );
                    })}
                  </div>
                </LayoutGroup>

                <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-end">
                  <label className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
                      {t("home.heroWhere")}
                    </span>
                    <input
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      list="hero-destinations"
                      placeholder={t("home.heroWherePlaceholder")}
                      autoComplete="off"
                      className="mt-1 w-full rounded-xl border-0 bg-transparent px-0 py-2 text-base font-medium text-ink outline-none placeholder:font-normal placeholder:text-muted"
                    />
                  </label>
                  <motion.button
                    type="submit"
                    whileTap={reduce ? undefined : { scale: 0.98 }}
                    transition={{ duration: 0.15, ease: easePremium }}
                    className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-brand-500 px-5 text-sm font-bold text-white shadow-sm transition hover:bg-brand-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                  >
                    <Search className="h-4 w-4" aria-hidden="true" />
                    {t("home.heroSearch")}
                  </motion.button>
                </div>

                <datalist id="hero-destinations">
                  {suggestions.map((label) => (
                    <option key={label} value={label} />
                  ))}
                </datalist>

                <p className="mt-3 border-t border-line pt-3 text-[11px] text-muted">
                  {t("home.heroStats", { count })}
                </p>
              </form>
            </RevealItem>

            <RevealItem>
              <div className="mt-4 flex flex-col gap-2">
                <a
                  href="#deals"
                  className="flex w-full items-center justify-center rounded-2xl border border-line bg-white px-4 py-3.5 text-sm font-semibold text-ink transition hover:border-brand-200 hover:bg-brand-50/60"
                >
                  {t("home.heroLatest")}
                </a>
                <a
                  href="#filters"
                  className="flex w-full items-center justify-center rounded-2xl border border-line bg-white px-4 py-3.5 text-sm font-semibold text-ink transition hover:border-brand-200 hover:bg-brand-50/60"
                >
                  {t("home.heroAllOffers")}
                </a>
              </div>
            </RevealItem>
          </RevealMountGroup>

          <HeroFeaturedDeal deals={deals} />
        </div>
      </Container>
    </section>
  );
}
