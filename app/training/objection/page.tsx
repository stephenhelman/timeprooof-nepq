"use client";

import { useState, useCallback } from "react";
import ModeToggle from "@/components/training/ModeToggle";
import MicButton from "@/components/training/MicButton";
import ChatTranscript from "@/components/training/ChatTranscript";
import CoachHint from "@/components/training/CoachHint";
import DebriefPanel from "@/components/training/DebriefPanel";
import { OBJECTION_CORES } from "@/lib/constants";
import { transcribeAudio, callClaude, speakText, createSession, saveMessage, completeSession } from "@/lib/api";
import { homeownerSystemPrompt, coachHintPrompt, debriefPrompt } from "@/lib/prompts";
import type { TrainingMode, Intensity, ChatMessage, DebriefResult, DrillScenario } from "@/lib/types";
import { ChevronDown, ChevronUp, Type, Mic } from "lucide-react";
import TTSProviderPicker from "@/components/training/TTSProviderPicker";

type Screen = "config" | "drill" | "debrief";

const CORES = ["price", "urgency", "trust"] as const;
const INTENSITIES: Intensity[] = ["mild", "firm", "hostile"];

// Minimal scenario for objection drills (no roof findings)
function buildObjectionScenario(coreId: string, variationId: string): DrillScenario {
  const core = OBJECTION_CORES[coreId];
  const variation = core.variations.find((v) => v.id === variationId)!;
  return {
    homeowner: {
      name: "Robert",
      ageRange: "45-55",
      yearsInHome: 12,
      familySituation: "Lives with spouse",
      personality: "no-strong-bias",
      contractorHistory: "none",
      howHeardAboutUs: "Door-to-door visit",
      spousePresent: true,
    },
    roof: { age: 14, shingleType: "architectural", severity: "moderate" },
    findings: [],
    urgencySummary: "Moderate roof damage requiring attention.",
    predictedObjection: {
      core: coreId as "price" | "urgency" | "trust",
      variation: variation.obj,
      variationId,
    },
  };
}

export default function ObjectionDrillPage() {
  const [screen, setScreen] = useState<Screen>("config");
  const [mode, setMode] = useState<TrainingMode>("timeproof");
  const [selectedCore, setSelectedCore] = useState<string>("price");
  const [selectedVariation, setSelectedVariation] = useState<string>("p1");
  const [intensity, setIntensity] = useState<Intensity>("mild");

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [coachHint, setCoachHint] = useState<string | null>(null);
  const [micState, setMicState] = useState<"idle" | "recording" | "processing" | "speaking">("idle");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [showRef, setShowRef] = useState(false);
  const [useText, setUseText] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [debrief, setDebrief] = useState<DebriefResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const scenario = buildObjectionScenario(selectedCore, selectedVariation);
  const core = OBJECTION_CORES[selectedCore];
  const variation = core.variations.find((v) => v.id === selectedVariation)!;
  const handlers = core.handlers[selectedVariation] ?? [];

  const userMessageCount = messages.filter((m) => m.role === "user").length;
  const canDebrief = userMessageCount >= 4;

  async function startDrill() {
    setError(null);
    try {
      const id = await createSession({
        drillType: "objection",
        trainingMode: mode,
        objectionCore: selectedCore,
        objectionVariation: selectedVariation,
        intensity,
      });
      setSessionId(id);
      setMessages([]);
      setCoachHint(null);
      setScreen("drill");

      // Opening homeowner message
      const system = homeownerSystemPrompt({
        scenario,
        trainingMode: mode,
        drillType: "objection",
        intensity,
        surfaceObjection: variation.obj,
        realFear: variation.realFear,
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

      try {
        // Get coach hint
        const conversationStr = updatedMessages
          .filter((m) => m.role !== "coach")
          .map((m) => `${m.role === "user" ? "Rep" : "Homeowner"}: ${m.content}`)
          .join("\n");

        const coachSystem = coachHintPrompt({
          scenario,
          trainingMode: mode,
          drillType: "objection",
          lastUserMessage: userText,
          conversationSoFar: conversationStr,
        });

        const [hintText, responseText] = await Promise.all([
          callClaude([{ role: "user", content: "Evaluate this message." }], coachSystem).catch(() => ""),
          callClaude(
            updatedMessages.filter((m) => m.role !== "coach").map((m) => ({
              role: m.role as "user" | "assistant",
              content: m.content,
            })),
            homeownerSystemPrompt({
              scenario,
              trainingMode: mode,
              drillType: "objection",
              intensity,
              surfaceObjection: variation.obj,
              realFear: variation.realFear,
            })
          ),
        ]);

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
    [sessionId, messages, scenario, mode, intensity, variation]
  );

  async function handleDebrief() {
    if (!sessionId) return;
    setMicState("processing");
    setError(null);

    try {
      const transcriptStr = messages
        .filter((m) => m.role !== "coach")
        .map((m) => `${m.role === "user" ? "Rep" : "Homeowner"}: ${m.content}`)
        .join("\n");

      const system = debriefPrompt({
        scenario,
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
        </div>
        <ModeToggle mode={mode} onChange={setMode} drillActive />
      </div>

      {/* Handler reference */}
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
