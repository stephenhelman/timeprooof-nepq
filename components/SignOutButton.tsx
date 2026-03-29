"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="text-gray-500 hover:text-gray-300 transition-colors flex items-center gap-1"
      title="Sign out"
      style={{ minHeight: "unset" }}
    >
      <LogOut size={14} />
    </button>
  );
}
