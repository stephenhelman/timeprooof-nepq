import type { DrillScenario } from "@/lib/types";

const SEVERITY_COLORS: Record<string, string> = {
  none: "#22c55e",
  minor: "#eab308",
  moderate: "#f97316",
  severe: "#ef4444",
};

const SEVERITY_BG: Record<string, string> = {
  none: "rgba(34,197,94,0.15)",
  minor: "rgba(234,179,8,0.15)",
  moderate: "rgba(249,115,22,0.15)",
  severe: "rgba(239,68,68,0.15)",
};

interface InspectionReportProps {
  scenario: DrillScenario;
  onStart: () => void;
}

export default function InspectionReport({ scenario, onStart }: InspectionReportProps) {
  const { homeowner, roof, findings, urgencySummary } = scenario;
  const severityColor = SEVERITY_COLORS[roof.severity];
  const severityBg = SEVERITY_BG[roof.severity];

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div
        className="rounded-t-2xl px-6 py-4"
        style={{ backgroundColor: "#0B1F3A" }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-0.5">
              Field Inspection Report
            </p>
            <h2 className="text-lg font-bold text-white">
              TimeProof USA — El Paso
            </h2>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">
              {new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
            <p className="text-xs" style={{ color: "#C8A84B" }}>
              Drill Scenario
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-b-2xl divide-y divide-gray-700">
        {/* Homeowner */}
        <div className="px-6 py-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
            Homeowner
          </p>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
            <div>
              <span className="text-gray-500">Name: </span>
              <span className="text-white font-medium">{homeowner.name}</span>
            </div>
            <div>
              <span className="text-gray-500">Age: </span>
              <span className="text-white">{homeowner.ageRange}</span>
            </div>
            <div>
              <span className="text-gray-500">Years in home: </span>
              <span className="text-white">{homeowner.yearsInHome}</span>
            </div>
            <div>
              <span className="text-gray-500">Spouse present: </span>
              <span className="text-white">
                {homeowner.spousePresent ? "Yes" : "No"}
              </span>
            </div>
            <div className="col-span-2">
              <span className="text-gray-500">Family: </span>
              <span className="text-white">{homeowner.familySituation}</span>
            </div>
            <div className="col-span-2">
              <span className="text-gray-500">Personality: </span>
              <span className="text-white capitalize">{homeowner.personality.replace(/-/g, " ")}</span>
            </div>
            <div className="col-span-2">
              <span className="text-gray-500">How they heard: </span>
              <span className="text-white">{homeowner.howHeardAboutUs}</span>
            </div>
          </div>
        </div>

        {/* Roof Profile */}
        <div className="px-6 py-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
            Roof Profile
          </p>
          <div className="flex items-center gap-4 text-sm">
            <div>
              <span className="text-gray-500">Age: </span>
              <span className="text-white font-medium">{roof.age} years</span>
            </div>
            <div>
              <span className="text-gray-500">Type: </span>
              <span className="text-white capitalize">{roof.shingleType}</span>
            </div>
            <span
              className="text-xs font-bold px-3 py-1 rounded-full uppercase"
              style={{ color: severityColor, backgroundColor: severityBg }}
            >
              {roof.severity} Damage
            </span>
          </div>
        </div>

        {/* Damage Findings */}
        <div className="px-6 py-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">
            Damage Findings ({findings.length})
          </p>
          <div className="space-y-4">
            {findings.map((f, i) => (
              <div key={i} className="bg-gray-900 rounded-xl p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="font-bold text-white text-sm">{f.category}</p>
                  <span className="text-xs text-gray-500 shrink-0">{f.location}</span>
                </div>
                <p className="text-gray-300 text-sm italic mb-1.5">{f.repNarration}</p>
                <p className="text-gray-500 text-xs">{f.consequence}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Urgency Summary */}
        <div
          className="px-6 py-4 rounded-b-2xl"
          style={{ backgroundColor: severityBg, borderTop: `1px solid ${severityColor}40` }}
        >
          <p className="text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: severityColor }}>
            Urgency Assessment
          </p>
          <p className="text-sm text-gray-300 leading-relaxed">{urgencySummary}</p>
        </div>
      </div>

      <button
        onClick={onStart}
        className="w-full mt-6 py-4 rounded-xl font-bold text-base transition-opacity hover:opacity-90"
        style={{ backgroundColor: "#C8A84B", color: "#0B1F3A" }}
      >
        Start Drill →
      </button>
    </div>
  );
}
