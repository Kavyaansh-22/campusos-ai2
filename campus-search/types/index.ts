/**
 * CampusOS shared entity types.
 *
 * Every entity carries `isSampleData`. Anything still `true` when real
 * MIT-WPU data is available should be replaced — see each file in /data
 * for exactly where. Keeping this flag (rather than deleting it once
 * replaced) also gives the future admin panel / AI assistant a cheap way
 * to flag "unverified" info to a student.
 */

export type CategorySlug =
  | "buildings"
  | "departments"
  | "faculty"
  | "labs"
  | "facilities"
  | "offices";

interface BaseEntity {
  id: string;
  name: string;
  /** True until real, verified MIT-WPU data replaces this record. */
  isSampleData: boolean;
}

export interface ContactInfo {
  email?: string;
  phone?: string;
}

export interface Building extends BaseEntity {
  type: "building";
  description: string;
  location: string;
  address?: string;
  floors?: number;
  departmentIds: string[];
  facilityIds: string[];
}

export interface Department extends BaseEntity {
  type: "department";
  school: string;
  description: string;
  location: string;
  buildingId?: string;
  facultyIds: string[];
  labIds: string[];
  contact?: ContactInfo;
}

export interface Faculty extends BaseEntity {
  type: "faculty";
  departmentId: string;
  designation: string;
  subjects?: string[];
  officeLocation?: string;
  contact?: ContactInfo;
  researchInterests?: string[];
}

export interface Lab extends BaseEntity {
  type: "lab";
  departmentId: string;
  buildingId: string;
  floor?: string;
  room?: string;
  description: string;
  equipment?: string[];
}

export interface Facility extends BaseEntity {
  type: "facility";
  category: string;
  location: string;
  buildingId?: string;
  timings?: string;
  description: string;
  contact?: ContactInfo;
}

export interface Office extends BaseEntity {
  type: "office";
  purpose: string;
  location: string;
  buildingId?: string;
  timings?: string;
  contact?: ContactInfo;
  servicesProvided: string[];
}

export type CampusEntity = Building | Department | Faculty | Lab | Facility | Office;
