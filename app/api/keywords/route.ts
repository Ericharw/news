import { NextResponse } from "next/server";
import pool from "@/lib/db";

// Default seed keywords if table is empty
const INITIAL_KEYWORDS = [
  { keyword: "Laundry", kategori: "Fasilitas Perorangan (Non-Allowable)" },
  { keyword: "LAUNDRY", kategori: "Fasilitas Perorangan (Non-Allowable)" },
  { keyword: "Wisata", kategori: "Rekreasi / Non-Allowable" },
  { keyword: "Rekreasi", kategori: "Rekreasi / Non-Allowable" },
  { keyword: "Golf", kategori: "Olahraga Pribadi / Non-Allowable" },
  { keyword: "Souvenir", kategori: "Hadiah / Non-Allowable" },
  { keyword: "Entertainment", kategori: "Hiburan / Non-Allowable" },
  { keyword: "Personal", kategori: "Pengeluaran Pribadi" },
  { keyword: "Purnabakti", kategori: "Jasa Duka / Hadiah" },
];

export async function ensureKeywordTable() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS master_keywords (
        id SERIAL PRIMARY KEY,
        keyword VARCHAR(255) NOT NULL UNIQUE,
        kategori_transaksi VARCHAR(255) DEFAULT 'Non-Allowable Cost',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const countRes = await client.query("SELECT COUNT(*) FROM master_keywords;");
    if (parseInt(countRes.rows[0].count, 10) === 0) {
      for (const item of INITIAL_KEYWORDS) {
        await client.query(
          "INSERT INTO master_keywords (keyword, kategori_transaksi) VALUES ($1, $2) ON CONFLICT DO NOTHING;",
          [item.keyword, item.kategori]
        );
      }
    }
  } finally {
    client.release();
  }
}

// GET /api/keywords - Fetch all master keywords
export async function GET() {
  try {
    await ensureKeywordTable();
    const result = await pool.query("SELECT * FROM master_keywords ORDER BY id ASC;");
    return NextResponse.json({ success: true, data: result.rows });
  } catch (error: unknown) {
    console.error("GET Keywords Error:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message || "Failed to fetch master keywords" },
      { status: 500 }
    );
  }
}

// POST /api/keywords - Add new master keyword
export async function POST(request: Request) {
  try {
    await ensureKeywordTable();
    const body = await request.json();
    const { keyword, kategoriTransaksi } = body;

    if (!keyword) {
      return NextResponse.json(
        { success: false, error: "Keyword tidak boleh kosong." },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `INSERT INTO master_keywords (keyword, kategori_transaksi)
       VALUES ($1, $2)
       ON CONFLICT (keyword) DO UPDATE SET kategori_transaksi = EXCLUDED.kategori_transaksi
       RETURNING *;`,
      [keyword.trim(), kategoriTransaksi || "Non-Allowable Cost"]
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
