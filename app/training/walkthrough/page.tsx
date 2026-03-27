"use client";

import { useState, useCallback } from "react";
import ModeToggle from "@/components/training/ModeToggle";
import MicButton from "@/components/training/MicButton";
import ChatTranscript from "@/components/training/ChatTranscript";
import CoachHint from "@/components/training/CoachHint";
import DebriefPanel from "@/components/training/DebriefPanel";
import InspectionReport from "@/components/training/InspectionReport";
import PhaseProgress from "@/components/training/PhaseProgress";
import { generateScenario } from "@/lib/scenarios";
import { TIMEPROOF_SEQUENCE, NEPQ_SEQUENCE } from "@/lib/constants";
import { transcribeAudio, callClaude, speakText, createSession, saveMessage, completeSession } from "@/lib/api";
import { homeownerSystemPrompt, coachHintPrompt, debriefPrompt } from "@/lib/prompts";
import type { TrainingMode, ChatMessage, DebriefResult, DrillScenario } from "@/lib/types";
import { ChevronDown, ChevronUp, RefreshCw, Type, Mic } from "lucide-react";

type Screen = "setup" | "report" | "drill" | "debrief";

const SEVERITY_COLORS = {
  none: "#22c55e",
  minor: "#eab308",
  moderate: "#f97316",
  severe: "#ef4444",
};

