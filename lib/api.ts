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
  system: string
): Promise<string> {
  const res = await fetch("/api/claude", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 512,
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

export async function speakText(text: string): Promise<void> {
  const res = await fetch("/api/speak", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? "TTS failed");
  }

  const arrayBuffer = await res.arrayBuffer();
  const audioContext = new AudioContext();
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
