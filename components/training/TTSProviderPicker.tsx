"use client";

import { useState, useEffect } from "react";
import {
  TTS_PROVIDERS,
  type TTSProvider,
  getDevProvider,
  setDevProvider,
} from "@/lib/tts";

export default function TTSProviderPicker() {
  const [activeProvider, setActiveProvider] =
    useState<TTSProvider>("elevenlabs");
  const [isOpen, setIsOpen] = useState(false);
  const [testStatus, setTestStatus] = useState<
    "idle" | "loading" | "done" | "error"
  >("idle");

  useEffect(() => {
    const stored = getDevProvider();
    if (stored) setActiveProvider(stored);
  }, []);

  // Returns null in production — zero overhead
  if (process.env.NODE_ENV !== "development") return null;

  function handleSelect(provider: TTSProvider) {
    setActiveProvider(provider);
    setDevProvider(provider);
    setTestStatus("idle");
  }

  async function handleTest() {
    setTestStatus("loading");
    try {
      const { speakText } = await import("@/lib/api");
      await speakText(
        "I'm not sure this is the right time for us. We weren't really planning on a new roof this year."
      );
      setTestStatus("done");
      setTimeout(() => setTestStatus("idle"), 2000);
    } catch {
      setTestStatus("error");
      setTimeout(() => setTestStatus("idle"), 2000);
    }
  }

  const active = TTS_PROVIDERS.find((p) => p.id === activeProvider);

  const qualityColors: Record<string, { bg: string; text: string }> = {
    Excellent: { bg: "#EAF3DE", text: "#3B6D11" },
    "Very Good": { bg: "#E6F1FB", text: "#185FA5" },
    Good: { bg: "#FAEEDA", text: "#854F0B" },
    Poor: { bg: "#F3F3F3", text: "#888" },
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 80,
        right: 16,
        zIndex: 9999,
        fontFamily: "system-ui, sans-serif",
      }}
    >
      {/* Collapsed pill */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            background: "#0B1F3A",
            color: "#C8A84B",
            border: "1px solid #C8A84B",
            borderRadius: 20,
            padding: "5px 12px",
            fontSize: 11,
            fontWeight: 600,
            cursor: "pointer",
            letterSpacing: "0.05em",
            minHeight: "unset",
          }}
        >
          DEV · TTS: {active?.label}
        </button>
      )}

      {/* Expanded panel */}
      {isOpen && (
        <div
          style={{
            background: "#fff",
            border: "1px solid #e5e5e5",
            borderRadius: 12,
            padding: "1rem",
            width: 280,
            boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#C8A84B",
                  letterSpacing: "0.08em",
                }}
              >
                DEV ONLY
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#0B1F3A" }}>
                TTS Provider
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: 18,
                color: "#aaa",
                lineHeight: 1,
                minHeight: "unset",
              }}
            >
              ×
            </button>
          </div>

          {/* Provider options */}
          {TTS_PROVIDERS.map((p) => {
            const qc = qualityColors[p.qualityRating] ?? qualityColors.Poor;
            return (
              <div
                key={p.id}
                onClick={() => handleSelect(p.id)}
                style={{
                  border:
                    activeProvider === p.id
                      ? "2px solid #0B1F3A"
                      : "1px solid #e5e5e5",
                  borderRadius: 8,
                  padding: "8px 10px",
                  marginBottom: 6,
                  cursor: "pointer",
                  background: activeProvider === p.id ? "#f8f9ff" : "#fff",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 2,
                  }}
                >
                  <span
                    style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}
                  >
                    {p.label}
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      padding: "2px 6px",
                      borderRadius: 10,
                      background: qc.bg,
                      color: qc.text,
                    }}
                  >
                    {p.qualityRating}
                  </span>
                </div>
                <div style={{ fontSize: 11, color: "#888", marginBottom: 2 }}>
                  {p.voiceNote}
                </div>
                <div style={{ fontSize: 10, color: "#bbb" }}>
                  {p.costPer1kChars} · {p.latency} latency
                </div>
              </div>
            );
          })}

          {/* Test button */}
          <button
            onClick={handleTest}
            disabled={testStatus === "loading"}
            style={{
              width: "100%",
              marginTop: 4,
              padding: "8px",
              borderRadius: 8,
              border: "none",
              background:
                testStatus === "done"
                  ? "#1D9E75"
                  : testStatus === "error"
                  ? "#A32D2D"
                  : "#0B1F3A",
              color: "#fff",
              fontSize: 12,
              fontWeight: 600,
              cursor: testStatus === "loading" ? "not-allowed" : "pointer",
              opacity: testStatus === "loading" ? 0.7 : 1,
              minHeight: "unset",
            }}
          >
            {testStatus === "loading"
              ? "Playing..."
              : testStatus === "done"
              ? "Sounded good?"
              : testStatus === "error"
              ? "Error — check key"
              : `Test ${active?.label} Voice`}
          </button>

          <div
            style={{
              fontSize: 10,
              color: "#ccc",
              textAlign: "center",
              marginTop: 8,
            }}
          >
            Not visible in production
          </div>
        </div>
      )}
    </div>
  );
}
