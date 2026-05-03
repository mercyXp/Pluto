const ELEVENLABS_BASE_URL = "https://api.elevenlabs.io/v1";

export async function transcribeWithElevenLabs(file: File) {
  const apiKey = process.env.ELEVENLABS_API_KEY;

  if (!apiKey) {
    return {
      transcript: "Send 0.1 SOL to Muape for lunch.",
      confidence: 0.75,
      demo: true
    };
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("model_id", process.env.ELEVENLABS_STT_MODEL_ID || "scribe_v2");

  const response = await fetch(`${ELEVENLABS_BASE_URL}/speech-to-text`, {
    method: "POST",
    headers: {
      "xi-api-key": apiKey
    },
    body: formData
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "ElevenLabs transcription failed");
  }

  const data = (await response.json()) as { text?: string; language_probability?: number };

  return {
    transcript: data.text || "",
    confidence: data.language_probability
  };
}

export async function speakWithElevenLabs(text: string, voiceId?: string) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  const resolvedVoiceId = voiceId || process.env.ELEVENLABS_VOICE_ID || "JBFqnCBsd6RMkjVDRZzb";

  if (!apiKey) {
    return {
      audioBase64: "",
      contentType: "audio/mpeg",
      demo: true
    };
  }

  const response = await fetch(
    `${ELEVENLABS_BASE_URL}/text-to-speech/${resolvedVoiceId}?output_format=mp3_44100_128`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": apiKey
      },
      body: JSON.stringify({
        text,
        model_id: process.env.ELEVENLABS_TTS_MODEL_ID || "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.58,
          similarity_boost: 0.72,
          style: 0.15,
          use_speaker_boost: true
        }
      })
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "ElevenLabs speech failed");
  }

  const arrayBuffer = await response.arrayBuffer();
  return {
    audioBase64: Buffer.from(arrayBuffer).toString("base64"),
    contentType: response.headers.get("content-type") || "audio/mpeg"
  };
}
