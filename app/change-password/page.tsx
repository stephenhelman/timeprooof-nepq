"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { Eye, EyeOff } from "lucide-react";
import { validatePassword } from "@/lib/validatePassword";

export default function ChangePasswordPage() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [show, setShow] = useState({ current: false, new: false, confirm: false });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field]: "" }));
    setGeneralError(null);
  }

  function validate() {
    const errs: Record<string, string> = {};
    if (!form.currentPassword) errs.currentPassword = "Current password is required.";
    const pwErr = validatePassword(form.newPassword);
    if (pwErr) errs.newPassword = pwErr;
    if (form.newPassword !== form.confirmPassword)
      errs.confirmPassword = "Passwords do not match.";
    if (form.newPassword && form.currentPassword && form.newPassword === form.currentPassword)
      errs.newPassword = "New password must be different from your current password.";
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setGeneralError(null);
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/user/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        }),
      });

      if (res.ok) {
        // Sign out and redirect to login with success banner
        // This refreshes the JWT so mustChangePassword is cleared on next login
        await signOut({ callbackUrl: "/login?passwordChanged=1" });
        return;
      }

      const data = await res.json();
      if (res.status === 400 && data.error === "WRONG_PASSWORD") {
        setFieldErrors({ currentPassword: "Current password is incorrect." });
      } else {
        setGeneralError(data.error ?? "Failed to update password. Please try again.");
      }
    } catch {
      setGeneralError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
            style={{ backgroundColor: "#0B1F3A" }}
          >
            <span className="text-2xl font-bold" style={{ color: "#C8A84B" }}>
              TP
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white">Set a New Password</h1>
          <p className="text-gray-400 text-sm mt-1">
            Your account requires a password change before continuing.
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8 border border-gray-800"
          style={{ backgroundColor: "#0B1F3A" }}
        >
          {generalError && (
            <div className="bg-red-900/30 border border-red-700 rounded-lg px-4 py-3 text-red-300 text-sm mb-5">
              {generalError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Current Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={show.current ? "text" : "password"}
                  value={form.currentPassword}
                  onChange={(e) => set("currentPassword", e.target.value)}
                  placeholder="Enter your current password"
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => ({ ...s, current: !s.current }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                  style={{ minHeight: "unset" }}
                >
                  {show.current ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {fieldErrors.currentPassword && (
                <p className="text-red-400 text-xs mt-1">{fieldErrors.currentPassword}</p>
              )}
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                New Password
              </label>
              <div className="relative">
                <input
                  type={show.new ? "text" : "password"}
                  value={form.newPassword}
                  onChange={(e) => set("newPassword", e.target.value)}
                  placeholder="Min 8 chars, uppercase, lowercase, special"
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => ({ ...s, new: !s.new }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                  style={{ minHeight: "unset" }}
                >
                  {show.new ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {fieldErrors.newPassword && (
                <p className="text-red-400 text-xs mt-1">{fieldErrors.newPassword}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={show.confirm ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={(e) => set("confirmPassword", e.target.value)}
                  placeholder="Re-enter your new password"
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => ({ ...s, confirm: !s.confirm }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                  style={{ minHeight: "unset" }}
                >
                  {show.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {fieldErrors.confirmPassword && (
                <p className="text-red-400 text-xs mt-1">{fieldErrors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-semibold text-sm transition-opacity disabled:opacity-60"
              style={{ backgroundColor: "#C8A84B", color: "#0B1F3A" }}
            >
              {loading ? "Updating..." : "Set New Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
