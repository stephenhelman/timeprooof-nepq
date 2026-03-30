"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import ModeToggle from "@/components/training/ModeToggle";
import MicButton from "@/components/training/MicButton";
import ChatTranscript from "@/components/training/ChatTranscript";
import CoachHint from "@/components/training/CoachHint";
import DebriefPanel from "@/components/training/DebriefPanel";
import InspectionReport from "@/components/training/InspectionReport";
import PhaseProgress from "@/components/training/PhaseProgress";
import { generateScenario, saveScenario, loadScenario, clearScenario, computeScenarioHash } from "@/lib/scenarios";
import { TIMEPROOF_SEQUENCE, NEPQ_SEQUENCE, TIMEPROOF_PHASES, EXPERIENCE_LEVELS, getCheckpointsForPhase, type NEPQPhaseDefinition } from "@/lib/constants";
import { transcribeAudio, callClaude, speakText, createSession, saveMessage, completeSession } from "@/lib/api";
import { homeownerSystemPrompt, coachHintPrompt, debriefPrompt } from "@/lib/prompts";
import { parseCoachResponse } from "@/lib/stepAdvance";
import type { TrainingMode, ChatMessage, DebriefResult, DrillScenario, ExperienceLevel } from "@/lib/types";
import { ChevronDown, ChevronUp, RefreshCw, Type, Mic, Lock, ClipboardList, Check } from "lucide-react";
import TTSProviderPicker from "@/components/training/TTSProviderPicker";

type Screen = "setup" | "report" | "drill" | "debrief";

const SEVERITY_COLORS = {
  none: "#22c55e",
  minor: "#eab308",
  moderate: "#f97316",
  severe: "#ef4444",
};

interface PresetScenarioItem {
  id: string;
  slug: string;
  tier: number;
  title: string;
  subtitle: string;
  description: string;
  challenge: string;
  unlocked: boolean;
  scenarioJson: DrillScenario;
  progress: { mastered: boolean; attempts: number; rollingAverage: number | null; consecutivePassCount: number } | null;
  phaseProgress: { phaseId: string; attempts: number; consecutivePassCount: number; mastered: boolean }[];
  masteredPhaseIds: string[];
}

