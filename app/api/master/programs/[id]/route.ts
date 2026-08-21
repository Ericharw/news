import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getMemoryPrograms, setMemoryPrograms } from "@/app/api/master/programs/route";

// DELETE /api/master/programs/[id] - Delete master program by ID
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const progId = parseInt(id, 10);

    if (isNaN(progId)) {
      return NextResponse.json(
        { success: false, error: "ID Program tidak valid." },
        { status: 400 }
      );
    }

    try {
      await pool.query("DELETE FROM master_program WHERE id = $1;", [progId]);
    } catch (dbErr) {
      console.warn("DELETE Master Program warning, operating in memory fallback:", (dbErr as Error).message);
    }

    const current = getMemoryPrograms();
    const updated = current.filter((item) => item.id !== progId);
    setMemoryPrograms(updated);

    return NextResponse.json({ success: true, message: "Master Program berhasil dihapus!" });
  } catch (error: unknown) {
    console.error("DELETE Master Program Error:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message || "Failed to delete master program" },
      { status: 500 }
    );
  }
}

// PUT /api/master/programs/[id] - Update master program by ID
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const progId = parseInt(id, 10);
    if (isNaN(progId)) {
      return NextResponse.json(
        { success: false, error: "ID Program tidak valid." },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { label, code } = body;
    if (!label || !code) {
      return NextResponse.json(
        { success: false, error: "Nama Program dan Kode Singkatan wajib diisi." },
        { status: 400 }
      );
    }

    const cleanLabel = label.trim();
    const cleanCode = code.trim().toUpperCase().substring(0, 6);

    try {
      const result = await pool.query(
        `UPDATE master_program SET nama_program = $1, singkatan = $2 WHERE id = $3 RETURNING *;`,
        [cleanLabel, cleanCode, progId]
      );
      if (result.rows.length === 0) {
        return NextResponse.json({ success: false, error: "Data program tidak ditemukan." }, { status: 404 });
      }
      const updatedRow = result.rows[0];
      const updatedItem = { id: updatedRow.id, label: updatedRow.nama_program, code: updatedRow.singkatan };
      
      const current = getMemoryPrograms();
      const updatedMem = current.map((p) => (p.id === progId ? updatedItem : p));
      setMemoryPrograms(updatedMem);

      return NextResponse.json({ success: true, data: updatedItem });
    } catch (dbErr) {
      console.error("PUT Master Program DB Error:", (dbErr as Error).message);
      return NextResponse.json(
        { success: false, error: (dbErr as Error).message || "Gagal memperbarui data di database." },
        { status: 400 }
      );
    }
  } catch (error: unknown) {
    console.error("PUT Master Program Error:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message || "Failed to update master program" },
      { status: 500 }
    );
  }
}
