import {
  Anchor,
  Bike,
  Car,
  Coffee,
  Dumbbell,
  Martini,
  Sparkles,
  ThermometerSun,
  Users,
  Utensils,
  Waves,
  Wifi,
  Wind,
  type LucideIcon,
} from "lucide-react";

/**
 * Maps known amenity labels to an icon. Any label not listed here (e.g. a
 * future backend-supplied amenity we don't know about yet) still renders
 * fine with the `defaultAmenityIcon` fallback, so this list never needs to
 * be exhaustive.
 */
const amenityIconMap: Record<string, LucideIcon> = {
  Außenpool: Waves,
  Innenpool: Waves,
  "Infinity-Pool": Waves,
  Aquapark: Waves,
  Wasserpark: Waves,
  Strandzugang: Waves,
  Seezugang: Anchor,
  Therme: ThermometerSun,
  Sauna: ThermometerSun,
  "Spa & Wellness": Sparkles,
  Fitnessraum: Dumbbell,
  Restaurant: Utensils,
  Restaurants: Utensils,
  "Mehrere Restaurants": Utensils,
  "À-la-carte-Restaurants": Utensils,
  Frühstücksraum: Coffee,
  Bar: Martini,
  "Rooftop-Bar": Martini,
  "WLAN inklusive": Wifi,
  Klimaanlage: Wind,
  Kinderclub: Users,
  Kinderspielplatz: Users,
  Tauchschule: Waves,
  Concierge: Users,
  Parkplatz: Car,
  Fahrradverleih: Bike,
};

export function getAmenityIcon(label: string): LucideIcon {
  return amenityIconMap[label] ?? Sparkles;
}
