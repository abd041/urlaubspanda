"use client";

import Link from "next/link";
import { LegalPageShell, LegalSection } from "@/components/legal/LegalPageShell";
import { useT } from "@/i18n/LocaleProvider";

export function ImpressumBody() {
  const t = useT();
  return (
    <LegalPageShell titleKey="legal.imprintTitle" introKey="legal.imprintIntro" path="/impressum">
      <LegalSection title={t("legal.provider")}>
        <p>
          <strong className="font-semibold text-ink">Urlaubspanda</strong>
          <br />
          Musterstraße 1<br />
          1010 Wien<br />
          {t("legal.countryAustria")}
        </p>
      </LegalSection>
      <LegalSection title={t("legal.contact")}>
        <p>
          E-Mail:{" "}
          <a href="mailto:info@urlaubspanda.at" className="font-medium text-brand-500 hover:text-brand-600">
            info@urlaubspanda.at
          </a>
          <br />
          Telefon: +43 1 000 00 00
        </p>
      </LegalSection>
      <LegalSection title={t("legal.company")}>
        <p>
          UID-Nr.: ATU00000000
          <br />
          Firmenbuchnummer: FN 000000 a
          <br />
          Firmenbuchgericht: Handelsgericht Wien
        </p>
      </LegalSection>
      <LegalSection title={t("legal.responsible")}>
        <p>{t("legal.responsibleText")}</p>
      </LegalSection>
    </LegalPageShell>
  );
}

export function DatenschutzBody() {
  const t = useT();
  return (
    <LegalPageShell titleKey="legal.privacyTitle" introKey="legal.privacyIntro" path="/datenschutz">
      <LegalSection title={t("legal.privacy1")}>
        <p>
          {t("legal.privacy1Text")}{" "}
          <Link href="/impressum" className="font-medium text-brand-500 hover:text-brand-600">
            {t("footer.imprint")}
          </Link>
          .
        </p>
      </LegalSection>
      <LegalSection title={t("legal.privacy2")}>
        <p>{t("legal.privacy2Text")}</p>
      </LegalSection>
      <LegalSection title={t("legal.privacy3")}>
        <p>{t("legal.privacy3Text")}</p>
      </LegalSection>
      <LegalSection title={t("legal.privacy4")}>
        <p>{t("legal.privacy4Text")}</p>
      </LegalSection>
      <LegalSection title={t("legal.privacy5")}>
        <p>{t("legal.privacy5Text")}</p>
      </LegalSection>
      <LegalSection title={t("legal.privacy6")}>
        <p>
          {t("legal.privacy6Text")}{" "}
          <a href="mailto:datenschutz@urlaubspanda.at" className="font-medium text-brand-500 hover:text-brand-600">
            datenschutz@urlaubspanda.at
          </a>
          .
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}

export function AgbBody() {
  const t = useT();
  return (
    <LegalPageShell titleKey="legal.termsTitle" introKey="legal.termsIntro" path="/agb">
      <LegalSection title={t("legal.terms1")}>
        <p>{t("legal.terms1Text")}</p>
      </LegalSection>
      <LegalSection title={t("legal.terms2")}>
        <p>{t("legal.terms2Text")}</p>
      </LegalSection>
      <LegalSection title={t("legal.terms3")}>
        <p>{t("legal.terms3Text")}</p>
      </LegalSection>
      <LegalSection title={t("legal.terms4")}>
        <p>{t("legal.terms4Text")}</p>
      </LegalSection>
      <LegalSection title={t("legal.terms5")}>
        <p>
          {t("legal.terms5Text")}{" "}
          <Link href="/datenschutz" className="font-medium text-brand-500 hover:text-brand-600">
            {t("footer.privacy")}
          </Link>
          .
        </p>
      </LegalSection>
      <LegalSection title={t("legal.terms6")}>
        <p>{t("legal.terms6Text")}</p>
      </LegalSection>
    </LegalPageShell>
  );
}
