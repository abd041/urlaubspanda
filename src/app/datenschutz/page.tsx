import type { Metadata } from "next";
import { DatenschutzBody } from "@/components/legal/LegalBodies";

const title = "Datenschutz | Urlaubspanda";
const description =
  "Datenschutzerklärung von Urlaubspanda – Informationen zur Verarbeitung personenbezogener Daten.";
const path = "/datenschutz";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: { title, description, url: path },
};

export default function DatenschutzPage() {
  return <DatenschutzBody />;
}
