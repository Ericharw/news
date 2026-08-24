import { NextResponse } from "next/server";
import pool from "@/lib/db";

// PUT /api/master/grey-area/[id] - Update record
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      return NextResponse.json({ success: false, error: "ID tidak valid." }, { status: 400 });
    }

    const body = await request.json();
    const { idKode, namaTransaksi, status, ringkasan } = body;

    if (!namaTransaksi) {
      return NextResponse.json(
        { success: false, error: "Nama Transaksi tidak boleh kosong." },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `UPDATE master_grey_area
       SET id_kode = $1, nama_transaksi = $2, status = $3, ringkasan = $4
       WHERE id = $5
       RETURNING *;`,
      [idKode, namaTransaksi.trim(), status, ringkasan, numericId]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ success: false, error: "Data tidak ditemukan." }, { status: 404 });
    }

    const row = result.rows[0];
    return NextResponse.json({
      success: true,
      data: {
        id: row.id,
        idKode: row.id_kode,
        namaTransaksi: row.nama_transaksi,
        status: row.status,
        ringkasan: row.ringkasan,
      },
    });
  } catch (error: unknown) {
    console.error("PUT Master Grey Area Error:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message || "Gagal memperbarui data." },
      { status: 500 }
    );
  }
}

// DELETE /api/master/grey-area/[id] - Delete record
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      return NextResponse.json({ success: false, error: "ID tidak valid." }, { status: 400 });
    }

    const result = await pool.query("DELETE FROM master_grey_area WHERE id = $1 RETURNING id;", [numericId]);
    if (result.rowCount === 0) {
      return NextResponse.json({ success: false, error: "Data tidak ditemukan." }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Data berhasil dihapus." });
  } catch (error: unknown) {
    console.error("DELETE Master Grey Area Error:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message || "Gagal menghapus data." },
      { status: 500 }
    );
  }
}
