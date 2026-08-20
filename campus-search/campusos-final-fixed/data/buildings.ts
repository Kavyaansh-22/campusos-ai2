import type { Building } from "@/types";

/**
 * ⚠️ SAMPLE DATA — REPLACE WITH REAL MIT-WPU DATA
 * -------------------------------------------------
 * Verified building names, addresses, floor counts, and department/facility
 * placement were not available at build time. Everything below is a
 * plausible placeholder so the search + UI can be fully exercised.
 *
 * To insert real data: replace the objects in this array (keep the `id`
 * values stable if other files already reference them, or update the
 * cross-references in departments.ts / labs.ts / facilities.ts to match).
 * Set `isSampleData: false` once a record is verified.
 *
 * Migrating to Postgres later: this array becomes the seed/rows for a
 * `buildings` table with the same column names.
 */
export const buildings: Building[] = [
  {
    id: "building-001",
    name: "Block A — Engineering Block",
    type: "building",
    description:
      "Primary academic block housing Engineering departments, core labs, and lecture theatres.",
    location: "MIT-WPU Kothrud Campus",
    address: "Paud Road, Kothrud, Pune", // TODO: verify exact address
    floors: 4,
    departmentIds: ["dept-001", "dept-002", "dept-004"],
    facilityIds: [],
    isSampleData: true,
  },
  {
    id: "building-002",
    name: "Block B — Design & Management Block",
    type: "building",
    description:
      "Houses the School of Design and School of Management, along with the main cafeteria.",
    location: "MIT-WPU Kothrud Campus",
    address: "Paud Road, Kothrud, Pune",
    floors: 3,
    departmentIds: ["dept-003", "dept-005"],
    facilityIds: ["facility-002"],
    isSampleData: true,
  },
  {
    id: "building-003",
    name: "Central Library Building",
    type: "building",
    description: "Standalone building housing the central library and quiet study areas.",
    location: "MIT-WPU Kothrud Campus",
    floors: 2,
    departmentIds: [],
    facilityIds: ["facility-001", "facility-006"],
    isSampleData: true,
  },
  {
    id: "building-004",
    name: "Sports & Recreation Complex",
    type: "building",
    description: "Indoor and outdoor sports facilities, gymnasium, and the health centre.",
    location: "MIT-WPU Kothrud Campus",
    floors: 1,
    departmentIds: [],
    facilityIds: ["facility-003", "facility-004"],
    isSampleData: true,
  },
];
