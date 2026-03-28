"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Copy, Eye, EyeOff, Settings } from "lucide-react";

type UserRow = {
  id: string;
  name: string | null;
  email: string;
  branch: string | null;
  role: string;
  profileComplete: boolean;
  createdAt: string;
  drillCount: number;
  avgScore: number | null;
};

function relativeDate(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? "s" : ""} ago`;
  return `${Math.floor(days / 30)} month${Math.floor(days / 30) > 1 ? "s" : ""} ago`;
}

function rolePill(role: string) {
  const styles: Record<string, string> = {
    ADMIN: "bg-yellow-900/40 text-yellow-400 border border-yellow-700",
    MANAGER: "bg-blue-900/40 text-blue-400 border border-blue-700",
    REP: "bg-gray-800 text-gray-400 border border-gray-700",
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${styles[role] ?? styles.REP}`}>
      {role}
    </span>
  );
}

function initials(name: string | null, email: string) {
  if (name) {
    const parts = name.trim().split(" ");
    return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase();
  }
  return email[0].toUpperCase();
}

const PAGE_SIZE = 20;

export default function AdminUsersClient({
  users: initialUsers,
  currentUserId,
}: {
  users: UserRow[];
  currentUserId: string;
}) {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [branchFilter, setBranchFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [inviteVisible, setInviteVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const [roleErrors, setRoleErrors] = useState<Record<string, string>>({});

  const branches = useMemo(
    () => ["all", ...Array.from(new Set(users.map((u) => u.branch ?? "—").filter(Boolean)))],
    [users]
  );

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        (u.name ?? "").toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q);
      const matchBranch = branchFilter === "all" || u.branch === branchFilter;
      const matchRole = roleFilter === "all" || u.role === roleFilter;
      return matchSearch && matchBranch && matchRole;
    });
  }, [users, search, branchFilter, roleFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  async function handleRoleChange(userId: string, newRole: string) {
    if (userId === currentUserId) return;
    const prev = users.find((u) => u.id === userId)?.role;
    // Optimistic update
    setUsers((cur) => cur.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
    setRoleErrors((e) => ({ ...e, [userId]: "" }));

    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) throw new Error();
    } catch {
      // Revert
      setUsers((cur) => cur.map((u) => (u.id === userId ? { ...u, role: prev! } : u)));
      setRoleErrors((e) => ({ ...e, [userId]: "Update failed. Try again." }));
    }
  }

  function copyInvite() {
    navigator.clipboard.writeText(process.env.NEXT_PUBLIC_INVITE_HINT ?? "timeproof2024");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const repCount = users.filter((u) => u.role === "REP").length;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Top nav */}
      <nav className="sticky top-0 z-10 bg-gray-950 border-b border-gray-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
            style={{ backgroundColor: "#0B1F3A", color: "#C8A84B" }}
          >
            TP
          </div>
          <span className="text-sm font-semibold text-gray-200">
            Admin Panel
          </span>
        </div>
        <Link
          href="/training"
          className="text-xs text-gray-400 hover:text-white flex items-center gap-1"
        >
          ← Training Hub
        </Link>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">User Management</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {repCount} active rep{repCount !== 1 ? "s" : ""} ·{" "}
              {users.length} total accounts
            </p>
          </div>
          <Settings size={18} className="text-gray-500" />
        </div>

        {/* Invite code card */}
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Current Invite Code
          </p>
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm text-white">
              {inviteVisible ? "timeproof2024" : "••••••••••••"}
            </span>
            <button
              onClick={() => setInviteVisible((v) => !v)}
              className="text-xs text-gray-400 hover:text-white px-2 py-1 rounded border border-gray-700"
              style={{ minHeight: "unset" }}
            >
              {inviteVisible ? (
                <EyeOff size={13} />
              ) : (
                <Eye size={13} />
              )}
            </button>
            <button
              onClick={copyInvite}
              className="text-xs text-gray-400 hover:text-white px-2 py-1 rounded border border-gray-700 flex items-center gap-1"
              style={{ minHeight: "unset" }}
            >
              <Copy size={13} />
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            To rotate this code, update INVITE_CODE in your environment
            variables and redeploy.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            placeholder="Search by name or email..."
            className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 w-64"
          />
          <select
            value={branchFilter}
            onChange={(e) => { setBranchFilter(e.target.value); setPage(0); }}
            className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-yellow-500"
          >
            {branches.map((b) => (
              <option key={b} value={b}>
                {b === "all" ? "All branches" : b}
              </option>
            ))}
          </select>
          <select
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); setPage(0); }}
            className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-yellow-500"
          >
            <option value="all">All roles</option>
            <option value="REP">REP</option>
            <option value="MANAGER">MANAGER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-gray-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-900/50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Name
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Branch
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Role
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Joined
                </th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Drills
                </th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Avg Score
                </th>
              </tr>
            </thead>
            <tbody>
              {paged.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-gray-800/50 hover:bg-gray-900/30 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{ backgroundColor: "#0B1F3A", color: "#C8A84B" }}
                      >
                        {initials(user.name, user.email)}
                      </div>
                      <div>
                        <div className="font-medium text-white">
                          {user.name ?? "—"}
                        </div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-300">
                    {user.branch ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    {user.id === currentUserId ? (
                      rolePill(user.role)
                    ) : (
                      <div>
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          className="bg-gray-900 border border-gray-700 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-yellow-500"
                        >
                          <option value="REP">REP</option>
                          <option value="MANAGER">MANAGER</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                        {roleErrors[user.id] && (
                          <p className="text-red-400 text-xs mt-1">
                            {roleErrors[user.id]}
                          </p>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-green-400 font-medium">
                      Active
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">
                    {relativeDate(user.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-300">
                    {user.drillCount}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {user.avgScore !== null ? (
                      <span
                        className={
                          user.avgScore >= 75
                            ? "text-green-400"
                            : user.avgScore >= 50
                            ? "text-yellow-400"
                            : "text-red-400"
                        }
                      >
                        {user.avgScore}
                      </span>
                    ) : (
                      <span className="text-gray-600">—</span>
                    )}
                  </td>
                </tr>
              ))}
              {paged.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-gray-500 text-sm"
                  >
                    No users match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>
              Showing {page * PAGE_SIZE + 1}–
              {Math.min((page + 1) * PAGE_SIZE, filtered.length)} of{" "}
              {filtered.length}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-3 py-1.5 rounded border border-gray-700 disabled:opacity-40 hover:bg-gray-800"
                style={{ minHeight: "unset" }}
              >
                ← Prev
              </button>
              <button
                onClick={() =>
                  setPage((p) => Math.min(totalPages - 1, p + 1))
                }
                disabled={page >= totalPages - 1}
                className="px-3 py-1.5 rounded border border-gray-700 disabled:opacity-40 hover:bg-gray-800"
                style={{ minHeight: "unset" }}
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
