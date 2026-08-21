import { NextResponse } from "next/server";
import pool from "@/lib/db";

// DELETE /api/activities/[id] - Delete activity from PostgreSQL
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const activityId = parseInt(id, 10);

    if (isNaN(activityId)) {
      return NextResponse.json(
        { success: false, error: "ID kegiatan tidak valid." },
        { status: 400 }
      );
    }

    const result = await pool.query("DELETE FROM activities WHERE id = $1 RETURNING *;", [activityId]);

    if (result.rowCount === 0) {
      return NextResponse.json(
        { success: false, error: "Data kegiatan tidak ditemukan." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Data kegiatan berhasil dihapus dari PostgreSQL!" });
  } catch (error: unknown) {
    console.error("Database DELETE Error:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message || "Failed to delete activity from PostgreSQL" },
      { status: 500 }
    );
  }
}
