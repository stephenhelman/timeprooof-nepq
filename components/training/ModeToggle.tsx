"use client";

import { Lock } from "lucide-react";
import type { TrainingMode } from "@/lib/types";

interface ModeToggleProps {
  mode: TrainingMode;
  onChange: (mode: TrainingMode) => void;
  drillActive?: boolean;
  nepqLocked?: boolean;
}

export default function ModeToggle({ mode, onChange, drillActive, nepqLocked }: ModeToggleProps) {
  function handleChange(next: TrainingMode) {
    if (next === mode) return;
    if (next === "nepq" && nepqLocked) return;
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
      {(["timeproof", "nepq"] as TrainingMode[]).map((m) => {
        const isLocked = m === "nepq" && nepqLocked;
        return (
          <button
            key={m}
            onClick={() => handleChange(m)}
            disabled={isLocked}
            title={isLocked ? "Master all TimeProof scenarios to unlock NEPQ" : undefined}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
              isLocked
                ? "text-gray-600 cursor-not-allowed"
                : mode === m
                ? "text-white shadow-sm"
                : "text-gray-400 hover:text-white"
            }`}
            style={
              !isLocked && mode === m
                ? { backgroundColor: "#0B1F3A", color: "white" }
                : undefined
            }
          >
            {isLocked && <Lock className="w-3 h-3" />}
            {m === "timeproof" ? "TimeProof" : "NEPQ"}
          </button>
        );
      })}
    </div>
  );
}
