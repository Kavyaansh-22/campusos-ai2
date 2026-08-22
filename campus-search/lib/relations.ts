import type { CampusEntity, CategorySlug } from "@/types";
import { getById } from "@/lib/data";

export interface RelatedGroup {
  label: string;
  category: CategorySlug;
  entities: CampusEntity[];
}

export async function getRelatedGroups(entity: CampusEntity): Promise<RelatedGroup[]> {
  const groups: RelatedGroup[] = [];

  if (entity.type === "building") {
    const departments = (await Promise.all(entity.departmentIds.map((id) => getById("departments", id)))).filter((e): e is CampusEntity => Boolean(e));
    const facilities = (await Promise.all(entity.facilityIds.map((id) => getById("facilities", id)))).filter((e): e is CampusEntity => Boolean(e));
    if (departments.length) groups.push({ label: "Departments", category: "departments", entities: departments });
    if (facilities.length) groups.push({ label: "Facilities", category: "facilities", entities: facilities });
  }

  if (entity.type === "department") {
    const facultyList = (await Promise.all(entity.facultyIds.map((id) => getById("faculty", id)))).filter((e): e is CampusEntity => Boolean(e));
    const labs = (await Promise.all(entity.labIds.map((id) => getById("labs", id)))).filter((e): e is CampusEntity => Boolean(e));
    if (facultyList.length) groups.push({ label: "Faculty", category: "faculty", entities: facultyList });
    if (labs.length) groups.push({ label: "Labs", category: "labs", entities: labs });
  }

  return groups;
}