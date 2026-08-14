import type { Metadata } from "next";
import { AgbBody } from "@/components/legal/LegalBodies";

const title = "AGB | Urlaubspanda";
const description =
  "Allgemeine Geschäftsbedingungen (AGB) von Urlaubspanda für die Nutzung der Website und Angebote.";
const path = "/agb";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: { title, description, url: path },
};

export default function AgbPage() {
  return <AgbBody />;
}
