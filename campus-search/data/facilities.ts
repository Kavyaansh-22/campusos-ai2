import type { Facility } from "@/types";

/**
 * ⚠️ SAMPLE DATA — REPLACE WITH REAL MIT-WPU DATA
 * -------------------------------------------------
 * Timings and contact info are placeholders. Replace with verified
 * MIT-WPU facility info and set `isSampleData: false`.
 */
export const facilities: Facility[] = [
  {
    id: "facility-001",
    name: "Central Library",
    type: "facility",
    category: "Library",
    location: "Central Library Building",
    buildingId: "building-003",
    timings: "8:00 AM – 8:00 PM, Mon–Sat", // TODO: verify real timings
    description: "Main campus library with reading halls, journals, and digital resources.",
    isSampleData: true,
  },
  {
    id: "facility-002",
    name: "Main Cafeteria",
    type: "facility",
    category: "Dining",
    location: "Block B, Ground Floor",
    buildingId: "building-002",
    timings: "8:00 AM – 6:00 PM",
    description: "Primary student dining space serving breakfast, lunch, and snacks.",
    isSampleData: true,
  },
  {
    id: "facility-003",
    name: "Sports Complex",
    type: "facility",
    category: "Sports",
    location: "Sports & Recreation Complex",
    buildingId: "building-004",
    description: "Indoor courts, gymnasium, and outdoor grounds for student sports.",
    isSampleData: true,
  },
  {
    id: "facility-004",
    name: "Health Centre",
    type: "facility",
    category: "Medical",
    location: "Sports & Recreation Complex, Ground Floor",
    buildingId: "building-004",
    timings: "9:00 AM – 5:00 PM",
    description: "On-campus first-aid and basic medical support for students and staff.",
    isSampleData: true,
  },
  {
    id: "facility-005",
    name: "Printing & Xerox Centre",
    type: "facility",
    category: "Printing",
    location: "Block A, Ground Floor",
    buildingId: "building-001",
    description: "Printing, photocopying, and binding services for coursework.",
    isSampleData: true,
  },
  {
    id: "facility-006",
    name: "Common Study Area",
    type: "facility",
    category: "Study Space",
    location: "Central Library Building, 2nd Floor",
    buildingId: "building-003",
    description: "Wi-Fi enabled quiet study area adjoining the library.",
    isSampleData: true,
  },
];
