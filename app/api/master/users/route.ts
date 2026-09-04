import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { createHmac } from "node:crypto";
import { MasterUserItem } from "@/types/activity";

const VALID_ROLES = ["ADMIN", "PKU", "JAR", "K3L_KAM"];

function hashPassword(password: string): string {
  return createHmac("sha256", process.env.AUTH_SECRET || "development-only-change-this-secret")
    .update(password)
    .digest("hex");
}

export async function ensureUsersTable() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS master_users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) NOT NULL UNIQUE,
        nama VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'PKU',
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
  } finally {
    client.release();
  }
}

// GET /api/master/users
export async function GET() {
  try {
    await ensureUsersTable();
    const result = await pool.query(`
      SELECT id, username, nama, UPPER(role) AS role, created_at
      FROM master_users
      UNION ALL
      SELECT -legacy.id AS id,
             legacy.username,
             COALESCE(legacy.nama, legacy.username) AS nama,
             UPPER(COALESCE(legacy.role, 'PKU')) AS role,
             legacy.created_at
      FROM admin_users AS legacy
      WHERE NOT EXISTS (
        SELECT 1
        FROM master_users AS master
        WHERE LOWER(master.username) = LOWER(legacy.username)
      )
      UNION ALL
      SELECT built_in.id,
             built_in.username,
             built_in.nama,
             built_in.role,
             CURRENT_TIMESTAMP AS created_at
      FROM (VALUES
        (-1001, 'pku', 'PKU', 'PKU'),
        (-1002, 'jar', 'JAR', 'JAR'),
        (-1003, 'k3l_kam', 'K3L & KAM', 'K3L_KAM')
      ) AS built_in(id, username, nama, role)
      WHERE NOT EXISTS (
        SELECT 1
        FROM master_users AS master
        WHERE LOWER(master.username) = LOWER(built_in.username)
      )
      AND NOT EXISTS (
        SELECT 1
        FROM admin_users AS legacy
        WHERE LOWER(legacy.username) = LOWER(built_in.username)
      )
      ORDER BY id ASC;
    `);
    const users: MasterUserItem[] = result.rows.map((row) => ({
      id: row.id,
      username: row.username,
      nama: row.nama,
      role: row.role,
      createdAt: row.created_at,
    }));
    return NextResponse.json({ success: true, data: users });
  } catch (error: unknown) {
    console.error("GET Master Users error:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message || "Gagal mengambil data user." },
      { status: 500 }
    );
  }
}

// POST /api/master/users - tambah user baru
export async function POST(request: Request) {
  try {
    await ensureUsersTable();
    const body = await request.json();
    const { username, nama, role, password } = body;

    if (!username || !nama || !role || !password) {
      return NextResponse.json(
        { success: false, error: "Username, nama, role, dan password wajib diisi." },
        { status: 400 }
      );
    }

    if (!VALID_ROLES.includes(role.toUpperCase())) {
      return NextResponse.json(
        { success: false, error: `Role tidak valid. Pilih salah satu: ${VALID_ROLES.join(", ")}.` },
        { status: 400 }
      );
    }

    const cleanUsername = username.trim().toLowerCase();
    const cleanNama = nama.trim();
    const cleanRole = role.trim().toUpperCase();
    const passwordHash = hashPassword(password);

    // Cek duplikat username
    const existing = await pool.query(
      "SELECT id FROM master_users WHERE username = $1;",
      [cleanUsername]
    );
    if (existing.rows.length > 0) {
      return NextResponse.json(
        { success: false, error: `Username "${cleanUsername}" sudah digunakan.` },
        { status: 409 }
      );
    }

    const result = await pool.query(
      `INSERT INTO master_users (username, nama, role, password_hash)
       VALUES ($1, $2, $3, $4)
       RETURNING id, username, nama, role, created_at;`,
      [cleanUsername, cleanNama, cleanRole, passwordHash]
    );

    const row = result.rows[0];
    const newUser: MasterUserItem = {
      id: row.id,
      username: row.username,
      nama: row.nama,
      role: row.role,
      createdAt: row.created_at,
    };

    return NextResponse.json({ success: true, data: newUser }, { status: 201 });
  } catch (error: unknown) {
    console.error("POST Master Users error:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message || "Gagal menyimpan user." },
      { status: 500 }
    );
  }
}

