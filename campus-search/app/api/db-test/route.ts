import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await pool.query("SELECT 1 + 1 AS result");
    return NextResponse.json({ status: "Success!", data: rows });
  } catch (error) {
    console.error("Database connection failed:", error);
    return NextResponse.json({ status: "Error", error: String(error) }, { status: 500 });
  }
}