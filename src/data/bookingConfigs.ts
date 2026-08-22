import type { ChildPricingRule, Deal, HotelBookingConfig, RoomCategoryDetail } from "@/types";
import { deals } from "@/data/deals";

/**
 * Child pricing rules shared by every hotel in this mock dataset. In the
 * real admin panel these would be configurable per hotel (see booking-flow
 * spec, "Child Pricing" / "Admin / Pricing Management").
 */
const defaultChildPricingRules: ChildPricingRule[] = [
  { id: "infant", minAge: 0, maxAge: 1.9, type: "free" },
  { id: "child", minAge: 2, maxAge: 5.9, type: "percent", value: 50 },
  { id: "junior", minAge: 6, maxAge: 11.9, type: "percent", value: 25 },
  /** Teens (12–17) priced like an extra adult traveler. */
  { id: "teen", minAge: 12, maxAge: 17.9, type: "percent", value: 0 },
];

/**
 * Full hand-authored booking config for Rewaya Luxury Resort, matching the
 * approved desktop/mobile mockups (room categories, prices, offers, meal
 * plan and cancellation upgrades) as closely as possible.
 */
const rewayaBookingConfig: HotelBookingConfig = {
  slug: "rewaya-luxury-resort",
  minStayNights: 2,
  maxStayNights: 7,
  childPricingRules: defaultChildPricingRules,
  roomCategories: [
    {
      id: "doppelzimmer-balkon",
      name: "Doppelzimmer Balkon",
      occupancyLabel: "2 Personen",
      sizeLabel: "24–28 m²",
      minOccupancy: 1,
      maxOccupancy: 3,
      badge: "Unsere Empfehlung",
      images: [
        "/images/1769149255670-aa0ad6428dd6.jpg",
        "/images/1680210851458-b7dc5685e06e.jpg",
        "/images/1774663855124-9ede7464f37e.jpg",
      ],
      weekdayRate: 280,
      weekendRate: 340,
      bedConfiguration: "1 Doppelbett oder 2 Einzelbetten",
      view: "Gartenblick",
      balcony: true,
      bathroom: "Bad mit Dusche, Fön, Kosmetikspiegel",
      airConditioning: true,
      wifi: true,
      amenities: ["Klimaanlage", "Balkon", "Minibar", "Safe", "Sat-TV", "WLAN inklusive"],
      description:
        "Freundlich eingerichtetes Doppelzimmer mit eigenem Balkon und Gartenblick, ideal für Paare oder Familien mit einem Kind.",
    },
    {
      id: "juniorsuite-voglbichl",
      name: "Juniorsuite Voglbichl",
      occupancyLabel: "2 Personen",
      sizeLabel: "38–45 m²",
      minOccupancy: 1,
      maxOccupancy: 4,
      images: [
        "/images/1778166135376-635f120a04d4.jpg",
        "/images/1593194730444-b37576d2847f.jpg",
        "/images/1645990097585-947bbb879c12.jpg",
      ],
      weekdayRate: 310,
      weekendRate: 370,
      bedConfiguration: "1 Doppelbett + Schlafsofa",
      view: "Meerblick",
      balcony: true,
      bathroom: "Bad mit Badewanne & Dusche, Fön, Bademäntel",
      airConditioning: true,
      wifi: true,
      amenities: ["Klimaanlage", "Balkon", "Meerblick", "Sitzbereich", "Minibar", "Safe", "WLAN inklusive"],
      description:
        "Großzügige Suite mit separatem Sitzbereich und Meerblick, ideal für Familien oder alle, die etwas mehr Platz wünschen.",
    },
    {
      id: "deluxe-zimmer",
      name: "Deluxe Zimmer",
      occupancyLabel: "2 Personen",
      sizeLabel: "28–32 m²",
      minOccupancy: 2,
      maxOccupancy: 3,
      images: [
        "/images/1692884263044-9ae27c7fa9ea.jpg",
        "/images/1758192838598-a1de4da5dcaf.jpg",
        "/images/1506242592132-b7476b527d50.jpg",
      ],
      weekdayRate: 330,
      weekendRate: 390,
      bedConfiguration: "1 Doppelbett",
      view: "Poolblick",
      balcony: true,
      bathroom: "Bad mit Dusche, Fön, Kosmetikspiegel",
      airConditioning: true,
      wifi: true,
      amenities: ["Klimaanlage", "Balkon", "Poolblick", "Minibar", "Safe", "Nespresso-Maschine", "WLAN inklusive"],
      description:
        "Modern gestaltetes Zimmer mit Blick auf die Poollandschaft, gehobene Ausstattung inklusive Kaffeemaschine.",
    },
  ],
  offers: [
    {
      id: "rewaya-balkon-vollpension",
      roomCategoryId: "doppelzimmer-balkon",
      provider: "DERTOUR",
      recommendationPercent: 91,
      recommendationCount: 4839,
      mealPlans: [
        { id: "vollpension", label: "Vollpension", includedInBase: true, supplementTotal: 0 },
        { id: "halbpension-plus", label: "Halbpension Plus", includedInBase: false, supplementTotal: 107 },
      ],
      cancellation: {
        id: "guenstige-stornierung",
        label: "Günstige Stornierung",
        includedInBase: false,
        supplementTotal: 29,
      },
    },
    {
      id: "rewaya-balkon-halbpension",
      roomCategoryId: "doppelzimmer-balkon",
      provider: "DERTOUR",
      recommendationPercent: 89,
      recommendationCount: 3421,
      mealPlans: [
        { id: "halbpension", label: "Halbpension", includedInBase: true, supplementTotal: 0 },
        { id: "vollpension-2", label: "Vollpension", includedInBase: false, supplementTotal: 89 },
      ],
      cancellation: {
        id: "guenstige-stornierung-2",
        label: "Günstige Stornierung",
        includedInBase: false,
        supplementTotal: 29,
      },
    },
    {
      id: "rewaya-juniorsuite-halbpension",
      roomCategoryId: "juniorsuite-voglbichl",
      provider: "5vorFlug",
      recommendationPercent: 94,
      recommendationCount: 2156,
      mealPlans: [
        { id: "halbpension-js", label: "Halbpension", includedInBase: true, supplementTotal: 0 },
        { id: "vollpension-js", label: "Vollpension", includedInBase: false, supplementTotal: 95 },
      ],
      cancellation: {
        id: "guenstige-stornierung-js",
        label: "Günstige Stornierung",
        includedInBase: false,
        supplementTotal: 35,
      },
    },
    {
      id: "rewaya-deluxe-allinclusive",
      roomCategoryId: "deluxe-zimmer",
      provider: "DERTOUR",
      recommendationPercent: 93,
      recommendationCount: 1287,
      mealPlans: [{ id: "all-inclusive", label: "All Inclusive", includedInBase: true, supplementTotal: 0 }],
    },
  ],
};

