import type {
  ChatMessage,
  CreateSessionParams,
  DebriefResult,
  LeaderboardEntry,
  LeaderboardParams,
} from "./types";

export async function transcribeAudio(blob: Blob): Promise<string> {
  const formData = new FormData();
  formData.append("file", blob, "audio.webm");

  const res = await fetch("/api/transcribe", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? "Transcription failed");
  }

  const data = await res.json();
  return data.text as string;
}

export async function callClaude(
  messages: ChatMessage[],
  system: string,
  maxTokens = 512
): Promise<string> {
  const res = await fetch("/api/claude", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: maxTokens,
      system,
      messages: messages
        .filter((m) => m.role !== "coach")
        .map((m) => ({ role: m.role, content: m.content })),
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? "AI request failed");
  }

  const data = await res.json();
  return data.content?.[0]?.text ?? "";
}

// Singleton AudioContext — mobile browsers require audio context to be
// created once and resumed (not re-created) on each playback. Creating a
// new AudioContext inside an async chain after a user gesture ends causes
// the context to start in "suspended" state and produce silence on mobile.
let _audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!_audioCtx || _audioCtx.state === "closed") {
    _audioCtx = new AudioContext();
  }
  return _audioCtx;
}

export async function speakText(text: string): Promise<void> {
  const isDev = process.env.NODE_ENV === "development";

  let provider = "elevenlabs";
  if (isDev) {
    const stored = localStorage.getItem("tp_tts_provider");
    if (stored) provider = stored;
  }

  // Browser native TTS — handled entirely client-side
  if (provider === "browser") {
    return new Promise((resolve, reject) => {
      if (!window.speechSynthesis) {
        reject(new Error("Browser TTS not supported"));
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 0.9;
      utterance.volume = 1;
      const voices = window.speechSynthesis.getVoices();
      const maleVoice = voices.find(
        (v) =>
          v.name.toLowerCase().includes("male") ||
          v.name.includes("Guy") ||
          v.name.includes("Daniel") ||
          v.name.includes("Alex")
      );
      if (maleVoice) utterance.voice = maleVoice;
      utterance.onend = () => resolve();
      utterance.onerror = (e) => reject(new Error(e.error));
      window.speechSynthesis.speak(utterance);
    });
  }

  // API-based TTS (ElevenLabs, OpenAI, Azure)
  const res = await fetch("/api/speak", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text,
      ...(isDev && { provider }),
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? "TTS failed");
  }

  const arrayBuffer = await res.arrayBuffer();

  // Use singleton context and resume it — this is the fix for mobile Chrome/Safari
  // which suspends AudioContext when not within an active user gesture frame.
  const audioContext = getAudioContext();
  if (audioContext.state === "suspended") {
    await audioContext.resume();
  }

  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  const source = audioContext.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(audioContext.destination);
  source.start(0);

  await new Promise<void>((resolve) => {
    source.onended = () => resolve();
  });
}

export async function createSession(params: CreateSessionParams): Promise<string> {
  const res = await fetch("/api/training/sessions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? "Failed to create session");
  }

  const data = await res.json();
  return data.sessionId as string;
}

export async function saveMessage(
  sessionId: string,
  message: ChatMessage
): Promise<void> {
  const res = await fetch(`/api/training/sessions/${sessionId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? "Failed to save message");
  }
}

export async function completeSession(
  sessionId: string,
  debrief: DebriefResult
): Promise<void> {
  const res = await fetch(`/api/training/sessions/${sessionId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ debrief, status: "COMPLETED" }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? "Failed to complete session");
  }
}

export async function getLeaderboard(
  params: LeaderboardParams
): Promise<LeaderboardEntry[]> {
  const url = new URL("/api/training/leaderboard", window.location.origin);
  if (params.type) url.searchParams.set("type", params.type);
  if (params.mode) url.searchParams.set("mode", params.mode);
  if (params.period) url.searchParams.set("period", params.period);

  const res = await fetch(url.toString());

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? "Failed to fetch leaderboard");
  }

  return res.json();
}
