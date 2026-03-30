"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Check, Lock, Dice5 } from "lucide-react";

interface ScenarioProgress {
  attempts: number;
  lastThreeScores: number[];
  rollingAverage: number | null;
  mastered: boolean;
  masteredAt: string | null;
}

interface ScenarioItem {
  id: string;
  slug: string;
  tier: number;
  orderInTier: number;
  title: string;
  subtitle: string;
  description: string;
  challenge: string;
  unlocked: boolean;
  progress: ScenarioProgress | null;
}

interface ScenariosResponse {
  scenarios: ScenarioItem[];
  tier2Unlocked: boolean;
  tier3Unlocked: boolean;
}

const TIER_LABELS = ["", "Foundation", "Challenge", "Random"];
const TIER_DESCRIPTIONS = [
  "",
  "Master these 4 scenarios to unlock Challenge tier.",
  "Master these 5 scenarios to unlock Random drilling.",
  "Generates unique scenarios informed by your mastered homeowner types.",
];

function ScoreBar({ value, max = 80 }: { value: number; max?: number }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="w-full bg-gray-700 rounded-full h-1.5">
      <div
        className="h-1.5 rounded-full transition-all"
        style={{
          width: `${pct}%`,
          backgroundColor: value >= max ? "#22c55e" : value >= 60 ? "#f59e0b" : "#6b7280",
        }}
      />
    </div>
  );
}

