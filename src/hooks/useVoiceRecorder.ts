"use client";

import { useRef, useState } from "react";

type RecorderState = "idle" | "recording" | "transcribing" | "error";

export function useVoiceRecorder({
  onTranscript,
  onError
}: {
  onTranscript: (transcript: string) => void;
  onError: (message: string) => void;
}) {
  const [state, setState] = useState<RecorderState>("idle");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  async function start() {
    if (typeof window === "undefined" || !navigator.mediaDevices || !window.MediaRecorder) {
      setState("error");
      onError("Voice is unavailable right now, but you can continue with text.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
        transcribe().catch(() => {
          setState("error");
          onError("I couldn't hear that clearly. Please try again.");
        });
      };
      mediaRecorderRef.current = recorder;
      recorder.start();
      setState("recording");
    } catch {
      setState("error");
      onError("Voice is unavailable right now, but you can continue with text.");
    }
  }

  function stop() {
    if (mediaRecorderRef.current?.state === "recording") {
      setState("transcribing");
      mediaRecorderRef.current.stop();
    }
  }

  async function transcribe() {
    const blob = new Blob(chunksRef.current, { type: "audio/webm" });
    const formData = new FormData();
    formData.append("audio", blob, "pluto.webm");

    const response = await fetch("/api/voice/transcribe", {
      method: "POST",
      body: formData
    });

    if (!response.ok) throw new Error("Transcription failed");
    const data = (await response.json()) as { transcript?: string };
    setState("idle");

    if (data.transcript) onTranscript(data.transcript);
    else onError("I couldn't hear that clearly. Please try again.");
  }

  function toggle() {
    if (state === "recording") stop();
    else if (state === "idle" || state === "error") void start();
  }

  return {
    state,
    isRecording: state === "recording",
    isTranscribing: state === "transcribing",
    toggle,
    start,
    stop
  };
}
