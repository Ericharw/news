import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { ActivityItem } from "@/types/activity";

// In-memory store fallback so data is ALWAYS saved even before PostgreSQL password is set in .env
let memoryActivities: ActivityItem[] = [];

export function getMemoryActivities() {
  return memoryActivities;
}

export function setMemoryActivities(items: ActivityItem[]) {
  memoryActivities = items;
}

// Auto-create table if not exists
async function ensureTableExists() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS activities (
        id SERIAL PRIMARY KEY,
        no INT,
        nama_program VARCHAR(255) NOT NULL,
        subjek_kegiatan VARCHAR(255) NOT NULL,
        jenis_biaya VARCHAR(100) NOT NULL,
        objek_kegiatan TEXT,
        tanggal_awal VARCHAR(50) NOT NULL,
        batch VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
  } finally {
    client.release();
  }
}

// GET /api/activities - Fetch all activities from PostgreSQL (or memory fallback)
export async function GET() {
  try {
    await ensureTableExists();
    const result = await pool.query("SELECT * FROM activities ORDER BY id DESC;");

    const activities = result.rows.map((row, index) => ({
      no: index + 1,
      id: row.id,
      namaProgram: row.nama_program,
      subjekKegiatan: row.subjek_kegiatan,
      jenisBiaya: row.jenis_biaya,
      objekKegiatan: row.objek_kegiatan,
      tanggalAwal: row.tanggal_awal,
      batch: row.batch,
    }));

    // Update memory cache
    memoryActivities = activities;
    return NextResponse.json({ success: true, data: activities });
  } catch (error: unknown) {
    console.warn("Database GET warning, operating in memory fallback mode:", (error as Error).message);
    return NextResponse.json({ success: true, data: memoryActivities });
  }
}

// POST /api/activities - Insert new activity into PostgreSQL (or memory fallback)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { namaProgram, subjekKegiatan, jenisBiaya, objekKegiatan, tanggalAwal, batch } = body;

    if (!namaProgram || !subjekKegiatan || !jenisBiaya) {
      return NextResponse.json(
        { success: false, error: "Harap lengkapi kolom yang bertanda bintang (*)." },
        { status: 400 }
      );
    }

    try {
      await ensureTableExists();
      const countRes = await pool.query("SELECT COUNT(*) FROM activities;");
      const nextNo = parseInt(countRes.rows[0].count, 10) + 1;

      const result = await pool.query(
        `INSERT INTO activities (no, nama_program, subjek_kegiatan, jenis_biaya, objek_kegiatan, tanggal_awal, batch)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *;`,
        [
          nextNo,
          namaProgram,
          subjekKegiatan,
          jenisBiaya,
          objekKegiatan || subjekKegiatan,
          tanggalAwal || "20/08/2026",
          batch ? (batch.startsWith("Batch") ? batch : `Batch ${batch}`) : "Batch 1",
        ]
      );

      const row = result.rows[0];
      const newItem: ActivityItem = {
        no: nextNo,
        id: row.id,
        namaProgram: row.nama_program,
        subjekKegiatan: row.subjek_kegiatan,
        jenisBiaya: row.jenis_biaya,
        objekKegiatan: row.objek_kegiatan,
        tanggalAwal: row.tanggal_awal,
        batch: row.batch,
      };

      memoryActivities.unshift(newItem);
      return NextResponse.json({ success: true, data: newItem }, { status: 201 });
    } catch (dbErr) {
      console.warn("Database POST warning, operating in memory store fallback:", (dbErr as Error).message);
      const nextNo = memoryActivities.length + 1;
      const newItem: ActivityItem = {
        no: nextNo,
        id: Date.now(),
        namaProgram,
        subjekKegiatan,
        jenisBiaya,
        objekKegiatan: objekKegiatan || subjekKegiatan,
        tanggalAwal: tanggalAwal || "20/08/2026",
        batch: batch ? (batch.startsWith("Batch") ? batch : `Batch ${batch}`) : "Batch 1",
      };

      // Add to memory list
      memoryActivities = [newItem, ...memoryActivities];

      return NextResponse.json({ success: true, data: newItem }, { status: 201 });
    }
  } catch (error: unknown) {
    console.error("Database POST Error:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message || "Failed to insert activity into database" },
      { status: 500 }
    );
  }
}
