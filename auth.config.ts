import type { NextAuthConfig } from "next-auth";

// Lightweight config — no Prisma, no bcrypt, safe for the Edge runtime.
// Imported by both auth.ts (full server config) and middleware.ts (edge).
// Module augmentation lives here so it's available in both contexts.

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      branch: string | null;
      profileComplete: boolean;
      mustChangePassword: boolean;
    } & import("next-auth").DefaultSession["user"];
  }

  interface User {
    role?: string;
    branch?: string | null;
    profileComplete?: boolean;
    mustChangePassword?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
    branch?: string | null;
    profileComplete?: boolean;
    mustChangePassword?: boolean;
  }
}

export default {
  providers: [],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role ?? "REP";
        token.branch = user.branch ?? null;
        token.profileComplete = user.profileComplete ?? false;
        token.mustChangePassword = user.mustChangePassword ?? false;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.branch = token.branch as string | null;
        session.user.profileComplete = token.profileComplete as boolean;
        session.user.mustChangePassword = token.mustChangePassword as boolean;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
