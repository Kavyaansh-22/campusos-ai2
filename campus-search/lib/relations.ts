import type { CampusEntity, CategorySlug } from "@/types";
import { getById } from "@/lib/data";

export interface RelatedGroup {
  label: string;
  category: CategorySlug;
  entities: CampusEntity[];
}

/**
 * Only Building and Department have child collections worth listing as
 * cards (per the product spec's field lists in section 6). Faculty, Lab,
 * Facility, and Office instead link to their single parent, which is
 * already handled as a linked row in `buildDetailFields`.
 */
export function getRelatedGroups(entity: CampusEntity): RelatedGroup[] {
  const groups: RelatedGroup[] = [];

  if (entity.type === "building") {
    const departments = entity.departmentIds
      .map((id) => getById("departments", id))
      .filter((e): e is CampusEntity => Boolean(e));
    const facilities = entity.facilityIds
      .map((id) => getById("facilities", id))
      .filter((e): e is CampusEntity => Boolean(e));
    if (departments.length) groups.push({ label: "Departments", category: "departments", entities: departments });
    if (facilities.length) groups.push({ label: "Facilities", category: "facilities", entities: facilities });
  }

  if (entity.type === "department") {
    const facultyList = entity.facultyIds
      .map((id) => getById("faculty", id))
      .filter((e): e is CampusEntity => Boolean(e));
    const labs = entity.labIds
      .map((id) => getById("labs", id))
      .filter((e): e is CampusEntity => Boolean(e));
    if (facultyList.length) groups.push({ label: "Faculty", category: "faculty", entities: facultyList });
    if (labs.length) groups.push({ label: "Labs", category: "labs", entities: labs });
  }

  return groups;
}
