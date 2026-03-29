import type { NEPQStep, CoachHintWithSignal } from "@/lib/types";

export function parseCoachResponse(raw: string): CoachHintWithSignal {
  try {
    const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/, "").trim();
    const parsed = JSON.parse(cleaned);
    return {
      hint: parsed.hint || "",
      stepSignal: {
        currentStep: (parsed.stepSignal?.currentStep as NEPQStep) || 1,
        stepComplete: parsed.stepSignal?.stepComplete || false,
        reason: parsed.stepSignal?.reason || "",
      },
    };
  } catch {
    // Malformed JSON — treat as plain hint text, no step advance
    return {
      hint: raw,
      stepSignal: { currentStep: 1, stepComplete: false, reason: "" },
    };
  }
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
