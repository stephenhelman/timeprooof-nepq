"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { validatePassword } from "@/lib/validatePassword";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    inviteCode: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field]: "" }));
    setGeneralError(null);
  }

  function validate() {
    const errs: Record<string, string> = {};
    if (!form.firstName.trim()) errs.firstName = "First name is required.";
    if (!form.lastName.trim()) errs.lastName = "Last name is required.";
    if (!form.email.trim()) {
      errs.email = "Email is required.";
    } else if (!form.email.toLowerCase().endsWith("@timeproofusa.com")) {
      errs.email = "Must be a @timeproofusa.com work email.";
    }
    if (!form.inviteCode.trim()) errs.inviteCode = "Invite code is required.";
    const pwErr = validatePassword(form.password);
    if (pwErr) errs.password = pwErr;
    if (form.password !== form.confirmPassword)
      errs.confirmPassword = "Passwords do not match.";
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
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          inviteCode: form.inviteCode,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (res.status === 201) {
        setSuccess(true);
        setTimeout(() => router.push("/login?registered=1"), 2000);
        return;
      }

      if (res.status === 400 && data.fields) {
        const errs: Record<string, string> = {};
        for (const [k, v] of Object.entries(data.fields)) {
          errs[k] = (v as string[])[0];
        }
        setFieldErrors(errs);
        return;
      }

      if (res.status === 401) {
        setGeneralError("Registration failed. Check your invite code and try again.");
        return;
      }

      if (res.status === 409) {
        setGeneralError("An account with this email already exists.");
        return;
      }

      setGeneralError("Something went wrong. Please try again.");
    } catch {
      setGeneralError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md px-4 py-6">
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
        <h1 className="text-2xl font-bold text-white">Create Your Account</h1>
        <p className="text-gray-400 text-sm mt-1">
          Only @timeproofusa.com email addresses are accepted
        </p>
      </div>

      {/* Card */}
      <div
        className="rounded-2xl p-8 border border-gray-800"
        style={{ backgroundColor: "#0B1F3A" }}
      >
        {success ? (
          <div className="text-center py-4">
            <div className="text-green-400 font-semibold mb-2">Account created!</div>
            <p className="text-gray-400 text-sm">Redirecting to login...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {generalError && (
              <div className="bg-red-900/30 border border-red-700 rounded-lg px-4 py-3 text-red-300 text-sm">
                {generalError}
              </div>
            )}

            {/* First / Last name row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  First Name
                </label>
                <input
                  type="text"
                  value={form.firstName}
                  onChange={(e) => set("firstName", e.target.value)}
                  placeholder="Jane"
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors"
                />
                {fieldErrors.firstName && (
                  <p className="text-red-400 text-xs mt-1">{fieldErrors.firstName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Last Name
                </label>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={(e) => set("lastName", e.target.value)}
                  placeholder="Smith"
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors"
                />
                {fieldErrors.lastName && (
                  <p className="text-red-400 text-xs mt-1">{fieldErrors.lastName}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Work Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="you@timeproofusa.com"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors"
              />
              {fieldErrors.email && (
                <p className="text-red-400 text-xs mt-1">{fieldErrors.email}</p>
              )}
            </div>

            {/* Invite Code */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Invite Code
              </label>
              <input
                type="password"
                value={form.inviteCode}
                onChange={(e) => set("inviteCode", e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors"
              />
              {fieldErrors.inviteCode && (
                <p className="text-red-400 text-xs mt-1">{fieldErrors.inviteCode}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => set("password", e.target.value)}
                  placeholder="Min 8 chars, uppercase, lowercase, special"
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                  style={{ minHeight: "unset" }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="text-red-400 text-xs mt-1">{fieldErrors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={(e) => set("confirmPassword", e.target.value)}
                  placeholder="Re-enter your password"
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                  style={{ minHeight: "unset" }}
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
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
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>
        )}

        <p className="text-center text-xs text-gray-500 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-gray-400 hover:text-white">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
