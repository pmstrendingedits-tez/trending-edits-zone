import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.AUTH_SECRET || "change-me");

export async function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith("/admin/dashboard")) return NextResponse.next();

  const token = request.cookies.get("tez_admin_session")?.value;
  if (!token) return NextResponse.redirect(new URL("/admin/login", request.url));

  try {
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
}

export const config = {
  matcher: ["/admin/dashboard/:path*"],
};
