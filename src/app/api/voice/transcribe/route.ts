import { NextResponse } from "next/server";
import { transcribeWithElevenLabs } from "@/lib/elevenlabs/client";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const audio = formData.get("audio");

    if (!(audio instanceof File)) {
      return NextResponse.json({ error: "Audio file is required" }, { status: 400 });
    }

    const result = await transcribeWithElevenLabs(audio);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      {
        error: "Voice is unavailable right now. You can continue by typing."
      },
      { status: 503 }
    );
  }
}
