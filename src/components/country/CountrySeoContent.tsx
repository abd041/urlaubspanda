"use client";

import {
  BadgeEuro,
  CalendarDays,
  Clock3,
  Compass,
  Heart,
  MapPinned,
  Plane,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import type {
  DestinationFaq,
  DestinationOverviewFact,
  DestinationSeoBlock,
} from "@/types";
import { useLocale, useT } from "@/i18n/LocaleProvider";
import { destinationName, tx } from "@/i18n/content";
import { cn } from "@/lib/utils";

interface CountrySeoContentProps {
  countrySlug: string;
  blocks: DestinationSeoBlock[];
  overviewFacts?: DestinationOverviewFact[];
  faqs?: DestinationFaq[];
}

/**
 * Country info below the deals grid — heading + paragraphs,
 * optional “auf einen Blick” table and FAQ.
 */
export function CountrySeoContent({
  countrySlug,
  blocks,
  overviewFacts = [],
  faqs = [],
}: CountrySeoContentProps) {
  const { locale } = useLocale();
  const t = useT();
  const countryName = destinationName(countrySlug, locale);
  const hasBlocks = blocks.length > 0;
  const hasOverview = overviewFacts.length > 0;
  const hasFaqs = faqs.length > 0;
  if (!hasBlocks && !hasOverview && !hasFaqs) return null;

  const headingClass =
    "text-[1.75rem] font-medium tracking-[-0.03em] text-ink sm:text-[2.125rem] xl:text-[2.375rem] xl:leading-[1.12]";

  return (
    <section
      className="bg-surface pt-16 pb-4 sm:pt-20"
      aria-label={t("country.moreInfo", { name: countryName })}
    >
      <Container>
        <div className="space-y-12 sm:space-y-16">
          {hasOverview && (
            <div>
              <Reveal>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-600">
                  {t("country.glanceKicker")}
                </p>
                <h2 className={`mt-2 ${headingClass}`}>
                  {t("country.glance", { name: countryName })}
                </h2>
              </Reveal>
              <RevealGroup className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
                {overviewFacts.map((fact, index) => {
                  const count = overviewFacts.length;
                  const featured = index === 0 && count % 3 !== 0;
                  const lastWide = index === count - 1 && featured && (count - 2) % 3 === 2;
                  return (
                    <RevealItem
                      key={fact.label}
                      className={cn(featured && "sm:col-span-2", lastWide && "xl:col-span-2")}
                    >
                      <GlanceFactCard
                        label={tx(fact.label, locale)}
                        value={tx(fact.value, locale)}
                        sourceLabel={fact.label}
                        featured={featured}
                      />
                    </RevealItem>
                  );
                })}
              </RevealGroup>
            </div>
          )}

          {blocks.map((block) => (
            <Reveal key={block.heading} className="max-w-4xl">
              <h2 className={headingClass}>{tx(block.heading, locale)}</h2>
              <div className="mt-3 space-y-3 sm:mt-4 sm:space-y-4">
                {block.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 64)}
                    className="text-[15px] leading-relaxed text-body sm:leading-7"
                  >
                    {tx(paragraph, locale)}
                  </p>
                ))}
              </div>
            </Reveal>
          ))}

          {hasFaqs && (
            <Reveal className="max-w-4xl">
              <h2 className={headingClass}>{t("country.faqs", { name: countryName })}</h2>
              <div className="mt-6 overflow-hidden rounded-2xl border border-[#eeeef2] bg-white shadow-[0_2px_10px_rgba(15,26,43,0.06)]">
                {faqs.map((faq, index) => (
                  <details
                    key={faq.question}
                    className={index > 0 ? "group border-t border-line" : "group"}
                  >
                    <summary className="cursor-pointer list-none px-5 py-4 text-sm font-semibold text-ink marker:content-none sm:px-6 sm:py-5 sm:text-base [&::-webkit-details-marker]:hidden">
                      <span className="flex items-start justify-between gap-3">
                        {tx(faq.question, locale)}
                        <span
                          aria-hidden="true"
                          className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface text-sm leading-none text-muted transition group-open:rotate-45 group-open:bg-brand-50 group-open:text-brand-600"
                        >
                          +
                        </span>
                      </span>
                    </summary>
                    <p className="px-5 pb-4 text-[15px] leading-relaxed text-body sm:px-6 sm:leading-7">
                      {tx(faq.answer, locale)}
                    </p>
                  </details>
                ))}
              </div>
            </Reveal>
          )}
        </div>
      </Container>
    </section>
  );
}

