import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import pool from "@/lib/db";
import { readSession, SESSION_COOKIE } from "@/lib/auth";
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
        created_by VARCHAR(100),
        created_by_username VARCHAR(100),
        created_by_role VARCHAR(50),
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
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='activities' AND column_name='created_by') THEN
          ALTER TABLE activities ADD COLUMN created_by VARCHAR(100);
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='activities' AND column_name='created_by_username') THEN
          ALTER TABLE activities ADD COLUMN created_by_username VARCHAR(100);
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='activities' AND column_name='created_by_role') THEN
          ALTER TABLE activities ADD COLUMN created_by_role VARCHAR(50);
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
export async function GET(request: Request) {
  try {
    const session = readSession((await cookies()).get(SESSION_COOKIE)?.value);
    const historyView = new URL(request.url).searchParams.get("view") === "history";
    if (!session) return NextResponse.json({ success: false, error: "Akses ditolak." }, { status: 403 });
    await ensureTableExists();
    const result = session.role === "ADMIN" || historyView
      ? await pool.query("SELECT * FROM activities ORDER BY id DESC;")
      : await pool.query("SELECT * FROM activities WHERE created_by_username = $1 ORDER BY id DESC;", [session.username]);

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
      createdBy: row.created_by || "",
      createdByUsername: row.created_by_username || "",
      createdByRole: row.created_by_role || "",
    }));

    // Update memory cache
    memoryActivities = activities;
    return NextResponse.json({ success: true, data: activities });
  } catch (error: unknown) {
    console.warn("Database GET warning, operating in memory fallback mode:", (error as Error).message);
    const session = readSession((await cookies()).get(SESSION_COOKIE)?.value);
    const visibleActivities = session?.role === "ADMIN"
      ? memoryActivities
      : memoryActivities.filter((item) => item.createdByUsername === session?.username);
    return NextResponse.json({ success: true, data: visibleActivities });
  }
}

// POST /api/activities - Insert new activity into PostgreSQL (or memory fallback)
export async function POST(request: Request) {
  try {
    const session = readSession((await cookies()).get(SESSION_COOKIE)?.value);
    if (!session) return NextResponse.json({ success: false, error: "Sesi login tidak valid." }, { status: 401 });
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
        `INSERT INTO activities (no, nama_program, subjek_kegiatan, jenis_biaya, objek_kegiatan, tanggal_awal, batch, status_nac, catatan_nac, created_by, created_by_username, created_by_role)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
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
          finalCatatanNac,
          session.id,
          session.username,
          session.role
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
        createdBy: row.created_by || session.id,
        createdByUsername: row.created_by_username || session.username,
        createdByRole: row.created_by_role || session.role,
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
        createdBy: session.id,
        createdByUsername: session.username,
        createdByRole: session.role,
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
    const session = readSession((await cookies()).get(SESSION_COOKIE)?.value);
    if (!session || session.role !== "ADMIN") return NextResponse.json({ success: false, error: "Akses ditolak." }, { status: 403 });
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
