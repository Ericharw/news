import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "news_session";
const secret = new TextEncoder().encode(process.env.AUTH_SECRET || "development-only-change-this-secret");
const publicPaths = ["/landing-page", "/user-form/login", "/api/auth/login", "/api/auth/logout", "/api/auth/session"];

function decodeBase64Url(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  return decodeURIComponent(Array.from(atob(normalized), (character) => `%${character.charCodeAt(0).toString(16).padStart(2, "0")}`).join(""));
}

async function getSession(request: NextRequest) {
  if (process.env.NODE_ENV === "production" && !process.env.AUTH_SECRET) return null;
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const [payload, receivedSignature] = token.split(".");
  if (!payload || !receivedSignature) return null;
  const key = await crypto.subtle.importKey("raw", secret, { name: "HMAC", hash: "SHA-256" }, false, ["verify"]);
  const valid = await crypto.subtle.verify("HMAC", key, Uint8Array.from(atob(receivedSignature.replace(/-/g, "+").replace(/_/g, "/")), (character) => character.charCodeAt(0)), new TextEncoder().encode(payload));
  if (!valid) return null;
  try {
    const session = JSON.parse(decodeBase64Url(payload)) as { role?: string; exp?: number };
    return session.exp && session.exp > Math.floor(Date.now() / 1000) ? session : null;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/_next/") || pathname === "/favicon.ico" || /\.[a-z0-9]+$/i.test(pathname) || publicPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`))) {
    return NextResponse.next();
  }

  const session = await getSession(request);
  if (!session) {
    return NextResponse.redirect(new URL("/landing-page", request.url));
  }

  const userApiAllowed = request.method === "GET" && (pathname === "/api/activities" || pathname === "/api/master/programs" || pathname === "/api/master/jenis-biaya")
    || request.method === "POST" && (pathname === "/api/activities" || pathname === "/api/activities/validate");
  if (session.role !== "ADMIN" && pathname !== "/user-form" && !pathname.startsWith("/api/auth/") && !userApiAllowed) {
    const destination = new URL("/user-form", request.url);
    if (pathname.startsWith("/api/")) return NextResponse.json({ success: false, error: "Akses ditolak." }, { status: 403 });
    return NextResponse.redirect(destination);
  }

  const response = NextResponse.next();
  response.headers.set("Cache-Control", "private, no-store, max-age=0");
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
