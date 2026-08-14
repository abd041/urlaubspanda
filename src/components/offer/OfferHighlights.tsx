"use client";

import { Sparkles } from "lucide-react";
import { useLocale, useT } from "@/i18n/LocaleProvider";
import { tx } from "@/i18n/content";

/** “Darauf kannst du dich freuen” — existing `highlights[]` from offer detail data. */
export function OfferHighlights({ items }: { items: string[] }) {
  const t = useT();
  const { locale } = useLocale();
  if (items.length === 0) return null;

  return (
    <section aria-labelledby="highlights-heading">
      <h2
        id="highlights-heading"
        className="text-[1.75rem] font-medium tracking-[-0.03em] text-ink sm:text-[2.125rem]"
      >
        {t("offer.highlights")}
      </h2>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-3 rounded-[1.25rem] border border-[rgba(15,23,42,0.07)] bg-white p-4 shadow-[0_1px_2px_rgba(15,26,43,0.04),0_8px_20px_rgba(15,26,43,0.045)] sm:p-5"
          >
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[rgba(27,99,235,0.12)] bg-[#F4F8FF] text-brand-500">
              <Sparkles className="h-4 w-4" aria-hidden="true" strokeWidth={1.6} />
            </span>
            <span className="text-[15px] leading-relaxed text-ink">{tx(item, locale)}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
