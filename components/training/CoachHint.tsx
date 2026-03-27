"use client";

interface CoachHintProps {
  hint: string | null;
}

export default function CoachHint({ hint }: CoachHintProps) {
  if (!hint) return null;

  const isGood = hint.startsWith("Good:");
  const isFix = hint.startsWith("Fix:");

  return (
    <div
      className="flex items-start gap-2 px-3 py-2 rounded-lg text-sm animate-fadeIn"
      style={{
        backgroundColor: isGood
          ? "rgba(34,197,94,0.1)"
          : isFix
          ? "rgba(239,68,68,0.1)"
          : "rgba(107,114,128,0.1)",
        border: `1px solid ${
          isGood ? "rgba(34,197,94,0.3)" : isFix ? "rgba(239,68,68,0.3)" : "rgba(107,114,128,0.3)"
        }`,
      }}
    >
      <span
        className="font-bold shrink-0"
        style={{ color: isGood ? "#22c55e" : isFix ? "#ef4444" : "#9ca3af" }}
      >
        {isGood ? "Good:" : isFix ? "Fix:" : "Coach:"}
      </span>
      <span className="text-gray-300">
        {hint.replace(/^(Good:|Fix:|Coach:)\s*/, "")}
      </span>
    </div>
  );
}
