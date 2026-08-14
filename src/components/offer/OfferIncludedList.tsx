"use client";

import { Check } from "lucide-react";
import { useLocale, useT } from "@/i18n/LocaleProvider";
import { tx } from "@/i18n/content";

/** “Was ist enthalten?” inclusive list. */
export function OfferIncludedList({ items }: { items: string[] }) {
  const t = useT();
  const { locale } = useLocale();
  if (items.length === 0) return null;

  return (
    <section aria-labelledby="inklusive-heading">
      <h2
        id="inklusive-heading"
        className="text-[1.75rem] font-medium tracking-[-0.03em] text-ink sm:text-[2.125rem]"
      >
        {t("offer.included")}
      </h2>
      <ul className="mt-6 overflow-hidden rounded-[1.25rem] border border-[rgba(15,23,42,0.07)] bg-white shadow-[0_1px_2px_rgba(15,26,43,0.04),0_8px_20px_rgba(15,26,43,0.045)]">
        {items.map((item, index) => (
          <li
            key={item}
            className={
              index > 0
                ? "flex items-start gap-3 border-t border-[rgba(15,23,42,0.06)] px-5 py-4 sm:px-6"
                : "flex items-start gap-3 px-5 py-4 sm:px-6"
            }
          >
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#E8F6EE] text-success">
              <Check className="h-3.5 w-3.5" aria-hidden="true" strokeWidth={2.2} />
            </span>
            <span className="text-[15px] leading-relaxed text-ink">{tx(item, locale)}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