// PUT /api/master/users - edit user
export async function PUT(request: Request) {
  try {
    await ensureUsersTable();
    const body = await request.json();
    const { id, username, nama, role, password } = body;

    if (!id || !username || !nama || !role) {
      return NextResponse.json(
        { success: false, error: "ID, username, nama, dan role wajib diisi." },
        { status: 400 }
      );
    }

    if (!VALID_ROLES.includes(role.toUpperCase())) {
      return NextResponse.json(
        { success: false, error: `Role tidak valid. Pilih salah satu: ${VALID_ROLES.join(", ")}.` },
        { status: 400 }
      );
    }

    const cleanUsername = username.trim().toLowerCase();
    const cleanNama = nama.trim();
    const cleanRole = role.trim().toUpperCase();

    if (Number(id) < 0) {
      const legacyId = Math.abs(Number(id));
      let legacyResult;
      if (password && password.trim() !== "") {
        legacyResult = await pool.query(
          `UPDATE admin_users
           SET username = $1, nama = $2, role = $3, password = $4
           WHERE id = $5
           RETURNING id, username, nama, role, created_at;`,
          [cleanUsername, cleanNama, cleanRole.toLowerCase(), password.trim(), legacyId]
        );
      } else {
        legacyResult = await pool.query(
          `UPDATE admin_users
           SET username = $1, nama = $2, role = $3
           WHERE id = $4
           RETURNING id, username, nama, role, created_at;`,
          [cleanUsername, cleanNama, cleanRole.toLowerCase(), legacyId]
        );
      }
      if (legacyResult.rows.length > 0) {
        const row = legacyResult.rows[0];
        return NextResponse.json({
          success: true,
          data: { id: -row.id, username: row.username, nama: row.nama, role: row.role.toUpperCase(), createdAt: row.created_at },
        });
      }
    }

    // Cek duplikat username (exclude user yang sedang diedit)
    const existing = await pool.query(
      "SELECT id FROM master_users WHERE username = $1 AND id != $2;",
      [cleanUsername, id]
    );
    if (existing.rows.length > 0) {
      return NextResponse.json(
        { success: false, error: `Username "${cleanUsername}" sudah digunakan oleh user lain.` },
        { status: 409 }
      );
    }

    let result;
    if (password && password.trim() !== "") {
      const passwordHash = hashPassword(password.trim());
      result = await pool.query(
        `UPDATE master_users
         SET username = $1, nama = $2, role = $3, password_hash = $4
         WHERE id = $5
         RETURNING id, username, nama, role, created_at;`,
        [cleanUsername, cleanNama, cleanRole, passwordHash, id]
      );
    } else {
      result = await pool.query(
        `UPDATE master_users
         SET username = $1, nama = $2, role = $3
         WHERE id = $4
         RETURNING id, username, nama, role, created_at;`,
        [cleanUsername, cleanNama, cleanRole, id]
      );
    }

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "User tidak ditemukan." },
        { status: 404 }
      );
    }

    const row = result.rows[0];
    const updatedUser: MasterUserItem = {
      id: row.id,
      username: row.username,
      nama: row.nama,
      role: row.role,
      createdAt: row.created_at,
    };

    return NextResponse.json({ success: true, data: updatedUser });
  } catch (error: unknown) {
    console.error("PUT Master Users error:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message || "Gagal mengupdate user." },
      { status: 500 }
    );
  }
}

// DELETE /api/master/users
export async function DELETE(request: Request) {
  try {
    await ensureUsersTable();
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID user wajib diisi." },
        { status: 400 }
      );
    }

    const result = await pool.query(
      "DELETE FROM master_users WHERE id = $1 RETURNING id, username;",
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "User tidak ditemukan." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `User "${result.rows[0].username}" berhasil dihapus.`,
    });
  } catch (error: unknown) {
    console.error("DELETE Master Users error:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message || "Gagal menghapus user." },
      { status: 500 }
    );
  }
}
