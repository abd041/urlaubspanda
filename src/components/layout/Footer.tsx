"use client";

import Link from "next/link";
import { Mail } from "lucide-react";
import { FacebookIcon, InstagramIcon } from "@/components/icons/SocialIcons";
import { PandaLogo } from "@/components/icons/PandaLogo";
import { Container } from "@/components/layout/Container";
import { useT } from "@/i18n/LocaleProvider";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";

const CONTACT_EMAIL = "info@urlaubspanda.at";

const socialLinks = [
  {
    icon: FacebookIcon,
    labelKey: "footer.facebook",
    href: "https://www.facebook.com/urlaubspanda.at",
  },
  {
    icon: InstagramIcon,
    labelKey: "footer.instagram",
    href: "https://www.instagram.com/urlaubspanda",
  },
] as const;

export function Footer() {
  const t = useT();
  const year = new Date().getFullYear();

  const legalLinks = [
    { href: "/datenschutz", label: t("footer.privacy") },
    { href: "/impressum", label: t("footer.imprint") },
    { href: "/agb", label: t("footer.terms") },
  ];

  return (
    <footer className="min-w-0 border-t border-line bg-surface">
      <Container className="py-12 sm:py-16">
        <RevealGroup className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
          <RevealItem>
            <h2 className="text-[15px] font-semibold tracking-tight text-ink">{t("footer.aboutTitle")}</h2>
            <p className="mt-3 text-sm leading-relaxed text-body">{t("footer.aboutText")}</p>
          </RevealItem>

          <RevealItem>
            <h2 className="text-[15px] font-semibold tracking-tight text-ink">{t("footer.contactTitle")}</h2>
            <p className="mt-3 text-sm leading-relaxed text-body">
              {t("footer.contactLead")}{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="font-medium text-brand-500 transition hover:text-brand-600"
              >
                {CONTACT_EMAIL}
              </a>
              . {t("footer.contactClose")}
            </p>
            <div className="mt-5 flex items-center gap-3 border-t border-line pt-5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-500">
                <Mail className="h-4 w-4" aria-hidden="true" strokeWidth={1.7} />
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted">
                  {t("footer.contactLabel")}
                </p>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-sm font-medium text-ink transition hover:text-brand-500"
                >
                  {CONTACT_EMAIL}
                </a>
              </div>
            </div>
          </RevealItem>

          <RevealItem>
            <h2 className="text-[15px] font-semibold tracking-tight text-ink">{t("footer.socialTitle")}</h2>
            <ul className="mt-3 space-y-2">
              {socialLinks.map(({ icon: Icon, labelKey, href }) => (
                <li key={href}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 text-sm font-medium text-body transition hover:text-brand-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
                  >
                    <Icon className="h-4 w-4 text-brand-500" />
                    {t(labelKey)}
                  </a>
                </li>
              ))}
            </ul>
          </RevealItem>
        </RevealGroup>

        <Reveal className="mt-12 flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <Link
              href="/"
              className="inline-flex items-center rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
            >
              <PandaLogo className="h-8 w-auto" />
            </Link>
            <p className="text-xs text-muted">{t("footer.copyright", { year })}</p>
          </div>

          <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-medium text-ink transition hover:text-brand-500"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </Reveal>

        <Reveal delay={0.08} as="p" className="mt-4 text-xs text-muted">
          {t("footer.priceNote")}
        </Reveal>
      </Container>
    </footer>
  );
}
