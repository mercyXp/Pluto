import { NextResponse } from "next/server";
import { speakWithElevenLabs } from "@/lib/elevenlabs/client";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { text?: string; voiceId?: string };
    if (!body.text) return NextResponse.json({ error: "Text is required" }, { status: 400 });

    const result = await speakWithElevenLabs(body.text, body.voiceId);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      {
        error: "Voice is unavailable right now, but you can continue with text."
      },
      { status: 503 }
    );
  }
}
