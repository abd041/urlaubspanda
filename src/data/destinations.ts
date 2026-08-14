import type { Destination } from "@/types";

/**
 * Mock destination data for the homepage carousel. Images are stored
 * locally under /public/images and should be replaced with licensed
 * Urlaubspanda photography once available from the backend/CMS.
 */

const img = (id: string) => `/images/${id}.jpg`;

export const destinations: Destination[] = [
  {
    id: "oesterreich",
    slug: "oesterreich",
    name: "Österreich",
    subtitle: "Berge, Seen & Natur",
    badge: "🇦🇹 Österreich",
    image:
      img("1506905925346-21bda4d32df4"),
    intro:
      "Von alpinen Wellnesshotels im Zillertal bis zu ruhigen Seen im Salzkammergut – Österreich bietet Urlaub für jede Jahreszeit. Wir haben die besten geprüften Angebote für deinen nächsten Kurzurlaub oder Winterurlaub direkt vor der Haustür zusammengestellt.",
    kurzgesagt:
      "Österreich ist das ideale Ganzjahresziel für Kurzurlaube, Wellness, Thermen und Ski – mit kurzer Anreise und einer großen Auswahl geprüfter Hotelangebote.",
    popularSpots: [
      {
        name: "Zillertal",
        fromPrice: 429,
        image:
          img("1751980678477-7108070ab3d9"),
      },
      {
        name: "Salzkammergut",
        fromPrice: 389,
        image:
          img("1527004013197-933c4bb611b3"),
      },
      {
        name: "Tirol",
        fromPrice: 459,
        image:
          img("1516550893923-42d28e5677af"),
      },
      {
        name: "Kärnten",
        fromPrice: 349,
        image:
          img("1506905925346-21bda4d32df4"),
      },
    ],
    seoContent: [
      {
        heading: "Warum Urlaub in Österreich?",
        paragraphs: [
          "Österreich punktet mit kurzer Anreise, abwechslungsreicher Natur und einer hohen Hoteldichte – von Thermenhotels über Familienresorts bis zu Ski- und Wellnessangeboten. Viele Regionen sind ganzjährig attraktiv und lassen sich flexibel als Wochenende oder längerer Aufenthalt planen.",
          "Bei Urlaubspanda vergleichst du geprüfte Österreich-Angebote transparent: Preis, Leistung und Bewertungen auf einen Blick – ohne versteckte Kosten und mit klaren Filteroptionen für Thermen, Wellness, See, Berge und Ski.",
        ],
      },
      {
        heading: "Beliebte Urlaubsarten in Österreich",
        paragraphs: [
          "Thermen- und Wellnessurlaub, Familienhotels, Urlaub am See, Berg- und Skiurlaub gehören zu den gefragtesten Kategorien. Mit unseren Filtern findest du schnell passende Hotels – und einzelne Filterkombinationen haben eigene SEO-Seiten, damit du Angebote gezielt entdecken kannst.",
        ],
      },
      {
        heading: "Beste Reisezeit für Österreich",
        paragraphs: [
          "Im Sommer laden Seen und Wanderwege ein, im Winter stehen Ski und gemütliche Thermen im Fokus. Viele Regionen sind auch in der Nebensaison gut buchbar – oft zu attraktiveren Preisen.",
        ],
      }
    ],
    overviewFacts: [
      { label: "Beliebteste Regionen", value: "Tirol, Salzburg, Kärnten, Salzkammergut, Zillertal" },
      { label: "Beste Reisezeit", value: "Ganzjährig – Sommer für Seen & Berge, Winter für Ski & Thermen" },
      { label: "Anreise", value: "Auto, Bahn oder Kurzflug – oft in wenigen Stunden erreichbar" },
      { label: "Typische Reisearten", value: "Thermen, Wellness, Ski, Familienhotels, Urlaub am See" },
      { label: "Ideal für", value: "Kurzurlaube, Familien, Wellnessfans, Wintersportler" },
    ],
    faqs: [
      {
        question: "Wann ist die beste Reisezeit für Österreich?",
        answer: "Österreich ist ganzjährig attraktiv: Im Sommer punkten Seen und Berge, im Winter Ski und Thermen. Für Kurzurlaube eignen sich besonders Frühjahr und Herbst.",
      },
      {
        question: "Lohnt sich ein Thermenurlaub in Österreich?",
        answer: "Ja – viele Thermenhotels bieten Kombiangebote mit Übernachtung, Verpflegung und Eintritt. Filtere nach Thermenurlaub und Wellness, um passende Deals zu finden.",
      },
    ],
  },
  {
    id: "griechenland",
    slug: "griechenland",
    name: "Griechenland",
    subtitle: "Inseln & Meer",
    badge: "🇬🇷 Griechenland",
    image:
      img("1506242592132-b7476b527d50"),
    intro:
      "Griechenland zählt zu den beliebtesten Urlaubszielen der Deutschen und Österreicher – kein Wunder bei kristallklarem Meer, weißen Stränden und gastfreundlichen Inselhotels. Ob Rhodos, Kreta oder die Kykladen: Hier findest du geprüfte All-Inclusive- und Strandhotel-Angebote zu Top-Preisen.",
    kurzgesagt:
      "Griechenland ist ein klassisches Sonnenziel für Strand-, Insel- und All-Inclusive-Urlaub – mit klarem Meer, kurzer Flugzeit und starken Preis-Leistungs-Angeboten.",
    popularSpots: [
      {
        name: "Rhodos",
        fromPrice: 548,
        image:
          img("1506242592132-b7476b527d50"),
      },
      {
        name: "Kreta",
        fromPrice: 672,
        image:
          img("1533105079780-92b9be482077"),
      },
      {
        name: "Kos",
        fromPrice: 499,
        image:
          img("1691246806224-a6e9dde3678d"),
      },
      {
        name: "Korfu",
        fromPrice: 539,
        image:
          img("1613395877344-13d4a8e0d49e"),
      },
    ],
    seoContent: [
      {
        heading: "Griechenland-Urlaub: Sonne, Meer & Inseln",
        paragraphs: [
          "Von All-Inclusive-Resorts bis Adults-Only-Hotels – Griechenland bietet vielfältige Strand- und Inselurlaubs-Formate. Direkte Strandlage, Flug inklusive und starke Weiterempfehlungsraten sind für viele Reisende entscheidend.",
          "Nutze die Filter auf dieser Seite, um Angebote nach Mit Flug, All Inclusive, Strandlage oder Familienhotel einzugrenzen. So bleibst du flexibel und behältst den Überblick über aktuelle Deals.",
        ],
      },
      {
        heading: "Beste Reisezeit für Griechenland",
        paragraphs: [
          "Die Hauptsaison liegt zwischen Mai und Oktober. Wer Hitze und volle Strände meiden will, plant eher Mai/Juni oder September/Oktober – oft mit besseren Preisen und angenehmeren Temperaturen.",
        ],
      },
      {
        heading: "Was dich in Griechenland erwartet",
        paragraphs: [
          "Kristallklares Meer, mediterrane Küche und gastfreundliche Hotels prägen den Griechenland-Urlaub. Viele Resorts liegen direkt am Strand und bieten All Inclusive oder Halbpension.",
        ],
      }
    ],
    overviewFacts: [
      { label: "Beliebteste Regionen", value: "Rhodos, Kreta, Kos, Korfu, Santorin" },
      { label: "Beste Reisezeit", value: "Mai bis Oktober – Hochsaison Juli/August" },
      { label: "Flugzeit ab Österreich/DE", value: "rund 2,5 bis 3,5 Stunden" },
      { label: "Typische Reisearten", value: "All Inclusive, Strandurlaub, Adults Only, Familienhotels" },
      { label: "Ideal für", value: "Sonnenfans, Familien, Paare, Inselhopper" },
    ],
    faqs: [
      {
        question: "Wann ist die beste Reisezeit für Griechenland?",
        answer: "Mai bis Oktober ist ideal zum Baden. Frühling und Herbst sind milder und oft günstiger; der Hochsommer bringt Hitze und Hochsaisonpreise.",
      },
      {
        question: "Welche Insel passt zu wem?",
        answer: "Rhodos und Kreta eignen sich gut für Familien und All Inclusive. Kos und Korfu sind vielseitig; für besondere Atmosphäre sind kleinere Inseln beliebt.",
      },
      {
        question: "Lohnt sich All Inclusive in Griechenland?",
        answer: "Sehr oft ja – besonders in Resortregionen. So bleiben Essen und Getränke kalkulierbar, und du kannst den Urlaub entspannt genießen.",
      },
    ],
  },
  {
    id: "italien",
    slug: "italien",
    name: "Italien",
    subtitle: "Küste & Kulinarik",
    badge: "🇮🇹 Italien",
    image:
      img("1516483638261-f4dbaf036963"),
    intro:
      "Italien vereint traumhafte Seen, historische Städte und mediterrane Küche wie kein anderes Land. Von entspannten Tagen am Gardasee bis zu kulinarischen Entdeckungen in der Toskana – wir zeigen dir handverlesene Hotelangebote für deinen Italien-Urlaub.",
    kurzgesagt:
      "Italien verbindet Küste, Seen, Städte und Kulinarik – ideal für entspannte Strandtage ebenso wie für Genuss- und Städtereisen.",
    popularSpots: [
      {
        name: "Gardasee",
        fromPrice: 489,
        image:
          img("1768992750994-3a80586a1e92"),
      },
      {
        name: "Toskana",
        fromPrice: 519,
        image:
          img("1523906834658-6e24ef2386f9"),
      },
      {
        name: "Adria",
        fromPrice: 449,
        image:
          img("1516483638261-f4dbaf036963"),
      },
      {
        name: "Sizilien",
        fromPrice: 559,
        image:
          img("1523906834658-6e24ef2386f9"),
      },
    ],
    seoContent: [
      {
        heading: "Italien entdecken – Küste, Kultur und Genuss",
        paragraphs: [
          "Italien eignet sich ebenso für entspannten Strandurlaub wie für Städte- und Genussreisen. Viele Angebote lassen sich mit Flug oder eigener Anreise kombinieren – je nach Region und Saison.",
          "Auf Urlaubspanda filterst du Italien-Deals nach deinen Prioritäten und vergleichst Preise, Hotelsterne und Bewertungen auf einen Blick.",
        ],
      },
      {
        heading: "Beste Reisezeit für Italien",
        paragraphs: [
          "Italien lohnt sich von Frühling bis Herbst. Seenregionen sind im Frühsommer besonders reizvoll, Küsten im Sommer und frühen Herbst.",
        ],
      }
    ],
    overviewFacts: [
      { label: "Beliebteste Regionen", value: "Gardasee, Adria, Toskana, Sizilien, Südtirol-Nähe" },
      { label: "Beste Reisezeit", value: "Frühling bis Herbst; Seen auch im Frühsommer ideal" },
      { label: "Anreise", value: "Auto, Bahn oder Flug – je nach Region" },
      { label: "Typische Reisearten", value: "Seeurlaub, Strand, Städte, Genuss & Kulinarik" },
      { label: "Ideal für", value: "Paare, Familien, Genießer, Kulturinteressierte" },
    ],
    faqs: [
      {
        question: "Wann ist die beste Reisezeit für Italien?",
        answer: "Frühling und Frühherbst sind besonders angenehm. Am Gardasee und an der Adria ist der Sommer Hochsaison – wer Ruhe sucht, reist außerhalb der Schulferien.",
      },
      {
        question: "Gardasee oder Meer – was passt besser?",
        answer: "Der Gardasee eignet sich für aktive und entspannte Kurzurlaube mit Bergpanorama. Die Adria und Sizilien punkten mit klassischem Strandurlaub und mediterranem Flair.",
      },
    ],
  },
  {
    id: "kroatien",
    slug: "kroatien",
    name: "Kroatien",
    subtitle: "Adriaküste",
    badge: "🇭🇷 Kroatien",
    image:
      img("1769092431507-97a5f83670a0"),
    intro:
      "Die kroatische Adriaküste begeistert mit glasklarem Wasser, malerischen Buchten und familienfreundlichen Resorts. Ob Istrien oder Zadar – hier findest du geprüfte Angebote für einen entspannten Strandurlaub mit kurzer Anreise.",
    kurzgesagt:
      "Kroatien punktet mit klarer Adria, familienfreundlichen Resorts und vergleichsweise kurzer Anreise – stark für Strand- und All-Inclusive-Urlaub.",
    popularSpots: [
      {
        name: "Zadar",
        fromPrice: 623,
        image:
          img("1769092431507-97a5f83670a0"),
      },
      {
        name: "Istrien",
        fromPrice: 499,
        image:
          img("1747339664057-e911cdcf2a57"),
      },
      {
        name: "Dalmatien",
        fromPrice: 549,
        image:
          img("1761382799659-725f824955ce"),
      },
      {
        name: "Dubrovnik",
        fromPrice: 689,
        image:
          img("1555993539-1732b0258235"),
      },
    ],
    seoContent: [
      {
        heading: "Kroatien: Adriaküste zum Entspannen",
        paragraphs: [
          "Kroatien ist ein Klassiker für Strandurlaub mit klaren Buchten und familienfreundlichen Hotels. Viele Resorts punkten mit All Inclusive und direkter Strandlage.",
          "Vergleiche aktuelle Kroatien-Angebote bei Urlaubspanda und filtere gezielt nach Flug, All Inclusive oder Familienhotel.",
        ],
      },
      {
        heading: "Beste Reisezeit für Kroatien",
        paragraphs: [
          "Die Adriaküste ist im Sommer am wärmsten. Wer weniger Trubel möchte, plant Randzeiten – dann sind Strände und Hotels oft entspannter.",
        ],
      }
    ],
    overviewFacts: [
      { label: "Beliebteste Regionen", value: "Istrien, Dalmatien, Zadar, Dubrovnik" },
      { label: "Beste Reisezeit", value: "Juni bis September zum Baden" },
      { label: "Anreise", value: "Auto oder Flug – oft vergleichsweise kurze Wege" },
      { label: "Typische Reisearten", value: "Strandurlaub, All Inclusive, Familienhotels" },
      { label: "Ideal für", value: "Familien, Paare, Sonnen- und Badefans" },
    ],
    faqs: [
      {
        question: "Wann ist die beste Reisezeit für Kroatien?",
        answer: "Zum Baden eignen sich Juni bis September. Mai und Oktober sind milder und oft ruhiger – gut für Kurzurlaube ohne Hochsaisonpreise.",
      },
      {
        question: "Istrien oder Dalmatien?",
        answer: "Istrien liegt näher und eignet sich gut für Autoreisen. Dalmatien (z. B. Zadar, Dubrovnik) bietet klassische Adriaküste mit klaren Buchten.",
      },
    ],
  },
  {
    id: "aegypten",
    slug: "aegypten",
    name: "Ägypten",
    subtitle: "Rotes Meer",
    badge: "🇪🇬 Ägypten",
    image:
      img("1568322445389-f64ac2515020"),
    intro:
      "Ägypten ist ganzjährig für Sonnengarantie und Top-All-Inclusive-Resorts bekannt. Hurghada und die Küstenorte am Roten Meer bieten Traumstrände, Tauchreviere und moderne Hotels – wir vergleichen die besten Angebote für dich.",
    kurzgesagt:
      "Ägypten ist ein günstiges Ganzjahres-Reiseziel für Strand-, Schnorchel- und Kulturfans. Die beliebtesten Badeorte liegen am Roten Meer – allen voran Hurghada und Marsa Alam.",
    popularSpots: [
      {
        name: "Hurghada",
        fromPrice: 429,
        image:
          img("1568322445389-f64ac2515020"),
      },
      {
        name: "Marsa Alam",
        fromPrice: 520,
        image:
          img("1539768942893-daf53e448371"),
      },
      {
        name: "Kalawy",
        fromPrice: 670,
        image:
          img("1544551763-46a013bb70d5"),
      },
      {
        name: "Luxor, Hurghada, …",
        fromPrice: 849,
        image:
          img("1587595431973-160d0d94add1"),
      },
      {
        name: "Sharm el Sheik",
        fromPrice: 593,
        image:
          img("1573843981267-be1999ff37cd"),
      },
      {
        name: "Soma Bay",
        fromPrice: 564,
        image:
          img("1572252009286-268acec5ca0a"),
      },
    ],
    seoContent: [
      {
        heading: "Ägypten-Urlaub am Roten Meer",
        paragraphs: [
          "Ägypten überzeugt mit ganzjähriger Sonne, modernen All-Inclusive-Resorts und attraktiven Preisen – besonders rund um Hurghada und die Küste am Roten Meer.",
          "Mit Filtern wie Mit Flug, All Inclusive und Direkte Strandlage findest du schnell das passende Angebot für deinen nächsten Ägypten-Urlaub.",
        ],
      },
      {
        heading: "Beste Reisezeit für Ägypten",
        paragraphs: [
          "Ägypten ist ein Ganzjahresziel, doch die angenehmste Zeit zum Baden liegt im Frühjahr und im Herbst: Dann ist es warm, ohne dass die Hitze drückt, und das Rote Meer herrlich warm. Im Winter bleibt es am Meer mild und sonnig.",
          "Für Sightseeing rund um Kairo, Luxor und den Nil sind die kühleren Monate klar im Vorteil. In der Nebensaison findest du oft die günstigsten Angebote.",
        ],
      },
      {
        heading: "Top-Ziele und Regionen am Roten Meer",
        paragraphs: [
          "Hurghada ist der Klassiker mit großer Hotelauswahl – ideal für Familien und Erstbesucher. Marsa Alam gilt als Taucher- und Schnorchelparadies. Soma Bay und Sahl Hasheesh stehen für gehobene Resortwelten; Sharm el-Sheikh auf dem Sinai für spektakuläre Tauchspots.",
        ],
      },
      {
        heading: "Was dich in Ägypten erwartet",
        paragraphs: [
          "Der große Trumpf ist das Rote Meer: An vielen Stränden reicht ein Sprung ins Wasser, und schon schwebst du über einem lebendigen Korallenriff. An Land locken Pyramiden, Tempel und Wüstenausflüge – dazu orientalische Basare und ägyptische Gastfreundschaft.",
        ],
      },
      {
        heading: "Anreise nach Ägypten",
        paragraphs: [
          "Nach Ägypten geht es per Flugzeug. Nonstop-Flüge führen zu den wichtigsten Urlaubsflughäfen Hurghada und Marsa Alam; die Flugzeit beträgt rund 4 bis 4,5 Stunden. Vom Flughafen bringt dich der Transfer ins Resort – bei Pauschalpaketen meist inklusive.",
        ],
      },
      {
        heading: "Praktische Tipps für deinen Ägypten-Urlaub",
        paragraphs: [
          "Die Sonne ist intensiv – hoher Lichtschutzfaktor, Kopfbedeckung und Sonnenbrille gehören ins Gepäck. Trinke abgefülltes Wasser und packe Badeschuhe fürs Riff ein. Außerhalb der Resorts ist dezente Kleidung angebracht; Trinkgeld (Bakschisch) ist üblich.",
        ],
      }
    ],
    overviewFacts: [
      { label: "Beliebteste Regionen", value: "Hurghada, Makadi Bay, Marsa Alam, Sahl Hasheesh, El Gouna, Sharm el-Sheikh" },
      { label: "Beste Reisezeit", value: "Frühjahr und Herbst zum Baden ideal, Winter mild, Hochsommer sehr heiß" },
      { label: "Flugzeit ab Österreich", value: "nonstop rund 4 bis 4,5 Stunden" },
      { label: "Zeitverschiebung", value: "in der Regel +1 Stunde gegenüber Mitteleuropa" },
      { label: "Währung", value: "Ägyptisches Pfund (EGP), in Resorts oft auch Euro akzeptiert" },
      { label: "Typische Reisearten", value: "Pauschal- und All-inclusive-Urlaub, Last Minute, Tauch- und Schnorchelreisen, Nilkreuzfahrt" },
      { label: "Ideal für", value: "Strand- und Wassersportfans, Familien, Taucher, Kulturbegeisterte" },
    ],
    faqs: [
      {
        question: "Ist Ägypten als Reiseziel sicher?",
        answer: "Die klassischen Badeorte am Roten Meer wie Hurghada, Makadi Bay und Marsa Alam sind touristisch gut ausgebaut. Informiere dich vor der Buchung über aktuelle offizielle Reisehinweise.",
      },
      {
        question: "Wann ist die beste Reisezeit für Ägypten?",
        answer: "Zum Baden sind Frühjahr und Herbst ideal. Der Winter bleibt am Meer mild und sonnig; der Hochsommer ist sehr heiß und eignet sich eher für Strand- und Poolurlaub.",
      },
      {
        question: "Lohnt sich All-inclusive in Ägypten?",
        answer: "In den Resortregionen ist All-inclusive weit verbreitet und bietet meist ein sehr gutes Preis-Leistungs-Verhältnis – besonders für Familien.",
      },
      {
        question: "Wo kann man in Ägypten am besten schnorcheln?",
        answer: "Besonders artenreiche Hausriffe findest du in Marsa Alam, der Makadi Bay und in Sahl Hasheesh. Viele Hotels haben direkten Zugang zu einem eigenen Riff.",
      },
    ],
  },
  {
    id: "spanien",
    slug: "spanien",
    name: "Spanien",
    subtitle: "Küste & Städte",
    badge: "🇪🇸 Spanien",
    image:
      img("1741020518459-067228547fe2"),
    intro:
      "Von der Costa Blanca bis zu den Kanarischen Inseln – Spanien bietet für jeden Geschmack den passenden Urlaub, ob quirliger Strandurlaub oder ruhige Auszeit. Entdecke geprüfte Hotelangebote mit Flug, All Inclusive und direkter Strandlage.",
    kurzgesagt:
      "Spanien bietet von der Costa Blanca bis zu den Inseln vielfältigen Strandurlaub – oft mit Flug, All Inclusive und direkter Strandlage.",
    popularSpots: [
      {
        name: "Costa Blanca",
        fromPrice: 479,
        image:
          img("1741020518459-067228547fe2"),
      },
      {
        name: "Mallorca",
        fromPrice: 399,
        image:
          img("1506905925346-21bda4d32df4"),
      },
      {
        name: "Kanaren",
        fromPrice: 449,
        image:
          img("1544551763-77ef2d0cfc6c"),
      },
      {
        name: "Costa Brava",
        fromPrice: 429,
        image:
          img("1539037116277-4db20889f2d4"),
      },
    ],
    seoContent: [
      {
        heading: "Spanien: Vielfalt von Küste bis Inseln",
        paragraphs: [
          "Spanien bietet Strand, Städte und Inselwelten in einem Land. Ob Costa Blanca oder Kanaren – die Auswahl an Hotels und Pauschalangeboten ist groß.",
          "Bei Urlaubspanda filterst du Spanien-Deals nach Flug, All Inclusive, Strandlage und mehr und behältst Preise sowie Bewertungen im Blick.",
        ],
      },
      {
        heading: "Beste Reisezeit für Spanien",
        paragraphs: [
          "Frühling und Herbst sind angenehm warm und oft günstiger. Im Hochsommer herrscht Hochsaison – wer flexibel ist, findet in den Randzeiten starke Deals.",
        ],
      }
    ],
    overviewFacts: [
      { label: "Beliebteste Regionen", value: "Costa Blanca, Mallorca, Kanaren, Costa Brava" },
      { label: "Beste Reisezeit", value: "Frühling bis Herbst; Kanaren ganzjährig" },
      { label: "Flugzeit", value: "rund 2,5 bis 4,5 Stunden je nach Ziel" },
      { label: "Typische Reisearten", value: "Strand, All Inclusive, Familienhotels, Last Minute" },
      { label: "Ideal für", value: "Sonnenurlaub, Familien, Paare, Inseltrips" },
    ],
    faqs: [
      {
        question: "Wann ist die beste Reisezeit für Spanien?",
        answer: "Festlandküsten und Balearen sind von Frühling bis Herbst ideal. Die Kanaren eignen sich oft ganzjährig – auch als Winterflucht.",
      },
      {
        question: "Costa Blanca oder Inseln?",
        answer: "Die Costa Blanca bietet lange Sandstrände und viele Familienangebote. Mallorca und die Kanaren punkten mit Insel-Feeling und großer Hotelvielfalt.",
      },
    ],
  },
  {
    id: "deutschland",
    slug: "deutschland",
    name: "Deutschland",
    subtitle: "Küste & Natur",
    badge: "🇩🇪 Deutschland",
    image:
      img("1485465053475-dd55ed3894b9"),
    intro:
      "Ob Therme an der Ostsee oder Wellnesshotel im Grünen – Deutschland punktet mit kurzer Anreise und vielseitigen Kurzurlauben für die ganze Familie. Wir zeigen dir geprüfte Angebote für Städtetrips, Thermen und Erholung am Wasser.",
    kurzgesagt:
      "Deutschland eignet sich ideal für spontane Kurzurlaube: Thermen, Wellness, See und Küste sind oft schnell erreichbar.",
    popularSpots: [
      {
        name: "Rügen",
        fromPrice: 299,
        image:
          img("1485465053475-dd55ed3894b9"),
      },
      {
        name: "Ostsee",
        fromPrice: 279,
        image:
          img("1507525428034-b723cf961d3e"),
      },
      {
        name: "Bayern",
        fromPrice: 349,
        image:
          img("1467269204594-9661b134dd2b"),
      },
      {
        name: "Schwarzwald",
        fromPrice: 329,
        image:
          img("1470071459604-3b5ec3a7fe05"),
      },
    ],
    seoContent: [
      {
        heading: "Kurzurlaub in Deutschland",
        paragraphs: [
          "Deutschland eignet sich ideal für spontane Wochenenden und Kurzurlaube: Thermen, Wellness, See und Küste sind oft schnell erreichbar.",
          "Entdecke geprüfte Deutschland-Angebote und filtere nach Thermenurlaub, Wellness, Familienhotel oder Last Minute – ganz nach deinem Plan.",
        ],
      },
      {
        heading: "Beste Reisezeit für Deutschland",
        paragraphs: [
          "Thermen und Wellness funktionieren ganzjährig. Für Küste und Outdoor eignen sich Frühling bis Herbst besonders gut.",
        ],
      }
    ],
    overviewFacts: [
      { label: "Beliebteste Regionen", value: "Ostsee, Rügen, Bayern, Schwarzwald" },
      { label: "Beste Reisezeit", value: "Ganzjährig – je nach Thermen-, See- oder Städteplan" },
      { label: "Anreise", value: "Auto oder Bahn – kurze Wege, spontan buchbar" },
      { label: "Typische Reisearten", value: "Thermen, Wellness, Kurzurlaub, Familienhotels" },
      { label: "Ideal für", value: "Wochenenden, Familien, Spontanurlauber" },
    ],
    faqs: [
      {
        question: "Lohnt sich ein Kurzurlaub in Deutschland?",
        answer: "Ja – kurze Anreise, flexible Buchung und viele Thermen- sowie Wellnessangebote machen Deutschland ideal für spontane Auszeiten.",
      },
      {
        question: "Ostsee oder Berge?",
        answer: "Die Ostsee und Rügen stehen für Meer und Strandfeeling. Bayern und der Schwarzwald bieten Natur, Wellness und Bergpanorama.",
      },
    ],
  },
  {
    id: "suedtirol",
    slug: "suedtirol",
    name: "Südtirol",
    subtitle: "Dolomiten",
    badge: "🇮🇹 Südtirol",
    image:
      img("1580118797218-2413f9d2e36b"),
    intro:
      "Südtirol verbindet alpine Landschaften mit italienischem Lebensgefühl – ideal für Wander-, Wellness- und Genussurlaub vor der Kulisse der Dolomiten. Bald findest du hier eine Auswahl unserer besten Südtirol-Angebote.",
    kurzgesagt:
      "Südtirol verbindet alpine Landschaften mit italienischem Lebensgefühl – ideal für Wellness-, Wander- und Genussurlaub.",
    seoContent: [
      {
        heading: "Südtirol: Alpen, Dolomiten und Genuss",
        paragraphs: [
          "Südtirol verbindet Berglandschaft mit mediterranem Flair – beliebt für Wellness, Familienurlaub und Aufenthalte am See oder in den Bergen.",
          "Sobald weitere Angebote verfügbar sind, kannst du hier gezielt nach Wellness, Familienhotel und Bergurlaub filtern.",
        ],
      },
      {
        heading: "Beste Reisezeit für Südtirol",
        paragraphs: [
          "Südtirol verbindet Alpen und mediterranes Flair. Plane Wanderungen eher von Juni bis September; Wellness und Genuss funktionieren das ganze Jahr.",
        ],
      }
    ],
    overviewFacts: [
      { label: "Beliebteste Regionen", value: "Dolomiten, Meran, Bozen, Seeregionen" },
      { label: "Beste Reisezeit", value: "Sommer für Wandern, Winter für Schnee & Wellness" },
      { label: "Anreise", value: "Auto oder Bahn – alpine Lage mit guter Anbindung" },
      { label: "Typische Reisearten", value: "Wellness, Wandern, Genuss, Familienurlaub" },
      { label: "Ideal für", value: "Genießer, Aktivurlauber, Paare, Familien" },
    ],
    faqs: [
      {
        question: "Wann ist die beste Reisezeit für Südtirol?",
        answer: "Sommer und Frühherbst sind ideal zum Wandern. Winter bringt Schnee und gemütliche Wellnessaufenthalte – beides ist stark nachgefragt.",
      },
    ],
  },
  {
    id: "staedtereisen",
    slug: "staedtereisen",
    name: "Städtereisen",
    subtitle: "Metropolen",
    image:
      img("1742071210076-75a5416e16f9"),
    intro:
      "Kurztrip statt langer Anreise: Entdecke Europas schönste Metropolen mit unseren Städtereisen-Angeboten inklusive Flug und zentral gelegenem Hotel – perfekt für ein verlängertes Wochenende.",
    kurzgesagt:
      "Städtereisen sind ideal für kurze Auszeiten: zentrale Hotels, gute Anbindung und oft Flug inklusive.",
    seoContent: [
      {
        heading: "Städtereisen und City-Trips",
        paragraphs: [
          "Städtereisen sind ideal für kurze Auszeiten: zentrale Hotels, gute Anbindung und oft Flug inklusive. Ob Wochenende oder verlängerter Trip – die richtigen Filter helfen dir, passende Deals schnell zu finden.",
          "Filtere nach Mit Flug, zentraler Lage, Frühbucher oder Last Minute und vergleiche aktuelle City-Angebote bei Urlaubspanda.",
        ],
      },
      {
        heading: "Tipps für Städtereisen",
        paragraphs: [
          "Zentrale Hotels sparen Transferzeit. Filtere nach Mit Flug und zentraler Lage, um passende City-Deals schnell zu finden.",
        ],
      }
    ],
    overviewFacts: [
      { label: "Beliebte Ziele", value: "Paris, Rom, Barcelona, London, Wien und mehr" },
      { label: "Typische Dauer", value: "2–5 Nächte – ideal für Wochenenden" },
      { label: "Anreise", value: "meist Flug inklusive oder gut erreichbar per Bahn" },
      { label: "Typische Reisearten", value: "City-Trip, Mit Flug, zentrale Lage, Last Minute" },
      { label: "Ideal für", value: "Paare, Freundesgruppen, Kultur- und Shoppingfans" },
    ],
    faqs: [
      {
        question: "Wie lange sollte ein Städtetrip dauern?",
        answer: "Für die meisten Metropolen reichen 2–4 Nächte. Mit Flug und zentralem Hotel nutzt du die Zeit maximal – ohne lange Anreise.",
      },
    ],
  },
];

/**
 * Homepage-details required order:
 * Österreich, Deutschland, Italien, Kroatien, Griechenland, Ägypten,
 * Spanien, Südtirol, Städtereisen.
 */
export const DESTINATION_DISPLAY_ORDER = [
  "oesterreich",
  "deutschland",
  "italien",
  "kroatien",
  "griechenland",
  "aegypten",
  "spanien",
  "suedtirol",
  "staedtereisen",
] as const;

export function destinationsInDisplayOrder(): Destination[] {
  const bySlug = new Map(destinations.map((destination) => [destination.slug, destination]));
  return DESTINATION_DISPLAY_ORDER.flatMap((slug) => {
    const destination = bySlug.get(slug);
    return destination ? [destination] : [];
  });
}
