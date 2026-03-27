import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey === "your_groq_api_key_here") {
    return NextResponse.json({ error: "GROQ_API_KEY not configured" }, { status: 503 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as Blob | null;

    if (!file) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
    }

    const groqForm = new FormData();
    groqForm.append("file", file, "audio.webm");
    groqForm.append("model", "whisper-large-v3-turbo");
    groqForm.append("language", "en");

    const res = await fetch(
      "https://api.groq.com/openai/v1/audio/transcriptions",
      {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}` },
        body: groqForm,
      }
    );

    if (!res.ok) {
      const error = await res.text();
      console.error("Groq transcription error:", error);
      return NextResponse.json({ error: "Transcription failed" }, { status: 502 });
    }

    const data = await res.json();
    return NextResponse.json({ text: data.text });
  } catch (err) {
    console.error("Transcribe route error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
