"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const studyLinks = [
  { href: "/", label: "Overview" },
  { href: "/by-section", label: "By Section" },
  { href: "/scripts", label: "Scripts" },
  { href: "/flashcards", label: "Flashcards" },
  { href: "/glossary", label: "Glossary" },
];

export default function Navigation({ userName }: { userName?: string | null }) {
  const pathname = usePathname();

  return (
    <nav className="bg-gray-900 border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-2 overflow-x-auto">
        <span className="text-white font-bold text-sm whitespace-nowrap py-3 pr-4 border-r border-gray-700 mr-2">
          TIMEPROOF Training
        </span>
        {studyLinks.map(({ href, label }) => {
          const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
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
        {userName && (
          <span className="ml-auto text-xs text-gray-400 whitespace-nowrap pr-3 py-3 flex-shrink-0">
            {userName}
          </span>
        )}
        <Link
          href="/training"
          className={`${userName ? "" : "ml-auto"} px-4 py-2 text-sm font-semibold rounded-lg whitespace-nowrap transition-colors flex-shrink-0`}
          style={{ backgroundColor: "#C8A84B", color: "#0B1F3A" }}
        >
          Training Drills →
        </Link>
      </div>
    </nav>
  );
}
