"use client";

import type { TrainingMode } from "@/lib/types";

interface ModeToggleProps {
  mode: TrainingMode;
  onChange: (mode: TrainingMode) => void;
  drillActive?: boolean;
}

export default function ModeToggle({ mode, onChange, drillActive }: ModeToggleProps) {
  function handleChange(next: TrainingMode) {
    if (next === mode) return;
    if (drillActive) {
      const confirmed = window.confirm(
        "Switching modes will end your current drill. Continue?"
      );
      if (!confirmed) return;
    }
    onChange(next);
  }

  return (
    <div className="flex items-center gap-1 bg-gray-800 rounded-full p-1">
      {(["timeproof", "nepq"] as TrainingMode[]).map((m) => (
        <button
          key={m}
          onClick={() => handleChange(m)}
          className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
            mode === m
              ? "text-white shadow-sm"
              : "text-gray-400 hover:text-white"
          }`}
          style={
            mode === m
              ? { backgroundColor: "#0B1F3A", color: "white" }
              : undefined
          }
        >
          {m === "timeproof" ? "TimeProof" : "NEPQ"}
        </button>
      ))}
    </div>
  );
}