function factIcon(label: string): LucideIcon {
  const key = label.toLowerCase();
  if (key.includes("region") || key.includes("ziele")) return MapPinned;
  if (key.includes("reisezeit") || key.includes("dauer")) return CalendarDays;
  if (key.includes("flug") || key.includes("anreise")) return Plane;
  if (key.includes("währung")) return BadgeEuro;
  if (key.includes("zeitverschiebung")) return Clock3;
  if (key.includes("ideal")) return Heart;
  if (key.includes("reisearten")) return Compass;
  return Compass;
}

function factPills(value: string): string[] | null {
  if (/[–—]/.test(value) || value.includes(" - ")) return null;
  const parts = value.split(",").map((part) => part.trim()).filter(Boolean);
  if (parts.length < 2 || parts.some((part) => part.length > 32)) return null;
  return parts;
}

function GlanceFactCard({
  label,
  value,
  sourceLabel,
  featured = false,
}: {
  label: string;
  value: string;
  sourceLabel: string;
  featured?: boolean;
}) {
  const Icon = factIcon(sourceLabel);
  const pills = factPills(value);

  return (
    <article
      className={cn(
        "group relative h-full overflow-hidden rounded-[1.25rem] border border-[rgba(15,23,42,0.07)] bg-white p-6 transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1 hover:border-[rgba(27,99,235,0.18)] hover:shadow-[0_18px_40px_rgba(15,26,43,0.1)] sm:p-7",
        featured
          ? "shadow-[0_12px_32px_rgba(15,26,43,0.08)] sm:p-8"
          : "shadow-[0_1px_2px_rgba(15,26,43,0.04),0_8px_20px_rgba(15,26,43,0.045)]"
      )}
    >
      <span
        className="pointer-events-none absolute inset-x-6 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(27,99,235,0.35),transparent)]"
        aria-hidden="true"
      />
      <span
        className={cn(
          "flex items-center justify-center rounded-full border border-[rgba(27,99,235,0.12)] bg-[#F4F8FF] text-brand-500",
          featured ? "h-12 w-12" : "h-10 w-10"
        )}
      >
        <Icon className={featured ? "h-5 w-5" : "h-[18px] w-[18px]"} aria-hidden="true" strokeWidth={1.5} />
      </span>
      <h3
        className={cn(
          "mt-4 font-bold uppercase tracking-[0.16em] text-brand-600",
          featured ? "text-[12px]" : "text-[11px]"
        )}
      >
        {label}
      </h3>
      {pills ? (
        <div className={cn("flex flex-wrap", featured ? "mt-5 gap-2" : "mt-4 gap-1.5")}>
          {pills.map((pill) => (
            <span
              key={pill}
              className={cn(
                "rounded-full border border-[rgba(15,23,42,0.08)] bg-white font-medium text-ink shadow-[0_1px_0_rgba(15,26,43,0.03)]",
                featured ? "px-3.5 py-1.5 text-[13px]" : "px-3 py-1 text-[12px]"
              )}
            >
              {pill}
            </span>
          ))}
        </div>
      ) : (
        <p
          className={cn(
            "leading-relaxed text-ink/80",
            featured ? "mt-4 max-w-xl text-base sm:text-lg sm:leading-8" : "mt-3.5 text-[15px]"
          )}
        >
          {value}
        </p>
      )}
    </article>
  );
}
