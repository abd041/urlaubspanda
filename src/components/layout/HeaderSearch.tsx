"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, MapPin, Search, X } from "lucide-react";
import { destinations } from "@/data/destinations";
import { deals } from "@/data/deals";
import { destinationPath } from "@/lib/destinationPaths";
import { cn } from "@/lib/utils";
import { useLocale, useT } from "@/i18n/LocaleProvider";
import { destinationName, destinationSubtitle, tx } from "@/i18n/content";

type Suggestion =
  | { type: "country"; id: string; href: string; title: string; subtitle: string }
  | { type: "city"; id: string; href: string; title: string; subtitle: string }
  | { type: "hotel"; id: string; href: string; title: string; subtitle: string };

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

export function HeaderSearch({
  className,
  onNavigate,
  compact = false,
}: {
  className?: string;
  onNavigate?: () => void;
  compact?: boolean;
}) {
  const t = useT();
  const { locale } = useLocale();
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const suggestions = useMemo(() => {
    const q = normalize(query);
    if (q.length < 1) return [] as Suggestion[];

    const results: Suggestion[] = [];

    for (const destination of destinations) {
      const name = destinationName(destination.slug, locale);
      const sub = destinationSubtitle(destination.slug, locale);
      if (normalize(name).includes(q) || normalize(destination.name).includes(q)) {
        results.push({
          type: "country",
          id: `country-${destination.id}`,
          href: destinationPath(destination.slug),
          title: name,
          subtitle: sub,
        });
      }
      for (const spot of destination.popularSpots ?? []) {
        const spotName = tx(spot.name, locale);
        if (normalize(spotName).includes(q) || normalize(spot.name).includes(q)) {
          results.push({
            type: "city",
            id: `city-${destination.slug}-${spot.name}`,
            href: `${destinationPath(destination.slug)}?ort=${encodeURIComponent(spot.name)}`,
            title: spotName,
            subtitle: name,
          });
        }
      }
    }

    for (const deal of deals) {
      if (normalize(deal.name).includes(q) || normalize(deal.destinationRegion).includes(q)) {
        results.push({
          type: "hotel",
          id: `hotel-${deal.id}`,
          href: `/angebot/${deal.slug}`,
          title: deal.name,
          subtitle: tx(deal.destinationRegion, locale),
        });
      }
    }

    return results.slice(0, 8);
  }, [query, locale]);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  const go = (href: string) => {
    setOpen(false);
    setQuery("");
    onNavigate?.();
    router.push(href, { scroll: true });
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open && (event.key === "ArrowDown" || event.key === "Enter")) {
      setOpen(true);
      return;
    }
    if (event.key === "Escape") {
      setOpen(false);
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((i) => Math.min(i + 1, Math.max(suggestions.length - 1, 0)));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (event.key === "Enter" && suggestions[active]) {
      event.preventDefault();
      go(suggestions[active].href);
    }
  };

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <label className="relative block">
        <span className="sr-only">{t("nav.search")}</span>
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
          aria-hidden="true"
        />
        <input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActive(0);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder={t("nav.searchPlaceholder")}
          autoComplete="off"
          className={cn(
            "w-full rounded-full border border-line bg-white pl-9 pr-9 text-sm text-ink outline-none transition placeholder:text-muted focus:border-brand-400 focus:ring-2 focus:ring-brand-100",
            compact ? "h-10" : "h-10 min-w-[14rem] lg:min-w-[16rem]"
          )}
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setOpen(false);
            }}
            aria-label={t("nav.clearSearch")}
            className="absolute right-2.5 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-muted hover:bg-surface hover:text-ink"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        )}
      </label>

      {open && query.trim().length > 0 && (
        <div className="absolute left-0 right-0 top-[calc(100%+0.4rem)] z-50 overflow-hidden rounded-2xl border border-line bg-white shadow-[0_16px_40px_rgba(15,26,43,0.14)]">
          {suggestions.length === 0 ? (
            <p className="px-4 py-3 text-sm text-muted">{t("nav.searchEmpty")}</p>
          ) : (
            <ul className="max-h-80 overflow-y-auto py-1">
              {suggestions.map((item, index) => {
                const Icon = item.type === "hotel" ? Building2 : MapPin;
                return (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      onClick={() => {
                        setOpen(false);
                        setQuery("");
                        onNavigate?.();
                      }}
                      className={cn(
                        "flex items-start gap-3 px-4 py-2.5 text-left transition hover:bg-brand-50",
                        index === active && "bg-brand-50"
                      )}
                    >
                      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface text-brand-500">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold text-ink">{item.title}</span>
                        <span className="block truncate text-xs text-muted">
                          {item.type === "country"
                            ? t("nav.searchCountry")
                            : item.type === "city"
                              ? t("nav.searchCity")
                              : t("nav.searchHotel")}
                          {" · "}
                          {item.subtitle}
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
