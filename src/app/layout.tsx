import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Bricolage_Grotesque } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
import { organizationJsonLd, websiteJsonLd } from "@/lib/structuredData";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import { LOCALE_COOKIE, parseLocale } from "@/i18n/config";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin", "latin-ext"],
  variable: "--font-bricolage",
  display: "swap",
});

const title = "Urlaubspanda – Die besten Urlaubsangebote & Reise-Deals";
const description =
  "Entdecke geprüfte Pauschalreisen, Last-Minute-Angebote und Urlaubs-Deals zu Top-Preisen – von Griechenland bis Ägypten, ehrlich verglichen mit Urlaubspanda.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title,
    description,
    url: "/",
    siteName: SITE_NAME,
    locale: "de_AT",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const cookieStore = await cookies();
  const locale = parseLocale(cookieStore.get(LOCALE_COOKIE)?.value);

  return (
    <html
      lang={locale}
      translate="no"
      suppressHydrationWarning
      className={`${bricolage.variable} ${bricolage.className} h-full antialiased`}
    >
      <body className="flex min-h-full min-w-0 flex-col overflow-x-clip bg-background text-foreground">
        <LocaleProvider initialLocale={locale}>
          <JsonLd data={organizationJsonLd()} />
          <JsonLd data={websiteJsonLd()} />
          <Header />
          <div className="min-w-0 flex-1 [contain:inline-size]">{children}</div>
          <Footer />
        </LocaleProvider>
      </body>
    </html>
  );
}
