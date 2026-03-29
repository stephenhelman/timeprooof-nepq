"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

interface Props {
  user: {
    username: string | null | undefined;
    role: string | null | undefined;
  };
}

export default function Navigation({ user }: Props) {
  const pathname = usePathname();
  const studyLinks = [
    { href: "/", label: "Overview" },
    { href: "/by-section", label: "By Section" },
    { href: "/scripts", label: "Scripts" },
    { href: "/flashcards", label: "Flashcards" },
    { href: "/glossary", label: "Glossary" },
    ...(user.role === "ADMIN"
      ? [{ href: "/admin/users", label: "Admin" }]
      : []),
  ];
  console.log(studyLinks);

  return (
    <nav className="bg-gray-900 border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-2 overflow-x-auto">
        <span className="text-white font-bold text-sm whitespace-nowrap py-3 pr-4 border-r border-gray-700 mr-2">
          TIMEPROOF Training
        </span>
        {studyLinks.map(({ href, label }) => {
          const isActive =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                isActive
                  ? "text-white border-b-2 border-blue-500"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {label}
            </Link>
          );
        })}
        <div
          className={`${user.username ? "ml-auto" : "ml-auto"} flex items-center gap-3 flex-shrink-0`}
        >
          <span className="text-xs text-gray-400 whitespace-nowrap">
            {user ? user.username : "TP User"}
          </span>
          <Link
            href="/training"
            className="px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors"
          >
            Training Drills →
          </Link>
          {user && (
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-gray-500 hover:text-gray-300 transition-colors"
              title="Sign out"
              style={{ minHeight: "unset" }}
            >
              <LogOut size={14} />
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