export default function WalkthroughDrillPage() {
  const { data: sessionData } = useSession();
  const searchParams = useSearchParams();
  const profileLevel = (sessionData?.user?.experienceLevel ?? "rookie") as ExperienceLevel;

  const [screen, setScreen] = useState<Screen>("setup");
  const [mode, setMode] = useState<TrainingMode>("timeproof");
  const [scenario, setScenario] = useState<DrillScenario | null>(null);

  // Entry mode: preset or random
  const [entryMode, setEntryMode] = useState<"preset" | "random">("preset");
  const [presetScenarios, setPresetScenarios] = useState<PresetScenarioItem[]>([]);
  const [tier3Unlocked, setTier3Unlocked] = useState(false);
  const [nepqUnlocked, setNepqUnlocked] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<PresetScenarioItem | null>(null);
  const [presetsLoading, setPresetsLoading] = useState(true);

  // Unlock celebration modal
  const [unlockModal, setUnlockModal] = useState<{ tier: 2 | 3 } | null>(null);

  // Phase & experience level selectors
  const [selectedPhaseId, setSelectedPhaseId] = useState<string | null>(null); // null = full walkthrough
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>(profileLevel);
  const [showLevelDropdown, setShowLevelDropdown] = useState(false);

  // Sync experience level with profile once session loads
  useEffect(() => {
    setExperienceLevel(profileLevel);
  }, [profileLevel]);

  // Load preset scenarios
  useEffect(() => {
    fetch("/api/training/scenarios")
      .then((r) => r.json())
      .then((d: { scenarios: PresetScenarioItem[]; tier3Unlocked: boolean; nepqUnlocked: boolean }) => {
        setPresetScenarios(d.scenarios ?? []);
        setTier3Unlocked(d.tier3Unlocked ?? false);
        setNepqUnlocked(d.nepqUnlocked ?? false);
        setPresetsLoading(false);
      })
      .catch(() => setPresetsLoading(false));
  }, []);

  // Handle ?preset=slug query param from scenario library
  useEffect(() => {
    const presetSlug = searchParams.get("preset");
    if (presetSlug && presetScenarios.length > 0) {
      const found = presetScenarios.find((p) => p.slug === presetSlug);
      if (found?.unlocked) {
        setSelectedPreset(found);
        setScenario(found.scenarioJson);
        setEntryMode("preset");
      }
    }
    const urlMode = searchParams.get("mode");
    if (urlMode === "random") setEntryMode("random");
  }, [searchParams, presetScenarios]);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [coachHint, setCoachHint] = useState<string | null>(null);
  const [micState, setMicState] = useState<"idle" | "recording" | "processing" | "speaking">("idle");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [completedPhaseIds, setCompletedPhaseIds] = useState<string[]>([]);
  const [showPhasePanel, setShowPhasePanel] = useState(false);
  const [showScenarioPanel, setShowScenarioPanel] = useState(false);
  const [useText, setUseText] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [debrief, setDebrief] = useState<DebriefResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Phase complete overlay
  const [phaseComplete, setPhaseComplete] = useState(false);
  const [phaseCompleteReason, setPhaseCompleteReason] = useState("");
  const [reviewMode, setReviewMode] = useState(false); // user cancelled auto-debrief
  const autoDebriefTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Scenario reuse (localStorage)
  const [savedScenario, setSavedScenario] = useState<DrillScenario | null>(null);
  useEffect(() => {
    setSavedScenario(loadScenario());
  }, []);

  // NEPQ behaviorsAchieved tracking
  const [behaviorsAchieved, setBehaviorsAchieved] = useState<string[]>([]);

  const sequence = mode === "timeproof" ? TIMEPROOF_SEQUENCE : NEPQ_SEQUENCE;
  const currentPhase = sequence[currentPhaseIndex];
  const userMessageCount = messages.filter((m) => m.role === "user").length;
  const canDebrief = phaseComplete || currentPhaseIndex >= 7 || userMessageCount >= 12;

  // Determine which phase checkpoints to show in PhaseProgress
  const filteredSequence = selectedPhaseId && mode === "timeproof"
    ? getCheckpointsForPhase(selectedPhaseId)
    : sequence;

  // NEPQ selected phase definition (rich data)
  const nepqSelectedPhase: NEPQPhaseDefinition | null =
    selectedPhaseId && mode === "nepq"
      ? NEPQ_SEQUENCE.find((p) => p.id === selectedPhaseId) ?? null
      : null;

  function handleGenerate() {
    const masteredSlugs = presetScenarios
      .filter((p) => p.progress?.mastered)
      .map((p) => p.slug);
    setScenario(generateScenario({ unlockedSlugs: masteredSlugs }));
  }

  async function startDrill() {
    if (!scenario) return;
    setError(null);
    setCurrentPhaseIndex(0);
    setCompletedPhaseIds([]);
    setPhaseComplete(false);
    setReviewMode(false);
    setBehaviorsAchieved([]);

    // Save scenario to localStorage for reuse across phase drills
    saveScenario(scenario);
    setSavedScenario(scenario);
    const hash = computeScenarioHash(scenario);

    // For phase-specific drills, start at that phase's first checkpoint
    let startIndex = 0;
    if (selectedPhaseId && mode === "timeproof") {
      const phaseCheckpoints = getCheckpointsForPhase(selectedPhaseId);
      if (phaseCheckpoints.length > 0) {
        const idx = TIMEPROOF_SEQUENCE.findIndex((c) => c.id === phaseCheckpoints[0].id);
        startIndex = idx >= 0 ? idx : 0;
      }
    } else if (selectedPhaseId && mode === "nepq") {
      const idx = NEPQ_SEQUENCE.findIndex((p) => p.id === selectedPhaseId);
      startIndex = idx >= 0 ? idx : 0;
    }

    try {
      const id = await createSession({
        drillType: "walkthrough",
        trainingMode: mode,
        scenarioJson: scenario,
        phaseId: selectedPhaseId ?? undefined,
        experienceLevel,
        scenarioHash: hash,
        presetScenarioId: selectedPreset?.id ?? undefined,
        presetScenarioSlug: selectedPreset?.slug ?? undefined,
      } as Parameters<typeof createSession>[0]);
      setSessionId(id);
      setCurrentPhaseIndex(startIndex);
      setMessages([]);
      setCoachHint(null);
      setScreen("drill");

      // Get phase context if drilling a specific phase
      const tpPhase = selectedPhaseId && mode === "timeproof"
        ? TIMEPROOF_PHASES.find((p) => p.id === selectedPhaseId)
        : null;
      const phaseContext = tpPhase?.robertStartingContext;
      const tpCheckpoints = tpPhase ? getCheckpointsForPhase(tpPhase.id).map((c) => c.label) : undefined;

      const system = homeownerSystemPrompt({
        scenario,
        trainingMode: mode,
        drillType: "walkthrough",
        intensity: "mild",
        experienceLevel,
        phaseId: selectedPhaseId ?? undefined,
        phaseContext,
        phaseCheckpoints: tpCheckpoints,
        nepqPhase: nepqSelectedPhase ?? undefined,
      });

      const openingPrompt = phaseContext
        ? "The rep is here and ready to begin."
        : "Hello, come on in, we've been expecting you.";

      const opening = await callClaude(
        [{ role: "user", content: openingPrompt }],
        system
      );

      const firstPhase = filteredSequence[0] ?? sequence[startIndex];
      const assistantMsg: ChatMessage = {
        role: "assistant",
        content: opening,
        phase: firstPhase?.id,
      };
      setMessages([assistantMsg]);
      await saveMessage(id, assistantMsg);
      setMicState("speaking");
      await speakText(opening).catch(() => {});
      setMicState("idle");
    } catch {
      setError("Something went wrong. Check your connection and try again.");
    }
  }

  const handleUserTurn = useCallback(
    async (userText: string) => {
      if (!sessionId || !scenario || !userText.trim()) return;
      setError(null);

      const userMsg: ChatMessage = {
        role: "user",
        content: userText,
        phase: currentPhase?.id,
      };
      const updatedMessages = [...messages, userMsg];
      setMessages(updatedMessages);
      await saveMessage(sessionId, userMsg);

      setMicState("processing");

      try {
        const conversationStr = updatedMessages
          .filter((m) => m.role !== "coach")
          .map((m) => `${m.role === "user" ? "Rep" : "Homeowner"}: ${m.content}`)
          .join("\n");

        // Get phase context for homeowner prompt
        const tpPhase = selectedPhaseId && mode === "timeproof"
          ? TIMEPROOF_PHASES.find((p) => p.id === selectedPhaseId)
          : null;
        const phaseContext = tpPhase?.robertStartingContext;
        const tpCheckpoints = tpPhase ? getCheckpointsForPhase(tpPhase.id).map((c) => c.label) : undefined;

        const [hintRaw, responseText] = await Promise.all([
          callClaude(
            [{ role: "user", content: "Evaluate this message." }],
            coachHintPrompt({
              scenario,
              trainingMode: mode,
              drillType: "walkthrough",
              experienceLevel,
              currentPhase: currentPhase?.label,
              currentPhaseId: selectedPhaseId ?? undefined,
              currentCheckpoint: currentPhase?.label,
              nepqPhase: nepqSelectedPhase ?? undefined,
              lastUserMessage: userText,
              conversationSoFar: conversationStr,
            })
          ).catch(() => ""),
          callClaude(
            updatedMessages
              .filter((m) => m.role !== "coach")
              .map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
            homeownerSystemPrompt({
              scenario,
              trainingMode: mode,
              drillType: "walkthrough",
              intensity: "mild",
              experienceLevel,
              phaseId: selectedPhaseId ?? undefined,
              phaseContext,
              phaseCheckpoints: tpCheckpoints,
              nepqPhase: nepqSelectedPhase ?? undefined,
            })
          ),
        ]);

        // Parse coach response for phaseComplete signal + behaviorsAchieved
        const parsed = parseCoachResponse(hintRaw);
        if (parsed.behaviorsAchieved.length > 0) {
          setBehaviorsAchieved((prev) => {
            const merged = [...prev];
            for (const b of parsed.behaviorsAchieved) {
              if (!merged.includes(b)) merged.push(b);
            }
            return merged;
          });
        }

        // Advance checkpoint index by message count
        let newPhaseIndex = currentPhaseIndex;
        if (!selectedPhaseId) {
          // Full walkthrough: advance across entire sequence
          newPhaseIndex = Math.min(
            Math.floor(updatedMessages.filter((m) => m.role === "user").length / 3),
            sequence.length - 1
          );
          if (newPhaseIndex > currentPhaseIndex) {
            setCompletedPhaseIds((prev) => [...prev, currentPhase.id]);
            setCurrentPhaseIndex(newPhaseIndex);
          }
        } else if (mode === "timeproof") {
          // Phase drill: advance within this phase's checkpoints by message count
          const phaseCheckpoints = getCheckpointsForPhase(selectedPhaseId);
          const phaseStartIndex = sequence.findIndex((c) => c.id === phaseCheckpoints[0]?.id);
          const userMsgCount = updatedMessages.filter((m) => m.role === "user").length;
          const offsetWithinPhase = Math.min(
            Math.floor(userMsgCount / 2),
            phaseCheckpoints.length - 1
          );
          newPhaseIndex = phaseStartIndex >= 0 ? phaseStartIndex + offsetWithinPhase : currentPhaseIndex;
          if (newPhaseIndex > currentPhaseIndex) {
            setCompletedPhaseIds((prev) => [...prev, currentPhase.id]);
            setCurrentPhaseIndex(newPhaseIndex);
          }
        }

        // Handle phaseComplete signal
        if (parsed.phaseComplete && !phaseComplete) {
          setPhaseComplete(true);
          setPhaseCompleteReason(parsed.phaseCompleteReason);

          // 3-second auto-debrief countdown
          autoDebriefTimer.current = setTimeout(() => {
            runDebrief();
          }, 3000);
        }

        const coachMsg: ChatMessage = { role: "coach", content: parsed.hint };
        const assistantMsg: ChatMessage = {
          role: "assistant",
          content: responseText,
          phase: sequence[newPhaseIndex]?.id,
        };

        setCoachHint(parsed.hint);
        setMessages((prev) => [...prev, coachMsg, assistantMsg]);
        await saveMessage(sessionId, coachMsg);
        await saveMessage(sessionId, assistantMsg);

        setMicState("speaking");
        await speakText(responseText).catch(() => {});
        setMicState("idle");
      } catch {
        setMicState("idle");
        setError("Something went wrong. Check your connection and try again.");
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sessionId, scenario, messages, mode, currentPhase, currentPhaseIndex, sequence, selectedPhaseId, experienceLevel, phaseComplete]
  );

  async function runDebrief() {
    if (autoDebriefTimer.current) {
      clearTimeout(autoDebriefTimer.current);
      autoDebriefTimer.current = null;
    }
    if (!sessionId || !scenario) return;
    setMicState("processing");
    setError(null);

    try {
      const transcriptStr = messages
        .filter((m) => m.role !== "coach")
        .map((m) => `${m.role === "user" ? "Rep" : "Homeowner"}: ${m.content}`)
        .join("\n");

      const tpPhase = selectedPhaseId && mode === "timeproof"
        ? TIMEPROOF_PHASES.find((p) => p.id === selectedPhaseId)
        : null;
      const nepqPhase = selectedPhaseId && mode === "nepq"
        ? NEPQ_SEQUENCE.find((p) => p.id === selectedPhaseId)
        : null;
      const phaseName = tpPhase?.label ?? nepqPhase?.label;

      const raw = await callClaude(
        [{ role: "user", content: "Score this drill." }],
        debriefPrompt({
          scenario,
          trainingMode: mode,
          drillType: "walkthrough",
          experienceLevel,
          phaseId: selectedPhaseId ?? undefined,
          phaseName,
          transcript: transcriptStr,
        }),
        1024
      );

      const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/, "").trim();
      const result: DebriefResult = JSON.parse(cleaned);
      await completeSession(sessionId, result);

      // Post progress for preset scenario drills
      if (selectedPreset?.slug && result.overallScore != null) {
        try {
          const progressRes = await fetch(
            `/api/training/scenarios/${selectedPreset.slug}/progress`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                score: result.overallScore,
                phaseId: selectedPhaseId ?? undefined,
                trainingMode: mode,
              }),
            }
          );
          const progressData = await progressRes.json();
          if (progressData.unlocks?.nepq) setNepqUnlocked(true);
          if (progressData.unlocks?.tier2) setUnlockModal({ tier: 2 });
          else if (progressData.unlocks?.tier3) setUnlockModal({ tier: 3 });
        } catch {
          // Progress update failure is non-fatal
        }
      }

      setDebrief(result);
      setScreen("debrief");
    } catch {
      setError("Something went wrong. Check your connection and try again.");
    } finally {
      setMicState("idle");
    }
  }

  async function handleRecordingComplete(blob: Blob) {
    setMicState("processing");
    setError(null);
    try {
      const text = await transcribeAudio(blob);
      if (text.trim()) {
        await handleUserTurn(text);
      } else {
        setMicState("idle");
        setError("Couldn't understand that — try again or switch to text input.");
      }
    } catch {
      setMicState("idle");
      setError("Couldn't understand that — try again or switch to text input.");
    }
  }

  function resetAll() {
    if (autoDebriefTimer.current) {
      clearTimeout(autoDebriefTimer.current);
      autoDebriefTimer.current = null;
    }
    setScreen("setup");
    setScenario(null);
    setMessages([]);
    setDebrief(null);
    setSessionId(null);
    setCurrentPhaseIndex(0);
    setCompletedPhaseIds([]);
    setPhaseComplete(false);
    setReviewMode(false);
    setPhaseCompleteReason("");
    setBehaviorsAchieved([]);
    setSelectedPreset(null);
    setUnlockModal(null);
  }

  const levelConfig = EXPERIENCE_LEVELS.find((l) => l.id === experienceLevel) ?? EXPERIENCE_LEVELS[0];

  // ── Unlock Modal ──────────────────────────────────────────────────────────
  if (unlockModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
        <div className="bg-gray-800 border border-amber-500/40 rounded-2xl p-8 max-w-sm w-full mx-4 text-center shadow-2xl">
          <div className="text-4xl mb-3">🎉</div>
          <p className="text-amber-400 font-bold text-lg mb-1">
            Tier {unlockModal.tier} Unlocked!
          </p>
          <p className="text-gray-300 text-sm mb-2">
            {unlockModal.tier === 2
              ? "You've mastered all Foundation scenarios. Challenge scenarios are now available."
              : "You've mastered all Challenge scenarios. Random drilling is now unlocked."}
          </p>
          <div className="flex gap-2 mt-5">
            <button
              onClick={() => { setUnlockModal(null); resetAll(); }}
              className="flex-1 py-2 rounded-xl text-xs font-medium bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
            >
              Continue
            </button>
            <button
              onClick={() => { window.location.href = "/training/scenarios"; }}
              className="flex-1 py-2 rounded-xl text-xs font-semibold transition-colors"
              style={{ backgroundColor: "#C8A84B", color: "#0B1F3A" }}
            >
              View {unlockModal.tier === 2 ? "Challenge" : "Random"} Scenarios
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Setup Screen ──────────────────────────────────────────────────────────
  if (screen === "setup") {
    const tier1Presets = presetScenarios.filter((p) => p.tier === 1);
    const tier2Presets = presetScenarios.filter((p) => p.tier === 2);

    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">Full Walkthrough</h1>
          <ModeToggle mode={mode} onChange={setMode} nepqLocked={!nepqUnlocked} />
        </div>

        {/* Entry Mode Selector */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">How do you want to drill?</p>
          <div className="grid grid-cols-2 gap-2">
            {(["preset", "random"] as const).map((em) => (
              <button
                key={em}
                onClick={() => { setEntryMode(em); setSelectedPreset(null); setScenario(null); }}
                className={`px-4 py-3 rounded-xl border text-left transition-colors ${
                  entryMode === em
                    ? "border-amber-500 bg-amber-500/10"
                    : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
                }`}
              >
                <p className="text-sm font-medium text-white">
                  {em === "preset" ? "Preset Library" : "Random Scenario"}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {em === "preset"
                    ? "Master specific homeowner types in order"
                    : "Generate a unique scenario each session"}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Phase Selector */}
        <div className="space-y-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Select Phase</p>

          {/* Full walkthrough option */}
          <button
            onClick={() => setSelectedPhaseId(null)}
            className={`w-full text-left px-4 py-3 rounded-xl border transition-colors ${
              selectedPhaseId === null
                ? "border-amber-500 bg-amber-500/10"
                : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
            }`}
          >
            <span className="text-sm font-medium text-white">Full Walkthrough</span>
            <span className="text-xs text-gray-400 ml-2">all phases</span>
          </button>

          {/* TimeProof phases (only shown for timeproof mode) */}
          {mode === "timeproof" && (
            <div className="grid grid-cols-1 gap-2">
              {TIMEPROOF_PHASES.map((phase) => {
                const isSelected = selectedPhaseId === phase.id;
                const isLocked = !phase.available;
                return (
                  <button
                    key={phase.id}
                    onClick={() => !isLocked && setSelectedPhaseId(phase.id)}
                    disabled={isLocked}
                    className={`w-full text-left px-4 py-3 rounded-xl border transition-colors ${
                      isLocked
                        ? "border-gray-800 bg-gray-900/30 opacity-50 cursor-not-allowed"
                        : isSelected
                        ? "border-amber-500 bg-amber-500/10"
                        : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium text-white">
                          Phase {phase.number} — {phase.label}
                        </span>
                        <span className="text-xs text-gray-400 ml-2">{phase.subtitle}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        {isLocked ? (
                          <span className="flex items-center gap-1 text-xs text-gray-500">
                            <Lock className="w-3 h-3" />
                            Coming soon
                          </span>
                        ) : (
                          <span className="text-xs text-gray-500">
                            {phase.checkpointIds.length} checkpoints
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* NEPQ phases */}
          {mode === "nepq" && (
            <div className="grid grid-cols-1 gap-2">
              {NEPQ_SEQUENCE.map((phase) => {
                const isSelected = selectedPhaseId === phase.id;
                return (
                  <button
                    key={phase.id}
                    onClick={() => setSelectedPhaseId(phase.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl border transition-colors ${
                      isSelected
                        ? "border-amber-500 bg-amber-500/10"
                        : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
                    }`}
                  >
                    <span className="text-sm font-medium text-white">{phase.label}</span>
                    {isSelected && (
                      <p className="text-xs text-amber-400/80 mt-1">{phase.nepqGoal}</p>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Experience Level Override */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Experience Level</p>
          <div className="relative">
            <button
              onClick={() => setShowLevelDropdown((s) => !s)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 hover:border-gray-600 transition-colors text-sm"
            >
              <span className="text-white font-medium">{levelConfig.label}</span>
              <span className="text-gray-400 text-xs">{levelConfig.description}</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 ml-auto" />
            </button>
            {showLevelDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-xl z-10 overflow-hidden shadow-xl">
                {EXPERIENCE_LEVELS.map((level) => (
                  <button
                    key={level.id}
                    onClick={() => {
                      setExperienceLevel(level.id);
                      setShowLevelDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-3 transition-colors hover:bg-gray-700 ${
                      experienceLevel === level.id ? "bg-gray-700/50" : ""
                    }`}
                  >
                    <p className="text-sm font-medium text-white">{level.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{level.description}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500">{levelConfig.coachingApproach}</p>
        </div>

        {/* Scenario — Preset Mode */}
        {entryMode === "preset" && (
          <div className="space-y-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Select Scenario</p>
            {presetsLoading ? (
              <div className="h-20 bg-gray-800 rounded-xl animate-pulse" />
            ) : (
              <div className="space-y-4">
                {[
                  { label: "Tier 1 — Foundation", items: tier1Presets },
                  { label: "Tier 2 — Challenge", items: tier2Presets },
                ].map(({ label, items }) => (
                  <div key={label}>
                    <p className="text-xs text-gray-500 mb-2">{label}</p>
                    <div className="space-y-1.5">
                      {items.map((p) => {
                        const isSelected = selectedPreset?.slug === p.slug;
                        if (!p.unlocked) {
                          return (
                            <div key={p.slug} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-800 bg-gray-900/40 opacity-50">
                              <Lock className="w-3.5 h-3.5 text-gray-600" />
                              <span className="text-xs text-gray-500">{p.title}</span>
                            </div>
                          );
                        }
                        return (
                          <button
                            key={p.slug}
                            onClick={() => {
                              setSelectedPreset(p);
                              setScenario(p.scenarioJson);
                            }}
                            className={`w-full text-left px-4 py-3 rounded-xl border transition-colors ${
                              isSelected
                                ? "border-amber-500 bg-amber-500/10"
                                : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="flex items-center gap-2">
                                  {p.progress?.mastered && (
                                    <Check className="w-3 h-3 text-green-500" strokeWidth={3} />
                                  )}
                                  <span className="text-sm font-medium text-white">{p.title}</span>
                                </div>
                                <p className="text-xs text-gray-400 mt-0.5">{p.subtitle}</p>
                              </div>
                              {p.progress && (
                                <span className={`text-xs shrink-0 ml-2 ${p.progress.mastered ? "text-green-500" : "text-gray-500"}`}>
                                  {p.progress.mastered ? "Mastered" : `Avg: ${p.progress.rollingAverage != null ? Math.round(p.progress.rollingAverage) : "—"}`}
                                </span>
                              )}
                            </div>
                            {isSelected && (
                              <p className="text-xs text-gray-400 mt-2 italic">{p.challenge}</p>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Scenario — Random Mode */}
        {entryMode === "random" && (
          <div className="space-y-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Scenario</p>

            {!tier3Unlocked && (
              <div className="rounded-xl border border-gray-700 bg-gray-800/40 p-4 flex items-center gap-3">
                <Lock className="w-4 h-4 text-gray-600 shrink-0" />
                <div>
                  <p className="text-sm text-gray-400">Random drilling is locked</p>
                  <p className="text-xs text-gray-600 mt-0.5">Complete all Tier 2 scenarios to unlock</p>
                </div>
              </div>
            )}

            {tier3Unlocked && (
              <>
                {/* Saved scenario reuse card */}
                {savedScenario && !scenario && (
                  <div className="rounded-xl border border-blue-700/50 bg-blue-900/20 p-4">
                    <p className="text-xs text-blue-400 font-semibold mb-1">Saved scenario available</p>
                    <p className="text-sm text-white font-medium">{savedScenario.homeowner.name}</p>
                    <p className="text-xs text-gray-400">{savedScenario.homeowner.ageRange} · {savedScenario.roof.age}-year roof</p>
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => setScenario(savedScenario)}
                        className="flex-1 py-2 rounded-lg text-xs font-semibold bg-blue-700 hover:bg-blue-600 text-white transition-colors"
                      >
                        Use this scenario
                      </button>
                      <button
                        onClick={() => { clearScenario(); setSavedScenario(null); handleGenerate(); }}
                        className="flex-1 py-2 rounded-lg text-xs font-medium bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors"
                      >
                        Generate new
                      </button>
                    </div>
                  </div>
                )}
                {(!savedScenario || scenario) && (
                  <button
                    onClick={handleGenerate}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-colors bg-gray-800 hover:bg-gray-700 text-white"
                  >
                    <RefreshCw className="w-4 h-4" />
                    {scenario ? "Regenerate Scenario" : "Generate Scenario"}
                  </button>
                )}
              </>
            )}
          </div>
        )}

        {scenario && (
          <div
            className="rounded-2xl p-5 border border-gray-700"
            style={{ backgroundColor: "#0B1F3A" }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-white text-lg">{scenario.homeowner.name}</p>
                <p className="text-gray-400 text-sm mt-0.5">
                  {scenario.homeowner.ageRange} · {scenario.homeowner.yearsInHome} years in home
                </p>
              </div>
              <span
                className="text-xs font-bold px-3 py-1 rounded-full uppercase"
                style={{
                  color: SEVERITY_COLORS[scenario.roof.severity],
                  backgroundColor: `${SEVERITY_COLORS[scenario.roof.severity]}20`,
                }}
              >
                {scenario.roof.severity} damage
              </span>
            </div>
            <button
              onClick={() => setScreen("report")}
              className="mt-4 text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              View Full Report →
            </button>
          </div>
        )}

        <button
          onClick={() => (scenario ? setScreen("report") : undefined)}
          disabled={!scenario}
          className="w-full py-4 rounded-xl font-bold text-base transition-opacity hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ backgroundColor: "#C8A84B", color: "#0B1F3A" }}
        >
          {selectedPhaseId
            ? `Drill ${mode === "timeproof"
                ? TIMEPROOF_PHASES.find((p) => p.id === selectedPhaseId)?.label ?? selectedPhaseId
                : NEPQ_SEQUENCE.find((p) => p.id === selectedPhaseId)?.label ?? selectedPhaseId
              } →`
            : "Start Drill →"}
        </button>
      </div>
    );
  }

  // ── Inspection Report Screen ──────────────────────────────────────────────
  if (screen === "report" && scenario) {
    return (
      <div className="max-w-2xl mx-auto">
        <InspectionReport scenario={scenario} onStart={startDrill} />
      </div>
    );
  }

  // ── Debrief Screen ────────────────────────────────────────────────────────
  if (screen === "debrief" && debrief && scenario) {
    const phasesHit = completedPhaseIds.length;
    const totalPhases = filteredSequence.length;

    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">Debrief</h1>
          {selectedPhaseId && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-amber-900/40 text-amber-400 border border-amber-700/40">
              {mode === "timeproof"
                ? TIMEPROOF_PHASES.find((p) => p.id === selectedPhaseId)?.label
                : NEPQ_SEQUENCE.find((p) => p.id === selectedPhaseId)?.label}
            </span>
          )}
        </div>

        {/* Level + phase badges */}
        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 rounded-full bg-gray-700 text-gray-300">
            {levelConfig.label} level
          </span>
          {!selectedPhaseId && (
            <div className="bg-gray-800 rounded-xl p-4 flex-1">
              <p className="text-xs text-gray-400 uppercase font-semibold tracking-wide mb-2">
                Phase Coverage
              </p>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-gray-700 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-green-500 transition-all"
                    style={{ width: `${totalPhases > 0 ? (phasesHit / totalPhases) * 100 : 0}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-white">
                  {phasesHit}/{totalPhases}
                </span>
              </div>
            </div>
          )}
        </div>

        <DebriefPanel
          debrief={debrief}
          mode={mode}
          onDrillAgain={resetAll}
          onNewConfig={resetAll}
        />
      </div>
    );
  }

  // ── Active Drill Screen ───────────────────────────────────────────────────
  const displayedPhase = currentPhase ?? filteredSequence[0];

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-2xl mx-auto">
      {/* Phase badge when drilling specific phase */}
      {selectedPhaseId && (
        <div className="shrink-0 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-1 rounded-full bg-amber-900/40 text-amber-400 border border-amber-700/40 font-medium">
              {mode === "timeproof"
                ? TIMEPROOF_PHASES.find((p) => p.id === selectedPhaseId)?.label
                : NEPQ_SEQUENCE.find((p) => p.id === selectedPhaseId)?.label}
            </span>
            <span className="text-xs text-gray-500">·</span>
            <span className="text-xs text-gray-500 capitalize">{levelConfig.label} level</span>
          </div>
        </div>
      )}

      {/* Phase progress */}
      <div className="shrink-0 mb-3">
        <PhaseProgress
          phases={filteredSequence}
          currentPhaseId={displayedPhase?.id ?? ""}
          completedPhaseIds={completedPhaseIds}
        />
      </div>

      {/* Top bar */}
      <div className="flex items-center justify-between mb-2 shrink-0">
        <div className="flex items-center gap-2">
          {displayedPhase && (
            <span className="text-xs font-medium text-gray-400">
              {displayedPhase.label}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {scenario && (
            <button
              onClick={() => setShowScenarioPanel((s) => !s)}
              title="Scenario reference"
              className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg transition-colors ${
                showScenarioPanel
                  ? "bg-blue-700/40 text-blue-300 border border-blue-600/40"
                  : "text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500"
              }`}
            >
              <ClipboardList className="w-3.5 h-3.5" />
              <span>Scenario</span>
            </button>
          )}
          <ModeToggle mode={mode} onChange={setMode} drillActive nepqLocked={!nepqUnlocked} />
        </div>
      </div>

      {/* Scenario reference panel */}
      {showScenarioPanel && scenario && (
        <div className="shrink-0 mb-2 bg-gray-800 rounded-xl p-4 text-xs space-y-2 border border-gray-700">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-bold text-white text-sm">{scenario.homeowner.name}</p>
              <p className="text-gray-400 mt-0.5">
                {scenario.homeowner.ageRange} · {scenario.homeowner.yearsInHome} yrs in home · {scenario.homeowner.familySituation}
              </p>
            </div>
            <span
              className="text-xs font-bold px-2 py-0.5 rounded-full uppercase shrink-0"
              style={{
                color: SEVERITY_COLORS[scenario.roof.severity],
                backgroundColor: `${SEVERITY_COLORS[scenario.roof.severity]}20`,
              }}
            >
              {scenario.roof.severity}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-gray-400">
            <span>Personality: <span className="text-gray-300">{scenario.homeowner.personality}</span></span>
            <span>Roof age: <span className="text-gray-300">{scenario.roof.age} yrs</span></span>
            <span>Contractor history: <span className="text-gray-300">{scenario.homeowner.contractorHistory}</span></span>
            <span>Spouse present: <span className="text-gray-300">{scenario.homeowner.spousePresent ? "Yes" : "No"}</span></span>
          </div>
          <div className="pt-1 border-t border-gray-700">
            <p className="text-gray-500 mb-1">Predicted objection</p>
            <p className="text-amber-400">"{scenario.predictedObjection.variation}"</p>
          </div>
          {scenario.findings.length > 0 && (
            <div className="pt-1 border-t border-gray-700">
              <p className="text-gray-500 mb-1">Damage findings</p>
              <ul className="space-y-0.5">
                {scenario.findings.map((f, i) => (
                  <li key={i} className="text-gray-300">· {f.repNarration}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Current phase reference panel */}
      {displayedPhase && (
        <div className="shrink-0 mb-2">
          <button
            onClick={() => setShowPhasePanel((s) => !s)}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
          >
            {showPhasePanel ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            Phase Reference
          </button>
          {showPhasePanel && (
            <div className="mt-2 bg-gray-800 rounded-xl p-4">
              {"nepqGoal" in displayedPhase && (
                <p className="text-xs text-amber-400 mb-2 font-medium">
                  Goal: {(displayedPhase as { nepqGoal: string }).nepqGoal}
                </p>
              )}
              {"required" in displayedPhase && (
                <div className="flex flex-wrap gap-1.5">
                  {(displayedPhase as { required: string[] }).required.map((r, i) => (
                    <span key={i} className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded">
                      {r}
                    </span>
                  ))}
                </div>
              )}
              {/* Behaviors achieved this session */}
              {behaviorsAchieved.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-700">
                  <p className="text-xs text-gray-500 mb-1.5">Behaviors demonstrated</p>
                  <div className="flex flex-wrap gap-1.5">
                    {behaviorsAchieved.map((b, i) => (
                      <span key={i} className="text-xs bg-green-900/40 text-green-400 border border-green-700/40 px-2 py-0.5 rounded">
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Transcript */}
      <div className="flex-1 bg-gray-900 rounded-xl overflow-hidden flex flex-col min-h-0 relative">
        <ChatTranscript messages={messages} />

        {/* Phase complete overlay */}
        {phaseComplete && !reviewMode && (
          <div className="absolute inset-0 flex items-end justify-center pb-6 bg-gray-900/80 backdrop-blur-sm rounded-xl">
            <div className="bg-gray-800 border border-amber-500/40 rounded-2xl p-5 mx-4 text-center max-w-sm w-full shadow-2xl">
              <p className="text-amber-400 font-semibold text-sm mb-1">
                Phase complete
              </p>
              {selectedPhaseId && (
                <p className="text-white text-xs mb-3">
                  Great work on {
                    mode === "timeproof"
                      ? TIMEPROOF_PHASES.find((p) => p.id === selectedPhaseId)?.label
                      : NEPQ_SEQUENCE.find((p) => p.id === selectedPhaseId)?.label
                  }.
                </p>
              )}
              {phaseCompleteReason && (
                <p className="text-gray-400 text-xs mb-4 italic">{phaseCompleteReason}</p>
              )}
              <p className="text-gray-500 text-xs mb-4">Going to debrief in 3 seconds...</p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    if (autoDebriefTimer.current) {
                      clearTimeout(autoDebriefTimer.current);
                      autoDebriefTimer.current = null;
                    }
                    setReviewMode(true);
                  }}
                  className="flex-1 py-2 rounded-xl text-xs font-medium bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
                >
                  Review conversation
                </button>
                <button
                  onClick={runDebrief}
                  className="flex-1 py-2 rounded-xl text-xs font-semibold transition-colors"
                  style={{ backgroundColor: "#C8A84B", color: "#0B1F3A" }}
                >
                  Go to Debrief →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Coach hint */}
      {coachHint && (
        <div className="mt-2 shrink-0">
          <CoachHint hint={coachHint} />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-2 shrink-0 bg-red-900/30 border border-red-700 rounded-lg px-3 py-2 text-red-300 text-xs">
          {error}
        </div>
      )}

      {/* Input */}
      <div className="mt-4 shrink-0 space-y-3">
        <div className="flex justify-end">
          <button
            onClick={() => setUseText((t) => !t)}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
          >
            {useText ? <Mic className="w-3.5 h-3.5" /> : <Type className="w-3.5 h-3.5" />}
            {useText ? "Use mic" : "Type instead"}
          </button>
        </div>

        {useText ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUserTurn(textInput);
              setTextInput("");
            }}
            className="flex gap-2"
          >
            <input
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Type your response..."
              className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gray-500"
            />
            <button
              type="submit"
              disabled={!textInput.trim() || micState === "processing"}
              className="px-4 py-3 rounded-xl font-semibold text-sm disabled:opacity-40"
              style={{ backgroundColor: "#0B1F3A", color: "white" }}
            >
              Send
            </button>
          </form>
        ) : (
          <div className="flex items-center justify-center">
            <MicButton
              state={micState}
              onRecordingComplete={handleRecordingComplete}
              disabled={micState !== "idle"}
            />
          </div>
        )}

        {reviewMode && phaseComplete ? (
          <button
            onClick={runDebrief}
            disabled={micState !== "idle"}
            className="w-full py-2.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ backgroundColor: "#C8A84B", color: "#0B1F3A" }}
          >
            Debrief →
          </button>
        ) : (
          <button
            onClick={runDebrief}
            disabled={!canDebrief || micState !== "idle" || (phaseComplete && !reviewMode)}
            className="w-full py-2.5 rounded-xl font-semibold text-sm transition-all border-2 border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {canDebrief ? "Debrief →" : "Keep going..."}
          </button>
        )}
      </div>
      <TTSProviderPicker />
    </div>
  );
}
