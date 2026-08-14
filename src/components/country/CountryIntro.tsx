"use client";

import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/motion/Reveal";
import { useLocale, useT } from "@/i18n/LocaleProvider";
import { tx } from "@/i18n/content";

/** Editorial “Kurz gesagt” pull-quote under the country hero. */
export function CountryIntro({ kurzgesagt }: { kurzgesagt?: string }) {
  const { locale } = useLocale();
  const t = useT();
  if (!kurzgesagt) return null;

  return (
    <section className="bg-surface pt-8 pb-2 sm:pt-10">
      <Container>
        <Reveal>
          <aside className="mx-auto max-w-3xl rounded-2xl border border-[#eeeef2] bg-white px-6 py-6 shadow-[inset_3px_0_0_0_var(--color-brand-500),0_2px_10px_rgba(15,26,43,0.06)] sm:px-8 sm:py-7">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-600">
              {t("country.inShort")}
            </p>
            <p className="mt-3 text-[17px] font-medium leading-relaxed text-ink sm:text-xl sm:leading-8">
              {tx(kurzgesagt, locale)}
            </p>
          </aside>
        </Reveal>
      </Container>
    </section>
  );
}
