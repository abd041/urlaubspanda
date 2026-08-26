"use client";

import { Suspense, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Heart, Menu, Search, X } from "lucide-react";
import { PandaLogo } from "@/components/icons/PandaLogo";
import { Container } from "@/components/layout/Container";
import { LanguageToggle } from "@/components/layout/LanguageToggle";
import { HeaderSearch } from "@/components/layout/HeaderSearch";
import { filterOptions, HEADER_FILTER_KEYS } from "@/data/filters";
import { cn } from "@/lib/utils";
import { useT, useLocale } from "@/i18n/LocaleProvider";
import { filterLabel } from "@/i18n/content";
import { AnimatePresence, easePremium, motion, useReducedMotion } from "@/components/motion/Reveal";

const primaryLinks = [
  { href: "/reiseziele", labelKey: "nav.destinations", match: (path: string) => path === "/reiseziele" || path.startsWith("/reiseziele/") },
  { href: "/angebote", labelKey: "nav.deals", match: (path: string) => path === "/angebote" },
  { href: "/last-minute", labelKey: "nav.lastMinute", match: (path: string) => path === "/last-minute" },
  { href: "/pauschalreisen", labelKey: "nav.packages", match: (path: string) => path === "/pauschalreisen" },
];

const travelTypeLinks = HEADER_FILTER_KEYS.map((key) => {
  const option = filterOptions.find((item) => item.key === key)!;
  return {
    key: option.key,
    label: option.label,
    href: `/angebote?${option.key}=1`,
  };
});

function isPrimaryActive(href: string, pathname: string, match: (path: string) => boolean) {
  if (href === "/angebote") return pathname === "/angebote";
  return match(pathname);
}

