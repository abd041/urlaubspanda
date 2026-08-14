"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { cn } from "@/lib/utils";
import { useT } from "@/i18n/LocaleProvider";

export function BreadcrumbNav({
  items,
  contained = true,
  tone = "default",
}: {
  items: { href?: string; labelKey?: string; label?: string }[];
  contained?: boolean;
  tone?: "default" | "onDark";
}) {
  const t = useT();
  const onDark = tone === "onDark";

  const nav = (
    <nav
      aria-label={t("nav.breadcrumb")}
      className={cn(
        "flex items-center gap-1.5 text-xs sm:text-sm",
        onDark ? "text-white/70" : "text-muted"
      )}
    >
      {items.map((item, index) => {
        const label = item.labelKey ? t(item.labelKey) : (item.label ?? "");
        const isLast = index === items.length - 1;
        return (
          <span key={`${label}-${index}`} className="flex min-w-0 items-center gap-1.5">
            {index > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />}
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className={cn("transition", onDark ? "hover:text-white" : "hover:text-brand-500")}
              >
                {label}
              </Link>
            ) : (
              <span
                className={cn("truncate font-medium", onDark ? "text-white" : "text-ink")}
                aria-current={isLast ? "page" : undefined}
              >
                {label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );

  if (!contained) return nav;
  return <Container className="pt-4 sm:pt-6">{nav}</Container>;
}

export function PageIntro({
  titleKey,
  introKey,
}: {
  titleKey: string;
  introKey: string;
}) {
  const t = useT();
  return (
    <section className="mt-3 sm:mt-4">
      <Container>
        <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl lg:text-4xl">
          {t(titleKey)}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-body sm:text-base">{t(introKey)}</p>
      </Container>
    </section>
  );
}
