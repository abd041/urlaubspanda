"use client";

import type { ReactNode } from "react";
import type { Locale } from "@/i18n/config";
import { tx } from "@/i18n/content";

/**
 * Renders description text with optional **bold** markers.
 * Bold stays the same size as body text (16px) at weight 700.
 */
export function OfferRichText({
  text,
  locale,
  className,
}: {
  text: string;
  locale: Locale;
  className?: string;
}) {
  const translated = tx(text, locale);
  const parts = translated.split(/(\*\*[^*]+\*\*)/g);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
          return (
            <strong key={index} className="font-bold text-inherit">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </span>
  );
}

export function OfferDescriptionParagraph({
  text,
  locale,
}: {
  text: string;
  locale: Locale;
}): ReactNode {
  return (
    <p className="text-base font-normal leading-[1.6] text-[#555550]">
      <OfferRichText text={text} locale={locale} />
    </p>
  );
}
