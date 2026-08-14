import type { Metadata } from "next";
import { getTravelCategory } from "@/data/travelCategories";

/** Server-only metadata helper — must not live in a Client Component module. */
export function travelCategoryMetadata(slug: string): Metadata {
  const category = getTravelCategory(slug);
  if (!category) return {};
  const path = `/${category.slug}`;
  return {
    title: category.title,
    description: category.description,
    alternates: { canonical: path },
    openGraph: {
      title: category.title,
      description: category.description,
      url: path,
    },
    twitter: {
      title: category.title,
      description: category.description,
    },
  };
}
