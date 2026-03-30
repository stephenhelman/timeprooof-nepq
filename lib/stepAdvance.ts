import type { NEPQStep, CoachHintWithSignal } from "@/lib/types";

function extractJsonObject(raw: string): Record<string, unknown> | null {
  // Strip markdown code fences if present
  const stripped = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/, "").trim();
  // Try direct parse first
  try {
    return JSON.parse(stripped) as Record<string, unknown>;
  } catch {
    // Fall back: find the first {...} block anywhere in the string
    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");
    if (start !== -1 && end > start) {
      try {
        return JSON.parse(raw.slice(start, end + 1)) as Record<string, unknown>;
      } catch {
        // ignore
      }
    }
    return null;
  }
}

export function parseCoachResponse(raw: string): CoachHintWithSignal {
  const parsed = extractJsonObject(raw);
  if (parsed) {
    return {
      hint: (parsed.hint as string) || "",
      stepSignal: {
        currentStep: ((parsed.stepSignal as Record<string, unknown>)?.currentStep as NEPQStep) || 1,
        stepComplete: ((parsed.stepSignal as Record<string, unknown>)?.stepComplete as boolean) || false,
        reason: ((parsed.stepSignal as Record<string, unknown>)?.reason as string) || "",
      },
      phaseComplete: parsed.phaseComplete === true,
      phaseCompleteReason: (parsed.phaseCompleteReason as string) || "",
      behaviorsAchieved: Array.isArray(parsed.behaviorsAchieved) ? (parsed.behaviorsAchieved as string[]) : [],
    };
  }

  // Absolute fallback: try to pull a hint string out of the raw text
  const hintMatch = raw.match(/"hint"\s*:\s*"([^"]+)"/);
  return {
    hint: hintMatch ? hintMatch[1] : "",
    stepSignal: { currentStep: 1, stepComplete: false, reason: "" },
    phaseComplete: false,
    phaseCompleteReason: "",
    behaviorsAchieved: [],
  };
}

export function computeNextStepState(
  currentStep: NEPQStep,
  completedSteps: NEPQStep[],
  signal: CoachHintWithSignal["stepSignal"]
): { currentStep: NEPQStep; completedSteps: NEPQStep[] } {
  if (!signal.stepComplete) {
    return { currentStep, completedSteps };
  }

  const newCompleted = completedSteps.includes(currentStep)
    ? completedSteps
    : [...completedSteps, currentStep];

  const nextStep: NEPQStep =
    currentStep < 4 ? ((currentStep + 1) as NEPQStep) : 4;

  return { currentStep: nextStep, completedSteps: newCompleted };
}

export function allStepsComplete(completedSteps: NEPQStep[]): boolean {
  return ([1, 2, 3, 4] as NEPQStep[]).every((s) => completedSteps.includes(s));
}
