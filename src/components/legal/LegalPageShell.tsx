"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd } from "@/lib/structuredData";
import { useT } from "@/i18n/LocaleProvider";

export function LegalPageShell({
  titleKey,
  introKey,
  path,
  children,
}: {
  titleKey: string;
  introKey: string;
  path: string;
  children: React.ReactNode;
}) {
  const t = useT();
  const title = t(titleKey);

  return (
    <main className="pb-12 sm:pb-16">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: t("nav.home"), path: "/" },
          { name: title, path },
        ])}
      />

      <div className="border-b border-line bg-surface">
        <Container className="py-8 sm:py-10">
          <nav aria-label={t("nav.breadcrumb")} className="flex items-center gap-1.5 text-xs text-muted sm:text-sm">
            <Link href="/" className="transition hover:text-brand-500">
              {t("nav.home")}
            </Link>
            <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span className="truncate font-medium text-ink" aria-current="page">
              {title}
            </span>
          </nav>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-ink sm:text-4xl">{title}</h1>
          <p className="mt-2 max-w-2xl text-sm text-body sm:text-base">{t(introKey)}</p>
        </Container>
      </div>

      <Container className="mt-8 sm:mt-10">
        <article className="mx-auto max-w-3xl space-y-8">{children}</article>
      </Container>
    </main>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-line bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-lg font-bold tracking-tight text-ink">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-body sm:text-[15px]">
        {children}
      </div>
    </section>
  );
}
