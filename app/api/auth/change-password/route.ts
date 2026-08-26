import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { username, oldPassword, newPassword } = body;

    if (!username || !oldPassword || !newPassword) {
      return NextResponse.json(
        { success: false, error: "Username, password lama, dan password baru wajib diisi." },
        { status: 400 }
      );
    }

    const cleanUsername = username.trim();
    const cleanOldPass = oldPassword.trim();
    const cleanNewPass = newPassword.trim();

    if (cleanNewPass.length < 4) {
      return NextResponse.json(
        { success: false, error: "Password baru minimal terdiri dari 4 karakter." },
        { status: 400 }
      );
    }

    // Check user in database
    const userCheck = await pool.query(
      "SELECT id, password FROM admin_users WHERE LOWER(username) = LOWER($1)",
      [cleanUsername]
    );

    if (userCheck.rows.length === 0 || userCheck.rows[0].password !== cleanOldPass) {
      return NextResponse.json(
        { success: false, error: "Password lama yang Anda masukkan salah." },
        { status: 401 }
      );
    }

    const userId = userCheck.rows[0].id;

    // Update password in PostgreSQL DB
    await pool.query(
      "UPDATE admin_users SET password = $1 WHERE id = $2",
      [cleanNewPass, userId]
    );

    // Record change log
    await pool.query(
      "INSERT INTO admin_login_logs (username, status) VALUES ($1, $2)",
      [cleanUsername, "UBAH_PASSWORD_BERHASIL"]
    );

    return NextResponse.json({
      success: true,
      message: "Password admin berhasil diperbarui di database PostgreSQL.",
    });
  } catch (error: unknown) {
    console.error("PUT /api/auth/change-password error:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message || "Gagal memperbarui password di server." },
      { status: 500 }
    );
  }
}
