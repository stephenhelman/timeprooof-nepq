export type TTSProvider = "elevenlabs" | "openai" | "azure" | "browser";

export interface TTSProviderConfig {
  id: TTSProvider;
  label: string;
  description: string;
  costPer1kChars: string;
  qualityRating: "Excellent" | "Very Good" | "Good" | "Poor";
  latency: "Low" | "Medium" | "High";
  voiceNote: string;
}

export const TTS_PROVIDERS: TTSProviderConfig[] = [
  {
    id: "elevenlabs",
    label: "ElevenLabs",
    description:
      "Most expressive, closest to human. Best for immersive roleplay.",
    costPer1kChars: "~$0.33",
    qualityRating: "Excellent",
    latency: "Medium",
    voiceNote: "Adam voice — natural skeptical American male",
  },
  {
    id: "openai",
    label: "OpenAI TTS",
    description:
      "Very natural, clean delivery. Less expressive range than ElevenLabs.",
    costPer1kChars: "~$0.015",
    qualityRating: "Very Good",
    latency: "Low",
    voiceNote: "Onyx voice — deep, measured, slightly guarded",
  },
  {
    id: "azure",
    label: "Azure Neural",
    description: "Good quality with a generous free tier (500k chars/month).",
    costPer1kChars: "Free up to 500k/mo",
    qualityRating: "Very Good",
    latency: "Low",
    voiceNote: "GuyNeural — natural American male",
  },
  {
    id: "browser",
    label: "Browser Native",
    description: "Free, zero latency. Robotic — for testing only.",
    costPer1kChars: "Free",
    qualityRating: "Poor",
    latency: "Low",
    voiceNote: "Uses device default voice — varies by browser/OS",
  },
];

export const DEV_STORAGE_KEY = "tp_tts_provider";

export function getDevProvider(): TTSProvider | null {
  if (typeof window === "undefined") return null;
  if (process.env.NODE_ENV !== "development") return null;
  return (localStorage.getItem(DEV_STORAGE_KEY) as TTSProvider) || null;
}

export function setDevProvider(provider: TTSProvider): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(DEV_STORAGE_KEY, provider);
}
