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
