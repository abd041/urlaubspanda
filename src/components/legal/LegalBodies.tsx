"use client";

import { LegalPageShell, LegalSection } from "@/components/legal/LegalPageShell";
import { AgbSections, PrivacySections } from "@/components/legal/LegalDocumentSections";
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
  return (
    <LegalPageShell titleKey="legal.privacyTitle" introKey="legal.privacyIntro" path="/datenschutz">
      <PrivacySections />
    </LegalPageShell>
  );
}

export function AgbBody() {
  return (
    <LegalPageShell titleKey="legal.termsTitle" introKey="legal.termsIntro" path="/agb">
      <AgbSections />
    </LegalPageShell>
  );
}
