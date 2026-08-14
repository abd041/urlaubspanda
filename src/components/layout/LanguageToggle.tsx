"use client";

import { cn } from "@/lib/utils";
import { useLocale, useT } from "@/i18n/LocaleProvider";
import type { Locale } from "@/i18n/config";
import { easePremium, LayoutGroup, motion, useReducedMotion } from "@/components/motion/Reveal";

const LOCALES: { code: Locale; nameKey: "lang.de" | "lang.en" }[] = [
  { code: "de", nameKey: "lang.de" },
  { code: "en", nameKey: "lang.en" },
];

export function LanguageToggle({ className }: { className?: string }) {
  const { locale, setLocale } = useLocale();
  const t = useT();
  const reduce = useReducedMotion();

  return (
    <LayoutGroup id="locale-toggle">
    <div
      role="group"
      aria-label={t("lang.group")}
      className={cn(
        "relative inline-flex h-9 items-center rounded-full border border-line bg-white p-0.75",
        className
      )}
    >
      {LOCALES.map((item) => {
        const active = locale === item.code;
        return (
          <button
            key={item.code}
            type="button"
            onClick={() => setLocale(item.code)}
            aria-pressed={active}
            aria-label={t(item.nameKey)}
            lang={item.code}
            className={cn(
              "relative rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 sm:px-3",
              active ? "text-white" : "text-muted hover:text-ink"
            )}
          >
            {active && (
              <motion.span
                layoutId={reduce ? undefined : "locale-pill"}
                className="absolute inset-0 rounded-full bg-ink shadow-[0_1px_2px_rgba(15,26,43,0.18)]"
                transition={{ duration: 0.28, ease: easePremium }}
              />
            )}
            <span className="relative z-10">{t(item.nameKey)}</span>
          </button>
        );
      })}
    </div>
    </LayoutGroup>
  );
}
