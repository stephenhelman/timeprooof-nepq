"use client";

import { useEffect, useRef } from "react";
import type { ChatMessage } from "@/lib/types";

interface ChatTranscriptProps {
  messages: ChatMessage[];
}

export default function ChatTranscript({ messages }: ChatTranscriptProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  let lastPhase: string | undefined;

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0">
      {messages.length === 0 && (
        <div className="text-center text-gray-500 text-sm py-8">
          Start talking to begin the drill.
        </div>
      )}

      {messages.map((msg, i) => {
        const showPhaseDivider =
          msg.phase && msg.phase !== lastPhase && msg.role !== "coach";
        if (msg.phase && msg.role !== "coach") lastPhase = msg.phase;

        if (msg.role === "coach") return null;

        return (
          <div key={i}>
            {showPhaseDivider && (
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-gray-700" />
                <span className="text-xs text-gray-500 font-medium px-2 uppercase tracking-wide">
                  {msg.phase}
                </span>
                <div className="flex-1 h-px bg-gray-700" />
              </div>
            )}

            <div
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "rounded-tr-sm text-white"
                    : "bg-gray-700 text-gray-100 rounded-tl-sm"
                }`}
                style={msg.role === "user" ? { backgroundColor: "#0B1F3A" } : undefined}
              >
                {msg.role === "assistant" && (
                  <p className="text-xs text-gray-400 mb-1 font-medium">Homeowner</p>
                )}
                <p>{msg.content}</p>
                {process.env.NODE_ENV === "development" && msg.role === "assistant" && (
                  <div style={{ fontSize: 9, color: "#aaa", marginTop: 3 }}>
                    via {typeof window !== "undefined" ? localStorage.getItem("tp_tts_provider") || "elevenlabs" : "elevenlabs"}
                  </div>
                )}
              </div>
            </div>

            {/* Coach hint below user message */}
            {msg.role === "user" && messages[i + 1]?.role === "coach" && (
              <div className="flex justify-end mt-1">
                <p className="text-xs text-amber-400 italic max-w-[75%] text-right px-1">
                  {messages[i + 1].content}
                </p>
              </div>
            )}
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
