"use client";

import ScoreRing from "./ScoreRing";
import { getScoreLabel, getCriterionColor } from "@/lib/scoring";
import type { DebriefResult, TrainingMode } from "@/lib/types";
import { TIMEPROOF_CRITERIA, NEPQ_CRITERIA } from "@/lib/scoring";
import { NEPQ_STEPS } from "@/lib/constants";
import type { NEPQStep } from "@/lib/types";
import { Check, X, Minus } from "lucide-react";

interface DebriefPanelProps {
  debrief: DebriefResult;
  mode: TrainingMode;
  completedSteps?: NEPQStep[];
  onDrillAgain: () => void;
  onNewConfig: () => void;
}

export default function DebriefPanel({
  debrief,
  mode,
  completedSteps,
  onDrillAgain,
  onNewConfig,
}: DebriefPanelProps) {
  const criteria = mode === "timeproof" ? TIMEPROOF_CRITERIA : NEPQ_CRITERIA;

  return (
    <div className="space-y-6 pb-8">
      {/* NEPQ step completion summary */}
      {mode === "nepq" && completedSteps !== undefined && (
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <div className="px-4 py-2.5 border-b border-gray-700">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              Step Completion
            </p>
          </div>
          <div className="divide-y divide-gray-700/50">
            {NEPQ_STEPS.map((step) => {
              const done = completedSteps.includes(step.number);
              // A step is "in progress" if it's the highest attempted but not done
              // We consider a step attempted if completedSteps has the previous step
              const prevDone = step.number === 1 || completedSteps.includes((step.number - 1) as NEPQStep);
              const inProgress = !done && prevDone && step.number <= (completedSteps.length + 1);
              return (
                <div key={step.number} className="flex items-center gap-3 px-4 py-2.5">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: done
                        ? "rgba(22,163,74,0.2)"
                        : inProgress
                        ? "rgba(245,158,11,0.15)"
                        : "rgba(107,114,128,0.15)",
                    }}
                  >
                    {done ? (
                      <Check size={11} className="text-green-500" strokeWidth={3} />
                    ) : inProgress ? (
                      <Minus size={11} className="text-amber-400" strokeWidth={3} />
                    ) : (
                      <X size={11} className="text-gray-600" strokeWidth={3} />
                    )}
                  </div>
                  <span className="text-xs font-medium text-gray-300 flex-1">
                    {step.number}. {step.shortLabel}
                  </span>
                  <span
                    className="text-xs font-medium"
                    style={{
                      color: done ? "#4ade80" : inProgress ? "#fbbf24" : "#6b7280",
                    }}
                  >
                    {done ? "Completed" : inProgress ? "In progress" : "Not reached"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

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
