"use client";

import ScoreRing from "./ScoreRing";
import { getScoreLabel, getCriterionColor } from "@/lib/scoring";
import type { DebriefResult, TrainingMode } from "@/lib/types";
import { TIMEPROOF_CRITERIA, NEPQ_CRITERIA } from "@/lib/scoring";

interface DebriefPanelProps {
  debrief: DebriefResult;
  mode: TrainingMode;
  onDrillAgain: () => void;
  onNewConfig: () => void;
}

export default function DebriefPanel({
  debrief,
  mode,
  onDrillAgain,
  onNewConfig,
}: DebriefPanelProps) {
  const criteria = mode === "timeproof" ? TIMEPROOF_CRITERIA : NEPQ_CRITERIA;

  return (
    <div className="space-y-6 pb-8">
      {/* Score header */}
      <div className="flex items-start gap-5">
        <ScoreRing score={debrief.overallScore} size={100} />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-sm font-bold px-2.5 py-0.5 rounded-full"
              style={{
                backgroundColor: "rgba(255,255,255,0.1)",
                color: "white",
              }}
            >
              {getScoreLabel(debrief.overallScore)}
            </span>
            <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">
              {mode === "timeproof" ? "TimeProof" : "NEPQ"} Mode
            </span>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed italic">
            &ldquo;{debrief.oneLiner}&rdquo;
          </p>
        </div>
      </div>

      {/* Criteria bars */}
      <div className="space-y-3">
        {criteria.map((c) => {
          const result = debrief.criteria[c.id];
          if (!result) return null;
          const barColor = getCriterionColor(result.score);
          return (
            <div key={c.id}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-gray-300">{c.label}</span>
                <span className="text-xs font-bold" style={{ color: barColor }}>
                  {result.score}/10
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-1.5">
                <div
                  className="h-1.5 rounded-full transition-all duration-700"
                  style={{
                    width: `${(result.score / 10) * 100}%`,
                    backgroundColor: barColor,
                  }}
                />
              </div>
              {result.note && (
                <p className="text-xs text-gray-500 mt-0.5">{result.note}</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Best moment */}
      <div className="rounded-xl p-4 border-l-4 border-green-500 bg-green-950/20">
        <p className="text-xs font-semibold text-green-400 mb-1 uppercase tracking-wide">
          Best Moment
        </p>
        <p className="text-gray-300 text-sm">{debrief.bestMoment}</p>
      </div>

      {/* Fix this */}
      <div className="rounded-xl p-4 border-l-4 border-red-500 bg-red-950/20">
        <p className="text-xs font-semibold text-red-400 mb-1 uppercase tracking-wide">
          Fix This
        </p>
        <p className="text-gray-300 text-sm">{debrief.fixThis}</p>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onDrillAgain}
          className="flex-1 py-3 rounded-xl font-semibold text-sm text-white transition-colors"
          style={{ backgroundColor: "#0B1F3A" }}
        >
          Drill Again
        </button>
        <button
          onClick={onNewConfig}
          className="flex-1 py-3 rounded-xl font-semibold text-sm transition-colors border border-gray-600 text-gray-300 hover:bg-gray-800"
        >
          New Config
        </button>
      </div>
    </div>
  );
}