function ScenarioCard({
  scenario,
  onStart,
}: {
  scenario: ScenarioItem;
  onStart: (slug: string) => void;
}) {
  const { progress, unlocked, title, subtitle, challenge } = scenario;

  if (!unlocked) {
    return (
      <div className="rounded-xl border border-gray-800 bg-gray-900/40 p-4 opacity-60">
        <div className="flex items-center gap-2 mb-2">
          <Lock className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-semibold text-gray-500">{title}</span>
        </div>
        <p className="text-xs text-gray-600">
          Unlock by mastering Tier {scenario.tier - 1}
        </p>
      </div>
    );
  }

  const mastered = progress?.mastered ?? false;
  const avg = progress?.rollingAverage ?? null;
  const attempts = progress?.attempts ?? 0;
  const lastThree = progress?.lastThreeScores ?? [];

  return (
    <div
      className={`rounded-xl border p-4 flex flex-col gap-3 ${
        mastered
          ? "border-green-700/50 bg-green-900/10"
          : "border-gray-700 bg-gray-800/50"
      }`}
    >
      {/* Header */}
      <div>
        {mastered && (
          <div className="flex items-center gap-1.5 mb-1">
            <Check className="w-3.5 h-3.5 text-green-500" strokeWidth={3} />
            <span className="text-xs font-bold text-green-500 uppercase tracking-wide">Mastered</span>
          </div>
        )}
        <p className="text-sm font-semibold text-white">{title}</p>
        <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
      </div>

      {/* Challenge */}
      <p className="text-xs text-gray-500">
        <span className="text-gray-400 font-medium">Challenge: </span>
        {challenge}
      </p>

      {/* Progress */}
      {progress && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Attempts: {attempts}</span>
            <span className={avg !== null && avg >= 80 ? "text-green-400" : "text-gray-400"}>
              Avg: {avg !== null ? Math.round(avg) : "—"}/80
            </span>
          </div>
          {avg !== null && <ScoreBar value={avg} />}
          {lastThree.length > 0 && (
            <p className="text-xs text-gray-600">
              Last {lastThree.length}: {lastThree.join(", ")}
            </p>
          )}
          {mastered && progress.masteredAt && (
            <p className="text-xs text-green-600">
              Mastered{" "}
              {new Date(progress.masteredAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </p>
          )}
        </div>
      )}

      {/* Action */}
      <button
        onClick={() => onStart(scenario.slug)}
        className="w-full py-2 rounded-lg text-xs font-semibold transition-colors"
        style={
          mastered
            ? { backgroundColor: "#1a2e1a", color: "#4ade80", border: "1px solid #166534" }
            : { backgroundColor: "#C8A84B", color: "#0B1F3A" }
        }
      >
        {attempts === 0 ? "Start Drill" : mastered ? "Drill Again" : "Drill Again"}
      </button>
    </div>
  );
}

export default function ScenariosPage() {
  const router = useRouter();
  const [data, setData] = useState<ScenariosResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/training/scenarios")
      .then((r) => r.json())
      .then((d: ScenariosResponse) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  function handleStart(slug: string) {
    // Navigate to walkthrough with preset slug as query param
    router.push(`/training/walkthrough?preset=${slug}`);
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-800 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12 text-gray-500 text-sm">
        Failed to load scenarios.
      </div>
    );
  }

  const { scenarios, tier2Unlocked, tier3Unlocked } = data;

  const tier1 = scenarios.filter((s) => s.tier === 1);
  const tier2 = scenarios.filter((s) => s.tier === 2);

  const tier1Mastered = tier1.filter((s) => s.progress?.mastered).length;
  const tier2Mastered = tier2.filter((s) => s.progress?.mastered).length;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white">Scenario Library</h1>
        <p className="text-sm text-gray-400 mt-1">
          Master these scenarios to unlock random drilling. Each scenario must average
          80+ over your last 3 attempts to be considered mastered.
        </p>
      </div>

      {/* Progress summary */}
      <div className="space-y-2">
        {[
          {
            label: "Tier 1 — Foundation",
            mastered: tier1Mastered,
            total: tier1.length,
            unlocked: true,
          },
          {
            label: "Tier 2 — Challenge",
            mastered: tier2Mastered,
            total: tier2.length,
            unlocked: tier2Unlocked,
          },
          {
            label: "Tier 3 — Random",
            mastered: 0,
            total: 0,
            unlocked: tier3Unlocked,
            isRandom: true,
          },
        ].map((tier) => (
          <div key={tier.label} className="flex items-center gap-3 text-xs">
            <span className="w-36 text-gray-400 shrink-0">{tier.label}</span>
            {tier.isRandom ? (
              tier.unlocked ? (
                <span className="text-green-400 flex items-center gap-1">
                  <Check className="w-3 h-3" /> Unlocked
                </span>
              ) : (
                <span className="text-gray-600 flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Master all Tier 2 to unlock
                </span>
              )
            ) : (
              <>
                <div className="flex-1 bg-gray-700 rounded-full h-1.5">
                  <div
                    className="h-1.5 rounded-full transition-all"
                    style={{
                      width: `${tier.total > 0 ? (tier.mastered / tier.total) * 100 : 0}%`,
                      backgroundColor: tier.mastered === tier.total ? "#22c55e" : "#C8A84B",
                    }}
                  />
                </div>
                <span className="text-gray-400 shrink-0">
                  {tier.mastered}/{tier.total} mastered
                </span>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Tier 1 */}
      <div className="space-y-4">
        <div>
          <h2 className="text-sm font-bold text-white uppercase tracking-wide">
            Tier 1 — {TIER_LABELS[1]}
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">{TIER_DESCRIPTIONS[1]}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {tier1.map((s) => (
            <ScenarioCard key={s.slug} scenario={s} onStart={handleStart} />
          ))}
        </div>
      </div>

      {/* Tier 2 */}
      <div className="space-y-4">
        <div>
          <h2 className="text-sm font-bold text-white uppercase tracking-wide">
            Tier 2 — {TIER_LABELS[2]}
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">{TIER_DESCRIPTIONS[2]}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {tier2.map((s) => (
            <ScenarioCard key={s.slug} scenario={s} onStart={handleStart} />
          ))}
        </div>
      </div>

      {/* Tier 3 — Random */}
      <div className="space-y-4">
        <div>
          <h2 className="text-sm font-bold text-white uppercase tracking-wide">
            Tier 3 — Random
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">{TIER_DESCRIPTIONS[3]}</p>
        </div>
        <div
          className={`rounded-xl border p-5 ${
            tier3Unlocked
              ? "border-gray-700 bg-gray-800/50"
              : "border-gray-800 bg-gray-900/40 opacity-60"
          }`}
        >
          <div className="flex items-start gap-3">
            {tier3Unlocked ? (
              <Dice5 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            ) : (
              <Lock className="w-5 h-5 text-gray-600 shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">Random Scenario</p>
              {tier3Unlocked ? (
                <>
                  <p className="text-xs text-gray-400 mt-1">
                    Generates unique scenarios informed by your mastered homeowner types and damage profiles.
                  </p>
                  <button
                    onClick={() => router.push("/training/walkthrough?mode=random")}
                    className="mt-3 px-4 py-2 rounded-lg text-xs font-semibold"
                    style={{ backgroundColor: "#C8A84B", color: "#0B1F3A" }}
                  >
                    Generate Scenario
                  </button>
                </>
              ) : (
                <p className="text-xs text-gray-600 mt-1">
                  Unlocks after mastering all Tier 2 scenarios.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
