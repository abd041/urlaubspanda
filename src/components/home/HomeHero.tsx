"use client";

import { Container } from "@/components/layout/Container";
import { localeTag } from "@/i18n/config";
import { useLocale, useT } from "@/i18n/LocaleProvider";
import { RevealItem, RevealMountGroup } from "@/components/motion/Reveal";

export function HomeHero() {
  const t = useT();
  const { locale } = useLocale();

  const today = new Intl.DateTimeFormat(localeTag(locale), {
    day: "numeric",
    month: "long",
  })
    .format(new Date())
    .toLocaleUpperCase(localeTag(locale));

  return (
    <section aria-labelledby="home-hero-heading" className="relative overflow-hidden bg-surface">
      <div
        className="pointer-events-none absolute left-[6%] top-[-5rem] h-[30rem] w-[30rem] rounded-full bg-[#d6e4ff]/70 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute right-[12%] top-10 h-64 w-64 rounded-full bg-white/80 blur-3xl"
        aria-hidden="true"
      />

      <Container className="relative pt-8 pb-2 sm:pt-10 sm:pb-3 lg:pt-12 lg:pb-3">
        <RevealMountGroup className="max-w-[40rem]">
          <RevealItem
            as="p"
            className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-brand-500"
          >
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" aria-hidden="true" />
            {t("home.heroEyebrow", { date: today })}
          </RevealItem>
          <RevealItem>
            <h1
              id="home-hero-heading"
              className="mt-4 text-[2.25rem] font-extrabold leading-[1.15] tracking-tight text-ink sm:text-[2.75rem] lg:text-[3.35rem] lg:leading-[1.12]"
            >
              {t("home.heroTitleBefore")}{" "}
              <span className="text-brand-500">{t("home.heroTitleHighlight")}</span>{" "}
              {t("home.heroTitleAfter")}
            </h1>
          </RevealItem>
          <RevealItem
            as="p"
            className="mt-3 max-w-[34rem] text-[15px] leading-[1.65] text-body sm:text-base"
          >
            {t("home.heroSub")}
          </RevealItem>
        </RevealMountGroup>
      </Container>
    </section>
  );
}
