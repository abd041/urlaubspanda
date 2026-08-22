import type { OfferDetail } from "@/types";

/**
 * Additional detail-page content for each offer, keyed by `Deal.slug`.
 *
 * CTA redirection (req 12) — set per deal, stand-in for future admin UI:
 * - `ctaMode: "direct"` + `bookingUrl` → open partner site immediately
 * - `ctaMode: "country_selection"` + `bookingUrls` and/or `ctaOptions`
 *   → popup with choices (emoji/flags supported on each option)
 */
export const offerDetails: Record<string, OfferDetail> = {
  "apollo-beach-rhodos": {
    slug: "apollo-beach-rhodos",
    tagline: "Familienurlaub direkt am Sandstrand von Rhodos.",
    reviewSource: "HolidayCheck",
    tripadvisorSummary: "4,5 von 5 Punkten aus 91 Bewertungen, Zertifikat für Exzellenz",
    transferIncluded: true,
    inclusions: [
      "Hoteltransfer inklusive",
      "Direktflug ab Wien",
      "7 Nächte im 4★ Hotel",
      "Halbpension",
      "20 kg Freigepäck pro Person",
    ],
    highlights: [
      "Direkte Strandlage mit Liegen & Sonnenschirmen",
      "Großer Pool- & Gartenbereich",
      "Kinderclub & Animationsprogramm",
      "Reichhaltiges Halbpensions-Buffet",
    ],
    descriptionHeading: "Familienfreundliches Strandhotel an der Ostküste von Rhodos",
    descriptionParagraphs: [
      "Das Apollo Beach Rhodos liegt direkt am Sandstrand der beliebten Ostküste und ist rund 25 Minuten vom Flughafen Rhodos entfernt.",
      "Die Anlage verfügt über einen großzügigen Pool- und Gartenbereich, mehrere Restaurants sowie ein tägliches Animationsprogramm für Kinder und Erwachsene.",
      "Die Zimmer sind modern eingerichtet und bieten Platz für Familien mit bis zu zwei Kindern.",
    ],
    contentSections: [
      {
        heading: "Über dieses Angebot",
        paragraphs: [
          "Das Apollo Beach Rhodos liegt direkt am Sandstrand der beliebten Ostküste und ist rund 25 Minuten vom Flughafen Rhodos entfernt. Familienfreundliches 4★-Hotel mit Halbpension, Direktflug und Hoteltransfer – ideal für einen entspannten Strandurlaub.",
          "Die Anlage verfügt über einen großzügigen Pool- und Gartenbereich, mehrere Restaurants sowie ein tägliches Animationsprogramm für Kinder und Erwachsene.",
        ],
      },
      {
        heading: "Lage: direkt am Sandstrand von Rhodos",
        paragraphs: [
          "In erster Strandlinie an der Ostküste von Rhodos gelegen, erreichst du Liegen und Sonnenschirme ohne lange Wege. Geschäfte und Restaurants der Umgebung sind gut erreichbar; der Transfer vom Flughafen ist im Angebot inklusive.",
        ],
      },
      {
        heading: "Pool, Strand & Animation",
        paragraphs: [
          "Großer Pool- und Gartenbereich, direkter Strandzugang sowie Kinderclub und Animation sorgen für Abwechslung. Halbpension mit reichhaltigem Buffet hält die Verpflegung unkompliziert.",
        ],
      },
      {
        heading: "Zimmer & Ausstattung",
        paragraphs: [
          "Die Zimmer sind modern eingerichtet und bieten Platz für Familien mit bis zu zwei Kindern. Klimaanlage und WLAN gehören zur Standardausstattung.",
        ],
      },
      {
        heading: "Für wen sich dieses Hotel eignet",
        paragraphs: [
          "Besonders geeignet für Familien und Paare, die Strandlage, Flug inklusive und Halbpension in einem Paket suchen – ohne auf Animation und Pool zu verzichten.",
        ],
      },
    ],
    amenities: [
      "Außenpool",
      "Kinderclub",
      "Restaurant",
      "Bar",
      "WLAN inklusive",
      "Strandzugang",
      "Klimaanlage",
    ],
    totalPhotoCount: 32,
    ctaMode: "direct",
    bookingUrl: "https://www.holidaycheck.at/betterAngebote/apollo-beach-rhodos",
    compareOffers: [
      {
        id: "apollo-hc",
        provider: "HolidayCheck",
        logoLabel: "HC",
        nights: 7,
        mealPlan: "Halbpension",
        oldPrice: 989.5,
        currentPrice: 548.5,
        priceUpdatedAt: "14.08.2026, 10:25",
        bookingUrl: "https://www.holidaycheck.at/betterAngebote/apollo-beach-rhodos",
        cheaperPercent: 15,
      },
      {
        id: "apollo-se",
        provider: "Secret Escapes",
        logoLabel: "SE",
        nights: 7,
        mealPlan: "Halbpension",
        oldPrice: 720,
        currentPrice: 649,
        priceUpdatedAt: "14.08.2026, 09:40",
        bookingUrl: "https://www.holidaycheck.at/betterAngebote/apollo-beach-rhodos",
      },
    ],
  },

  "city-hotel-bellevue-paris": {
    slug: "city-hotel-bellevue-paris",
    tagline: "Kurztrip ins Herz von Paris, zentral und stilvoll.",
    reviewSource: "HolidayCheck",
    transferIncluded: false,
    inclusions: [
      "Direktflug ab Wien",
      "3 Nächte im 4★ Hotel",
      "Frühstück inklusive",
      "Zentrale Lage im Stadtzentrum",
    ],
    highlights: [
      "Nur 10 Gehminuten zum Eiffelturm",
      "Rooftop-Bar mit Blick über die Stadt",
      "Fußläufig zur Metro",
      "Stilvoll eingerichtete Zimmer",
    ],
    descriptionHeading: "Boutique-Hotel im 7. Arrondissement",
    descriptionParagraphs: [
      "Das City Hotel Bellevue Paris liegt im eleganten 7. Arrondissement, nur wenige Gehminuten vom Eiffelturm und der Seine entfernt.",
      "Ideal für einen Kurztrip zu zweit oder ein verlängertes Wochenende – die Metro-Station vor der Tür bringt dich in wenigen Minuten in die gesamte Stadt.",
    ],
    contentSections: [
      {
        heading: "Über dieses Angebot",
        paragraphs: [
          "Das City Hotel Bellevue Paris liegt im eleganten 7. Arrondissement, nur wenige Gehminuten vom Eiffelturm und der Seine entfernt – ideal für einen stilvollen Kurztrip.",
        ],
      },
      {
        heading: "Lage: zentral im 7. Arrondissement",
        paragraphs: [
          "Metro vor der Tür, Fußweg zum Eiffelturm und Rooftop-Bar mit Stadtblick. Perfekt als Ausgangspunkt für Sightseeing.",
        ],
      },
      {
        heading: "Zimmer & Ausstattung",
        paragraphs: [
          "Stilvoll eingerichtete Zimmer mit Klimaanlage und WLAN. Concierge-Service hilft bei Tipps und Reservierungen.",
        ],
      },
    ],
    amenities: [
      "Rooftop-Bar",
      "Frühstücksraum",
      "WLAN inklusive",
      "Klimaanlage",
      "Concierge",
    ],
    totalPhotoCount: 18,
    ctaMode: "direct",
    bookingUrl: "https://www.expedia.at/City-Hotel-Bellevue-Paris",
    countdownEndsAt: "2026-09-30T21:59:59+02:00",
  },

  "costa-blanca-beach-hotel": {
    slug: "costa-blanca-beach-hotel",
    tagline: "All-Inclusive-Urlaub an der spanischen Costa Blanca.",
    reviewSource: "HolidayCheck",
    transferIncluded: true,
    inclusions: [
      "Direktflug ab Wien",
      "Hoteltransfer inklusive",
      "7 Nächte im 4★ Hotel",
      "All Inclusive",
    ],
    highlights: [
      "Direkte Strandlage",
      "Wasserrutschen & Kinderpool",
      "Tägliches Live-Entertainment",
      "Mehrere Themen-Restaurants",
    ],
    descriptionHeading: "All-Inclusive-Resort direkt am Strand von Benidorm",
    descriptionParagraphs: [
      "Das Costa Blanca Beach Hotel liegt in erster Strandlinie und bietet ein umfassendes All-Inclusive-Konzept für die ganze Familie.",
      "Neben mehreren Pools und einem eigenen Wasserpark-Bereich erwarten dich abendliche Shows und ein großes kulinarisches Angebot.",
    ],
    contentSections: [
      {
        heading: "Über dieses Angebot",
        paragraphs: [
          "Das Costa Blanca Beach Hotel liegt in erster Strandlinie und bietet ein umfassendes All-Inclusive-Konzept für die ganze Familie.",
        ],
      },
      {
        heading: "Lage: direkt am Strand von Benidorm",
        paragraphs: [
          "Strandlage mit Wasserrutschen, Kinderpool und abendlichem Entertainment – typischer All-Inclusive-Familienurlaub an der Costa Blanca.",
        ],
      },
      {
        heading: "Kulinarik & Animation",
        paragraphs: [
          "Mehrere Themen-Restaurants, tägliches Live-Entertainment und ein großer Wasserpark-Bereich halten Groß und Klein bei Laune.",
        ],
      },
    ],
    amenities: [
      "Außenpool",
      "Wasserpark",
      "Kinderclub",
      "Mehrere Restaurants",
      "Fitnessraum",
      "WLAN inklusive",
    ],
    totalPhotoCount: 27,
    ctaMode: "country_selection",
    bookingUrls: {
      AT: "https://www.tui.at/hotel/costa-blanca-beach-hotel",
      DE: "https://www.tui.de/hotel/costa-blanca-beach-hotel",
      CH: "https://www.tui.ch/hotel/costa-blanca-beach-hotel",
    },
    ctaOptions: [
      {
        id: "AT",
        label: "Österreich",
        url: "https://www.tui.at/hotel/costa-blanca-beach-hotel",
        emoji: "🇦🇹",
      },
      {
        id: "DE",
        label: "Deutschland",
        url: "https://www.tui.de/hotel/costa-blanca-beach-hotel",
        emoji: "🇩🇪",
      },
      {
        id: "CH",
        label: "Schweiz",
        url: "https://www.tui.ch/hotel/costa-blanca-beach-hotel",
        emoji: "🇨🇭",
      },
    ],
    countdownEndsAt: "2026-12-31T21:59:59+01:00",
    importantNotice: "Nur noch wenige Zimmer zu diesem Preis verfügbar.",
  },

  "rewaya-luxury-resort": {
    slug: "rewaya-luxury-resort",
    tagline: "Traumhafte Auszeit im Wellnessparadies am Roten Meer.",
    badge: "Neu eröffnetes Resort",
    reviewSource: "HolidayCheck",
    transferIncluded: true,
    inclusions: [
      "Hoteltransfer inklusive",
      "1 Woche im neu eröffneten Resort",
      "All Inclusive",
      "Direktflug",
      "24/7 deutschsprachige Reiseleitung",
    ],
    highlights: [
      "Große Pool- & Aquapark-Landschaft",
      "Mehrere Restaurants & Bars",
      "Moderner Wellnessbereich",
      "Kinderfreundlich mit Animation",
      "Direkt am Roten Meer",
    ],
    descriptionHeading: "Neu eröffnetes Resort direkt am Roten Meer",
    descriptionParagraphs: [
      "Das Rewaya Luxury Resort liegt rund 20 km vom Flughafen Hurghada entfernt, sodass ihr nach der Landung keine lange Anreise vor euch habt.",
      "Gleichzeitig liegt El Gouna nur etwa 10 km entfernt. Die Anlage erstreckt sich über rund 55.000 m² und bietet einen wunderschönen Blick auf das Rote Meer.",
      "Die Zimmer sind modern gestaltet und in verschiedenen Kategorien buchbar – darunter Zimmer mit Meerblick, Junior Suiten und sogar Swim-up-Zimmer, bei denen ihr direkten Zugang zum Pool habt.",
    ],
    contentSections: [
      {
        heading: "Über dieses Angebot",
        paragraphs: [
          "Das Rewaya Luxury Resort liegt rund 20 km vom Flughafen Hurghada entfernt. Die Anlage erstreckt sich über rund 55.000 m² und bietet einen wunderschönen Blick auf das Rote Meer.",
        ],
      },
      {
        heading: "Lage: am Roten Meer nahe El Gouna",
        paragraphs: [
          "El Gouna liegt nur etwa 10 km entfernt. Transfer und All Inclusive sind im Angebot enthalten – ideal für Strand-, Pool- und Wellnessurlaub.",
        ],
      },
      {
        heading: "Wellness, Pool & Aquapark",
        paragraphs: [
          "Große Pool- und Aquapark-Landschaft, moderner Wellnessbereich sowie mehrere Restaurants und Bars erwarten dich vor Ort.",
        ],
      },
      {
        heading: "Zimmer & Ausstattung",
        paragraphs: [
          "Modern gestaltete Zimmer in verschiedenen Kategorien – darunter Meerblick, Junior Suiten und Swim-up-Zimmer mit direktem Poolzugang.",
        ],
      },
    ],
    amenities: [
      "Außenpool",
      "Aquapark",
      "Spa & Wellness",
      "Fitnessraum",
      "Restaurants",
      "Bar",
      "WLAN inklusive",
      "Kinderclub",
      "Tauchschule",
    ],
    totalPhotoCount: 45,
    ctaMode: "country_selection",
    bookingUrls: {
      AT: "https://www.tui.at/hotel/rewaya-luxury-resort",
      DE: "https://www.tui.de/hotel/rewaya-luxury-resort",
      CH: "https://www.tui.ch/hotel/rewaya-luxury-resort",
    },
    ctaOptions: [
      {
        id: "AT",
        label: "Österreich",
        url: "https://www.tui.at/hotel/rewaya-luxury-resort",
        emoji: "🇦🇹",
      },
      {
        id: "DE",
        label: "Deutschland",
        url: "https://www.tui.de/hotel/rewaya-luxury-resort",
        emoji: "🇩🇪",
      },
      {
        id: "CH",
        label: "Schweiz",
        url: "https://www.tui.ch/hotel/rewaya-luxury-resort",
        emoji: "🇨🇭",
      },
      {
        id: "partner",
        label: "HolidayCheck Angebot",
        url: "https://www.holidaycheck.at/betterAngebote/rewaya-luxury-resort",
        emoji: "✅",
      },
    ],
  },

  "kreta-sun-village": {
    slug: "kreta-sun-village",
    tagline: "Adults-Only-Luxus an der Nordküste von Kreta.",
    badge: "Topseller",
    reviewSource: "HolidayCheck",
    transferIncluded: true,
    inclusions: [
      "Direktflug ab Wien",
      "Hoteltransfer inklusive",
      "7 Nächte im 5★ Resort",
      "All Inclusive",
    ],
    highlights: [
      "Nur für Erwachsene (Adults Only)",
      "Infinity-Pool mit Meerblick",
      "Preisgekrönter Spa-Bereich",
      "À-la-carte-Restaurants inklusive",
    ],
    descriptionHeading: "Adults-Only-Resort mit Infinity-Pool über dem Meer",
    descriptionParagraphs: [
      "Das Kreta Sun Village liegt an der ruhigen Nordküste Kretas und richtet sich ausschließlich an erwachsene Gäste, die eine entspannte Auszeit suchen.",
      "Highlight der Anlage ist der Infinity-Pool mit direktem Blick auf das Mittelmeer, ergänzt durch einen großzügigen Spa- und Wellnessbereich.",
    ],
    contentSections: [
      {
        heading: "Über dieses Angebot",
        paragraphs: [
          "Das Kreta Sun Village liegt an der ruhigen Nordküste Kretas und richtet sich ausschließlich an erwachsene Gäste, die eine entspannte Auszeit suchen.",
        ],
      },
      {
        heading: "Lage: Adults Only an der Nordküste",
        paragraphs: [
          "Ruhige Lage mit Strandzugang und Infinity-Pool über dem Mittelmeer – ohne Familientrubel.",
        ],
      },
      {
        heading: "Wellness & Kulinarik",
        paragraphs: [
          "Preisgekrönter Spa-Bereich und À-la-carte-Restaurants inklusive machen den Aufenthalt besonders.",
        ],
      },
    ],
    amenities: [
      "Infinity-Pool",
      "Spa & Wellness",
      "À-la-carte-Restaurants",
      "Fitnessraum",
      "WLAN inklusive",
      "Strandzugang",
    ],
    totalPhotoCount: 38,
    ctaMode: "direct",
    bookingUrl: "https://www.tui.at/hotel/kreta-sun-village",
    countdownEndsAt: "2026-10-15T21:59:59+02:00",
  },

  "falkenstein-resort-punta-skala": {
    slug: "falkenstein-resort-punta-skala",
    tagline: "5★ Adults-Only-Resort an der kroatischen Adriaküste.",
    reviewSource: "HolidayCheck",
    transferIncluded: true,
    inclusions: [
      "Direktflug ab Wien",
      "Hoteltransfer inklusive",
      "5 Nächte im 5★ Resort",
      "All Inclusive",
    ],
    highlights: [
      "Nur für Erwachsene (Adults Only)",
      "Direkte Lage an der Adria",
      "Weitläufige Poollandschaft",
      "Gehobenes All-Inclusive-Konzept",
    ],
    descriptionHeading: "Adults-Only-Resort auf der Halbinsel Punta Skala",
    descriptionParagraphs: [
      "Das Falkenstein Resort Punta Skala liegt auf einer eigenen Halbinsel nahe Zadar, umgeben von kristallklarem Adriawasser und mediterraner Vegetation.",
      "Das gehobene All-Inclusive-Konzept umfasst mehrere Restaurants, eine große Poollandschaft und einen ruhigen, ausschließlich für Erwachsene reservierten Bereich.",
    ],
    contentSections: [
      {
        heading: "Über dieses Angebot",
        paragraphs: [
          "Das Falkenstein Resort Punta Skala liegt auf einer eigenen Halbinsel nahe Zadar, umgeben von kristallklarem Adriawasser.",
        ],
      },
      {
        heading: "Lage: Halbinsel Punta Skala",
        paragraphs: [
          "Direkte Adria-Lage mit gehobener All-Inclusive-Atmosphäre – ausschließlich für Erwachsene.",
        ],
      },
      {
        heading: "Pool, Spa & Restaurants",
        paragraphs: [
          "Weitläufige Poollandschaft, Spa & Wellness sowie mehrere Restaurants und Bars gehören zum Resort.",
        ],
      },
    ],
    amenities: [
      "Außenpool",
      "Spa & Wellness",
      "Mehrere Restaurants",
      "Bar",
      "Fitnessraum",
      "WLAN inklusive",
      "Strandzugang",
    ],
    totalPhotoCount: 41,
    ctaMode: "country_selection",
    bookingUrls: {
      AT: "https://www.hoferreisen.at/hotel/falkenstein-resort-punta-skala",
      DE: "https://www.hoferreisen.de/hotel/falkenstein-resort-punta-skala",
      CH: "https://www.hoferreisen.ch/hotel/falkenstein-resort-punta-skala",
    },
  },

  "alpenresort-zillertal": {
    slug: "alpenresort-zillertal",
    tagline: "Wellness & Bergpanorama mitten im Zillertal.",
    reviewSource: "HolidayCheck",
    transferIncluded: false,
    inclusions: [
      "4 Nächte im 4★ Hotel",
      "Halbpension",
      "Freier Eintritt in den Spa-Bereich",
      "Kostenlose Parkplätze",
    ],
    highlights: [
      "Großer Wellness- & Saunabereich",
      "Panoramablick auf die Zillertaler Alpen",
      "Regionale Küche am Abend",
      "Ideal für Wanderungen direkt ab dem Hotel",
    ],
    descriptionHeading: "Wellnesshotel mit Panoramablick im Zillertal",
    descriptionParagraphs: [
      "Das Alpenresort Zillertal liegt ruhig oberhalb des Tals und bietet einen weiten Blick auf die umgebenden Berge.",
      "Der großzügige Wellnessbereich mit Innen- und Außenpool sowie mehreren Saunen lädt zum Entspannen nach einem Tag in den Bergen ein.",
    ],
    contentSections: [
      {
        heading: "Über dieses Angebot",
        paragraphs: [
          "Das Alpenresort Zillertal liegt ruhig oberhalb des Tals und bietet einen weiten Blick auf die umgebenden Berge.",
        ],
      },
      {
        heading: "Lage: Panorama im Zillertal",
        paragraphs: [
          "Ideal für Wanderungen direkt ab dem Hotel – und für Wellness nach dem Tag in den Bergen.",
        ],
      },
      {
        heading: "Wellness & Kulinarik",
        paragraphs: [
          "Großer Wellness- und Saunabereich sowie regionale Küche am Abend (Halbpension).",
        ],
      },
    ],
    amenities: [
      "Spa & Wellness",
      "Innenpool",
      "Sauna",
      "Restaurant",
      "WLAN inklusive",
      "Parkplatz",
    ],
    totalPhotoCount: 24,
    ctaMode: "direct",
    bookingUrl: "https://www.alpenwelt-reisen.at/hotel/alpenresort-zillertal",
  },

  "hotel-bellavista-gardasee": {
    slug: "hotel-bellavista-gardasee",
    tagline: "Familienurlaub direkt am Ufer des Gardasees.",
    reviewSource: "HolidayCheck",
    transferIncluded: false,
    inclusions: [
      "6 Nächte im 4★ Hotel",
      "All Inclusive",
      "Seeblick-Zimmer verfügbar",
      "Kostenloser Parkplatz",
    ],
    highlights: [
      "Direkt am Ufer des Gardasees",
      "Kinderfreundlicher Pool- & Gartenbereich",
      "Hauseigener Bootsanleger",
      "Reichhaltiges All-Inclusive-Angebot",
    ],
    descriptionHeading: "Familienhotel direkt am Gardasee",
    descriptionParagraphs: [
      "Das Hotel Bellavista Gardasee liegt direkt am Ufer des Sees mit eigenem Zugang zum Wasser und einem hauseigenen Bootsanleger.",
      "Der weitläufige Garten- und Poolbereich sowie das reichhaltige All-Inclusive-Angebot machen das Hotel ideal für Familien.",
    ],
    contentSections: [
      {
        heading: "Über dieses Angebot",
        paragraphs: [
          "Das Hotel Bellavista Gardasee liegt direkt am Ufer des Sees mit eigenem Zugang zum Wasser und einem hauseigenen Bootsanleger.",
        ],
      },
      {
        heading: "Lage: direkt am Gardasee",
        paragraphs: [
          "Seeblick, Pool- und Gartenbereich sowie All Inclusive – besonders beliebt bei Familien.",
        ],
      },
      {
        heading: "Für wen sich dieses Hotel eignet",
        paragraphs: [
          "Familien und Paare, die Seeurlaub mit unkomplizierter Verpflegung suchen.",
        ],
      },
    ],
    amenities: [
      "Außenpool",
      "Seezugang",
      "Restaurant",
      "Kinderspielplatz",
      "WLAN inklusive",
      "Parkplatz",
    ],
    totalPhotoCount: 29,
    ctaMode: "direct",
    bookingUrl: "https://www.sonnenklar.tv/hotel/hotel-bellavista-gardasee",
  },

  "ostsee-therme-spa-hotel": {
    slug: "ostsee-therme-spa-hotel",
    tagline: "Kurzurlaub mit Therme direkt an der Ostsee.",
    reviewSource: "HolidayCheck",
    transferIncluded: false,
    inclusions: [
      "3 Nächte im 4★ Hotel",
      "Halbpension",
      "Freier Thermeneintritt",
      "Fahrradverleih vor Ort",
    ],
    highlights: [
      "Nur wenige Gehminuten zum Strand",
      "Großzügiger Thermen- & Saunabereich",
      "Ruhige Lage auf Rügen",
      "Ideal für einen kurzen Erholungstrip",
    ],
    descriptionHeading: "Therme & Spa direkt an der Ostseeküste",
    descriptionParagraphs: [
      "Das Ostsee Therme & Spa Hotel liegt auf Rügen, nur wenige Gehminuten vom Strand entfernt.",
      "Der Eintritt in den hoteleigenen Thermenbereich mit Innen- und Außenbecken ist während des gesamten Aufenthalts inklusive.",
    ],
    contentSections: [
      {
        heading: "Über dieses Angebot",
        paragraphs: [
          "Das Ostsee Therme & Spa Hotel liegt auf Rügen, nur wenige Gehminuten vom Strand entfernt.",
        ],
      },
      {
        heading: "Lage: nah am Ostseestrand",
        paragraphs: [
          "Ruhige Lage auf Rügen – ideal für einen kurzen Erholungstrip mit Thermeneintritt inklusive.",
        ],
      },
      {
        heading: "Therme & Spa",
        paragraphs: [
          "Freier Eintritt in den hoteleigenen Thermenbereich mit Innen- und Außenbecken während des gesamten Aufenthalts.",
        ],
      },
    ],
    amenities: [
      "Therme",
      "Sauna",
      "Restaurant",
      "Fahrradverleih",
      "WLAN inklusive",
      "Parkplatz",
    ],
    totalPhotoCount: 16,
    ctaMode: "country_selection",
    bookingUrls: {
      AT: "https://www.tui.at/hotel/ostsee-therme-spa-hotel",
      DE: "https://www.tui.de/hotel/ostsee-therme-spa-hotel",
      CH: "https://www.tui.ch/hotel/ostsee-therme-spa-hotel",
    },
  },
};

