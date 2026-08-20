import type { CategorySlug } from "@/types";

export interface CategoryConfig {
  slug: CategorySlug;
  label: string;
  singular: string;
  /** Short signage-style code, mirrors a physical campus directory board. */
  code: string;
  icon: string;
  /** Tailwind arbitrary-value friendly CSS var, e.g. var(--color-cat-buildings) */
  colorVar: string;
  cardBlurb: string;
  emptyStateHint: string;
}

export const CATEGORIES: CategoryConfig[] = [
  {
    slug: "buildings",
    label: "Buildings",
    singular: "Building",
    code: "BLDG",
    icon: "🏢",
    colorVar: "var(--color-cat-buildings)",
    cardBlurb: "Find campus buildings and locations.",
    emptyStateHint: "a building name, like “Block A”",
  },
  {
    slug: "departments",
    label: "Departments",
    singular: "Department",
    code: "DEPT",
    icon: "🏫",
    colorVar: "var(--color-cat-departments)",
    cardBlurb: "Explore academic departments.",
    emptyStateHint: "a department, like “Computer Science”",
  },
  {
    slug: "faculty",
    label: "Faculty",
    singular: "Faculty",
    code: "FAC",
    icon: "👨‍🏫",
    colorVar: "var(--color-cat-faculty)",
    cardBlurb: "Find faculty members and their departments.",
    emptyStateHint: "a faculty name or subject",
  },
  {
    slug: "labs",
    label: "Labs",
    singular: "Lab",
    code: "LAB",
    icon: "🔬",
    colorVar: "var(--color-cat-labs)",
    cardBlurb: "Find laboratories and their locations.",
    emptyStateHint: "a lab, like “Electronics Lab”",
  },
  {
    slug: "facilities",
    label: "Facilities",
    singular: "Facility",
    code: "FCL",
    icon: "📍",
    colorVar: "var(--color-cat-facilities)",
    cardBlurb: "Discover campus facilities.",
    emptyStateHint: "a facility, like “Library” or “Cafeteria”",
  },
  {
    slug: "offices",
    label: "Important Offices",
    singular: "Office",
    code: "OFC",
    icon: "🏛️",
    colorVar: "var(--color-cat-offices)",
    cardBlurb: "Find important administrative offices.",
    emptyStateHint: "an office, like “Admissions”",
  },
];

export function getCategory(slug: CategorySlug): CategoryConfig {
  const found = CATEGORIES.find((c) => c.slug === slug);
  if (!found) throw new Error(`Unknown category slug: ${slug}`);
  return found;
}
