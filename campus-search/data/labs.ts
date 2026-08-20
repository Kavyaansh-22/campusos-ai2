import type { Lab } from "@/types";

/**
 * ⚠️ SAMPLE DATA — REPLACE WITH REAL MIT-WPU DATA
 * -------------------------------------------------
 * Room numbers and equipment lists are placeholders. Replace with
 * verified lab info and set `isSampleData: false`. Per the product spec,
 * live availability/booking is intentionally NOT implemented yet.
 */
export const labs: Lab[] = [
  {
    id: "lab-001",
    name: "Electronics Lab I",
    type: "lab",
    departmentId: "dept-001",
    buildingId: "building-001",
    floor: "2nd Floor",
    room: "204",
    description: "Core electronics lab for circuit design and analog experiments.",
    equipment: ["Oscilloscopes", "Function generators", "Breadboarding stations"],
    isSampleData: true,
  },
  {
    id: "lab-002",
    name: "VLSI & Embedded Systems Lab",
    type: "lab",
    departmentId: "dept-001",
    buildingId: "building-001",
    floor: "2nd Floor",
    room: "210",
    description: "Used for VLSI design coursework and embedded systems projects.",
    equipment: ["FPGA boards", "Microcontroller kits"],
    isSampleData: true,
  },
  {
    id: "lab-003",
    name: "AI & Data Science Lab",
    type: "lab",
    departmentId: "dept-002",
    buildingId: "building-001",
    floor: "3rd Floor",
    room: "301",
    description: "GPU-equipped lab for machine learning and data science coursework.",
    equipment: ["GPU workstations"],
    isSampleData: true,
  },
  {
    id: "lab-004",
    name: "CAD/CAM Lab",
    type: "lab",
    departmentId: "dept-004",
    buildingId: "building-001",
    floor: "1st Floor",
    room: "102",
    description: "Computer-aided design and manufacturing lab for mechanical engineering.",
    equipment: ["CAD workstations", "3D printer"],
    isSampleData: true,
  },
  {
    id: "lab-005",
    name: "Design Studio",
    type: "lab",
    departmentId: "dept-003",
    buildingId: "building-002",
    floor: "1st Floor",
    room: "115",
    description: "Open studio space for design coursework, model-making, and critiques.",
    isSampleData: true,
  },
];