const GENERIC_ROOM_IMAGE_POOL = [
  "/images/1680210851458-b7dc5685e06e.jpg",
  "/images/1774663855124-9ede7464f37e.jpg",
  "/images/1758192838598-a1de4da5dcaf.jpg",
];

/**
 * Reasonable fallback booking config generated from a marketing `Deal`, so
 * every offer on the site has a working "Buchungsstrecke" even though only
 * Rewaya's content was hand-authored to pixel-match the client's mockups.
 */
function generateDefaultBookingConfig(deal: Deal): HotelBookingConfig {
  const baseRate = Math.round((deal.currentPrice / deal.nights) * 1.9);

  const standard: RoomCategoryDetail = {
    id: `${deal.slug}-standard`,
    name: "Standardzimmer",
    occupancyLabel: "2 Personen",
    sizeLabel: "20–24 m²",
    minOccupancy: 1,
    maxOccupancy: 3,
    badge: "Unsere Empfehlung",
    images: deal.images.slice(0, 3),
    weekdayRate: baseRate,
    weekendRate: Math.round(baseRate * 1.18),
    bedConfiguration: "1 Doppelbett oder 2 Einzelbetten",
    view: "Gartenblick",
    balcony: true,
    bathroom: "Bad mit Dusche, Fön",
    airConditioning: true,
    wifi: true,
    amenities: ["Klimaanlage", "Balkon", "Safe", "WLAN inklusive"],
    description: `Komfortables Doppelzimmer im ${deal.name}, ideal für Paare oder kleine Familien.`,
  };

  const superior: RoomCategoryDetail = {
    id: `${deal.slug}-superior`,
    name: "Superior Zimmer",
    occupancyLabel: "2 Personen",
    sizeLabel: "26–30 m²",
    minOccupancy: 1,
    maxOccupancy: 4,
    images: [...deal.images.slice(1, 3), ...GENERIC_ROOM_IMAGE_POOL].slice(0, 3),
    weekdayRate: Math.round(baseRate * 1.22),
    weekendRate: Math.round(baseRate * 1.42),
    bedConfiguration: "1 Doppelbett + Zustellbett möglich",
    view: "Meer- oder Poolblick",
    balcony: true,
    bathroom: "Bad mit Dusche, Fön, Bademäntel",
    airConditioning: true,
    wifi: true,
    amenities: ["Klimaanlage", "Balkon", "Minibar", "Safe", "WLAN inklusive"],
    description: `Großzügigeres Zimmer im ${deal.name} mit etwas mehr Platz und gehobener Ausstattung.`,
  };

  return {
    slug: deal.slug,
    minStayNights: 2,
    maxStayNights: 7,
    childPricingRules: defaultChildPricingRules,
    roomCategories: [standard, superior],
    offers: [
      {
        id: `${deal.slug}-standard-offer`,
        roomCategoryId: standard.id,
        provider: deal.provider,
        recommendationPercent: deal.reviewPercent,
        recommendationCount: deal.reviewCount,
        mealPlans: [
          { id: "included", label: deal.mealPlan, includedInBase: true, supplementTotal: 0 },
          { id: "upgrade", label: "All Inclusive", includedInBase: false, supplementTotal: 89 },
        ],
        cancellation: {
          id: "guenstige-stornierung",
          label: "Günstige Stornierung",
          includedInBase: false,
          supplementTotal: 25,
        },
      },
      {
        id: `${deal.slug}-superior-offer`,
        roomCategoryId: superior.id,
        provider: deal.provider,
        recommendationPercent: Math.max(deal.reviewPercent - 2, 70),
        recommendationCount: Math.round(deal.reviewCount * 0.4),
        mealPlans: [{ id: "included-superior", label: deal.mealPlan, includedInBase: true, supplementTotal: 0 }],
        cancellation: {
          id: "guenstige-stornierung-superior",
          label: "Günstige Stornierung",
          includedInBase: false,
          supplementTotal: 25,
        },
      },
    ],
  };
}

export const bookingConfigs: Record<string, HotelBookingConfig> = {
  [rewayaBookingConfig.slug]: rewayaBookingConfig,
  ...Object.fromEntries(
    deals
      .filter((deal) => deal.slug !== rewayaBookingConfig.slug)
      .map((deal) => [deal.slug, generateDefaultBookingConfig(deal)])
  ),
};
