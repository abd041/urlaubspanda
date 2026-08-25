"use client";

import Link from "next/link";
import { LegalSection } from "@/components/legal/LegalPageShell";
import { useT } from "@/i18n/LocaleProvider";

export type LegalDocKind = "agb" | "cancellation" | "privacy";

export function legalDocTitleKey(kind: LegalDocKind) {
  if (kind === "agb") return "legal.termsTitle";
  if (kind === "cancellation") return "legal.cancelTitle";
  return "legal.privacyTitle";
}

export function legalDocIntroKey(kind: LegalDocKind) {
  if (kind === "agb") return "legal.termsIntro";
  if (kind === "cancellation") return "legal.cancelIntro";
  return "legal.privacyIntro";
}

export function AgbSections() {
  const t = useT();
  return (
    <>
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
        <p>{t("legal.terms5Text")}</p>
      </LegalSection>
      <LegalSection title={t("legal.terms6")}>
        <p>{t("legal.terms6Text")}</p>
      </LegalSection>
    </>
  );
}

export function CancellationSections() {
  const t = useT();
  return (
    <>
      <LegalSection title={t("legal.cancel1")}>
        <p>{t("legal.cancel1Text")}</p>
      </LegalSection>
      <LegalSection title={t("legal.cancel2")}>
        <p>{t("legal.cancel2Text")}</p>
      </LegalSection>
      <LegalSection title={t("legal.cancel3")}>
        <p>{t("legal.cancel3Text")}</p>
      </LegalSection>
      <LegalSection title={t("legal.cancel4")}>
        <p>{t("legal.cancel4Text")}</p>
      </LegalSection>
    </>
  );
}

export function PrivacySections() {
  const t = useT();
  return (
    <>
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
    </>
  );
}

export function LegalDocumentSections({ kind }: { kind: LegalDocKind }) {
  if (kind === "agb") return <AgbSections />;
  if (kind === "cancellation") return <CancellationSections />;
  return <PrivacySections />;
}
