"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { OrbState } from "@/types";

export function PlutoOrb({
  state = "idle",
  size = "lg"
}: {
  state?: OrbState;
  size?: "md" | "lg" | "xl";
}) {
  const isListening = state === "listening";
  const isThinking = state === "thinking";
  const isSpeaking = state === "speaking";
  const isSuccess = state === "success";
  const diameter = size === "xl" ? "h-52 w-52" : size === "lg" ? "h-36 w-36" : "h-24 w-24";
  const orbitRadius = size === "xl" ? 88 : size === "lg" ? 62 : 42;

  return (
    <div className={cn("relative grid place-items-center", diameter)}>
      {isListening
        ? [0, 0.45, 0.9].map((delay) => (
            <span
              key={delay}
              className="absolute h-full w-full rounded-full border border-pluto-blue/35 animate-ring"
              style={{ animationDelay: `${delay}s` }}
            />
          ))
        : null}

      <div
        className={cn(
          "relative grid h-full w-full place-items-center overflow-hidden rounded-full bg-[radial-gradient(circle_at_34%_28%,rgba(255,255,255,0.82),transparent_20%),radial-gradient(circle_at_74%_66%,rgba(10,132,255,0.98),transparent_42%),linear-gradient(145deg,#E2FAFF_0%,#86DEFF_38%,#0A84FF_78%,#0671E8_100%)] shadow-[0_30px_90px_rgba(10,132,255,0.24)] transition-transform duration-500",
          state === "confirming" ? "scale-[0.93]" : "",
          isSuccess ? "scale-[1.04]" : "",
          isThinking ? "rotate-[8deg]" : "",
          state === "idle" ? "animate-breathe" : "",
          isSpeaking ? "animate-voice-fluid" : ""
        )}
      >
        <div className="absolute left-[16%] top-[18%] h-[24%] w-[30%] rounded-full bg-white/45 blur-md" />
        <div className="absolute bottom-[18%] right-[16%] h-[32%] w-[40%] rounded-full bg-blue-700/20 blur-xl" />
        <div className="absolute inset-0 rounded-full ring-1 ring-white/40" />
        {isThinking
          ? [0, 1, 2].map((index) => (
              <span
                key={index}
                className="absolute h-2 w-2 rounded-full bg-white shadow-sm"
                style={{
                  transform: `rotate(${index * 120}deg) translateX(${orbitRadius}px)`,
                  transformOrigin: "center"
                }}
              />
            ))
          : null}
        {isSuccess ? <Check className="relative z-10 h-11 w-11 text-white" strokeWidth={2.4} /> : null}
      </div>
    </div>
  );
}
