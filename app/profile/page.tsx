"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { EXPERIENCE_LEVELS } from "@/lib/constants";
import type { ExperienceLevel } from "@/lib/types";

export default function ProfilePage() {
  const [selectedLevel, setSelectedLevel] = useState<ExperienceLevel>("rookie");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentConfig = EXPERIENCE_LEVELS.find((l) => l.id === selectedLevel) ?? EXPERIENCE_LEVELS[0];

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    setError(null);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ experienceLevel: selectedLevel }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to save");
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto space-y-8">
      <h1 className="text-xl font-bold text-white">Profile Settings</h1>

      {/* Experience Level Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-white">Experience Level</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Sets the default coaching strictness for all your drills. You can override per session.
          </p>
        </div>

        <div className="space-y-3">
          {EXPERIENCE_LEVELS.map((level) => {
            const isSelected = selectedLevel === level.id;
            return (
              <button
                key={level.id}
                onClick={() => setSelectedLevel(level.id)}
                className={`w-full text-left px-4 py-4 rounded-xl border transition-colors ${
                  isSelected
                    ? "border-amber-500 bg-amber-500/10"
                    : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${
                      isSelected ? "border-amber-500" : "border-gray-600"
                    }`}
                  >
                    {isSelected && (
                      <div className="w-2 h-2 rounded-full bg-amber-500" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{level.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{level.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Coaching approach description */}
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
            Coach approach at {currentConfig.label} level
          </p>
          <p className="text-xs text-gray-300">{currentConfig.coachingApproach}</p>
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-700 rounded-lg px-3 py-2 text-red-300 text-xs">
            {error}
          </div>
        )}

        {saved && (
          <div className="bg-green-900/30 border border-green-700 rounded-lg px-3 py-2 text-green-300 text-xs">
            Experience level updated — applies to all future drills.
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-3 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{ backgroundColor: "#C8A84B", color: "#0B1F3A" }}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
