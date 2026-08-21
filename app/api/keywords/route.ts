import { NextResponse } from "next/server";
import pool from "@/lib/db";

// GET /api/keywords - Fetch all master keywords from PostgreSQL master_keyword
export async function GET() {
  try {
    const result = await pool.query("SELECT * FROM master_keyword ORDER BY id DESC;");
    return NextResponse.json({ success: true, data: result.rows });
  } catch (error: unknown) {
    console.error("GET Keywords Error:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message || "Failed to fetch master keywords" },
      { status: 500 }
    );
  }
}

// POST /api/keywords - Add new master keyword to master_keyword table
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { keyword, kategoriTransaksi, tipeTransaksi } = body;

    if (!keyword) {
      return NextResponse.json(
        { success: false, error: "Keyword tidak boleh kosong." },
        { status: 400 }
      );
    }

    const tipeVal = tipeTransaksi || kategoriTransaksi || "Non-Allowable Cost (NAC)";

    const result = await pool.query(
      `INSERT INTO master_keyword (keyword, tipe_transaksi)
       VALUES ($1, $2)
       RETURNING *;`,
      [keyword.trim(), tipeVal.trim()]
    );

    return NextResponse.json({ success: true, data: result.rows[0] }, { status: 201 });
  } catch (error: unknown) {
    console.error("POST Keyword Error:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message || "Failed to save master keyword" },
      { status: 500 }
    );
  }
}

