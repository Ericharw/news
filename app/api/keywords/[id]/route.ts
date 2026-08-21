import { NextResponse } from "next/server";
import pool from "@/lib/db";

// DELETE /api/keywords/[id] - Delete master keyword by ID
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const kwId = parseInt(id, 10);

    if (isNaN(kwId)) {
      return NextResponse.json(
        { success: false, error: "ID Keyword tidak valid." },
        { status: 400 }
      );
    }

    try {
      await pool.query("DELETE FROM master_keyword WHERE id = $1;", [kwId]);
    } catch (dbErr) {
      console.warn("DELETE Master Keyword warning:", (dbErr as Error).message);
    }

    return NextResponse.json({ success: true, message: "Master Keyword berhasil dihapus!" });
  } catch (error: unknown) {
    console.error("DELETE Master Keyword Error:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message || "Failed to delete master keyword" },
      { status: 500 }
    );
  }
}
