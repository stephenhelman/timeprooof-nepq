"use client";

import { useRef, useState, useCallback } from "react";
import { Mic, MicOff, Loader2, Volume2 } from "lucide-react";

type MicState = "idle" | "recording" | "processing" | "speaking";

interface MicButtonProps {
  state: MicState;
  onRecordingComplete: (blob: Blob) => void;
  disabled?: boolean;
}

export default function MicButton({ state, onRecordingComplete, disabled }: MicButtonProps) {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [isPressed, setIsPressed] = useState(false);

  const startRecording = useCallback(async () => {
    if (disabled || state !== "idle") return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "audio/mp4";

      const recorder = new MediaRecorder(stream, { mimeType });
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        stream.getTracks().forEach((t) => t.stop());
        onRecordingComplete(blob);
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsPressed(true);
    } catch {
      alert("Microphone access denied. Enable mic in your browser settings, then refresh.");
    }
  }, [disabled, state, onRecordingComplete]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    setIsPressed(false);
  }, []);

  const bgColor =
    state === "recording"
      ? "#dc2626"
      : state === "processing"
      ? "#374151"
      : state === "speaking"
      ? "#1d4ed8"
      : "#0B1F3A";

  const icon =
    state === "recording" ? (
      <MicOff className="w-8 h-8 text-white" />
    ) : state === "processing" ? (
      <Loader2 className="w-8 h-8 text-white animate-spin" />
    ) : state === "speaking" ? (
      <Volume2 className="w-8 h-8 text-white" />
    ) : (
      <Mic className="w-8 h-8 text-white" />
    );

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onMouseDown={startRecording}
        onMouseUp={stopRecording}
        onMouseLeave={stopRecording}
        onTouchStart={(e) => { e.preventDefault(); startRecording(); }}
        onTouchEnd={stopRecording}
        disabled={disabled || state === "processing" || state === "speaking"}
        className="relative flex items-center justify-center rounded-full transition-all select-none"
        style={{
          width: 80,
          height: 80,
          backgroundColor: bgColor,
          boxShadow: isPressed
            ? "0 0 0 6px rgba(220,38,38,0.3)"
            : "0 4px 16px rgba(0,0,0,0.4)",
        }}
        aria-label={state === "recording" ? "Release to send" : "Hold to talk"}
      >
        {state === "recording" && (
          <span
            className="absolute inset-0 rounded-full animate-ping"
            style={{ backgroundColor: "rgba(220,38,38,0.3)" }}
          />
        )}
        {icon}
      </button>
      <span className="text-xs text-gray-500">
        {state === "idle" && "Hold to talk"}
        {state === "recording" && "Release to send"}
        {state === "processing" && "Processing..."}
        {state === "speaking" && "Speaking..."}
      </span>
    </div>
  );
}
