import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { TrustStrip } from "@/components/home/TrustStrip";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, offerDetailJsonLd } from "@/lib/structuredData";
import { destinationPath } from "@/lib/destinationPaths";
import { deals } from "@/data/deals";
import { offerDetails } from "@/data/offerDetails";
import { destinations } from "@/data/destinations";
import { OfferGallery } from "@/components/offer/OfferGallery";
import { OfferHeroHeader } from "@/components/offer/OfferHeroHeader";
import { OfferAtAGlance } from "@/components/offer/OfferAtAGlance";
import { OfferContentSections } from "@/components/offer/OfferContentSections";
import { OfferIncludedList } from "@/components/offer/OfferIncludedList";
import { OfferCompareCard } from "@/components/offer/OfferCompareCard";
import { OfferLocationSection } from "@/components/offer/OfferLocationSection";
import { OfferImpressions } from "@/components/offer/OfferImpressions";
import { OfferSimilarDeals } from "@/components/offer/OfferSimilarDeals";
import { OfferAmenities } from "@/components/offer/OfferAmenities";
import { OfferHighlights } from "@/components/offer/OfferHighlights";
import { MobilePriceSection } from "@/components/offer/MobilePriceSection";
import { MobileStickyCta } from "@/components/offer/MobileStickyCta";
import { OfferClickTracker } from "@/components/offer/OfferClickTracker";
import { PriceSidebar } from "@/components/offer/PriceSidebar";
import { SITE_URL } from "@/lib/site";
import { OfferBreadcrumb } from "@/components/offer/OfferBreadcrumb";
import { OfferOpenAtTop } from "@/components/offer/OfferOpenAtTop";

function getOffer(slug: string) {
  const deal = deals.find((d) => d.slug === slug);
  const detail = offerDetails[slug];
  if (!deal || !detail) return null;
  return { deal, detail };
}

function getRegionLabel(destinationRegion: string) {
  return destinationRegion.split(" · ")[0] ?? destinationRegion;
}

export function generateStaticParams() {
  return deals.map((deal) => ({ slug: deal.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/angebot/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const offer = getOffer(slug);
  if (!offer) return {};
  const { deal, detail } = offer;

  const title = `${deal.name} – ${deal.summary} | Urlaubspanda`;
  const description = detail.descriptionParagraphs[0] ?? deal.summary;
  const path = `/angebot/${deal.slug}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, images: [deal.images[0]] },
    twitter: { title, description, images: [deal.images[0]] },
  };
}

/**
 * Offer detail — top hero/gallery match urlaubshamster; body sections below.
 */
export default async function OfferPage({ params }: PageProps<"/angebot/[slug]">) {
  const { slug } = await params;
  const offer = getOffer(slug);
  if (!offer) notFound();
  const { deal, detail } = offer;

  const region = getRegionLabel(deal.destinationRegion);
  const countryDestination = destinations.find((d) => d.name === deal.destinationCountry);
  const offerUrl = `${SITE_URL}/angebot/${deal.slug}`;

  return (
    <main className="bg-background pb-16">
      <JsonLd data={offerDetailJsonLd(deal, detail)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Startseite", path: "/" },
          ...(countryDestination
            ? [{ name: deal.destinationCountry, path: destinationPath(countryDestination.slug) }]
            : []),
          { name: region, path: `/angebot/${deal.slug}` },
          { name: deal.name, path: `/angebot/${deal.slug}` },
        ])}
      />

      <MobileStickyCta deal={deal} detail={detail} />
      <OfferClickTracker dealId={deal.id} />
      <OfferOpenAtTop />

      <OfferBreadcrumb
        country={deal.destinationCountry}
        countrySlug={countryDestination?.slug}
        region={region}
        hotelName={deal.name}
      />

      <Container>
        <OfferHeroHeader deal={deal} detail={detail} offerUrl={offerUrl} />
      </Container>

      <Container className="mt-5 sm:mt-6">
        <div className="flex flex-col gap-5 sm:gap-8 lg:gap-10">
          <OfferGallery
            images={deal.images}
            alt={deal.name}
            discountPercent={deal.discountPercent}
            totalPhotoCount={detail.totalPhotoCount}
          />

          <div className="lg:hidden">
            <MobilePriceSection deal={deal} detail={detail} />
          </div>

          <div className="lg:flex lg:items-start lg:gap-8">
            <div className="flex min-w-0 flex-1 flex-col gap-10 sm:gap-12">
              <OfferAtAGlance deal={deal} detail={detail} />

              <OfferIncludedList items={detail.inclusions} />

              <OfferHighlights items={detail.highlights} />

              <OfferContentSections
                sections={detail.contentSections}
                fallbackHeading={detail.descriptionHeading}
                fallbackParagraphs={detail.descriptionParagraphs}
              />

              <OfferCompareCard deal={deal} detail={detail} />

              <OfferLocationSection deal={deal} />

              <OfferImpressions deal={deal} detail={detail} />

              {detail.amenities.length > 0 && <OfferAmenities amenities={detail.amenities} />}
            </div>

            <PriceSidebar deal={deal} detail={detail} />
          </div>
        </div>
      </Container>

      <OfferSimilarDeals current={deal} candidates={deals} />

      <TrustStrip />
    </main>
  );
}
