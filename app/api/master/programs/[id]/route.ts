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
