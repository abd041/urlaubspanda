import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { WishlistView } from "@/components/home/WishlistView";
import { TrustStrip } from "@/components/home/TrustStrip";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd } from "@/lib/structuredData";
import { deals } from "@/data/deals";
import { BreadcrumbNav, PageIntro } from "@/components/i18n/PageChrome";

const title = "Merkliste – Gespeicherte Angebote | Urlaubspanda";
const description =
  "Deine gespeicherten Urlaubspanda-Angebote an einem Ort – vergleiche und buche deine Favoriten.";
const path = "/merkliste";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: { title, description, url: path },
  twitter: { title, description },
  robots: { index: false, follow: true },
};

export default function WishlistPage() {
  return (
    <main className="pb-4">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Startseite", path: "/" },
          { name: "Merkliste", path },
        ])}
      />

      <BreadcrumbNav
        items={[
          { href: "/", labelKey: "nav.home" },
          { href: path, labelKey: "nav.wishlist" },
        ]}
      />

      <PageIntro titleKey="pages.wishlistTitle" introKey="pages.wishlistIntro" />

      <section className="mt-6 sm:mt-8">
        <Container>
          <WishlistView deals={deals} />
        </Container>
      </section>

      <TrustStrip />
    </main>
  );
}