export default function WalkthroughDrillPage() {
  const [screen, setScreen] = useState<Screen>("setup");
  const [mode, setMode] = useState<TrainingMode>("timeproof");
  const [scenario, setScenario] = useState<DrillScenario | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [coachHint, setCoachHint] = useState<string | null>(null);
  const [micState, setMicState] = useState<"idle" | "recording" | "processing" | "speaking">("idle");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [completedPhaseIds, setCompletedPhaseIds] = useState<string[]>([]);
  const [showPhasePanel, setShowPhasePanel] = useState(false);
  const [useText, setUseText] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [debrief, setDebrief] = useState<DebriefResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sequence = mode === "timeproof" ? TIMEPROOF_SEQUENCE : NEPQ_SEQUENCE;
  const currentPhase = sequence[currentPhaseIndex];
  const userMessageCount = messages.filter((m) => m.role === "user").length;
  const canDebrief = currentPhaseIndex >= 7 || userMessageCount >= 12;

  function handleGenerate() {
    setScenario(generateScenario());
  }

  async function startDrill() {
    if (!scenario) return;
    setError(null);
    setCurrentPhaseIndex(0);
    setCompletedPhaseIds([]);

    try {
      const id = await createSession({
        drillType: "walkthrough",
        trainingMode: mode,
        scenarioJson: scenario,
      });
      setSessionId(id);
      setMessages([]);
      setCoachHint(null);
      setScreen("drill");

      const system = homeownerSystemPrompt({
        scenario,
        trainingMode: mode,
        drillType: "walkthrough",
        intensity: "mild",
      });

      const opening = await callClaude(
        [{ role: "user", content: "Hello, come on in, we've been expecting you." }],
        system
      );

      const assistantMsg: ChatMessage = {
        role: "assistant",
        content: opening,
        phase: currentPhase.id,
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

        const [hintText, responseText] = await Promise.all([
          callClaude(
            [{ role: "user", content: "Evaluate this message." }],
            coachHintPrompt({
              scenario,
              trainingMode: mode,
              drillType: "walkthrough",
              currentPhase: currentPhase?.label,
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
            })
          ),
        ]);

        // Advance phase periodically based on message count
        const newPhaseIndex = Math.min(
          Math.floor(updatedMessages.filter((m) => m.role === "user").length / 3),
          sequence.length - 1
        );
        if (newPhaseIndex > currentPhaseIndex) {
          setCompletedPhaseIds((prev) => [...prev, currentPhase.id]);
          setCurrentPhaseIndex(newPhaseIndex);
        }

        const coachMsg: ChatMessage = { role: "coach", content: hintText };
        const assistantMsg: ChatMessage = {
          role: "assistant",
          content: responseText,
          phase: sequence[newPhaseIndex]?.id,
        };

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
    [sessionId, scenario, messages, mode, currentPhase, currentPhaseIndex, sequence]
  );

  async function handleDebrief() {
    if (!sessionId || !scenario) return;
    setMicState("processing");
    setError(null);

    try {
      const transcriptStr = messages
        .filter((m) => m.role !== "coach")
        .map((m) => `${m.role === "user" ? "Rep" : "Homeowner"}: ${m.content}`)
        .join("\n");

      const raw = await callClaude(
        [{ role: "user", content: "Score this drill." }],
        debriefPrompt({
          scenario,
          trainingMode: mode,
          drillType: "walkthrough",
          transcript: transcriptStr,
        })
      );

      const result: DebriefResult = JSON.parse(raw);
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

  // ── Setup Screen ──────────────────────────────────────────────────────────
  if (screen === "setup") {
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">Full Walkthrough</h1>
          <ModeToggle mode={mode} onChange={setMode} />
        </div>

        <div>
          <p className="text-sm text-gray-400 mb-4">
            Generate a randomized homeowner and roof scenario. Review the inspection
            report, then start the drill.
          </p>

          <button
            onClick={handleGenerate}
            className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-colors bg-gray-800 hover:bg-gray-700 text-white"
          >
            <RefreshCw className="w-4 h-4" />
            Generate Scenario
          </button>
        </div>

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
          Start Drill →
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
    const totalPhases = sequence.length;

    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-xl font-bold text-white">Debrief</h1>

        {/* Phase completion summary */}
        <div className="bg-gray-800 rounded-xl p-4">
          <p className="text-xs text-gray-400 uppercase font-semibold tracking-wide mb-2">
            Phase Coverage
          </p>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-gray-700 rounded-full h-2">
              <div
                className="h-2 rounded-full bg-green-500 transition-all"
                style={{ width: `${(phasesHit / totalPhases) * 100}%` }}
              />
            </div>
            <span className="text-sm font-bold text-white">
              {phasesHit}/{totalPhases}
            </span>
          </div>
        </div>

        <DebriefPanel
          debrief={debrief}
          mode={mode}
          onDrillAgain={() => {
            setScreen("setup");
            setScenario(null);
            setMessages([]);
            setDebrief(null);
            setSessionId(null);
            setCurrentPhaseIndex(0);
            setCompletedPhaseIds([]);
          }}
          onNewConfig={() => {
            setScreen("setup");
            setScenario(null);
            setMessages([]);
            setDebrief(null);
            setSessionId(null);
            setCurrentPhaseIndex(0);
            setCompletedPhaseIds([]);
          }}
        />
      </div>
    );
  }

  // ── Active Drill Screen ───────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-2xl mx-auto">
      {/* Phase progress */}
      <div className="shrink-0 mb-3">
        <PhaseProgress
          phases={sequence}
          currentPhaseId={currentPhase?.id ?? ""}
          completedPhaseIds={completedPhaseIds}
        />
      </div>

      {/* Top bar */}
      <div className="flex items-center justify-between mb-2 shrink-0">
        <div className="flex items-center gap-2">
          {currentPhase && (
            <span className="text-xs font-medium text-gray-400">
              {currentPhase.label}
            </span>
          )}
        </div>
        <ModeToggle mode={mode} onChange={setMode} drillActive />
      </div>

      {/* Current phase reference panel */}
      {currentPhase && (
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
              {"nepqGoal" in currentPhase && (
                <p className="text-xs text-amber-400 mb-2 font-medium">
                  Goal: {(currentPhase as { nepqGoal: string }).nepqGoal}
                </p>
              )}
              {"required" in currentPhase && (
                <div className="flex flex-wrap gap-1.5">
                  {(currentPhase as { required: string[] }).required.map((r, i) => (
                    <span key={i} className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded">
                      {r}
                    </span>
                  ))}
                </div>
              )}
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

        <button
          onClick={handleDebrief}
          disabled={!canDebrief || micState !== "idle"}
          className="w-full py-2.5 rounded-xl font-semibold text-sm transition-all border-2 border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {canDebrief ? "Debrief →" : "Keep going..."}
        </button>
      </div>
    </div>
  );
}
