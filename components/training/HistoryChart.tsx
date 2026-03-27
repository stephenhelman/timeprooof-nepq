"use client";

import { useState } from "react";
import { getScoreColor } from "@/lib/scoring";

interface DrillBar {
  score: number;
  mode: string;
  type: string;
  date: string;
}

interface HistoryChartProps {
  drills: DrillBar[];
}

export default function HistoryChart({ drills }: HistoryChartProps) {
  const [tooltip, setTooltip] = useState<{
    index: number;
    drill: DrillBar;
  } | null>(null);

  const recent = drills.slice(-12);
  const maxScore = 100;

  if (recent.length === 0) {
    return (
      <div className="h-32 flex items-center justify-center text-gray-500 text-sm">
        No drills yet
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="flex items-end gap-1.5 h-32">
        {recent.map((drill, i) => {
          const height = Math.max(4, (drill.score / maxScore) * 100);
          const color = getScoreColor(drill.score);
          return (
            <div
              key={i}
              className="flex-1 relative group cursor-pointer"
              style={{ height: "100%", display: "flex", alignItems: "flex-end" }}
              onMouseEnter={() => setTooltip({ index: i, drill })}
              onMouseLeave={() => setTooltip(null)}
            >
              <div
                className="w-full rounded-t transition-all duration-300"
                style={{
                  height: `${height}%`,
                  backgroundColor: color,
                  opacity: tooltip && tooltip.index !== i ? 0.5 : 1,
                }}
              />

              {tooltip?.index === i && (
                <div
                  className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-xs whitespace-nowrap z-10 shadow-lg"
                >
                  <p className="font-bold text-white text-sm">{drill.score}</p>
                  <p className="text-gray-400">
                    {drill.mode === "TIMEPROOF" ? "TimeProof" : "NEPQ"} ·{" "}
                    {drill.type === "OBJECTION" ? "Objection" : "Walkthrough"}
                  </p>
                  <p className="text-gray-500">{drill.date}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex justify-between text-xs text-gray-600 mt-1">
        <span>Older</span>
        <span>Recent</span>
      </div>
    </div>
  );
}
