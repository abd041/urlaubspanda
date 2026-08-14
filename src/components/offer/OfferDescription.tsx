"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocale, useT } from "@/i18n/LocaleProvider";
import { tx } from "@/i18n/content";

interface OfferDescriptionProps {
  heading: string;
  paragraphs: string[];
}

export function OfferDescription({ heading, paragraphs }: OfferDescriptionProps) {
  const [expanded, setExpanded] = useState(false);
  const [first, ...rest] = paragraphs;
  const t = useT();
  const { locale } = useLocale();

  return (
    <div id="beschreibung">
      <h2 className="text-lg font-bold text-ink sm:text-xl">{tx(heading, locale)}</h2>
      <p className="mt-3 text-sm leading-relaxed text-body sm:text-base">{tx(first, locale)}</p>

      {rest.length > 0 && (
        <>
          <div
            className={cn(
              "grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out",
              expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
            )}
          >
            <div className="min-h-0 space-y-3 pt-3 text-sm leading-relaxed text-body sm:text-base">
              {rest.map((paragraph) => (
                <p key={paragraph}>{tx(paragraph, locale)}</p>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className="mt-3 flex items-center gap-1 text-sm font-semibold text-brand-500 hover:text-brand-600"
          >
            {expanded ? t("offer.readLess") : t("offer.readMore")}
            <ChevronDown
              className={cn("h-4 w-4 transition-transform", expanded && "rotate-180")}
              aria-hidden="true"
            />
          </button>
        </>
      )}
    </div>
  );
}
