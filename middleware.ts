import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req: NextRequest & { auth: unknown }) => {
  const { pathname } = req.nextUrl;
  const session = (req as unknown as {
    auth: {
      user?: {
        profileComplete?: boolean;
        role?: string;
        mustChangePassword?: boolean;
      };
    } | null;
  }).auth;

  // Public: auth API, login, register
  if (
    pathname.startsWith("/api/auth") ||
    pathname === "/login" ||
    pathname === "/register"
  ) {
    return NextResponse.next();
  }

  // All other routes require auth
  if (!session?.user) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (session?.user) {
    // Force password change
    if (
      session.user.mustChangePassword &&
      pathname !== "/change-password" &&
      !pathname.startsWith("/api/user/password") &&
      !pathname.startsWith("/api/auth")
    ) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Password change required" }, { status: 403 });
      }
      return NextResponse.redirect(new URL("/change-password", req.url));
    }

    // Redirect incomplete profiles to onboarding
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
    "/((?!_next/static|_next/image|favicon.ico|icons|images|fonts).*)",
  ],
};
