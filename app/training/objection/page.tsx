"use client";

import { useState, useCallback, useEffect } from "react";
import ModeToggle from "@/components/training/ModeToggle";
import MicButton from "@/components/training/MicButton";
import ChatTranscript from "@/components/training/ChatTranscript";
import CoachHint from "@/components/training/CoachHint";
import DebriefPanel from "@/components/training/DebriefPanel";
import NEPQStepTracker from "@/components/training/NEPQStepTracker";
import { OBJECTION_CORES, OBJECTION_CONTEXT_CARDS } from "@/lib/constants";
import { generateScenario } from "@/lib/scenarios";
import { transcribeAudio, callClaude, speakText, createSession, saveMessage, completeSession } from "@/lib/api";
import { homeownerSystemPrompt, coachHintPrompt, debriefPrompt } from "@/lib/prompts";
import { parseCoachResponse, computeNextStepState, allStepsComplete } from "@/lib/stepAdvance";
import type {
  TrainingMode,
  Intensity,
  ChatMessage,
  DebriefResult,
  DrillScenario,
  NEPQStep,
  PresentationContext,
} from "@/lib/types";
import { ChevronDown, ChevronUp, Type, Mic, RefreshCw, Lock } from "lucide-react";
import TTSProviderPicker from "@/components/training/TTSProviderPicker";

type Screen = "config" | "drill" | "debrief";

const CORES = ["price", "urgency", "trust"] as const;
const INTENSITIES: Intensity[] = ["mild", "firm", "hostile"];

interface PresetScenarioItem {
  id: string;
  slug: string;
  tier: number;
  title: string;
  subtitle: string;
  unlocked: boolean;
  scenarioJson: DrillScenario;
}

// Build a PresentationContext from a context card + scenario for objection drills
function buildObjectionContext(
  contextCardId: string,
  scenario: DrillScenario | null,
  objectionTrigger: string,
): PresentationContext {
  const card = OBJECTION_CONTEXT_CARDS.find((c) => c.id === contextCardId) ?? OBJECTION_CONTEXT_CARDS[3];

  return {
    homeownerName: scenario?.homeowner.name ?? "Robert",
    homeownerPersonality: scenario?.homeowner.personality ?? "no-strong-bias",
    roofAge: scenario?.roof.age ?? 14,
    roofSeverity: scenario?.roof.severity ?? "moderate",
    damageFindings: scenario?.findings.map((f) => f.repNarration) ?? [],
    urgencySummary: scenario?.urgencySummary ?? "Moderate roof damage requiring attention.",
    phasesCompleted: card.phasesCompleted,
    keyMomentsFromPriorPhases: card.keyMoments,
    robertCurrentMood: card.robertMood,
    robertExpectation: card.robertExpectation,
    objectionTrigger,
    presentationMoment: card.label,
  };
}

