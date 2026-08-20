import type { CampusEntity, CategorySlug } from "@/types";
import { dataByCategory } from "@/lib/data";

/**
 * CampusOS search engine.
 *
 * Deliberately dependency-free and framework-agnostic so it can be unit
 * tested on its own, reused server-side or client-side, and swapped for a
 * real DB/full-text-search query later without touching any UI code.
 */

export interface SearchResult {
  entity: CampusEntity;
  category: CategorySlug;
  /** Higher = more relevant. Used to sort within and across categories. */
  score: number;
  /** Which field matched, mainly useful for debugging/tuning. */
  matchedOn: string;
}

export interface GroupedSearchResults {
  query: string;
  totalCount: number;
  groups: { category: CategorySlug; results: SearchResult[] }[];
}

/** Resolves a department id to its name, for cross-referenced search fields below. */
function departmentName(id?: string): string {
  if (!id) return "";
  return (dataByCategory.departments.find((d) => d.id === id) as { name: string } | undefined)?.name ?? "";
}

/** Resolves building id -> the names of departments housed there. */
function departmentsInBuilding(buildingId: string): string {
  return dataByCategory.departments
    .filter((d) => (d as { buildingId?: string }).buildingId === buildingId)
    .map((d) => d.name)
    .join(" ");
}

/** Fields searched per entity type, in priority order (name always first). */
function searchableFields(entity: CampusEntity): { field: string; value: string; weight: number }[] {
  const fields: { field: string; value: string; weight: number }[] = [
    { field: "name", value: entity.name, weight: 10 },
  ];

  switch (entity.type) {
    case "building":
      fields.push(
        { field: "description", value: entity.description, weight: 3 },
        { field: "location", value: entity.location, weight: 4 },
        // So "electronics" also surfaces the building that houses the
        // Electronics department, per the product spec's example.
        { field: "departments housed here", value: departmentsInBuilding(entity.id), weight: 2 }
      );
      break;
    case "department":
      fields.push(
        { field: "school", value: entity.school, weight: 6 },
        { field: "description", value: entity.description, weight: 3 },
        { field: "location", value: entity.location, weight: 4 }
      );
      break;
    case "faculty":
      fields.push(
        { field: "designation", value: entity.designation, weight: 4 },
        { field: "subjects", value: (entity.subjects ?? []).join(" "), weight: 6 },
        { field: "researchInterests", value: (entity.researchInterests ?? []).join(" "), weight: 5 },
        // So "electronics" also surfaces faculty who belong to that
        // department, per the product spec's example.
        { field: "department", value: departmentName(entity.departmentId), weight: 4 }
      );
      break;
    case "lab":
      fields.push(
        { field: "description", value: entity.description, weight: 3 },
        { field: "equipment", value: (entity.equipment ?? []).join(" "), weight: 4 }
      );
      break;
    case "facility":
      fields.push(
        { field: "category", value: entity.category, weight: 6 },
        { field: "description", value: entity.description, weight: 3 },
        { field: "location", value: entity.location, weight: 4 }
      );
      break;
    case "office":
      fields.push(
        { field: "purpose", value: entity.purpose, weight: 5 },
        { field: "servicesProvided", value: entity.servicesProvided.join(" "), weight: 5 },
        { field: "location", value: entity.location, weight: 4 }
      );
      break;
  }

  return fields;
}

/**
 * Scores a single field match. Rewards, in order: exact match, "starts
 * with", then plain substring — so "electronics" ranks the Electronics
 * department above a facility that merely mentions electronics in passing.
 */
function scoreField(query: string, value: string, weight: number): number {
  const v = value.toLowerCase();
  const q = query.toLowerCase();
  if (!v.includes(q)) return 0;
  if (v === q) return weight * 3;
  if (v.startsWith(q)) return weight * 2;
  return weight;
}

function scoreEntity(entity: CampusEntity, category: CategorySlug, query: string): SearchResult | null {
  let best = { score: 0, matchedOn: "" };
  for (const { field, value, weight } of searchableFields(entity)) {
    if (!value) continue;
    const score = scoreField(query, value, weight);
    if (score > best.score) best = { score, matchedOn: field };
  }
  if (best.score === 0) return null;
  return { entity, category, score: best.score, matchedOn: best.matchedOn };
}

/**
 * Searches across all six categories (or a restricted set via `categories`).
 * Case-insensitive, partial-match ("electro" matches "Electronics").
 */
export function search(query: string, categories?: CategorySlug[]): SearchResult[] {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const categoriesToSearch = categories ?? (Object.keys(dataByCategory) as CategorySlug[]);
  const results: SearchResult[] = [];

  for (const category of categoriesToSearch) {
    for (const entity of dataByCategory[category]) {
      const result = scoreEntity(entity, category, trimmed);
      if (result) results.push(result);
    }
  }

  return results.sort((a, b) => b.score - a.score);
}

/** Same as `search`, but grouped by category for the results page. */
export function searchGrouped(query: string, categories?: CategorySlug[]): GroupedSearchResults {
  const flat = search(query, categories);

  const byCategory = new Map<CategorySlug, SearchResult[]>();
  for (const result of flat) {
    const list = byCategory.get(result.category) ?? [];
    list.push(result);
    byCategory.set(result.category, list);
  }

  // Preserve a stable, intentional category order (matches nav order)
  // rather than whatever order Map insertion happened to produce.
  const CATEGORY_ORDER: CategorySlug[] = [
    "departments",
    "labs",
    "faculty",
    "buildings",
    "facilities",
    "offices",
  ];

  const groups = CATEGORY_ORDER.filter((c) => byCategory.has(c)).map((category) => ({
    category,
    results: byCategory.get(category)!,
  }));

  return { query: query.trim(), totalCount: flat.length, groups };
}
