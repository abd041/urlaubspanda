"use client";

import {
  BedDouble,
  Check,
  ChevronDown,
  GlassWater,
  Luggage,
  Plane,
  Sparkles,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import { useId, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useLocale, useT } from "@/i18n/LocaleProvider";
import { tx } from "@/i18n/content";

function inclusionIcon(text: string): LucideIcon {
  const lower = text.toLowerCase();
  if (lower.includes("flug") || lower.includes("flight")) return Plane;
  if (lower.includes("transfer") || lower.includes("gepäck") || lower.includes("luggage")) return Luggage;
  if (lower.includes("nacht") || lower.includes("zimmer") || lower.includes("hotel") || lower.includes("night"))
    return BedDouble;
  if (
    lower.includes("pension") ||
    lower.includes("frühstück") ||
    lower.includes("buffet") ||
    lower.includes("verpflegung") ||
    lower.includes("meal") ||
    lower.includes("board")
  )
    return UtensilsCrossed;
  if (lower.includes("prosecco") || lower.includes("drink") || lower.includes("wein") || lower.includes("glas"))
    return GlassWater;
  return Sparkles;
}

function AccordionBlock({
  title,
  defaultOpen = true,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();
  const buttonId = useId();

  return (
    <div className="border-b border-[rgba(15,23,42,0.08)]">
      <h3>
        <button
          type="button"
          id={buttonId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((value) => !value)}
          className="flex w-full items-center justify-between gap-3 py-4 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
        >
          <span className="text-[1.05rem] font-bold tracking-tight text-ink">{title}</span>
          <span className="text-lg font-medium leading-none text-ink" aria-hidden="true">
            {open ? "−" : "+"}
          </span>
          <ChevronDown className="sr-only" />
        </button>
      </h3>
      <div id={panelId} role="region" aria-labelledby={buttonId} hidden={!open} className="pb-5">
        {children}
      </div>
    </div>
  );
}

/**
 * Mobile accordion for included services + “Was wir lieben”
 * (client mobile reference). Desktop uses OfferIncludedList / OfferHighlights.
 */
export function OfferOverviewAccordions({
  inclusions,
  highlights,
}: {
  inclusions: string[];
  highlights: string[];
}) {
  const t = useT();
  const { locale } = useLocale();

  if (inclusions.length === 0 && highlights.length === 0) return null;

  return (
    <section className="lg:hidden" aria-label={t("offer.offerInfo")}>
      {inclusions.length > 0 && (
        <AccordionBlock title={t("offer.includedMobile")} defaultOpen>
          <ul className="space-y-4">
            {inclusions.map((item) => {
              const Icon = inclusionIcon(item);
              return (
                <li key={item} className="flex items-start gap-3">
                  <Icon
                    className="mt-0.5 h-[18px] w-[18px] shrink-0 text-[#64748B]"
                    aria-hidden="true"
                    strokeWidth={1.6}
                  />
                  <span className="text-[15px] leading-snug text-ink">{tx(item, locale)}</span>
                </li>
              );
            })}
          </ul>
        </AccordionBlock>
      )}

      {highlights.length > 0 && (
        <AccordionBlock title={t("offer.whatWeLove")} defaultOpen>
          <ul className="space-y-4">
            {highlights.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <Check
                  className="mt-0.5 h-[18px] w-[18px] shrink-0 text-ink"
                  aria-hidden="true"
                  strokeWidth={2.25}
                />
                <span className="text-[15px] leading-snug text-ink">{tx(item, locale)}</span>
              </li>
            ))}
          </ul>
        </AccordionBlock>
      )}
    </section>
  );
}
