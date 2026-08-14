"use client";

import { CheckCircle2 } from "lucide-react";
import { useLocale, useT } from "@/i18n/LocaleProvider";
import { tx } from "@/i18n/content";

/**
 * Shared trust rows, reused next to inclusion content and in the booking/offer chrome.
 */
export function OfferTrustList() {
  const t = useT();
  const { locale } = useLocale();

  const items = [
    {
      title: t("deal.bestPrice"),
      subtitle: tx("Bei uns buchst du immer zum besten Preis", locale),
    },
    {
      title: t("deal.secure"),
      subtitle: t("home.trustSecureText"),
    },
  ];

  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.title} className="flex items-start gap-2.5">
          <CheckCircle2 className="mt-0.5 h-[18px] w-[18px] shrink-0 text-brand-500" aria-hidden="true" />
          <span>
            <span className="block text-sm font-medium text-ink">{item.title}</span>
            <span className="block text-xs text-body">{item.subtitle}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}
