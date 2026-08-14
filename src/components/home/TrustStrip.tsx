"use client";

import { BadgeEuro, Headphones, LockKeyhole, Sparkles, type LucideIcon } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { useT } from "@/i18n/LocaleProvider";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";

const cardClass =
  "rounded-xl border border-[#eeeef2] bg-white p-6 shadow-[0_2px_10px_rgba(15,26,43,0.06)] transition-[transform,box-shadow] duration-150 ease-out hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(15,26,43,0.1)]";

export function TrustStrip() {
  const t = useT();
  const items: {
    icon: LucideIcon;
    iconClass: string;
    title: string;
    description: string;
  }[] = [
    {
      icon: BadgeEuro,
      iconClass: "text-[#1B63EB]",
      title: t("home.trustBestPrice"),
      description: t("home.trustBestPriceText"),
    },
    {
      icon: LockKeyhole,
      iconClass: "text-[#12A89A]",
      title: t("home.trustSecure"),
      description: t("home.trustSecureText"),
    },
    {
      icon: Sparkles,
      iconClass: "text-[#E39B1A]",
      title: t("home.trustDeals"),
      description: t("home.trustDealsText"),
    },
    {
      icon: Headphones,
      iconClass: "text-[#6366F1]",
      title: t("home.trustSupport"),
      description: t("home.trustSupportText"),
    },
  ];

  return (
    <section aria-labelledby="warum-urlaubspanda-heading" className="pt-16 pb-20 sm:pt-20 sm:pb-24">
      <Container>
        <Reveal className="max-w-2xl">
          <h2
            id="warum-urlaubspanda-heading"
            className="text-[1.75rem] font-medium tracking-[-0.03em] text-ink sm:text-[2.125rem] xl:text-[2.375rem] xl:leading-[1.12]"
          >
            {t("home.trustTitle")}
          </h2>
          <p className="mt-3 text-[15px] font-normal leading-relaxed text-body">{t("home.trustSubtitle")}</p>
        </Reveal>

        <RevealGroup as="ul" className="mt-10 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {items.map((item) => (
            <RevealItem as="li" key={item.title}>
              <div className={cardClass}>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface">
                  <item.icon className={`h-5 w-5 ${item.iconClass}`} aria-hidden="true" strokeWidth={1.6} />
                </span>
                <h3 className="mt-5 text-[15px] font-semibold tracking-tight text-ink">{item.title}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-body">{item.description}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal as="p" className="mt-8 text-[12px] tracking-[0.04em] text-muted sm:mt-10">
          {t("home.trustProof")}
        </Reveal>
      </Container>
    </section>
  );
}
