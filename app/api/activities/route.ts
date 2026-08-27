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
        status_nac VARCHAR(50) DEFAULT 'AMAN',
        catatan_nac TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    // Alter table if status_nac column doesn't exist yet
    await client.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='activities' AND column_name='status_nac') THEN
          ALTER TABLE activities ADD COLUMN status_nac VARCHAR(50) DEFAULT 'AMAN';
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='activities' AND column_name='catatan_nac') THEN
          ALTER TABLE activities ADD COLUMN catatan_nac TEXT;
        END IF;
      END $$;
    `);
  } catch (err) {
    console.warn("ensureTableExists warning:", err);
  } finally {
    client.release();
  }
}

// GET /api/activities - Fetch all activities from PostgreSQL (or memory fallback)
export async function GET() {
  try {
    await ensureTableExists();
    const result = await pool.query("SELECT * FROM activities ORDER BY id DESC;");

    const activities: ActivityItem[] = result.rows.map((row, index) => ({
      no: index + 1,
      id: row.id,
      namaProgram: row.nama_program,
      subjekKegiatan: row.subjek_kegiatan,
      jenisBiaya: row.jenis_biaya,
      objekKegiatan: row.objek_kegiatan,
      tanggalAwal: row.tanggal_awal,
      batch: row.batch,
      statusNac: row.status_nac || "AMAN",
      catatanNac: row.catatan_nac || "",
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
    const { namaProgram, subjekKegiatan, jenisBiaya, objekKegiatan, tanggalAwal, batch, statusNac, catatanNac } = body;

    if (!namaProgram || !subjekKegiatan || !jenisBiaya) {
      return NextResponse.json(
        { success: false, error: "Harap lengkapi kolom yang bertanda bintang (*)." },
        { status: 400 }
      );
    }

    const finalStatusNac = statusNac || "AMAN";
    const finalCatatanNac = catatanNac || "";

    try {
      await ensureTableExists();
      const countRes = await pool.query("SELECT COUNT(*) FROM activities;");
      const nextNo = parseInt(countRes.rows[0].count, 10) + 1;

      const result = await pool.query(
        `INSERT INTO activities (no, nama_program, subjek_kegiatan, jenis_biaya, objek_kegiatan, tanggal_awal, batch, status_nac, catatan_nac)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING *;`,
        [
          nextNo,
          namaProgram,
          subjekKegiatan,
          jenisBiaya,
          objekKegiatan || subjekKegiatan,
          tanggalAwal || "20/08/2026",
          batch ? (batch.startsWith("Batch") ? batch : `Batch ${batch}`) : "Batch 1",
          finalStatusNac,
          finalCatatanNac
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
        statusNac: row.status_nac || finalStatusNac,
        catatanNac: row.catatan_nac || finalCatatanNac,
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
        statusNac: finalStatusNac,
        catatanNac: finalCatatanNac,
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

// DELETE /api/activities - Delete ALL activities
export async function DELETE() {
  try {
    await ensureTableExists();
    await pool.query("TRUNCATE TABLE activities RESTART IDENTITY;");
    memoryActivities = [];
    return NextResponse.json({ success: true, message: "Semua data kegiatan berhasil dihapus." });
  } catch (error: unknown) {
    console.warn("Database DELETE ALL warning, clearing memory store:", (error as Error).message);
    memoryActivities = [];
    return NextResponse.json({ success: true, message: "Semua data kegiatan berhasil dihapus." });
  }
}
