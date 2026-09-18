import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createSession } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json();
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");

  const adminEmail = (process.env.ADMIN_EMAIL || "admin@tez.com").toLowerCase();
  const passwordHash = process.env.ADMIN_PASSWORD_HASH || "";

  if (email !== adminEmail || !passwordHash || !(await bcrypt.compare(password, passwordHash))) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  await createSession(email);
  return NextResponse.json({ success: true });
}
