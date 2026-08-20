import type { Department } from "@/types";

/**
 * ⚠️ SAMPLE DATA — REPLACE WITH REAL MIT-WPU DATA
 * -------------------------------------------------
 * School names, HOD details, and contact info are placeholders. Replace
 * with verified MIT-WPU department info and set `isSampleData: false`.
 */
export const departments: Department[] = [
  {
    id: "dept-001",
    name: "Electronics & Telecommunication Engineering",
    type: "department",
    school: "School of Engineering",
    description:
      "Offers undergraduate and postgraduate programs in electronics, communication systems, and embedded design.",
    location: "Block A, 2nd Floor",
    buildingId: "building-001",
    facultyIds: ["faculty-001", "faculty-003"],
    labIds: ["lab-001", "lab-002"],
    contact: { email: "entc@mitwpu.example.edu" }, // TODO: verify real contact
    isSampleData: true,
  },
  {
    id: "dept-002",
    name: "Computer Science & Engineering",
    type: "department",
    school: "School of Engineering",
    description:
      "Focuses on software engineering, AI/ML, and data science, with strong industry-linked electives.",
    location: "Block A, 3rd Floor",
    buildingId: "building-001",
    facultyIds: ["faculty-002"],
    labIds: ["lab-003"],
    contact: { email: "cse@mitwpu.example.edu" },
    isSampleData: true,
  },
  {
    id: "dept-003",
    name: "School of Design",
    type: "department",
    school: "School of Design",
    description: "Undergraduate design programs spanning product, communication, and UX design.",
    location: "Block B, 1st Floor",
    buildingId: "building-002",
    facultyIds: ["faculty-005"],
    labIds: ["lab-005"],
    isSampleData: true,
  },
  {
    id: "dept-004",
    name: "Mechanical Engineering",
    type: "department",
    school: "School of Engineering",
    description: "Covers thermal, design, and manufacturing streams with a dedicated CAD/CAM lab.",
    location: "Block A, 1st Floor",
    buildingId: "building-001",
    facultyIds: ["faculty-004"],
    labIds: ["lab-004"],
    isSampleData: true,
  },
  {
    id: "dept-005",
    name: "School of Management",
    type: "department",
    school: "School of Management",
    description: "BBA and MBA programs with a focus on entrepreneurship and analytics.",
    location: "Block B, 2nd Floor",
    buildingId: "building-002",
    facultyIds: ["faculty-006"],
    labIds: [],
    isSampleData: true,
  },
];