function HeaderNavStatic({
  onNavigate,
  className,
}: {
  onNavigate?: () => void;
  className?: string;
}) {
  const t = useT();
  return (
    <ul className={className}>
      {primaryLinks.map((link) => (
        <li key={link.href}>
          <Link
            href={link.href}
            onClick={onNavigate}
            className="block px-3 py-2 text-sm font-medium text-body transition hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
          >
            {t(link.labelKey)}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function HeaderNavActive({
  onNavigate,
  className,
}: {
  onNavigate?: () => void;
  className?: string;
}) {
  const pathname = usePathname();
  const t = useT();

  return (
    <ul className={className}>
      {primaryLinks.map((link) => {
        const isActive = isPrimaryActive(link.href, pathname, link.match);
        return (
          <li key={link.href}>
            <Link
              href={link.href}
              onClick={onNavigate}
              className={cn(
                "relative block px-3 py-2 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500",
                isActive
                  ? "text-ink after:absolute after:inset-x-3 after:bottom-1 after:h-px after:bg-brand-500"
                  : "text-body hover:text-ink"
              )}
            >
              {t(link.labelKey)}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function HeaderNav(props: { onNavigate?: () => void; className?: string }) {
  return (
    <Suspense fallback={<HeaderNavStatic {...props} />}>
      <HeaderNavActive {...props} />
    </Suspense>
  );
}

function TravelTypeLinks({
  onNavigate,
  stacked = false,
}: {
  onNavigate?: () => void;
  stacked?: boolean;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { locale } = useLocale();

  return (
    <ul className={stacked ? "flex flex-col gap-1" : "flex flex-wrap items-center gap-1"}>
      {travelTypeLinks.map((link) => {
        const isActive = pathname === "/angebote" && searchParams.get(link.key) === "1";
        return (
          <li key={link.key}>
            <Link
              href={link.href}
              onClick={onNavigate}
              className={cn(
                "block rounded-full px-3 py-1.5 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500",
                isActive
                  ? "text-ink"
                  : "text-body hover:text-ink"
              )}
            >
              {filterLabel(link.key, locale)}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function TravelTypeLinksBoundary(props: { onNavigate?: () => void; stacked?: boolean }) {
  const { locale } = useLocale();
  return (
    <Suspense
      fallback={
        <ul className={props.stacked ? "flex flex-col gap-1" : "flex flex-wrap items-center gap-1"}>
          {travelTypeLinks.map((link) => (
            <li key={link.key}>
              <Link
                href={link.href}
                onClick={props.onNavigate}
                className="block rounded-full px-3 py-1.5 text-sm font-medium text-body transition hover:bg-surface hover:text-ink"
              >
                {filterLabel(link.key, locale)}
              </Link>
            </li>
          ))}
        </ul>
      }
    >
      <TravelTypeLinks {...props} />
    </Suspense>
  );
}

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [portalReady, setPortalReady] = useState(false);
  const t = useT();
  const reduce = useReducedMotion();

  useEffect(() => {
    setPortalReady(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen || mobileSearchOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen, mobileSearchOpen]);

  useEffect(() => {
    if (!mobileSearchOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileSearchOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileSearchOpen]);

  const openMobileSearch = () => {
    setMobileOpen(false);
    setMobileSearchOpen(true);
  };

  const closeMobileSearch = () => setMobileSearchOpen(false);

  const mobileSearchOverlay =
    portalReady &&
    createPortal(
      <AnimatePresence>
        {mobileSearchOpen && (
          <motion.div
            id="mobile-search"
            role="dialog"
            aria-modal="true"
            aria-label={t("nav.search")}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0.12 : 0.2, ease: easePremium }}
            className="fixed inset-0 z-[100] flex flex-col bg-white sm:hidden"
          >
            <div className="flex h-[68px] shrink-0 items-center gap-2 border-b border-line px-4">
              <p className="flex-1 text-sm font-semibold text-ink">{t("nav.search")}</p>
              <button
                type="button"
                onClick={closeMobileSearch}
                aria-label={t("nav.closeSearch")}
                className="flex h-10 w-10 items-center justify-center rounded-full text-ink transition hover:bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
              >
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
              <HeaderSearch panel autoFocus onNavigate={closeMobileSearch} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body
    );

  return (
    <header className="sticky top-0 z-40 min-w-0 border-b border-line bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <Container>
        <div className="flex h-[68px] items-center justify-between gap-4 sm:h-[76px]">
          <Link
            href="/"
            className="flex shrink-0 items-center rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
          >
            <PandaLogo className="h-8 w-auto sm:h-9" />
          </Link>

          <nav aria-label={t("nav.main")} className="hidden lg:block">
            <HeaderNav className="flex items-center gap-1" />
          </nav>

          <div className="mx-2 hidden min-w-0 flex-1 justify-center sm:flex lg:mx-4 lg:max-w-sm lg:flex-none lg:justify-end">
            <HeaderSearch className="w-full max-w-md" />
          </div>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <LanguageToggle />
            <button
              type="button"
              onClick={openMobileSearch}
              aria-expanded={mobileSearchOpen}
              aria-controls="mobile-search"
              aria-label={t("nav.openSearch")}
              className="flex h-10 w-10 items-center justify-center rounded-full text-ink transition hover:bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 sm:hidden"
            >
              <Search className="h-5 w-5" aria-hidden="true" />
            </button>
            <Link
              href="/merkliste"
              className="flex items-center gap-1.5 rounded-full px-2.5 py-2 text-sm font-medium text-body transition hover:bg-surface hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 sm:px-3"
            >
              <Heart className="h-5 w-5" aria-hidden="true" />
              <span className="hidden lg:inline">{t("nav.wishlist")}</span>
            </Link>
            <button
              type="button"
              onClick={() => {
                setMobileSearchOpen(false);
                setMobileOpen((v) => !v);
              }}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              aria-label={mobileOpen ? t("nav.closeMenu") : t("nav.openMenu")}
              className="flex h-10 w-10 items-center justify-center rounded-full text-ink transition hover:bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 lg:hidden"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={mobileOpen ? "close" : "menu"}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.86 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.86 }}
                  transition={{ duration: reduce ? 0.12 : 0.18, ease: easePremium }}
                  className="flex"
                >
                  {mobileOpen ? (
                    <X className="h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Menu className="h-6 w-6" aria-hidden="true" />
                  )}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </Container>

      {mobileSearchOverlay}

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            animate={reduce ? { opacity: 1 } : { height: "auto", opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: reduce ? 0.16 : 0.38, ease: easePremium }}
            className="overflow-hidden border-t border-line bg-white lg:hidden"
          >
            <Container>
              <nav aria-label={t("nav.mobile")} className="py-3">
                <HeaderNav
                  onNavigate={() => setMobileOpen(false)}
                  className="flex flex-col gap-1"
                />
                <p className="mt-4 px-3 text-[11px] font-bold uppercase tracking-[0.08em] text-muted">
                  {t("nav.travelTypes")}
                </p>
                <div className="mt-1">
                  <TravelTypeLinksBoundary
                    stacked
                    onNavigate={() => setMobileOpen(false)}
                  />
                </div>
              </nav>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
