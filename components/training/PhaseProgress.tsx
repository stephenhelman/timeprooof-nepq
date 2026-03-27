"use client";

import { Check } from "lucide-react";
import { useRef, useEffect } from "react";

interface Phase {
  id: string;
  label: string;
}

interface PhaseProgressProps {
  phases: Phase[];
  currentPhaseId: string;
  completedPhaseIds: string[];
}

export default function PhaseProgress({
  phases,
  currentPhaseId,
  completedPhaseIds,
}: PhaseProgressProps) {
  const currentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    currentRef.current?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [currentPhaseId]);

  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex items-center gap-0 min-w-max px-4">
        {phases.map((phase, i) => {
          const isCompleted = completedPhaseIds.includes(phase.id);
          const isCurrent = phase.id === currentPhaseId;
          const isUpcoming = !isCompleted && !isCurrent;

          return (
            <div key={phase.id} className="flex items-center">
              {/* Phase node */}
              <div
                ref={isCurrent ? currentRef : undefined}
                className="flex flex-col items-center"
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                  style={{
                    backgroundColor: isCompleted
                      ? "#22c55e"
                      : isCurrent
                      ? "#C8A84B"
                      : "#374151",
                    color: isCompleted || isCurrent ? "#0B1F3A" : "#6b7280",
                  }}
                >
                  {isCompleted ? (
                    <Check className="w-3.5 h-3.5" strokeWidth={3} />
                  ) : (
                    i + 1
                  )}
                </div>
                <span
                  className="text-xs mt-1 text-center max-w-16 leading-tight"
                  style={{
                    color: isCompleted
                      ? "#22c55e"
                      : isCurrent
                      ? "#C8A84B"
                      : "#6b7280",
                    fontWeight: isCurrent ? 600 : 400,
                  }}
                >
                  {phase.label.replace(/Phase \d+ — /, "").replace(/Slide \d+ — /, "")}
                </span>
              </div>

              {/* Connector */}
              {i < phases.length - 1 && (
                <div
                  className="w-4 h-0.5 mx-0.5 mt-[-1.25rem] transition-colors"
                  style={{
                    backgroundColor: isCompleted ? "#22c55e" : "#374151",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
