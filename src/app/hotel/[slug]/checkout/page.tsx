import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { deals } from "@/data/deals";
import { getHotelBooking } from "@/lib/hotelBooking";
import { CheckoutFlow } from "@/components/booking/CheckoutFlow";

export function generateStaticParams() {
  return deals.map((deal) => ({ slug: deal.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/hotel/[slug]/checkout">): Promise<Metadata> {
  const { slug } = await params;
  const booking = getHotelBooking(slug);
  if (!booking) return {};

  return {
    title: `Buchung abschließen – ${booking.deal.name} | Urlaubspanda`,
    description: `Reisedaten und Zahlung für ${booking.deal.name} angeben und die Buchung abschließen.`,
    robots: { index: false, follow: false },
  };
}

function CheckoutFallback() {
  return (
    <main className="min-h-screen bg-surface">
      <div className="mx-auto w-[calc(100%-2rem)] max-w-[1240px] animate-pulse py-10 sm:w-[calc(100%-3rem)] lg:w-[calc(100%-4rem)]">
        <div className="h-64 rounded-2xl bg-white shadow-sm" />
      </div>
    </main>
  );
}

export default async function HotelCheckoutPage({ params }: PageProps<"/hotel/[slug]/checkout">) {
  const { slug } = await params;
  const booking = getHotelBooking(slug);
  if (!booking) notFound();

  return (
    <Suspense fallback={<CheckoutFallback />}>
      <CheckoutFlow deal={booking.deal} config={booking.config} />
    </Suspense>
  );
}
