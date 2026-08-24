export interface DestinationSeoBlock {
  heading: string;
  paragraphs: string[];
}

/** Key facts table (“… auf einen Blick”), urlaubshamster country-info style. */
export interface DestinationOverviewFact {
  label: string;
  value: string;
}

export interface DestinationFaq {
  question: string;
  answer: string;
}

/** Sub-region / popular spot card on a country landing (urlaubshamster style). */
export interface PopularSpot {
  name: string;
  image: string;
  fromPrice: number;
}

export interface Destination {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  image: string;
  /** Small pill label shown on the card, e.g. a flag emoji + country name. */
  badge?: string;
  /**
   * Short editable intro paragraph shown directly under the country H1.
   * Manually written per country/CMS field later on.
   */
  intro?: string;
  /**
   * Optional “Kurz gesagt:” summary paragraph under the hero (urlaubshamster
   * country landing style).
   */
  kurzgesagt?: string;
  /**
   * “Top-Destinationen für {country}” cards above the deals grid.
   * Falls back to regions derived from deals when omitted.
   */
  popularSpots?: PopularSpot[];
  /**
   * Extra SEO body below the deals grid (Homepage-details: additional SEO
   * content on country landing pages). Editable per destination later via CMS.
   */
  seoContent?: DestinationSeoBlock[];
  /** Optional facts table under the SEO sections. */
  overviewFacts?: DestinationOverviewFact[];
  /** Optional FAQ accordion content below the info sections. */
  faqs?: DestinationFaq[];
}

/**
 * Unique keys for homepage travel-type filters. Kept as a union so the
 * filter state, chip data and future URL query params (?filters=mit-flug,...)
 * all stay in sync with a single source of truth.
 */
export type FilterKey =
  | "mit-flug"
  | "all-inclusive"
  | "direkte-strandlage"
  | "adults-only"
  | "familienhotel"
  | "thermenurlaub"
  | "wellness"
  | "urlaub-am-see"
  | "urlaub-am-meer"
  | "in-den-bergen"
  | "skiurlaub"
  | "ab-85-weiterempfehlung"
  | "fruehbucher"
  | "last-minute"
  | "zentrale-lage"
  /** Country sidebar attribute filters (urlaubshamster-style). */
  | "bis-300"
  | "top-bewertung"
  | "fuenf-sterne"
  | "kurztrips";

export interface FilterOption {
  key: FilterKey;
  label: string;
}

export interface Deal {
  id: string;
  slug: string;
  images: string[];
  provider: string;
  stars: number;
  destinationRegion: string;
  destinationCountry: string;
  name: string;
  summary: string;
  /**
   * Manually supplied review summary (percentage, score and count) can be
   * turned off per offer from the backend/admin later. When `false`, the
   * `ReviewBadge` is not rendered on this deal's card at all.
   */
  reviewEnabled: boolean;
  reviewPercent: number;
  reviewScore: number;
  reviewMaxScore: number;
  reviewCount: number;
  nights: number;
  mealPlan: string;
  flightIncluded: boolean;
  dateRange: string;
  oldPrice: number;
  currentPrice: number;
  discountPercent: number;
  /** Manually supplied booking-popularity count, e.g. "Über 778 mal gebucht". */
  bookingCount: number;
  tags: FilterKey[];
}

/**
 * Per-offer CTA behaviour for “Termine & Preise anzeigen”, configurable in
 * admin later (frontend stand-in: `offerDetails`). `direct` opens `bookingUrl`
 * immediately; `country_selection` opens a filter-style popup (“Wo wohnst du?”)
 * with optional emoji/flag buttons, then redirects to the matching partner URL.
 */
export type CtaMode = "direct" | "country_selection";

export interface OfferBookingUrls {
  AT: string;
  DE: string;
  CH: string;
}

/**
 * Rich detail content for a single offer's detail page (`/angebot/[slug]`).
 * Keyed 1:1 by `Deal.slug` and layered on top of the base `Deal` fields
 * (price, review numbers, images, ...), which the offer page also reads.
 */
export interface OfferContentSection {
  heading: string;
  paragraphs: string[];
}

/** One row in “Angebote vergleichen” (provider offer card). */
export interface OfferCompareOption {
  id: string;
  provider: string;
  /** Short label inside the logo box (defaults to provider initials). */
  logoLabel?: string;
  nights: number;
  mealPlan: string;
  oldPrice?: number;
  currentPrice: number;
  /** e.g. "13.08.2026, 10:25" */
  priceUpdatedAt?: string;
  bookingUrl?: string;
  /** When set, shows the green “X % günstiger…” ribbon. */
  cheaperPercent?: number;
}

