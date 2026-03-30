import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Settings, User } from "lucide-react";
import SignOutButton from "@/components/SignOutButton";

export default async function TrainingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Top nav */}
      <nav
        className="sticky top-0 z-50 border-b border-gray-800"
        style={{ backgroundColor: "#0B1F3A" }}
      >
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between h-12">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-gray-400 hover:text-white text-xs transition-colors flex items-center"
            >
              ← Study Guide
            </Link>
            <span className="text-gray-700">|</span>
            <Link
              href="/training"
              className="text-sm font-semibold flex items-center"
              style={{ color: "#C8A84B" }}
            >
              Training
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500">
              {session.user.name ?? session.user.email}
            </span>
            <Link
              href="/profile"
              className="text-gray-500 hover:text-gray-300 transition-colors flex items-center"
              title="Profile Settings"
            >
              <User size={14} />
            </Link>
            {session.user.role === "ADMIN" && (
              <Link
                href="/admin/users"
                className="text-gray-500 hover:text-gray-300 transition-colors flex items-center"
                title="Admin Panel"
              >
                <Settings size={14} />
              </Link>
            )}
            <SignOutButton />
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
