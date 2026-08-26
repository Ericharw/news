import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: "Username dan password wajib diisi." },
        { status: 400 }
      );
    }

    const cleanUsername = username.trim();
    const cleanPassword = password.trim();

    // 1. Ensure admin_users table exists in PostgreSQL
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        nama VARCHAR(150),
        role VARCHAR(50) DEFAULT 'admin',
        last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Ensure admin_login_logs table exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admin_login_logs (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) NOT NULL,
        status VARCHAR(50) NOT NULL,
        login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 3. Auto-provision default admin if missing
    const userCheck = await pool.query("SELECT * FROM admin_users WHERE LOWER(username) = LOWER($1)", [cleanUsername]);
    
    if (userCheck.rows.length === 0 && cleanUsername.toLowerCase() === "admin") {
      await pool.query(
        "INSERT INTO admin_users (username, password, nama, role) VALUES ($1, $2, $3, $4)",
        ["admin", "admin", "Administrator SDM & Diklat", "admin"]
      );
    }

    // 4. Validate credentials against DB
    const res = await pool.query(
      "SELECT id, username, nama, role, password FROM admin_users WHERE LOWER(username) = LOWER($1)",
      [cleanUsername]
    );

    if (res.rows.length === 0 || res.rows[0].password !== cleanPassword) {
      await pool.query(
        "INSERT INTO admin_login_logs (username, status) VALUES ($1, $2)",
        [cleanUsername, "GAGAL_PASSWORD_SALAH"]
      );
      return NextResponse.json(
        { success: false, error: "Username atau password admin salah." },
        { status: 401 }
      );
    }

    const user = res.rows[0];

    // 5. Update last_login timestamp and record success log in DB
    await pool.query(
      "UPDATE admin_users SET last_login = CURRENT_TIMESTAMP WHERE id = $1",
      [user.id]
    );
    await pool.query(
      "INSERT INTO admin_login_logs (username, status) VALUES ($1, $2)",
      [cleanUsername, "BERHASIL_LOGIN"]
    );

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        nama: user.nama || "Admin PLN",
        role: user.role || "admin",
      },
      message: "Login admin berhasil dan tersinkronisasi ke database PostgreSQL.",
    });
  } catch (error: unknown) {
    console.error("POST /api/auth/login error:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message || "Terjadi kesalahan server saat login." },
      { status: 500 }
    );
  }
}
