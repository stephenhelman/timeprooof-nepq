export const TIMEPROOF_CRITERIA = [
  { id: "script_adherence", label: "Script Adherence" },
  { id: "tie_downs", label: "Tie-Down Questions" },
  { id: "objection_handling", label: "Objection Handling" },
  { id: "sequence", label: "Sequence Order" },
  { id: "close_attempt", label: "Close Attempt" },
];

export const NEPQ_CRITERIA = [
  { id: "question_first", label: "Led with questions" },
  { id: "silence_discipline", label: "Silence discipline" },
  { id: "emotional_progression", label: "Emotional progression" },
  { id: "specificity", label: "Connected to their situation" },
  { id: "phase_goal_achieved", label: "Phase goal achieved" },
];

export function getScoreColor(score: number): string {
  if (score >= 75) return "#22c55e"; // green-500
  if (score >= 50) return "#f59e0b"; // amber-500
  return "#ef4444"; // red-500
}

export function getScoreLabel(score: number): string {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 50) return "Needs Work";
  return "Critical";
}

export function getCriterionColor(score: number): string {
  if (score >= 8) return "#22c55e";
  if (score >= 5) return "#f59e0b";
  return "#ef4444";
}
