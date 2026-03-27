"use client";

import { useState, useEffect } from "react";
import HistoryChart from "@/components/training/HistoryChart";
import ScoreRing from "@/components/training/ScoreRing";
import { getScoreColor, getScoreLabel } from "@/lib/scoring";

interface DrillSession {
  id: string;
  drillType: string;
  trainingMode: string;
  status: string;
  objectionCore?: string;
  objectionVariation?: string;
  overallScore?: number;
  oneLiner?: string;
  startedAt: string;
  completedAt?: string;
}

interface LeaderboardEntry {
  userId: string;
  name: string;
  branch: string | null;
  drillCount: number;
  avgScore: number;
  bestScore: number;
  lastDrillAt: string;
}

type Tab = "history" | "leaderboard";
type PeriodFilter = "week" | "month" | "all";
type ModeFilter = "all" | "timeproof" | "nepq";

export default function HistoryPage() {
  const [tab, setTab] = useState<Tab>("history");
  const [sessions, setSessions] = useState<DrillSession[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [lbLoading, setLbLoading] = useState(false);

  const [typeFilter, setTypeFilter] = useState<"all" | "objection" | "walkthrough">("all");
  const [modeFilter, setModeFilter] = useState<ModeFilter>("all");
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>("all");
  const [lbMode, setLbMode] = useState<ModeFilter>("all");
  const [lbPeriod, setLbPeriod] = useState<PeriodFilter>("all");

  useEffect(() => {
    fetch("/api/training/sessions")
      .then((r) => r.json())
      .then((data) => {
        setSessions(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (tab !== "leaderboard") return;
    setLbLoading(true);
    fetch(`/api/training/leaderboard?mode=${lbMode}&period=${lbPeriod}`)
      .then((r) => r.json())
      .then((data) => {
        setLeaderboard(Array.isArray(data) ? data : []);
        setLbLoading(false);
      })
      .catch(() => setLbLoading(false));
  }, [tab, lbMode, lbPeriod]);

  const completed = sessions.filter(
    (s) => s.status === "COMPLETED" && s.overallScore != null
  );
  const filtered = completed.filter((s) => {
    if (typeFilter !== "all" && s.drillType.toLowerCase() !== typeFilter) return false;
    if (modeFilter !== "all" && s.trainingMode.toLowerCase() !== modeFilter) return false;
    return true;
  });

  const avgScore =
    completed.length > 0
      ? Math.round(completed.reduce((acc, s) => acc + (s.overallScore ?? 0), 0) / completed.length)
      : 0;
  const bestScore = completed.length > 0 ? Math.max(...completed.map((s) => s.overallScore ?? 0)) : 0;

  // Streak: consecutive completed drills with score >= 70
  let streak = 0;
  for (const s of [...completed].reverse()) {
    if ((s.overallScore ?? 0) >= 70) streak++;
    else break;
  }

  const chartData = completed.slice(-12).map((s) => ({
    score: s.overallScore!,
    mode: s.trainingMode,
    type: s.drillType,
    date: new Date(s.startedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  }));

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-xl font-bold text-white mb-6">History & Leaderboard</h1>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-800 rounded-xl p-1 mb-6">
        {(["history", "leaderboard"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t ? "text-white" : "text-gray-400 hover:text-white"
            }`}
            style={tab === t ? { backgroundColor: "#0B1F3A" } : undefined}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* ── History Tab ── */}
      {tab === "history" && (
        <div className="space-y-6">
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-800 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Total Drills", value: completed.length },
                  { label: "Avg Score", value: avgScore || "—" },
                  { label: "Best Score", value: bestScore || "—" },
                  { label: "Streak ≥70", value: streak },
                ].map((stat) => (
                  <div key={stat.label} className="bg-gray-800 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Chart */}
              {chartData.length > 0 && (
                <div className="bg-gray-800 rounded-xl p-4">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">
                    Score Trend (Last 12 Drills)
                  </p>
                  <HistoryChart drills={chartData} />
                </div>
              )}

              {/* Filters */}
              <div className="flex gap-2 flex-wrap">
                {(["all", "objection", "walkthrough"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setTypeFilter(f)}
                    className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                      typeFilter === f
                        ? "bg-blue-600 text-white"
                        : "bg-gray-800 text-gray-400 hover:text-white"
                    }`}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
                <span className="text-gray-700">|</span>
                {(["all", "timeproof", "nepq"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setModeFilter(f)}
                    className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                      modeFilter === f
                        ? "bg-purple-600 text-white"
                        : "bg-gray-800 text-gray-400 hover:text-white"
                    }`}
                  >
                    {f === "all" ? "All Modes" : f === "timeproof" ? "TimeProof" : "NEPQ"}
                  </button>
                ))}
              </div>

              {/* Session list */}
              {filtered.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-8">No drills yet. Start your first drill!</p>
              ) : (
                <div className="space-y-2">
                  {filtered.map((s) => {
                    const scoreColor = getScoreColor(s.overallScore!);
                    return (
                      <div key={s.id} className="bg-gray-800 rounded-xl p-4 flex items-center gap-4">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                          style={{ backgroundColor: `${scoreColor}20`, color: scoreColor }}
                        >
                          {s.overallScore}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-xs text-gray-400 capitalize">
                              {s.trainingMode.toLowerCase()} ·{" "}
                              {s.drillType.toLowerCase()}
                            </span>
                            {s.objectionVariation && (
                              <span className="text-xs text-gray-500 truncate">
                                · &ldquo;{s.objectionVariation}&rdquo;
                              </span>
                            )}
                          </div>
                          {s.oneLiner && (
                            <p className="text-xs text-gray-300 truncate italic">{s.oneLiner}</p>
                          )}
                        </div>
                        <div className="text-right shrink-0">
                          <p
                            className="text-xs font-semibold"
                            style={{ color: scoreColor }}
                          >
                            {getScoreLabel(s.overallScore!)}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {new Date(s.startedAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ── Leaderboard Tab ── */}
      {tab === "leaderboard" && (
        <div className="space-y-5">
          {/* Coming soon banner */}
          <div className="bg-amber-950/30 border border-amber-700/50 rounded-xl p-4">
            <p className="text-amber-400 text-sm font-semibold">
              Leaderboard — Coming Soon
            </p>
            <p className="text-amber-300/70 text-xs mt-1">
              Leaderboard goes live once 3+ reps have completed 3+ drills each.
            </p>
          </div>

          {/* Filters */}
          <div className="flex gap-2 flex-wrap">
            {(["all", "week", "month"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setLbPeriod(f)}
                className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                  lbPeriod === f ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-400 hover:text-white"
                }`}
              >
                {f === "all" ? "All Time" : f === "week" ? "This Week" : "This Month"}
              </button>
            ))}
            <span className="text-gray-700">|</span>
            {(["all", "timeproof", "nepq"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setLbMode(f)}
                className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                  lbMode === f ? "bg-purple-600 text-white" : "bg-gray-800 text-gray-400 hover:text-white"
                }`}
              >
                {f === "all" ? "All Modes" : f === "timeproof" ? "TimeProof" : "NEPQ"}
              </button>
            ))}
          </div>

          {/* Table */}
          {lbLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-14 bg-gray-800 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="text-center py-12 text-gray-500 text-sm">
              No leaderboard data yet.
            </div>
          ) : (
            <div className="space-y-2">
              {leaderboard.map((entry, i) => (
                <div
                  key={entry.userId}
                  className="bg-gray-800 rounded-xl px-4 py-3 flex items-center gap-4"
                >
                  <span
                    className="text-lg font-bold w-7 text-center shrink-0"
                    style={{
                      color: i === 0 ? "#C8A84B" : i === 1 ? "#9ca3af" : i === 2 ? "#d97706" : "#6b7280",
                    }}
                  >
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{entry.name}</p>
                    {entry.branch && (
                      <p className="text-xs text-gray-400">{entry.branch}</p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <ScoreRing score={entry.avgScore} size={44} />
                  </div>
                  <div className="text-right shrink-0 text-xs text-gray-400">
                    <p>{entry.drillCount} drills</p>
                    <p>Best: {entry.bestScore}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
