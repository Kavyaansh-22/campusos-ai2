import type { CampusEntity, CategorySlug } from "@/types";
import { fetchAllData } from "@/lib/data";

export interface SearchResult {
  entity: CampusEntity;
  category: CategorySlug;
  score: number;
  matchedOn: string;
}

export interface GroupedSearchResults {
  query: string;
  totalCount: number;
  groups: { category: CategorySlug; results: SearchResult[] }[];
}

function departmentName(dataByCategory: Record<CategorySlug, CampusEntity[]>, id?: string): string {
  if (!id) return "";
  return (dataByCategory.departments.find((d) => d.id === id) as { name: string } | undefined)?.name ?? "";
}

function departmentsInBuilding(dataByCategory: Record<CategorySlug, CampusEntity[]>, buildingId: string): string {
  return dataByCategory.departments
    .filter((d) => (d as { buildingId?: string }).buildingId === buildingId)
    .map((d) => d.name)
    .join(" ");
}

function searchableFields(dataByCategory: Record<CategorySlug, CampusEntity[]>, entity: CampusEntity): { field: string; value: string; weight: number }[] {
  const fields: { field: string; value: string; weight: number }[] = [
    { field: "name", value: entity.name, weight: 10 },
  ];

  switch (entity.type) {
    case "building":
      fields.push(
        { field: "description", value: entity.description, weight: 3 },
        { field: "location", value: entity.location, weight: 4 },
        { field: "departments housed here", value: departmentsInBuilding(dataByCategory, entity.id), weight: 2 }
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
        { field: "department", value: departmentName(dataByCategory, entity.departmentId), weight: 4 }
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

function scoreField(query: string, value: string, weight: number): number {
  const v = value.toLowerCase();
  const q = query.toLowerCase();
  if (!v.includes(q)) return 0;
  if (v === q) return weight * 3;
  if (v.startsWith(q)) return weight * 2;
  return weight;
}

function scoreEntity(dataByCategory: Record<CategorySlug, CampusEntity[]>, entity: CampusEntity, category: CategorySlug, query: string): SearchResult | null {
  let best = { score: 0, matchedOn: "" };
  for (const { field, value, weight } of searchableFields(dataByCategory, entity)) {
    if (!value) continue;
    const score = scoreField(query, value, weight);
    if (score > best.score) best = { score, matchedOn: field };
  }
  if (best.score === 0) return null;
  return { entity, category, score: best.score, matchedOn: best.matchedOn };
}

// These are now async so they can await the live database connection
export async function search(query: string, categories?: CategorySlug[]): Promise<SearchResult[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const dataByCategory = await fetchAllData();
  const categoriesToSearch = categories ?? (Object.keys(dataByCategory) as CategorySlug[]);
  const results: SearchResult[] = [];

  for (const category of categoriesToSearch) {
    for (const entity of dataByCategory[category]) {
      const result = scoreEntity(dataByCategory, entity, category, trimmed);
      if (result) results.push(result);
    }
  }

  return results.sort((a, b) => b.score - a.score);
}

export async function searchGrouped(query: string, categories?: CategorySlug[]): Promise<GroupedSearchResults> {
  const flat = await search(query, categories);

  const byCategory = new Map<CategorySlug, SearchResult[]>();
  for (const result of flat) {
    const list = byCategory.get(result.category) ?? [];
    list.push(result);
    byCategory.set(result.category, list);
  }

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