export default function ObjectionDrillPage() {
  const [screen, setScreen] = useState<Screen>("config");
  const [mode, setMode] = useState<TrainingMode>("timeproof");
  const [selectedCore, setSelectedCore] = useState<string>("price");
  const [selectedVariation, setSelectedVariation] = useState<string>("p1");
  const [intensity, setIntensity] = useState<Intensity>("mild");
  const [contextCardId, setContextCardId] = useState<string>("after-product");
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  // Scenario selection
  const [presetScenarios, setPresetScenarios] = useState<PresetScenarioItem[]>([]);
  const [presetsLoading, setPresetsLoading] = useState(true);
  const [selectedPreset, setSelectedPreset] = useState<PresetScenarioItem | null>(null);
  const [generatedScenario, setGeneratedScenario] = useState<DrillScenario | null>(null);
  const [scenarioMode, setScenarioMode] = useState<"preset" | "quick" | "skip">("skip");

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [coachHint, setCoachHint] = useState<string | null>(null);
  const [micState, setMicState] = useState<"idle" | "recording" | "processing" | "speaking">("idle");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [showRef, setShowRef] = useState(false);
  const [currentStep, setCurrentStep] = useState<NEPQStep>(1);
  const [completedSteps, setCompletedSteps] = useState<NEPQStep[]>([]);
  const [lastHint, setLastHint] = useState<string | undefined>(undefined);
  const [useText, setUseText] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [debrief, setDebrief] = useState<DebriefResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Active drill state (captured at drill start)
  const [activeScenario, setActiveScenario] = useState<DrillScenario | null>(null);
  const [activeContext, setActiveContext] = useState<PresentationContext | null>(null);

  // Load presets
  useEffect(() => {
    fetch("/api/training/scenarios")
      .then((r) => r.json())
      .then((d: { scenarios: PresetScenarioItem[] }) => {
        setPresetScenarios(d.scenarios ?? []);
        setPresetsLoading(false);
      })
      .catch(() => setPresetsLoading(false));
  }, []);

  const core = OBJECTION_CORES[selectedCore];
  const variation = core.variations.find((v) => v.id === selectedVariation)!;
  const handlers = core.handlers[selectedVariation] ?? [];
  const selectedContextCard = OBJECTION_CONTEXT_CARDS.find((c) => c.id === contextCardId) ?? OBJECTION_CONTEXT_CARDS[3];

  // The scenario used for the drill
  const drillScenario =
    scenarioMode === "preset" && selectedPreset
      ? selectedPreset.scenarioJson
      : scenarioMode === "quick" && generatedScenario
      ? generatedScenario
      : null;

  const userMessageCount = messages.filter((m) => m.role === "user").length;
  const canDebrief = userMessageCount >= 4;

  function handleQuickGenerate() {
    // Weight personality by selected objection core
    const personalityWeights: Record<string, string[]> = {
      price: ["price-sensitive"],
      trust: ["prior-bad-experience", "skeptical"],
      urgency: ["no-strong-bias", "trusting"],
    };
    const _ = personalityWeights[selectedCore]; void _;

    const generated = generateScenario();
    setGeneratedScenario(generated);
    setScenarioMode("quick");
    setSelectedPreset(null);
  }

  async function startDrill() {
    setError(null);
    const scenario = drillScenario;
    const ctx = buildObjectionContext(
      contextCardId,
      scenario,
      selectedContextCard.objectionTrigger,
    );

    try {
      const id = await createSession({
        drillType: "objection",
        trainingMode: mode,
        objectionCore: selectedCore,
        objectionVariation: selectedVariation,
        intensity,
        scenarioJson: scenario ?? undefined,
        presetScenarioId: selectedPreset?.id ?? undefined,
        presetScenarioSlug: selectedPreset?.slug ?? undefined,
      } as Parameters<typeof createSession>[0]);
      setSessionId(id);
      setActiveScenario(scenario);
      setActiveContext(ctx);
      setMessages([]);
      setCoachHint(null);
      setCurrentStep(1);
      setCompletedSteps([]);
      setLastHint(undefined);
      setScreen("drill");

      // Build a minimal scenario if none selected (for prompt compatibility)
      const promptScenario: DrillScenario = scenario ?? {
        homeowner: {
          name: ctx.homeownerName,
          ageRange: "45-55",
          yearsInHome: 12,
          familySituation: selectedContextCard.phasesCompleted.length > 0 ? "Seated at kitchen table with rep" : "Opened door to rep",
          personality: "no-strong-bias",
          contractorHistory: "none",
          howHeardAboutUs: "Door-to-door visit",
          spousePresent: false,
        },
        roof: { age: 14, shingleType: "architectural", severity: "moderate" },
        findings: [],
        urgencySummary: "Moderate roof damage requiring attention.",
        predictedObjection: {
          core: selectedCore as "price" | "urgency" | "trust",
          variation: variation.obj,
          variationId: selectedVariation,
        },
      };

      const system = homeownerSystemPrompt({
        scenario: promptScenario,
        trainingMode: mode,
        drillType: "objection",
        intensity,
        surfaceObjection: variation.obj,
        realFear: variation.realFear,
        presentationContext: ctx,
      });

      const opening = await callClaude(
        [{ role: "user", content: "So based on everything I showed you up there today, I'd love to get the paperwork started and get this taken care of for you. What do you think?" }],
        system
      );

      const assistantMsg: ChatMessage = { role: "assistant", content: opening };
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
      if (!sessionId || !userText.trim()) return;
      setError(null);

      const userMsg: ChatMessage = { role: "user", content: userText };
      const updatedMessages = [...messages, userMsg];
      setMessages(updatedMessages);
      await saveMessage(sessionId, userMsg);

      setMicState("processing");

      const promptScenario: DrillScenario = activeScenario ?? {
        homeowner: {
          name: activeContext?.homeownerName ?? "Robert",
          ageRange: "45-55",
          yearsInHome: 12,
          familySituation: "Seated at kitchen table with rep",
          personality: "no-strong-bias",
          contractorHistory: "none",
          howHeardAboutUs: "Door-to-door visit",
          spousePresent: false,
        },
        roof: { age: 14, shingleType: "architectural", severity: "moderate" },
        findings: [],
        urgencySummary: "Moderate roof damage requiring attention.",
        predictedObjection: {
          core: selectedCore as "price" | "urgency" | "trust",
          variation: variation.obj,
          variationId: selectedVariation,
        },
      };

      try {
        const conversationStr = updatedMessages
          .filter((m) => m.role !== "coach")
          .map((m) => `${m.role === "user" ? "Rep" : "Homeowner"}: ${m.content}`)
          .join("\n");

        const coachSystem = coachHintPrompt({
          scenario: promptScenario,
          trainingMode: mode,
          drillType: "objection",
          lastUserMessage: userText,
          conversationSoFar: conversationStr,
          surfaceObjection: variation.obj,
          realFear: variation.realFear,
          presentationContext: activeContext ?? undefined,
        });

        const [rawCoach, responseText] = await Promise.all([
          callClaude([{ role: "user", content: "Evaluate this message." }], coachSystem).catch(() => ""),
          callClaude(
            updatedMessages.filter((m) => m.role !== "coach").map((m) => ({
              role: m.role as "user" | "assistant",
              content: m.content,
            })),
            homeownerSystemPrompt({
              scenario: promptScenario,
              trainingMode: mode,
              drillType: "objection",
              intensity,
              surfaceObjection: variation.obj,
              realFear: variation.realFear,
              presentationContext: activeContext ?? undefined,
            })
          ),
        ]);

        const parsed = parseCoachResponse(rawCoach);
        const hintText = parsed.hint;

        if (mode === "nepq") {
          const next = computeNextStepState(currentStep, completedSteps, parsed.stepSignal);
          setCurrentStep(next.currentStep);
          setCompletedSteps(next.completedSteps);
          setLastHint(hintText || undefined);
        }

        const coachMsg: ChatMessage = { role: "coach", content: hintText };
        const assistantMsg: ChatMessage = { role: "assistant", content: responseText };

        setCoachHint(hintText);
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
    [sessionId, messages, activeScenario, activeContext, mode, intensity, variation, selectedCore, selectedVariation, currentStep, completedSteps]
  );

  async function handleDebrief() {
    if (!sessionId) return;
    setMicState("processing");
    setError(null);

    const promptScenario: DrillScenario = activeScenario ?? {
      homeowner: {
        name: activeContext?.homeownerName ?? "Robert",
        ageRange: "45-55",
        yearsInHome: 12,
        familySituation: "Seated at kitchen table",
        personality: "no-strong-bias",
        contractorHistory: "none",
        howHeardAboutUs: "Door-to-door visit",
        spousePresent: false,
      },
      roof: { age: 14, shingleType: "architectural", severity: "moderate" },
      findings: [],
      urgencySummary: "Moderate roof damage.",
      predictedObjection: {
        core: selectedCore as "price" | "urgency" | "trust",
        variation: variation.obj,
        variationId: selectedVariation,
      },
    };

    try {
      const transcriptStr = messages
        .filter((m) => m.role !== "coach")
        .map((m) => `${m.role === "user" ? "Rep" : "Homeowner"}: ${m.content}`)
        .join("\n");

      const system = debriefPrompt({
        scenario: promptScenario,
        trainingMode: mode,
        drillType: "objection",
        transcript: transcriptStr,
      });

      const raw = await callClaude(
        [{ role: "user", content: "Score this drill." }],
        system,
        1024
      );

      const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/, "").trim();
      const result: DebriefResult = JSON.parse(cleaned);
      await completeSession(sessionId, result);
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

  // ── Config Screen ─────────────────────────────────────────────────────────
  if (screen === "config") {
    const CORE_COLORS: Record<string, string> = { price: "#A32D2D", urgency: "#b45309", trust: "#1d4ed8" };

    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">Objection Drill</h1>
          <ModeToggle mode={mode} onChange={setMode} />
        </div>

        {/* Core selector */}
        <div>
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3 block">
            Core Objection
          </label>
          <div className="grid grid-cols-3 gap-3">
            {CORES.map((c) => {
              const coreData = OBJECTION_CORES[c];
              return (
                <button
                  key={c}
                  onClick={() => {
                    setSelectedCore(c);
                    setSelectedVariation(coreData.variations[0].id);
                  }}
                  className="p-4 rounded-xl border-2 text-left transition-all"
                  style={{
                    borderColor: selectedCore === c ? coreData.color : "transparent",
                    backgroundColor: selectedCore === c ? `${coreData.color}15` : "#1f2937",
                  }}
                >
                  <span
                    className="font-bold text-sm block mb-1"
                    style={{ color: selectedCore === c ? coreData.color : "white" }}
                  >
                    {coreData.label}
                  </span>
                  <span className="text-xs text-gray-500">{coreData.variations.length} variations</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Master question */}
        <div className="bg-gray-800 rounded-xl p-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
            Master Diagnostic
          </p>
          <p className="text-white text-sm italic">&ldquo;{core.master}&rdquo;</p>
        </div>

        {/* Variation selector */}
        <div>
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3 block">
            Variation
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {core.variations.map((v) => (
              <button
                key={v.id}
                onClick={() => setSelectedVariation(v.id)}
                className="p-4 rounded-xl border-2 text-left transition-all"
                style={{
                  borderColor: selectedVariation === v.id ? core.color : "transparent",
                  backgroundColor: selectedVariation === v.id ? `${core.color}10` : "#1f2937",
                }}
              >
                <p className="font-semibold text-sm text-white mb-0.5">&ldquo;{v.obj}&rdquo;</p>
                <p className="text-xs text-gray-400">{v.sub}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Intensity */}
        <div>
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3 block">
            Resistance Level
          </label>
          <div className="flex gap-3">
            {INTENSITIES.map((lvl) => (
              <button
                key={lvl}
                onClick={() => setIntensity(lvl)}
                className="flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all border-2"
                style={{
                  borderColor: intensity === lvl ? "#C8A84B" : "transparent",
                  backgroundColor: intensity === lvl ? "rgba(200,168,75,0.15)" : "#1f2937",
                  color: intensity === lvl ? "#C8A84B" : "#9ca3af",
                }}
              >
                {lvl.charAt(0).toUpperCase() + lvl.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Context Card Selector */}
        <div className="space-y-3">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              Presentation Context
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              Where in the presentation did this objection come up?
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {OBJECTION_CONTEXT_CARDS.map((card) => {
              const isSelected = contextCardId === card.id;
              const isNatural = card.naturalObjectionCores.includes(selectedCore);
              const isExpanded = expandedCard === card.id;

              return (
                <div key={card.id} className="flex flex-col">
                  <button
                    onClick={() => {
                      setContextCardId(card.id);
                      setExpandedCard(isSelected && isExpanded ? null : card.id);
                    }}
                    className={`w-full text-left p-3 rounded-xl border-2 transition-all ${
                      isSelected
                        ? "border-blue-600 bg-blue-900/20"
                        : isNatural
                        ? "border-gray-600 bg-gray-800/60"
                        : "border-gray-800 bg-gray-900/40 opacity-70"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white leading-tight">{card.label}</p>
                        <p className="text-xs text-gray-400 mt-0.5 leading-tight">{card.subtitle}</p>
                      </div>
                      <div className="flex gap-1 shrink-0 flex-wrap justify-end">
                        {card.naturalObjectionCores.map((c) => (
                          <span
                            key={c}
                            className="text-xs px-1.5 py-0.5 rounded font-medium"
                            style={{
                              backgroundColor: `${CORE_COLORS[c] ?? "#6b7280"}20`,
                              color: CORE_COLORS[c] ?? "#9ca3af",
                            }}
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                    {isSelected && (
                      <p className="text-xs text-gray-300 mt-2 leading-relaxed">{card.description}</p>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Scenario Selector */}
        <div className="space-y-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Scenario</p>

          {/* Scenario mode tabs */}
          <div className="flex gap-2">
            {(["preset", "quick", "skip"] as const).map((sm) => (
              <button
                key={sm}
                onClick={() => {
                  setScenarioMode(sm);
                  if (sm !== "preset") setSelectedPreset(null);
                  if (sm !== "quick") setGeneratedScenario(null);
                }}
                className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                  scenarioMode === sm
                    ? "bg-gray-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:text-white"
                }`}
              >
                {sm === "preset" ? "Preset Scenario" : sm === "quick" ? "Quick Generate" : "Context Only"}
              </button>
            ))}
          </div>

          {/* Preset list */}
          {scenarioMode === "preset" && (
            <div className="space-y-1.5">
              {presetsLoading ? (
                <div className="h-16 bg-gray-800 rounded-xl animate-pulse" />
              ) : (
                presetScenarios.map((p) => {
                  if (!p.unlocked) {
                    return (
                      <div key={p.slug} className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-gray-800 bg-gray-900/40 opacity-50">
                        <Lock className="w-3 h-3 text-gray-600" />
                        <span className="text-xs text-gray-500">{p.title}</span>
                      </div>
                    );
                  }
                  const isSelected = selectedPreset?.slug === p.slug;
                  return (
                    <button
                      key={p.slug}
                      onClick={() => setSelectedPreset(isSelected ? null : p)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl border transition-colors ${
                        isSelected
                          ? "border-amber-500 bg-amber-500/10"
                          : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
                      }`}
                    >
                      <p className="text-sm font-medium text-white">{p.title}</p>
                      <p className="text-xs text-gray-400">{p.subtitle}</p>
                    </button>
                  );
                })
              )}
            </div>
          )}

          {/* Quick generate */}
          {scenarioMode === "quick" && (
            <div className="space-y-2">
              <button
                onClick={handleQuickGenerate}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                {generatedScenario ? "Regenerate" : "Quick Generate"}
              </button>
              {generatedScenario && (
                <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-3">
                  <p className="text-sm font-medium text-white">{generatedScenario.homeowner.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {generatedScenario.roof.severity} damage · {generatedScenario.homeowner.personality}
                  </p>
                  {generatedScenario.findings.length > 0 && (
                    <p className="text-xs text-gray-500 mt-1 truncate">
                      {generatedScenario.findings.map((f) => f.category).join(", ")}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Context only */}
          {scenarioMode === "skip" && (
            <p className="text-xs text-gray-500">
              Robert has no specific damage details — context card sets his history and mood.
            </p>
          )}
        </div>

        <button
          onClick={startDrill}
          className="w-full py-4 rounded-xl font-bold text-base transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#C8A84B", color: "#0B1F3A" }}
        >
          Start Drill →
        </button>
      </div>
    );
  }

  // ── Debrief Screen ────────────────────────────────────────────────────────
  if (screen === "debrief" && debrief) {
    return (
      <div className="max-w-2xl mx-auto">
        <h1 className="text-xl font-bold text-white mb-6">Debrief</h1>
        <DebriefPanel
          debrief={debrief}
          mode={mode}
          completedSteps={completedSteps}
          onDrillAgain={() => {
            setScreen("drill");
            setMessages([]);
            setDebrief(null);
            startDrill();
          }}
          onNewConfig={() => {
            setScreen("config");
            setMessages([]);
            setDebrief(null);
            setSessionId(null);
            setActiveScenario(null);
            setActiveContext(null);
          }}
        />
      </div>
    );
  }

  // ── Active Drill Screen ───────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-2xl mx-auto">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-3 shrink-0">
        <div className="flex items-center gap-2">
          <span
            className="text-xs font-bold px-2.5 py-1 rounded-full"
            style={{ backgroundColor: `${core.color}20`, color: core.color }}
          >
            {core.label}
          </span>
          <span className="text-xs text-gray-400">{variation.obj}</span>
          {selectedContextCard && (
            <span className="text-xs text-gray-500">· {selectedContextCard.label}</span>
          )}
        </div>
        <ModeToggle mode={mode} onChange={setMode} drillActive />
      </div>

      {/* NEPQ Step Tracker (NEPQ mode) or Handler Reference (TimeProof mode) */}
      {mode === "nepq" ? (
        <NEPQStepTracker
          currentStep={currentStep}
          completedSteps={completedSteps}
          objectionCore={selectedCore}
          lastHint={lastHint}
        />
      ) : (
        <div className="shrink-0 mb-2">
          <button
            onClick={() => setShowRef((s) => !s)}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
          >
            {showRef ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            Show Reference
          </button>
          {showRef && (
            <div className="mt-2 bg-gray-800 rounded-xl p-4 space-y-1">
              {handlers.map((step, i) => (
                <p key={i} className="text-xs text-gray-300 flex gap-2">
                  <span className="text-gray-500 shrink-0">{i + 1}.</span>
                  {step}
                </p>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Transcript */}
      <div className="flex-1 bg-gray-900 rounded-xl overflow-hidden flex flex-col min-h-0">
        <ChatTranscript messages={messages} />
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

      {/* Input area */}
      <div className="mt-4 shrink-0 space-y-3">
        {/* Text toggle */}
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
              className="px-4 py-3 rounded-xl font-semibold text-sm disabled:opacity-40 transition-opacity"
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

        {mode === "nepq" && allStepsComplete(completedSteps) && (
          <div className="rounded-xl p-3 border border-green-700 bg-green-950/30 flex items-center justify-between">
            <span className="text-xs font-semibold text-green-400">All 4 steps complete!</span>
            <button
              onClick={handleDebrief}
              disabled={micState !== "idle"}
              className="text-xs font-bold px-3 py-1.5 rounded-lg disabled:opacity-40 transition-opacity"
              style={{ backgroundColor: "#16a34a", color: "white" }}
            >
              Debrief →
            </button>
          </div>
        )}

        <button
          onClick={handleDebrief}
          disabled={!canDebrief || micState !== "idle"}
          className="w-full py-2.5 rounded-xl font-semibold text-sm transition-all border-2 border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {canDebrief ? "Debrief →" : `Debrief (${4 - userMessageCount} more exchanges)`}
        </button>
      </div>
      <TTSProviderPicker />
    </div>
  );
}
