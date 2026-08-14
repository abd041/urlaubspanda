import type { Metadata } from "next";
import { ImpressumBody } from "@/components/legal/LegalBodies";

const title = "Impressum | Urlaubspanda";
const description =
  "Impressum und Anbieterkennzeichnung von Urlaubspanda – Angaben gemäß § 5 ECG / Mediengesetz.";
const path = "/impressum";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: { title, description, url: path },
};

export default function ImpressumPage() {
  return <ImpressumBody />;
}