/** Compact detail stub so new homepage deals open without a full CMS write-up. */
function stubDetail(
  slug: string,
  tagline: string,
  nights: number,
  meal: string,
  location: string
): OfferDetail {
  return {
    slug,
    tagline,
    reviewSource: "HolidayCheck",
    transferIncluded: false,
    inclusions: [
      `${nights} Nächte im Hotel`,
      meal,
      "Steuern & Gebühren inklusive",
    ],
    highlights: [
      `Schöne Lage in ${location}`,
      "Geprüftes Urlaubspanda-Angebot",
      "Flexible Buchungsoptionen",
      "Ideal für den nächsten Kurzurlaub",
    ],
    descriptionHeading: tagline,
    descriptionParagraphs: [
      `Entdecke ${tagline} Mit diesem Angebot genießt du ${nights} Nächte inklusive ${meal} – ehrlich verglichen und transparent bepreist.`,
    ],
    contentSections: [
      {
        heading: "Über dieses Angebot",
        paragraphs: [
          `Dieses Angebot umfasst ${nights} Nächte mit ${meal} in ${location}.`,
        ],
      },
      {
        heading: "Lage",
        paragraphs: [`Zentrale bzw. ruhige Lage in ${location} – ideal für Erholung und Ausflüge.`],
      },
    ],
    amenities: ["Restaurant", "WLAN inklusive", "Pool oder Wellness", "Rezeption 24h"],
    totalPhotoCount: 12,
    ctaMode: "direct",
    bookingUrl: `https://www.holidaycheck.de/hotels/${slug}`,
  };
}

