import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { deals } from "@/data/deals";
import { bookingConfigs } from "@/data/bookingConfigs";
import { BookingFlow } from "@/components/booking/BookingFlow";

function getHotelBooking(slug: string) {
  const deal = deals.find((d) => d.slug === slug);
  const config = bookingConfigs[slug];
  if (!deal || !config) return null;
  return { deal, config };
}

/** Prerender the booking-flow shell for every known offer at build time. */
export function generateStaticParams() {
  return deals.map((deal) => ({ slug: deal.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/hotel/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const booking = getHotelBooking(slug);
  if (!booking) return {};

  return {
    title: `Buchung – ${booking.deal.name} | Urlaubspanda`,
    description: `Wähle Reisende, Zeitraum, Zimmer und Angebot für ${booking.deal.name} und schließe deine Buchung ab.`,
    // Transactional booking-flow URLs carry personal search state and should
    // never be indexed or show up as duplicate content of the offer page.
    robots: { index: false, follow: false },
  };
}

function BookingFlowFallback() {
  return (
    <main className="min-h-screen bg-surface">
      <div className="mx-auto w-full max-w-[1320px] animate-pulse px-4 py-10 sm:px-6 lg:px-8">
        <div className="h-64 rounded-2xl bg-white shadow-sm" />
      </div>
    </main>
  );
}

export default async function HotelBookingPage({ params }: PageProps<"/hotel/[slug]">) {
  const { slug } = await params;
  const booking = getHotelBooking(slug);
  if (!booking) notFound();

  return (
    <Suspense fallback={<BookingFlowFallback />}>
      <BookingFlow deal={booking.deal} config={booking.config} />
    </Suspense>
  );
}
