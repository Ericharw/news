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

export function authenticate(username: string, password: string): AuthUser | null {
  const account = accounts.find((item) => item.username === username.trim().toLowerCase() && item.password === password);
  if (!account) return null;
  return { id: account.id, username: account.username, nama: account.nama, role: account.role };
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
