import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { authenticate, createSession, sessionCookie } from "@/lib/auth";

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
    const user = authenticate(cleanUsername, password);
    if (!user) {
      try {
        await pool.query("INSERT INTO admin_login_logs (username, status) VALUES ($1, $2)", [cleanUsername, "GAGAL_PASSWORD_SALAH"]);
      } catch (logError) {
        console.warn("Login failure log unavailable:", logError);
      }
      return NextResponse.json({ success: false, error: "Username atau password tidak valid." }, { status: 401 });
    }

    try {
      await pool.query(`CREATE TABLE IF NOT EXISTS admin_login_logs (id SERIAL PRIMARY KEY, username VARCHAR(100) NOT NULL, status VARCHAR(50) NOT NULL, login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
      await pool.query("INSERT INTO admin_login_logs (username, status) VALUES ($1, $2)", [user.username, "BERHASIL_LOGIN"]);
    } catch (logError) {
      console.warn("Login success log unavailable:", logError);
    }

    const response = NextResponse.json({ success: true, data: user, message: "Login berhasil." });
    response.headers.set("Set-Cookie", sessionCookie(createSession(user)));
    return response;
  } catch (error: unknown) {
    console.error("POST /api/auth/login error:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message || "Terjadi kesalahan server saat login." },
      { status: 500 }
    );
  }
}
