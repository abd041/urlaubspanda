import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { deals } from "@/data/deals";
import { getHotelBooking } from "@/lib/hotelBooking";
import { ConfirmationFlow } from "@/components/booking/ConfirmationFlow";

export function generateStaticParams() {
  return deals.map((deal) => ({ slug: deal.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/hotel/[slug]/checkout/confirmation">): Promise<Metadata> {
  const { slug } = await params;
  const booking = getHotelBooking(slug);
  if (!booking) return {};

  return {
    title: `Buchungsbestätigung – ${booking.deal.name} | Urlaubspanda`,
    description: `Buchungsbestätigung für ${booking.deal.name}.`,
    robots: { index: false, follow: false },
  };
}

function ConfirmationFallback() {
  return (
    <main className="min-h-screen bg-surface">
      <div className="mx-auto w-[calc(100%-2rem)] max-w-[960px] animate-pulse py-10 sm:w-[calc(100%-3rem)]">
        <div className="h-64 rounded-2xl bg-white shadow-sm" />
      </div>
    </main>
  );
}

export default async function BookingConfirmationPage({
  params,
}: PageProps<"/hotel/[slug]/checkout/confirmation">) {
  const { slug } = await params;
  const booking = getHotelBooking(slug);
  if (!booking) notFound();

  return (
    <Suspense fallback={<ConfirmationFallback />}>
      <ConfirmationFlow deal={booking.deal} />
    </Suspense>
  );
}
