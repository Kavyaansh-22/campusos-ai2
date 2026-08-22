import type { CampusEntity, CategorySlug, Department, Building } from "@/types";
import { getById } from "@/lib/data";

export function entityHref(category: CategorySlug, id: string): string {
  return `/${category}/${id}`;
}

export async function entitySubtitle(entity: CampusEntity): Promise<string> {
  switch (entity.type) {
    case "building":
      return entity.description;
    case "department":
      return entity.school;
    case "faculty": {
      const dept = await getById("departments", entity.departmentId) as Department | undefined;
      return [entity.designation, dept?.name].filter(Boolean).join(" · ");
    }
    case "lab": {
      const dept = await getById("departments", entity.departmentId) as Department | undefined;
      return dept?.name ?? "";
    }
    case "facility":
      return entity.category;
    case "office":
      return entity.purpose;
  }
}

export async function entityLocationLine(entity: CampusEntity): Promise<string | undefined> {
  switch (entity.type) {
    case "building":
      return entity.location;
    case "department":
      return entity.location;
    case "faculty":
      return entity.officeLocation;
    case "lab": {
      const building = await getById("buildings", entity.buildingId) as Building | undefined;
      return [building?.name, entity.floor, entity.room ? `Room ${entity.room}` : undefined]
        .filter(Boolean)
        .join(", ");
    }
    case "facility":
      return entity.location;
    case "office":
      return entity.location;
  }
}

export function entityIntro(entity: CampusEntity): string | undefined {
  switch (entity.type) {
    case "building":
    case "department":
    case "lab":
    case "facility":
      return entity.description;
    case "office":
      return entity.purpose;
    case "faculty":
      return undefined;
  }
}

export interface DetailField {
  label: string;
  value: string;
  href?: string;
}

export async function buildDetailFields(entity: CampusEntity): Promise<DetailField[]> {
  const fields: DetailField[] = [];

  switch (entity.type) {
    case "building": {
      fields.push({ label: "Location", value: entity.location });
      if (entity.address) fields.push({ label: "Address", value: entity.address });
      if (entity.floors) fields.push({ label: "Floors", value: String(entity.floors) });
      break;
    }
    case "department": {
      const building = await getById("buildings", entity.buildingId ?? "") as Building | undefined;
      fields.push({ label: "School", value: entity.school });
      fields.push({ label: "Location", value: entity.location });
      if (building) fields.push({ label: "Building", value: building.name, href: `/buildings/${building.id}` });
      if (entity.contact?.email) fields.push({ label: "Email", value: entity.contact.email });
      if (entity.contact?.phone) fields.push({ label: "Phone", value: entity.contact.phone });
      break;
    }
    case "faculty": {
      const dept = await getById("departments", entity.departmentId) as Department | undefined;
      if (dept) fields.push({ label: "Department", value: dept.name, href: `/departments/${dept.id}` });
      fields.push({ label: "Designation", value: entity.designation });
      if (entity.subjects?.length) fields.push({ label: "Subjects", value: entity.subjects.join(", ") });
      if (entity.officeLocation) fields.push({ label: "Office Location", value: entity.officeLocation });
      if (entity.researchInterests?.length)
        fields.push({ label: "Research Interests", value: entity.researchInterests.join(", ") });
      if (entity.contact?.email) fields.push({ label: "Email", value: entity.contact.email });
      if (entity.contact?.phone) fields.push({ label: "Phone", value: entity.contact.phone });
      break;
    }
    case "lab": {
      const dept = await getById("departments", entity.departmentId) as Department | undefined;
      const building = await getById("buildings", entity.buildingId) as Building | undefined;
      if (dept) fields.push({ label: "Department", value: dept.name, href: `/departments/${dept.id}` });
      if (building) fields.push({ label: "Building", value: building.name, href: `/buildings/${building.id}` });
      if (entity.floor) fields.push({ label: "Floor", value: entity.floor });
      if (entity.room) fields.push({ label: "Room", value: entity.room });
      if (entity.equipment?.length) fields.push({ label: "Equipment", value: entity.equipment.join(", ") });
      break;
    }
    case "facility": {
      const building = await getById("buildings", entity.buildingId ?? "") as Building | undefined;
      fields.push({ label: "Category", value: entity.category });
      fields.push({ label: "Location", value: entity.location });
      if (building) fields.push({ label: "Building", value: building.name, href: `/buildings/${building.id}` });
      if (entity.timings) fields.push({ label: "Timings", value: entity.timings });
      if (entity.contact?.email) fields.push({ label: "Email", value: entity.contact.email });
      if (entity.contact?.phone) fields.push({ label: "Phone", value: entity.contact.phone });
      break;
    }
    case "office": {
      const building = await getById("buildings", entity.buildingId ?? "") as Building | undefined;
      fields.push({ label: "Location", value: entity.location });
      if (building) fields.push({ label: "Building", value: building.name, href: `/buildings/${building.id}` });
      if (entity.timings) fields.push({ label: "Timings", value: entity.timings });
      if (entity.servicesProvided?.length)
        fields.push({ label: "Services Provided", value: entity.servicesProvided.join(", ") });
      if (entity.contact?.email) fields.push({ label: "Email", value: entity.contact.email });
      if (entity.contact?.phone) fields.push({ label: "Phone", value: entity.contact.phone });
      break;
    }
  }

  return fields;
}