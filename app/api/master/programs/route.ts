import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { PROGRAM_OPTIONS } from "@/data/programOptions";
import { MasterProgramItem } from "@/types/activity";

let memoryPrograms: MasterProgramItem[] = PROGRAM_OPTIONS.map((opt, idx) => ({
  id: idx + 1,
  label: opt.label,
  code: opt.code,
}));

export async function ensureProgramTable() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS master_program (
        id SERIAL PRIMARY KEY,
        nama_program VARCHAR(255) NOT NULL,
        singkatan VARCHAR(50) NOT NULL
      );
    `);

    const countRes = await client.query("SELECT COUNT(*) FROM master_program;");
    if (parseInt(countRes.rows[0].count, 10) === 0) {
      for (const item of PROGRAM_OPTIONS) {
        await client.query(
          "INSERT INTO master_program (nama_program, singkatan) VALUES ($1, $2);",
          [item.label, item.code]
        );
      }
    }
  } finally {
    client.release();
  }
}

// GET /api/master/programs - Fetch all master programs from PostgreSQL master_program
export async function GET() {
  try {
    await ensureProgramTable();
    const result = await pool.query("SELECT * FROM master_program ORDER BY id DESC;");
    const programs: MasterProgramItem[] = result.rows.map((row) => ({
      id: row.id,
      label: row.nama_program || row.label,
      code: row.singkatan || row.code,
    }));
    memoryPrograms = programs;
    return NextResponse.json({ success: true, data: programs });
  } catch (error: unknown) {
    console.warn("GET Master Programs warning, operating in memory fallback mode:", (error as Error).message);
    return NextResponse.json({ success: true, data: memoryPrograms });
  }
}

// POST /api/master/programs - Add new master program to master_program table
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { label, code } = body;

    if (!label || !code) {
      return NextResponse.json(
        { success: false, error: "Nama Program (label) dan Singkatan (code) wajib diisi." },
        { status: 400 }
      );
    }

    const cleanLabel = label.trim();
    const cleanCode = code.trim().toUpperCase().substring(0, 6);

    try {
      await ensureProgramTable();
      const result = await pool.query(
        `INSERT INTO master_program (nama_program, singkatan)
         VALUES ($1, $2)
         RETURNING *;`,
        [cleanLabel, cleanCode]
      );
      const row = result.rows[0];
      const newItem: MasterProgramItem = {
        id: row.id,
        label: row.nama_program,
        code: row.singkatan,
      };
      memoryPrograms.unshift(newItem);
      return NextResponse.json({ success: true, data: newItem }, { status: 201 });
    } catch (dbErr) {
      console.error("POST Master Program DB Error:", (dbErr as Error).message);
      return NextResponse.json(
        { success: false, error: (dbErr as Error).message || "Gagal menyimpan data ke database PostgreSQL." },
        { status: 400 }
      );
    }
  } catch (error: unknown) {
    console.error("POST Master Program Error:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message || "Failed to save master program" },
      { status: 500 }
    );
  }
}

export function getMemoryPrograms() {
  return memoryPrograms;
}

export function setMemoryPrograms(items: MasterProgramItem[]) {
  memoryPrograms = items;
}

