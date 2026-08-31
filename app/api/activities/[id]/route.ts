import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import pool from "@/lib/db";
import { readSession, SESSION_COOKIE } from "@/lib/auth";
import { getMemoryActivities, setMemoryActivities } from "@/app/api/activities/route";

// DELETE /api/activities/[id] - Delete activity by ID
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = readSession((await cookies()).get(SESSION_COOKIE)?.value);
    if (!session || session.role !== "ADMIN") return NextResponse.json({ success: false, error: "Akses ditolak." }, { status: 403 });
    const { id } = await params;
    const activityId = parseInt(id, 10);

    if (isNaN(activityId)) {
      return NextResponse.json(
        { success: false, error: "ID Kegiatan tidak valid." },
        { status: 400 }
      );
    }

    try {
      const result = await pool.query("DELETE FROM activities WHERE id = $1 RETURNING *;", [
        activityId,
      ]);

      if (result.rowCount === 0) {
        // Fallback remove from memory
        const current = getMemoryActivities();
        const updated = current.filter((item) => item.id !== activityId);
        setMemoryActivities(updated);
      }
    } catch (dbErr) {
      console.warn("Database DELETE warning, operating in memory store fallback:", (dbErr as Error).message);
      const current = getMemoryActivities();
      const updated = current.filter((item) => item.id !== activityId);
      setMemoryActivities(updated);
    }

    return NextResponse.json({ success: true, message: "Data kegiatan berhasil dihapus!" });
  } catch (error: unknown) {
    console.error("Database DELETE Error:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message || "Failed to delete activity" },
      { status: 500 }
    );
  }
}
