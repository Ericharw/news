import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth";

export async function POST() {
  const response = NextResponse.json({ success: true, message: "Logout berhasil." });
  response.headers.set("Set-Cookie", clearSessionCookie());
  response.headers.set("Cache-Control", "no-store");
  return response;
}
