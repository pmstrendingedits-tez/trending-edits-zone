import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { signToken, setAuthCookie } from "@/lib/auth";

export async function POST(request) {
  const { username, password } = await request.json();

  const validUsername = username === process.env.ADMIN_USERNAME;
  const validPassword =
    process.env.ADMIN_PASSWORD_HASH &&
    (await bcrypt.compare(password || "", process.env.ADMIN_PASSWORD_HASH));

  if (!validUsername || !validPassword) {
    return NextResponse.json(
      { error: "Invalid username or password" },
      { status: 401 }
    );
  }

  const token = signToken({ username });
  setAuthCookie(token);

  return NextResponse.json({ success: true });
}
