import { pool } from "@/lib/db";
import type { 
  CampusEntity, 
  CategorySlug, 
  Building, 
  Department, 
  Faculty, 
  Lab, 
  Facility, 
  Office 
} from "@/types";

// Helper to safely parse comma-separated strings into arrays for our UI
const parseList = (str?: string | null) => (str ? str.split(",").map((s) => s.trim()) : []);

export async function fetchAllData(): Promise<Record<CategorySlug, CampusEntity[]>> {
  // 1. Fetch all tables from MySQL concurrently
  const [bRows] = await pool.query<any[]>("SELECT * FROM buildings");
  const [dRows] = await pool.query<any[]>("SELECT * FROM departments");
  const [fRows] = await pool.query<any[]>("SELECT * FROM faculty");
  const [lRows] = await pool.query<any[]>("SELECT * FROM labs");
  const [facRows] = await pool.query<any[]>("SELECT * FROM facilities");
  const [oRows] = await pool.query<any[]>("SELECT * FROM offices");

  // 2. Map Buildings
  const buildings: Building[] = bRows.map((b) => ({
    id: String(b.id),
    type: "building",
    name: b.name,
    description: b.description || "",
    location: b.location || "",
    address: b.address || "",
    floors: b.floors || undefined,
    // Map relations: Find departments that mention this building's name in their location
    departmentIds: dRows.filter((d) => d.location === b.name).map((d) => String(d.id)),
    facilityIds: facRows.filter((f) => f.building_id === b.id).map((f) => String(f.id)),
    isSampleData: false,
  }));

  // 3. Map Departments
  const departments: Department[] = dRows.map((d) => {
    const matchedBuilding = buildings.find((b) => b.name === d.location);
    return {
      id: String(d.id),
      type: "department",
      name: d.name,
      school: d.school || "",
      description: d.description || "",
      location: d.location || "",
      buildingId: matchedBuilding?.id,
      facultyIds: fRows.filter((f) => f.department_id === d.id).map((f) => String(f.id)),
      labIds: lRows.filter((l) => l.department_id === d.id).map((l) => String(l.id)),
      contact: { email: d.contact_email || undefined, phone: d.contact_phone || undefined },
      isSampleData: false,
    };
  });

  // 4. Map Faculty
  const faculty: Faculty[] = fRows.map((f) => ({
    id: String(f.id),
    type: "faculty",
    name: f.name,
    departmentId: String(f.department_id),
    designation: f.designation || "",
    subjects: parseList(f.subjects),
    officeLocation: f.office_location || "",
    contact: { email: f.email || undefined },
    researchInterests: parseList(f.research_interests),
    isSampleData: false,
  }));

  // 5. Map Labs
  const labs: Lab[] = lRows.map((l) => ({
    id: String(l.id),
    type: "lab",
    name: l.name,
    departmentId: String(l.department_id),
    buildingId: String(l.building_id),
    floor: l.floor ? `${l.floor} Floor` : undefined,
    room: l.room_number || "",
    description: l.description || "",
    equipment: parseList(l.equipment),
    isSampleData: false,
  }));

  // 6. Map Facilities
  const facilities: Facility[] = facRows.map((f) => ({
    id: String(f.id),
    type: "facility",
    name: f.name,
    category: f.category || "",
    location: f.location || "",
    buildingId: String(f.building_id),
    timings: f.timings || "",
    description: f.description || "",
    // Basic catch to sort email vs phone
    contact: { 
      email: f.contact?.includes('@') ? f.contact : undefined, 
      phone: f.contact && !f.contact.includes('@') ? f.contact : undefined 
    },
    isSampleData: false,
  }));

  // 7. Map Offices
  const offices: Office[] = oRows.map((o) => ({
    id: String(o.id),
    type: "office",
    name: o.name,
    purpose: o.purpose || "",
    location: o.location || "",
    buildingId: String(o.building_id),
    timings: o.timings || "",
    contact: { email: o.contact_email || undefined, phone: o.contact_phone || undefined },
    servicesProvided: parseList(o.services),
    isSampleData: false,
  }));

  return { buildings, departments, faculty, labs, facilities, offices };
}

// Exported async helpers that the rest of our app will use
export async function getAll<T extends CampusEntity>(category: CategorySlug): Promise<T[]> {
  const data = await fetchAllData();
  return data[category] as T[];
}

export async function getById(category: CategorySlug, id: string): Promise<CampusEntity | undefined> {
  const data = await fetchAllData();
  return data[category].find((item) => item.id === id);
}

export async function getAllEntities(): Promise<CampusEntity[]> {
  const data = await fetchAllData();
  return Object.values(data).flat();
}