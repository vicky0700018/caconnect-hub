import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "caconnect_session";
const AUTH_SECRET_STR =
  process.env.AUTH_SECRET ||
  process.env.NEXTAUTH_SECRET ||
  "caconnect-production-super-secure-auth-secret-key-2026";

const SECRET_KEY = new TextEncoder().encode(AUTH_SECRET_STR);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_NAME)?.value;

  let isValid = false;
  if (token) {
    try {
      await jwtVerify(token, SECRET_KEY);
      isValid = true;
    } catch {
      isValid = false;
    }
  }

  // Protect /dashboard routes
  if (pathname.startsWith("/dashboard")) {
    if (!isValid) {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Redirect logged-in users away from /login to /dashboard
  if (pathname === "/login") {
    if (isValid) {
      const dashboardUrl = new URL("/dashboard", request.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
