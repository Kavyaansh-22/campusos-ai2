import type { Office } from "@/types";

/**
 * ⚠️ SAMPLE DATA — REPLACE WITH REAL MIT-WPU DATA
 * -------------------------------------------------
 * Locations, timings, and contact info are placeholders. Replace with
 * verified MIT-WPU administrative office info and set
 * `isSampleData: false`.
 */
export const offices: Office[] = [
  {
    id: "office-001",
    name: "Admissions Office",
    type: "office",
    purpose: "Handles undergraduate and postgraduate admissions enquiries.",
    location: "Block B, Ground Floor",
    buildingId: "building-002",
    timings: "9:30 AM – 5:30 PM, Mon–Sat", // TODO: verify real timings
    servicesProvided: ["Admission enquiries", "Document verification", "Fee structure info"],
    isSampleData: true,
  },
  {
    id: "office-002",
    name: "Examination Office",
    type: "office",
    purpose: "Manages exam schedules, hall tickets, and results.",
    location: "Block A, Ground Floor",
    buildingId: "building-001",
    timings: "9:30 AM – 5:00 PM, Mon–Fri",
    servicesProvided: ["Hall ticket issues", "Revaluation requests", "Transcript requests"],
    isSampleData: true,
  },
  {
    id: "office-003",
    name: "Student Affairs Office",
    type: "office",
    purpose: "Point of contact for student welfare, discipline, and general support.",
    location: "Block B, 1st Floor",
    buildingId: "building-002",
    servicesProvided: ["Grievance redressal", "ID card issues", "General student support"],
    isSampleData: true,
  },
  {
    id: "office-004",
    name: "Scholarship & Financial Aid Office",
    type: "office",
    purpose: "Handles scholarship applications and financial aid queries.",
    location: "Block B, Ground Floor",
    buildingId: "building-002",
    servicesProvided: ["Scholarship applications", "Fee waiver queries"],
    isSampleData: true,
  },
  {
    id: "office-005",
    name: "International Relations Office",
    type: "office",
    purpose: "Supports international students and outbound exchange programs.",
    location: "Block B, 2nd Floor",
    buildingId: "building-002",
    servicesProvided: ["Visa support", "Exchange program info", "International student onboarding"],
    isSampleData: true,
  },
];
