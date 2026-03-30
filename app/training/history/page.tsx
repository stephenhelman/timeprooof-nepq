"use client";

import { useState, useEffect } from "react";
import HistoryChart from "@/components/training/HistoryChart";
import ScoreRing from "@/components/training/ScoreRing";
import { getScoreColor, getScoreLabel } from "@/lib/scoring";
import { ChevronDown, ChevronUp } from "lucide-react";
import { PRESET_SCENARIOS } from "@/lib/presetScenarios";

const PRESET_TITLE_MAP = Object.fromEntries(
  PRESET_SCENARIOS.map((p) => [p.slug, p.title])
);

interface DrillSession {
  id: string;
  drillType: string;
  trainingMode: string;
  status: string;
  objectionCore?: string;
  objectionVariation?: string;
  overallScore?: number;
  oneLiner?: string;
  phaseId?: string | null;
  experienceLevel?: string | null;
  scenarioHash?: string | null;
  presetScenarioSlug?: string | null;
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
type LevelFilter = "all" | "rookie" | "rep" | "vet";
type SourceFilter = "all" | "preset" | "random";

export default function HistoryPage() {
  const [tab, setTab] = useState<Tab>("history");
  const [sessions, setSessions] = useState<DrillSession[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [lbLoading, setLbLoading] = useState(false);

  const [typeFilter, setTypeFilter] = useState<"all" | "objection" | "walkthrough">("all");
  const [modeFilter, setModeFilter] = useState<ModeFilter>("all");
  const [levelFilter, setLevelFilter] = useState<LevelFilter>("all");
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>("all");
  const [lbMode, setLbMode] = useState<ModeFilter>("all");
  const [lbPeriod, setLbPeriod] = useState<PeriodFilter>("all");
  const [expandedHashes, setExpandedHashes] = useState<Set<string>>(new Set());
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>("all");

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
    if (levelFilter !== "all" && (s.experienceLevel ?? "rookie") !== levelFilter) return false;
    if (sourceFilter === "preset" && !s.presetScenarioSlug) return false;
    if (sourceFilter === "random" && s.presetScenarioSlug) return false;
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

  // Group filtered sessions by scenarioHash (where multiple sessions share the same hash)
  const hashCounts: Record<string, number> = {};
  for (const s of filtered) {
    if (s.scenarioHash) hashCounts[s.scenarioHash] = (hashCounts[s.scenarioHash] ?? 0) + 1;
  }
  type SessionGroup =
    | { type: "standalone"; session: DrillSession }
    | { type: "scenario_set"; hash: string; sessions: DrillSession[] };
  const sessionGroups: SessionGroup[] = [];
  const seenHashes = new Set<string>();
  for (const s of filtered) {
    const hash = s.scenarioHash;
    if (hash && hashCounts[hash] > 1) {
      if (!seenHashes.has(hash)) {
        seenHashes.add(hash);
        sessionGroups.push({
          type: "scenario_set",
          hash,
          sessions: filtered.filter((x) => x.scenarioHash === hash),
        });
      }
    } else {
      sessionGroups.push({ type: "standalone", session: s });
    }
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
                <span className="text-gray-700">|</span>
                {(["all", "rookie", "rep", "vet"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setLevelFilter(f)}
                    className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                      levelFilter === f
                        ? "bg-amber-600 text-white"
                        : "bg-gray-800 text-gray-400 hover:text-white"
                    }`}
                  >
                    {f === "all" ? "All Levels" : f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
                <span className="text-gray-700">|</span>
                {(["all", "preset", "random"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setSourceFilter(f)}
                    className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                      sourceFilter === f
                        ? "bg-green-700 text-white"
                        : "bg-gray-800 text-gray-400 hover:text-white"
                    }`}
                  >
                    {f === "all" ? "All Sources" : f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>

              {/* Session list */}
              {filtered.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-8">No drills yet. Start your first drill!</p>
              ) : (
                <div className="space-y-2">
                  {sessionGroups.map((group, gi) => {
                    if (group.type === "standalone") {
                      const s = group.session;
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
                            <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                              {s.presetScenarioSlug && PRESET_TITLE_MAP[s.presetScenarioSlug] && (
                                <span className="text-xs font-medium text-white">
                                  {PRESET_TITLE_MAP[s.presetScenarioSlug]}
                                </span>
                              )}
                              <span className="text-xs text-gray-400 capitalize">
                                {s.trainingMode.toLowerCase()}
                              </span>
                              {s.phaseId ? (
                                <span className="text-xs text-amber-400/80">
                                  · {s.phaseId.replace(/_/g, " ")}
                                </span>
                              ) : (
                                <span className="text-xs text-gray-500">
                                  · {s.drillType.toLowerCase()}
                                </span>
                              )}
                              {s.experienceLevel && (
                                <span className="text-xs text-gray-500 capitalize">
                                  · {s.experienceLevel}
                                </span>
                              )}
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
                            <p className="text-xs font-semibold" style={{ color: scoreColor }}>
                              {getScoreLabel(s.overallScore!)}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {new Date(s.startedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                            </p>
                          </div>
                        </div>
                      );
                    }

                    // Scenario set group
                    const isExpanded = expandedHashes.has(group.hash);
                    const avgGroupScore = Math.round(
                      group.sessions.reduce((a, s) => a + (s.overallScore ?? 0), 0) / group.sessions.length
                    );
                    const scenarioName = group.hash.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
                    const groupScoreColor = getScoreColor(avgGroupScore);

                    return (
                      <div key={`set_${group.hash}_${gi}`} className="rounded-xl border border-blue-700/30 overflow-hidden">
                        {/* Group header */}
                        <button
                          onClick={() => setExpandedHashes((prev) => {
                            const next = new Set(prev);
                            if (next.has(group.hash)) next.delete(group.hash);
                            else next.add(group.hash);
                            return next;
                          })}
                          className="w-full flex items-center gap-3 px-4 py-3 bg-blue-900/20 hover:bg-blue-900/30 transition-colors text-left"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold text-blue-400">Scenario set</span>
                              <span className="text-xs text-gray-400">·</span>
                              <span className="text-xs text-white font-medium truncate">{scenarioName}</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {group.sessions.length} phases · avg {avgGroupScore}
                            </p>
                          </div>
                          <div
                            className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                            style={{ backgroundColor: `${groupScoreColor}20`, color: groupScoreColor }}
                          >
                            {avgGroupScore}
                          </div>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                          )}
                        </button>

                        {/* Expanded sessions */}
                        {isExpanded && (
                          <div className="divide-y divide-gray-700/50">
                            {group.sessions.map((s) => {
                              const scoreColor = getScoreColor(s.overallScore!);
                              return (
                                <div key={s.id} className="bg-gray-800/60 px-4 py-3 flex items-center gap-3">
                                  <div
                                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                                    style={{ backgroundColor: `${scoreColor}20`, color: scoreColor }}
                                  >
                                    {s.overallScore}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      {s.phaseId && (
                                        <span className="text-xs text-amber-400/80 capitalize">
                                          {s.phaseId.replace(/_/g, " ")}
                                        </span>
                                      )}
                                      {s.experienceLevel && (
                                        <span className="text-xs text-gray-500 capitalize">
                                          · {s.experienceLevel}
                                        </span>
                                      )}
                                    </div>
                                    {s.oneLiner && (
                                      <p className="text-xs text-gray-400 truncate italic mt-0.5">{s.oneLiner}</p>
                                    )}
                                  </div>
                                  <div className="text-right shrink-0">
                                    <p className="text-xs font-semibold" style={{ color: scoreColor }}>
                                      {getScoreLabel(s.overallScore!)}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {new Date(s.startedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
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
