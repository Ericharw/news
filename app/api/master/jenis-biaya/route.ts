import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { MasterJenisBiayaItem } from "@/types/activity";

let memoryJenisBiaya: MasterJenisBiayaItem[] = [];

// GET /api/master/jenis-biaya - Fetch all master jenis biaya from PostgreSQL
export async function GET() {
  try {
    const result = await pool.query("SELECT * FROM master_jenis_biaya ORDER BY id DESC;");
    const items: MasterJenisBiayaItem[] = result.rows.map((row) => ({
      id: row.id,
      nama: row.jenis_biaya || row.nama || "",
      keterangan: row.singkatan || row.keterangan || "",
    }));
    memoryJenisBiaya = items;
    return NextResponse.json({ success: true, data: items });
  } catch (error: unknown) {
    console.warn("GET Master Jenis Biaya warning, operating in memory fallback mode:", (error as Error).message);
    return NextResponse.json({ success: true, data: memoryJenisBiaya });
  }
}

// POST /api/master/jenis-biaya - Add new master jenis biaya
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nama, keterangan } = body;

    if (!nama) {
      return NextResponse.json(
        { success: false, error: "Nama Jenis Biaya tidak boleh kosong." },
        { status: 400 }
      );
    }

    const cleanNama = nama.trim();
    const cleanKet = keterangan ? keterangan.trim().toUpperCase().substring(0, 6) : "";

    try {
      const result = await pool.query(
        `INSERT INTO master_jenis_biaya (jenis_biaya, singkatan)
         VALUES ($1, $2)
         RETURNING *;`,
        [cleanNama, cleanKet]
      );

      const row = result.rows[0];
      const newItem: MasterJenisBiayaItem = {
        id: row.id,
        nama: row.jenis_biaya || row.nama || cleanNama,
        keterangan: row.singkatan || row.keterangan || cleanKet,
      };
      memoryJenisBiaya.unshift(newItem);
      return NextResponse.json({ success: true, data: newItem }, { status: 201 });
    } catch (dbErr) {
      console.error("POST Master Jenis Biaya DB Error:", (dbErr as Error).message);
      return NextResponse.json(
        { success: false, error: (dbErr as Error).message || "Gagal menyimpan data ke database PostgreSQL." },
        { status: 400 }
      );
    }
  } catch (error: unknown) {
    console.error("POST Master Jenis Biaya Error:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message || "Failed to save master jenis biaya" },
      { status: 500 }
    );
  }
}

export function getMemoryJenisBiaya() {
  return memoryJenisBiaya;
}

export function setMemoryJenisBiaya(items: MasterJenisBiayaItem[]) {
  memoryJenisBiaya = items;
}
