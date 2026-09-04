import { createHmac, timingSafeEqual } from "node:crypto";

export type AppRole = "ADMIN" | "PKU" | "JAR" | "K3L_KAM";

export interface AuthUser {
  id: string;
  username: string;
  nama: string;
  role: AppRole;
}

const SESSION_COOKIE = "news_session";
const SESSION_TTL_SECONDS = 60 * 60 * 8;
const sessionSecret = process.env.AUTH_SECRET || "development-only-change-this-secret";

const accounts: Array<AuthUser & { password: string }> = [
  { id: "admin-1", username: "admin", nama: "Administrator", role: "ADMIN", password: process.env.AUTH_ADMIN_PASSWORD || "News@Admin2026" },
  { id: "pku-1", username: "pku", nama: "PKU", role: "PKU", password: process.env.AUTH_PKU_PASSWORD || "News@PKU2026" },
  { id: "jar-1", username: "jar", nama: "JAR", role: "JAR", password: process.env.AUTH_JAR_PASSWORD || "News@JAR2026" },
  { id: "k3l-kam-1", username: "k3l_kam", nama: "K3L & KAM", role: "K3L_KAM", password: process.env.AUTH_K3L_KAM_PASSWORD || "News@K3LKAM2026" },
];

function encode(value: string) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function decode(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function sign(value: string) {
  return createHmac("sha256", sessionSecret).update(value).digest("base64url");
}

export function hashPassword(password: string): string {
  return createHmac("sha256", sessionSecret).update(password).digest("hex");
}

function hashPasswordWithSecret(password: string, secret: string): string {
  return createHmac("sha256", secret).update(password).digest("hex");
}

export function authenticate(username: string, password: string): AuthUser | null {
  const account = accounts.find((item) => item.username === username.trim().toLowerCase() && item.password === password);
  if (!account) return null;
  return { id: account.id, username: account.username, nama: account.nama, role: account.role };
}

export async function authenticateWithDB(username: string, password: string): Promise<AuthUser | null> {
  // 1. Cek akun statis terlebih dahulu
  const staticAccount = accounts.find(
    (item) => item.username === username.trim().toLowerCase() && item.password === password
  );
  if (staticAccount) {
    return { id: staticAccount.id, username: staticAccount.username, nama: staticAccount.nama, role: staticAccount.role };
  }

  // 2. Cek di database master_users
  try {
    const pool = (await import("@/lib/db")).default;
    try {
      const passwordHash = hashPassword(password);
      const result = await pool.query(
        "SELECT id, username, nama, role FROM master_users WHERE username = $1 AND password_hash IN ($2, $3) LIMIT 1;",
        [
          username.trim().toLowerCase(),
          passwordHash,
          hashPasswordWithSecret(password, "development-only-change-this-secret"),
        ]
      );
      if (result.rows.length > 0) {
        const row = result.rows[0];
        const validRoles = ["ADMIN", "PKU", "JAR", "K3L_KAM"];
        const role = validRoles.includes(row.role) ? (row.role as AppRole) : "PKU";
        return { id: `db-${row.id}`, username: row.username, nama: row.nama, role };
      }
    } catch (masterError) {
      console.warn("authenticateWithDB: master_users check failed, checking legacy users:", masterError);
    }

    // 3. Cek akun lama pada tabel admin_users
    const legacyResult = await pool.query(
      "SELECT id, username, nama, role FROM admin_users WHERE LOWER(username) = LOWER($1) AND password = $2 LIMIT 1;",
      [username.trim(), password]
    );
    if (legacyResult.rows.length > 0) {
      const row = legacyResult.rows[0];
      const validRoles = ["ADMIN", "PKU", "JAR", "K3L_KAM"];
      const normalizedRole = String(row.role || "ADMIN").toUpperCase();
      const role = validRoles.includes(normalizedRole) ? (normalizedRole as AppRole) : "ADMIN";
      return { id: `legacy-${row.id}`, username: row.username, nama: row.nama || row.username, role };
    }
  } catch (err) {
    console.warn("authenticateWithDB: DB check failed, fallback only:", err);
  }

  return null;
}

export function createSession(user: AuthUser) {
  if (process.env.NODE_ENV === "production" && !process.env.AUTH_SECRET) {
    throw new Error("AUTH_SECRET wajib dikonfigurasi di production.");
  }
  const payload = encode(JSON.stringify({ ...user, exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS }));
  return `${payload}.${sign(payload)}`;
}

export function readSession(token?: string): AuthUser | null {
  if (process.env.NODE_ENV === "production" && !process.env.AUTH_SECRET) return null;
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  const expected = Buffer.from(sign(payload));
  const received = Buffer.from(signature);
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) return null;
  try {
    const session = JSON.parse(decode(payload)) as AuthUser & { exp?: number };
    if (!session.exp || session.exp < Math.floor(Date.now() / 1000)) return null;
    if (!["ADMIN", "PKU", "JAR", "K3L_KAM"].includes(session.role)) return null;
    return { id: session.id, username: session.username, nama: session.nama, role: session.role };
  } catch {
    return null;
  }
}

export function sessionCookie(token: string) {
  return `${SESSION_COOKIE}=${token}; Path=/; Max-Age=${SESSION_TTL_SECONDS}; HttpOnly; SameSite=Lax${process.env.NODE_ENV === "production" ? "; Secure" : ""}`;
}

export function clearSessionCookie() {
  return `${SESSION_COOKIE}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax${process.env.NODE_ENV === "production" ? "; Secure" : ""}`;
}

export { SESSION_COOKIE };
