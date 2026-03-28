import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import type { TTSProvider } from "@/lib/tts";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { text, provider: clientProvider } = body;

    if (!text?.trim()) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    const isDev = process.env.NODE_ENV === "development";
    const activeProvider: TTSProvider =
      isDev && clientProvider
        ? clientProvider
        : ((process.env.TTS_PROVIDER as TTSProvider) || "elevenlabs");

    switch (activeProvider) {
      case "elevenlabs":
        return await handleElevenLabs(text);
      case "openai":
        return await handleOpenAI(text);
      case "azure":
        return await handleAzure(text);
      case "browser":
        return NextResponse.json({ text, provider: "browser" });
      default:
        return await handleElevenLabs(text);
    }
  } catch (err) {
    console.error("TTS error:", err);
    return NextResponse.json({ error: "TTS request failed" }, { status: 500 });
  }
}

async function handleElevenLabs(text: string): Promise<NextResponse> {
  const voiceId = process.env.ELEVENLABS_VOICE_ID || "pNInz6obpgDQGcFmaJgB";
  const apiKey = process.env.ELEVENLABS_API_KEY;

  if (!apiKey || apiKey === "your_elevenlabs_api_key_here") {
    return NextResponse.json(
      { error: "ElevenLabs API key not configured" },
      { status: 503 }
    );
  }

  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`,
    {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_turbo_v2",
        voice_settings: {
          stability: 0.45,
          similarity_boost: 0.75,
          style: 0.2,
          use_speaker_boost: true,
        },
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    console.error("ElevenLabs error:", err);
    return NextResponse.json(
      { error: "ElevenLabs TTS failed" },
      { status: 502 }
    );
  }

  const audioBuffer = await res.arrayBuffer();
  return new NextResponse(audioBuffer, {
    headers: {
      "Content-Type": "audio/mpeg",
      "X-TTS-Provider": "elevenlabs",
    },
  });
}

async function handleOpenAI(text: string): Promise<NextResponse> {
  const apiKey = process.env.OPENAI_API_KEY;
  const voice = process.env.OPENAI_TTS_VOICE || "onyx";
  const model = process.env.OPENAI_TTS_MODEL || "tts-1-hd";

  if (!apiKey || apiKey === "your_openai_key_here") {
    return NextResponse.json(
      { error: "OpenAI API key not configured" },
      { status: 503 }
    );
  }

  const res = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model, input: text, voice, response_format: "mp3" }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("OpenAI TTS error:", err);
    return NextResponse.json({ error: "OpenAI TTS failed" }, { status: 502 });
  }

  const audioBuffer = await res.arrayBuffer();
  return new NextResponse(audioBuffer, {
    headers: {
      "Content-Type": "audio/mpeg",
      "X-TTS-Provider": "openai",
    },
  });
}

async function handleAzure(text: string): Promise<NextResponse> {
  const apiKey = process.env.AZURE_TTS_KEY;
  const region = process.env.AZURE_TTS_REGION || "eastus";
  const voice = process.env.AZURE_TTS_VOICE || "en-US-GuyNeural";

  if (!apiKey || apiKey === "your_azure_key_here") {
    return NextResponse.json(
      { error: "Azure TTS key not configured" },
      { status: 503 }
    );
  }

  const ssml = `<speak version='1.0' xml:lang='en-US'><voice name='${voice}'><prosody rate='0%' pitch='0%'>${text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</prosody></voice></speak>`;

  const res = await fetch(
    `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`,
    {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": apiKey,
        "Content-Type": "application/ssml+xml",
        "X-Microsoft-OutputFormat": "audio-24khz-96kbitrate-mono-mp3",
        "User-Agent": "TimeProofTraining",
      },
      body: ssml,
    }
  );

  if (!res.ok) {
    const err = await res.text();
    console.error("Azure TTS error:", err);
    return NextResponse.json({ error: "Azure TTS failed" }, { status: 502 });
  }

  const audioBuffer = await res.arrayBuffer();
  return new NextResponse(audioBuffer, {
    headers: {
      "Content-Type": "audio/mpeg",
      "X-TTS-Provider": "azure",
    },
  });
}
