import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { MasterGreyAreaItem } from "@/types/activity";

let memoryGreyArea: MasterGreyAreaItem[] = [];

// GET /api/master/grey-area - Fetch all master grey area records
export async function GET() {
  try {
    const result = await pool.query("SELECT * FROM master_grey_area ORDER BY id ASC;");
    const items: MasterGreyAreaItem[] = result.rows.map((row) => ({
      id: row.id,
      idKode: row.id_kode || `GA${String(row.id).padStart(3, "0")}`,
      namaTransaksi: row.nama_transaksi || "",
      status: row.status || "Grey Area",
      ringkasan: row.ringkasan || "",
    }));
    memoryGreyArea = items;
    return NextResponse.json({ success: true, data: items });
  } catch (error: unknown) {
    console.warn("GET Master Grey Area warning, operating in memory fallback mode:", (error as Error).message);
    return NextResponse.json({ success: true, data: memoryGreyArea });
  }
}

// POST /api/master/grey-area - Add new master grey area record
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { idKode, namaTransaksi, status, ringkasan } = body;

    if (!namaTransaksi) {
      return NextResponse.json(
        { success: false, error: "Nama Transaksi tidak boleh kosong." },
        { status: 400 }
      );
    }

    const cleanNama = namaTransaksi.trim();
    const cleanStatus = status ? status.trim() : "Grey Area";
    const cleanRingkasan = ringkasan ? ringkasan.trim() : "";

    try {
      // Calculate next idKode if not provided
      let finalKode = idKode ? idKode.trim() : "";
      if (!finalKode) {
        const countRes = await pool.query("SELECT COUNT(*) FROM master_grey_area;");
        const nextId = parseInt(countRes.rows[0].count, 10) + 1;
        finalKode = `GA${String(nextId).padStart(3, "0")}`;
      }

      const result = await pool.query(
        `INSERT INTO master_grey_area (id_kode, nama_transaksi, status, ringkasan)
         VALUES ($1, $2, $3, $4)
         RETURNING *;`,
        [finalKode, cleanNama, cleanStatus, cleanRingkasan]
      );

      const row = result.rows[0];
      const newItem: MasterGreyAreaItem = {
        id: row.id,
        idKode: row.id_kode,
        namaTransaksi: row.nama_transaksi,
        status: row.status,
        ringkasan: row.ringkasan,
      };
      memoryGreyArea.push(newItem);
      return NextResponse.json({ success: true, data: newItem }, { status: 201 });
    } catch (dbErr) {
      console.error("POST Master Grey Area DB Error:", (dbErr as Error).message);
      return NextResponse.json(
        { success: false, error: (dbErr as Error).message || "Gagal menyimpan data ke database PostgreSQL." },
        { status: 400 }
      );
    }
  } catch (error: unknown) {
    console.error("POST Master Grey Area Error:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message || "Failed to save master grey area record" },
      { status: 500 }
    );
  }
}
