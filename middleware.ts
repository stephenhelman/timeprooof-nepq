import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default auth((req: NextRequest & { auth: unknown }) => {
  const { pathname } = req.nextUrl;
  const session = (req as unknown as { auth: { user?: { profileComplete?: boolean; role?: string } } | null }).auth;

  // Public: auth API, login, register
  if (
    pathname.startsWith("/api/auth") ||
    pathname === "/login" ||
    pathname === "/register"
  ) {
    return NextResponse.next();
  }

  // Protected routes that require auth
  const requiresAuth =
    pathname.startsWith("/training") ||
    pathname.startsWith("/api/training") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/onboarding");

  if (requiresAuth && !session?.user) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (session?.user) {
    // Redirect incomplete profiles to onboarding (skip if already there)
    if (
      !session.user.profileComplete &&
      !pathname.startsWith("/onboarding") &&
      !pathname.startsWith("/api/")
    ) {
      return NextResponse.redirect(new URL("/onboarding", req.url));
    }

    // Admin-only routes
    if (pathname.startsWith("/admin") && session.user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/training", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/training/:path*",
    "/api/training/:path*",
    "/admin/:path*",
    "/onboarding/:path*",
  ],
};
