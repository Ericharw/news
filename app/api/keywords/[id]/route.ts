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

// PUT /api/keywords/[id] - Update master keyword by ID
export async function PUT(
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

    const body = await request.json();
    const { keyword, tipeTransaksi, kategoriTransaksi } = body;
    if (!keyword) {
      return NextResponse.json(
        { success: false, error: "Kata Kunci (Keyword) tidak boleh kosong." },
        { status: 400 }
      );
    }

    const cleanKw = keyword.trim();
    const cleanTipe = (tipeTransaksi || kategoriTransaksi || "Non-Allowable Cost (NAC)").trim();

    try {
      const result = await pool.query(
        `UPDATE master_keyword SET keyword = $1, tipe_transaksi = $2 WHERE id = $3 RETURNING *;`,
        [cleanKw, cleanTipe, kwId]
      );
      if (result.rows.length === 0) {
        return NextResponse.json({ success: false, error: "Data keyword tidak ditemukan." }, { status: 404 });
      }
      const updatedRow = result.rows[0];
      const updatedItem = {
        id: updatedRow.id,
        keyword: updatedRow.keyword,
        kategoriTransaksi: updatedRow.tipe_transaksi || cleanTipe,
      };

      return NextResponse.json({ success: true, data: updatedItem });
    } catch (dbErr) {
      console.error("PUT Master Keyword DB Error:", (dbErr as Error).message);
      return NextResponse.json(
        { success: false, error: (dbErr as Error).message || "Gagal memperbarui data di database." },
        { status: 400 }
      );
    }
  } catch (error: unknown) {
    console.error("PUT Master Keyword Error:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message || "Failed to update master keyword" },
      { status: 500 }
    );
  }
}
