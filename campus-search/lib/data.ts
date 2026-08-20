import type { CampusEntity, CategorySlug } from "@/types";
import { buildings } from "@/data/buildings";
import { departments } from "@/data/departments";
import { faculty } from "@/data/faculty";
import { labs } from "@/data/labs";
import { facilities } from "@/data/facilities";
import { offices } from "@/data/offices";

/**
 * Single point every other module reads campus data through.
 *
 * Today this just re-exports the in-memory arrays from /data/*.ts.
 * When CampusOS moves to Postgres, only this file (and the /data files
 * it imports) need to change — everything downstream (search, pages,
 * components) keeps working against the same shapes and functions.
 */

export const dataByCategory: Record<CategorySlug, CampusEntity[]> = {
  buildings,
  departments,
  faculty,
  labs,
  facilities,
  offices,
};

export function getAll<T extends CampusEntity>(category: CategorySlug): T[] {
  return dataByCategory[category] as T[];
}

export function getById(category: CategorySlug, id: string): CampusEntity | undefined {
  return dataByCategory[category].find((item) => item.id === id);
}

export function getAllEntities(): CampusEntity[] {
  return Object.values(dataByCategory).flat();
}