const EXTRA_OFFER_DETAILS: Record<string, OfferDetail> = {
  "santorini-blue-domes": stubDetail(
    "santorini-blue-domes",
    "Caldera-Blick und Frühstück auf Santorini.",
    5,
    "Frühstück",
    "Santorini"
  ),
  "mallorca-palma-bay": stubDetail(
    "mallorca-palma-bay",
    "Strandnaher All-Inclusive-Urlaub auf Mallorca.",
    7,
    "All Inclusive",
    "Palma"
  ),
  "lago-di-como-villa": stubDetail(
    "lago-di-como-villa",
    "Halbpension am Comer See.",
    4,
    "Halbpension",
    "Comer See"
  ),
  "prague-old-town-hotel": stubDetail(
    "prague-old-town-hotel",
    "Städtetrip nach Prag mit Frühstück.",
    3,
    "Frühstück",
    "Prag"
  ),
  "salzburg-city-spa": stubDetail(
    "salzburg-city-spa",
    "Kurzurlaub mit Spa in Salzburg.",
    3,
    "Frühstück",
    "Salzburg"
  ),
  "titisee-black-forest": stubDetail(
    "titisee-black-forest",
    "Schwarzwald-Auszeit mit Halbpension.",
    4,
    "Halbpension",
    "Titisee"
  ),
  "split-adriatic-hotel": stubDetail(
    "split-adriatic-hotel",
    "Adria-Urlaub in Split mit Flug.",
    6,
    "Halbpension",
    "Split"
  ),
  "mykonos-windmill-inn": stubDetail(
    "mykonos-windmill-inn",
    "Adults Only All Inclusive auf Mykonos.",
    5,
    "All Inclusive",
    "Mykonos"
  ),
  "barcelona-ramblas-suites": stubDetail(
    "barcelona-ramblas-suites",
    "Zentrumsnah in Barcelona mit Frühstück.",
    3,
    "Frühstück",
    "Barcelona"
  ),
  "rome-trastevere-boutique": stubDetail(
    "rome-trastevere-boutique",
    "Boutique-Hotel nahe der Altstadt von Rom.",
    4,
    "Frühstück",
    "Rom"
  ),
  "tirol-ski-chalet": stubDetail(
    "tirol-ski-chalet",
    "Skiurlaub in Tirol mit Halbpension.",
    5,
    "Halbpension",
    "Innsbruck"
  ),
  "usedom-beach-hotel": stubDetail(
    "usedom-beach-hotel",
    "Ostsee-Urlaub auf Usedom.",
    4,
    "Halbpension",
    "Usedom"
  ),
  "korfu-olive-grove": stubDetail(
    "korfu-olive-grove",
    "All Inclusive unter Olivenbäumen auf Korfu.",
    7,
    "All Inclusive",
    "Korfu"
  ),
  "ibiza-sunset-resort": stubDetail(
    "ibiza-sunset-resort",
    "Adults Only Sunset-Resort auf Ibiza.",
    6,
    "All Inclusive",
    "Ibiza"
  ),
  "vienna-ringstrasse-hotel": stubDetail(
    "vienna-ringstrasse-hotel",
    "Stadt-Hotel an der Wiener Ringstraße.",
    3,
    "Frühstück",
    "Wien"
  ),
  "naples-vesuvius-view": stubDetail(
    "naples-vesuvius-view",
    "Neapel mit Blick Richtung Vesuv.",
    5,
    "Halbpension",
    "Neapel"
  ),
  "amsterdam-canal-house": stubDetail(
    "amsterdam-canal-house",
    "Canal-Haus-Feeling in Amsterdam.",
    3,
    "Frühstück",
    "Amsterdam"
  ),
  "berlin-mitte-design": stubDetail(
    "berlin-mitte-design",
    "Design-Hotel in Berlin-Mitte.",
    3,
    "Frühstück",
    "Berlin"
  ),
  "hurghada-coral-bay": stubDetail(
    "hurghada-coral-bay",
    "Korallenbucht All Inclusive in Hurghada.",
    7,
    "All Inclusive",
    "Hurghada"
  ),
  "suedtirol-dolomiten-lodge": stubDetail(
    "suedtirol-dolomiten-lodge",
    "Dolomiten-Lodge mit Wellness.",
    5,
    "Halbpension",
    "Seiser Alm"
  ),
  "dubrovnik-cliffside": stubDetail(
    "dubrovnik-cliffside",
    "Cliffside Resort über Dubrovnik.",
    5,
    "All Inclusive",
    "Dubrovnik"
  ),
  "zakynthos-lagoon-resort": stubDetail(
    "zakynthos-lagoon-resort",
    "Lagunen-Resort auf Zakynthos.",
    7,
    "All Inclusive",
    "Zakynthos"
  ),
  "tenerife-costa-adeje": stubDetail(
    "tenerife-costa-adeje",
    "Costa Adeje All Inclusive auf Teneriffa.",
    7,
    "All Inclusive",
    "Teneriffa"
  ),
  "gardasee-limone-hotel": stubDetail(
    "gardasee-limone-hotel",
    "Halbpension in Limone am Gardasee.",
    5,
    "Halbpension",
    "Limone"
  ),
  "marsa-alam-red-sea": stubDetail(
    "marsa-alam-red-sea",
    "Rotes Meer All Inclusive in Marsa Alam.",
    7,
    "All Inclusive",
    "Marsa Alam"
  ),
  "kitzbuehel-alpin-spa": stubDetail(
    "kitzbuehel-alpin-spa",
    "Ski & Spa in Kitzbühel.",
    4,
    "Halbpension",
    "Kitzbühel"
  ),
  "makarska-riviera-hotel": stubDetail(
    "makarska-riviera-hotel",
    "Riviera-Hotel in Makarska.",
    6,
    "Halbpension",
    "Makarska"
  ),
  "munich-altstadt-suites": stubDetail(
    "munich-altstadt-suites",
    "Suiten in der Münchner Altstadt.",
    3,
    "Frühstück",
    "München"
  ),
  "lisbon-alfama-boutique": stubDetail(
    "lisbon-alfama-boutique",
    "Boutique-Hotel in Lissabon-Alfama.",
    4,
    "Frühstück",
    "Lissabon"
  ),
  "rhodos-faliraki-beach": stubDetail(
    "rhodos-faliraki-beach",
    "Strandhotel in Faliraki auf Rhodos.",
    7,
    "Halbpension",
    "Faliraki"
  ),
  "meran-therme-palace": stubDetail(
    "meran-therme-palace",
    "Therme & Palace in Meran.",
    4,
    "Halbpension",
    "Meran"
  ),
};

Object.assign(offerDetails, EXTRA_OFFER_DETAILS);
