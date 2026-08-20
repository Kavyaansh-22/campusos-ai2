import type { Faculty } from "@/types";

/**
 * ⚠️ SAMPLE DATA — REPLACE WITH REAL MIT-WPU DATA
 * -------------------------------------------------
 * Names, designations, and contact details below are illustrative
 * placeholders, not real MIT-WPU faculty. Replace with verified public
 * faculty directory info and set `isSampleData: false`. Only include
 * contact info that faculty have made publicly available.
 */
export const faculty: Faculty[] = [
  {
    id: "faculty-001",
    name: "Dr. Aditi Kulkarni",
    type: "faculty",
    departmentId: "dept-001",
    designation: "Professor & Head of Department",
    subjects: ["Digital Signal Processing", "VLSI Design"],
    officeLocation: "Block A, Room 208",
    researchInterests: ["Embedded Systems", "IoT"],
    isSampleData: true,
  },
  {
    id: "faculty-002",
    name: "Dr. Rohan Deshpande",
    type: "faculty",
    departmentId: "dept-002",
    designation: "Associate Professor",
    subjects: ["Artificial Intelligence", "Data Structures"],
    officeLocation: "Block A, Room 305",
    researchInterests: ["Machine Learning", "Computer Vision"],
    isSampleData: true,
  },
  {
    id: "faculty-003",
    name: "Dr. Neha Joshi",
    type: "faculty",
    departmentId: "dept-001",
    designation: "Assistant Professor",
    subjects: ["Analog Circuits", "Signals & Systems"],
    officeLocation: "Block A, Room 206",
    isSampleData: true,
  },
  {
    id: "faculty-004",
    name: "Dr. Sanjay Patil",
    type: "faculty",
    departmentId: "dept-004",
    designation: "Professor",
    subjects: ["Thermodynamics", "Manufacturing Processes"],
    officeLocation: "Block A, Room 104",
    isSampleData: true,
  },
  {
    id: "faculty-005",
    name: "Ar. Priya Menon",
    type: "faculty",
    departmentId: "dept-003",
    designation: "Assistant Professor",
    subjects: ["Design Studio", "Human-Centred Design"],
    officeLocation: "Block B, Room 112",
    isSampleData: true,
  },
  {
    id: "faculty-006",
    name: "Dr. Vikram Rao",
    type: "faculty",
    departmentId: "dept-005",
    designation: "Professor",
    subjects: ["Business Analytics", "Entrepreneurship"],
    officeLocation: "Block B, Room 210",
    isSampleData: true,
  },
];