export interface OfferDetail {
  slug: string;
  /** Short marketing tagline shown under the location line, e.g. mobile subtitle. */
  tagline: string;
  /** Small status pill next to the star rating, e.g. "Neu". Omit to hide it. */
  badge?: string;
  /** Show Superior “S” after the star icons (4★ Superior hotels). */
  starsSuperior?: boolean;
  /** Manual review-source attribution shown next to the review badges, e.g. "HolidayCheck". */
  reviewSource?: string;
  /** Optional Tripadvisor blurb for Angebots-Infos sidebar. */
  tripadvisorSummary?: string;
  transferIncluded: boolean;
  /** "Das ist inklusive" checklist. */
  inclusions: string[];
  /** "Darauf kannst du dich freuen" checklist. */
  highlights: string[];
  descriptionHeading: string;
  descriptionParagraphs: string[];
  /**
   * Optional multi-section article body (urlaubshamster-style). When set,
   * these replace the single descriptionHeading/paragraphs block on the page.
   */
  contentSections?: OfferContentSection[];
  /**
   * Optional multi-provider rows for “Angebote vergleichen”.
   * When omitted, the page builds a fallback from the deal price.
   */
  compareOffers?: OfferCompareOption[];
  /** Bottom amenities icon row; unmapped labels fall back to a generic icon. */
  amenities: string[];
  /**
   * Virtual total photo count used for the gallery counter/overlay copy
   * (e.g. "1 / 45", "+149 Fotos"). Kept independent from the real
   * `Deal.images` array length, since only a handful of representative mock
   * photos are stored but the mockup shows a much larger real gallery.
   */
  totalPhotoCount: number;
  ctaMode: CtaMode;
  /** Required when `ctaMode` is "direct". */
  bookingUrl?: string;
  /** Required when `ctaMode` is "country_selection". */
  bookingUrls?: OfferBookingUrls;
  /**
   * Optional limited-time offer end (ISO datetime). When set, the mobile
   * sticky CTA shows a countdown. Omit to hide the timer.
   */
  countdownEndsAt?: string;
  /**
   * Optional notice box on the mobile price card (and desktop sidebar when set).
   * Shown only when configured — not on every deal.
   */
  importantNotice?: string;
  /**
   * Optional custom CTA popup choices (emoji/icon + label + url).
   * When set with `ctaMode: "country_selection"`, these replace the default AT/DE/CH list.
   */
  ctaOptions?: OfferCtaOption[];
}

export interface OfferCtaOption {
  id: string;
  label: string;
  url: string;
  /** Emoji or short icon text shown on the button, e.g. country flag. */
  emoji?: string;
}

/**
 * Traveler makeup for a single room within the booking flow (step 1,
 * "Zimmer hinzufügen"). Kept separate from the marketing `Deal`/`OfferDetail`
 * types since this only exists inside the interactive booking flow state.
 */
export interface RoomOccupancy {
  adults: number;
  /** One entry per child, its exact age (used to resolve the matching `ChildPricingRule`). */
  childAges: number[];
}

/**
 * A child-pricing bracket, configurable per hotel in the (future) admin
 * panel. Either a flat percentage discount, a fixed euro price, or free —
 * never hard-coded age bands in the pricing logic itself.
 */
export interface ChildPricingRule {
  id: string;
  minAge: number;
  maxAge: number;
  type: "free" | "percent" | "fixed";
  /** Percent discount (0–100) when `type` is "percent"; euro amount when "fixed". Unused when "free". */
  value?: number;
}

/** One selectable room category shown in "Wähle dein Zimmer" (step 2). */
export interface RoomCategoryDetail {
  id: string;
  name: string;
  occupancyLabel: string;
  sizeLabel: string;
  maxOccupancy: number;
  minOccupancy: number;
  images: string[];
  badge?: string;
  /** Per-night rate, Sunday–Thursday. */
  weekdayRate: number;
  /** Per-night rate, Friday–Saturday. */
  weekendRate: number;
  bedConfiguration: string;
  view: string;
  balcony: boolean;
  bathroom: string;
  airConditioning: boolean;
  wifi: boolean;
  amenities: string[];
  description: string;
}

/** One meal-plan choice inside an offer card, e.g. "Halbpension — inkl.". */
export interface MealPlanOption {
  id: string;
  label: string;
  includedInBase: boolean;
  /** Total supplement for the whole stay (all travelers), 0 when included. */
  supplementTotal: number;
}

/** The optional cancellation-flexibility upgrade inside an offer card. */
export interface CancellationOption {
  id: string;
  label: string;
  includedInBase: boolean;
  supplementTotal: number;
}

/** One bookable rate for a room category, shown in "Wähle dein Angebot" (step 3). */
export interface BookingOffer {
  id: string;
  roomCategoryId: string;
  provider: string;
  recommendationPercent: number;
  recommendationCount: number;
  mealPlans: MealPlanOption[];
  /** Omitted entirely when the offer has no alternative cancellation option. */
  cancellation?: CancellationOption;
}

/**
 * Optional paid add-on shown in checkout Part 5.
 * Configured per offer (frontend stand-in for admin / backend later).
 */
export interface CheckoutAddon {
  id: string;
  name: string;
  /** Short helper text under the name. */
  description?: string;
  /** Unit price in EUR. */
  price: number;
  /** When true, customer can choose a quantity (default 1). */
  allowQuantity?: boolean;
  /** Upper bound when `allowQuantity` is true (default 5). */
  maxQuantity?: number;
}

/**
 * Full booking-flow configuration for one hotel, keyed by `Deal.slug`. In
 * production this would be assembled by the pricing/availability service
 * described in the booking-flow spec (manual data now, external APIs
 * later) — the frontend only ever consumes this normalized shape.
 */
export interface HotelBookingConfig {
  slug: string;
  minStayNights: number;
  maxStayNights: number;
  childPricingRules: ChildPricingRule[];
  roomCategories: RoomCategoryDetail[];
  offers: BookingOffer[];
  /**
   * Optional checkout add-ons for this offer (“Brauchst du noch etwas?”).
   * Admin/backend will configure these per deal later. Empty / omitted →
   * the add-ons section is hidden for that checkout.
   */
  addons?: CheckoutAddon[];
}
