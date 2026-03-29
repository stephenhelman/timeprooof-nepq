"use client";

import { useState } from "react";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import type { NEPQStep } from "@/lib/types";
import { NEPQ_STEPS } from "@/lib/constants";

interface NEPQStepTrackerProps {
  currentStep: NEPQStep;
  completedSteps: NEPQStep[];
  objectionCore: string;
  lastHint?: string;
}

const DIAGNOSTIC_QUESTIONS: Record<string, string> = {
  price: "Is it the total investment, or more the monthly payment?",
  urgency: "What would need to happen for this to feel like the right time?",
  trust: "What specifically would you want to feel confident about before moving forward?",
};

export default function NEPQStepTracker({
  currentStep,
  completedSteps,
  objectionCore,
  lastHint,
}: NEPQStepTrackerProps) {
  const [expanded, setExpanded] = useState(false);

  const progressPct = (completedSteps.length / 4) * 100;
  const allDone = completedSteps.length === 4;
  const isGoodHint = lastHint?.startsWith("Good:");
  const isFixHint = lastHint?.startsWith("Fix:");

  const activeStep = NEPQ_STEPS.find((s) => !completedSteps.includes(s.number) && s.number === currentStep);

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 mb-3 shrink-0 overflow-hidden">
      {/* Collapsed header — always visible */}
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-700/40 transition-colors"
      >
        {/* Step dots */}
        <div className="flex items-center gap-1.5 flex-1">
          {NEPQ_STEPS.map((step) => {
            const done = completedSteps.includes(step.number);
            const active = !done && currentStep === step.number;
            return (
              <div
                key={step.number}
                className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all duration-300"
                style={{
                  backgroundColor: done ? "#16a34a" : active ? "#0B1F3A" : "transparent",
                  border: done ? "2px solid #16a34a" : active ? "2px solid #C8A84B" : "2px solid #4b5563",
                  color: done ? "white" : active ? "#C8A84B" : "#6b7280",
                }}
              >
                {done ? <Check size={10} strokeWidth={3} /> : step.number}
              </div>
            );
          })}

          {/* Active step label */}
          {activeStep && !allDone && (
            <span className="text-xs text-gray-300 ml-1 truncate">{activeStep.shortLabel}</span>
          )}
          {allDone && (
            <span className="text-xs font-semibold text-green-400 ml-1">All steps complete</span>
          )}
        </div>

        {/* Progress + chevron */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs text-gray-500">{completedSteps.length}/4</span>
          {expanded ? (
            <ChevronUp className="w-3.5 h-3.5 text-gray-400" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          )}
        </div>
      </button>

      {/* Thin progress bar always visible */}
      <div className="h-0.5 bg-gray-700">
        <div
          className="h-full transition-all duration-500 ease-out"
          style={{
            width: `${progressPct}%`,
            backgroundColor: allDone ? "#16a34a" : "#C8A84B",
          }}
        />
      </div>

      {/* Expandable body */}
      {expanded && (
        <div className="p-3 space-y-1.5 border-t border-gray-700">
          {NEPQ_STEPS.map((step) => {
            const done = completedSteps.includes(step.number);
            const active = !done && currentStep === step.number;

            return (
              <div key={step.number}>
                <div className="flex items-center gap-3">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold transition-all duration-300"
                    style={{
                      backgroundColor: done ? "#16a34a" : active ? "#0B1F3A" : "transparent",
                      border: done ? "2px solid #16a34a" : active ? "2px solid #C8A84B" : "2px solid #4b5563",
                      color: done ? "white" : active ? "#C8A84B" : "#6b7280",
                    }}
                  >
                    {done ? <Check size={12} strokeWidth={3} /> : step.number}
                  </div>
                  <span
                    className="text-sm font-medium flex-1"
                    style={{ color: done ? "#6b7280" : active ? "white" : "#6b7280" }}
                  >
                    {step.shortLabel}
                  </span>
                  {done && <span className="text-xs text-green-500 font-semibold">Done</span>}
                </div>

                {active && (
                  <div className="ml-9 mt-2 mb-1 bg-gray-900 rounded-lg p-3 border border-gray-700">
                    <div className="mb-2">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Goal</span>
                      <p className="text-xs text-gray-300 mt-0.5">{step.goal}</p>
                    </div>
                    <div className="mb-2">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Say</span>
                      <p className="text-xs text-gray-400 italic mt-0.5">{step.keyBehavior}</p>
                    </div>
                    {step.number === 2 && DIAGNOSTIC_QUESTIONS[objectionCore] && (
                      <div>
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Ask</span>
                        <p className="text-xs italic mt-0.5" style={{ color: "#C8A84B" }}>
                          &ldquo;{DIAGNOSTIC_QUESTIONS[objectionCore]}&rdquo;
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Last hint banner */}
      {lastHint && (
        <div
          className="px-3 py-2 text-xs border-t border-gray-700/50"
          style={{
            backgroundColor: isGoodHint
              ? "rgba(22,163,74,0.1)"
              : isFixHint
              ? "rgba(245,158,11,0.1)"
              : "rgba(75,85,99,0.15)",
            color: isGoodHint ? "#4ade80" : isFixHint ? "#fbbf24" : "#9ca3af",
          }}
        >
          {lastHint}
        </div>
      )}
    </div>
  );
}
