import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getMemoryJenisBiaya, setMemoryJenisBiaya } from "@/app/api/master/jenis-biaya/route";

// DELETE /api/master/jenis-biaya/[id] - Delete master jenis biaya by ID
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const itemNumId = parseInt(id, 10);

    if (isNaN(itemNumId)) {
      return NextResponse.json(
        { success: false, error: "ID Jenis Biaya tidak valid." },
        { status: 400 }
      );
    }

    try {
      await pool.query("DELETE FROM master_jenis_biaya WHERE id = $1;", [itemNumId]);
    } catch (dbErr) {
      console.warn("DELETE Master Jenis Biaya warning, operating in memory fallback:", (dbErr as Error).message);
    }

    const current = getMemoryJenisBiaya();
    const updated = current.filter((item) => item.id !== itemNumId);
    setMemoryJenisBiaya(updated);

    return NextResponse.json({ success: true, message: "Master Jenis Biaya berhasil dihapus!" });
  } catch (error: unknown) {
    console.error("DELETE Master Jenis Biaya Error:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message || "Failed to delete master jenis biaya" },
      { status: 500 }
    );
  }
}

// PUT /api/master/jenis-biaya/[id] - Update master jenis biaya by ID
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const itemNumId = parseInt(id, 10);
    if (isNaN(itemNumId)) {
      return NextResponse.json(
        { success: false, error: "ID Jenis Biaya tidak valid." },
        { status: 400 }
      );
    }

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
        `UPDATE master_jenis_biaya SET jenis_biaya = $1, singkatan = $2 WHERE id = $3 RETURNING *;`,
        [cleanNama, cleanKet, itemNumId]
      );
      if (result.rows.length === 0) {
        return NextResponse.json({ success: false, error: "Data jenis biaya tidak ditemukan." }, { status: 404 });
      }
      const updatedRow = result.rows[0];
      const updatedItem = {
        id: updatedRow.id,
        nama: updatedRow.jenis_biaya || cleanNama,
        keterangan: updatedRow.singkatan || cleanKet,
      };

      const current = getMemoryJenisBiaya();
      const updatedMem = current.map((item) => (item.id === itemNumId ? updatedItem : item));
      setMemoryJenisBiaya(updatedMem);

      return NextResponse.json({ success: true, data: updatedItem });
    } catch (dbErr) {
      console.error("PUT Master Jenis Biaya DB Error:", (dbErr as Error).message);
      return NextResponse.json(
        { success: false, error: (dbErr as Error).message || "Gagal memperbarui data di database." },
        { status: 400 }
      );
    }
  } catch (error: unknown) {
    console.error("PUT Master Jenis Biaya Error:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message || "Failed to update master jenis biaya" },
      { status: 500 }
    );
  }
}
