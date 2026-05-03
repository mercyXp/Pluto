"use client";

import { AudioWaveform, ChevronRight, Menu, Mic, MoreHorizontal, Plus, X } from "lucide-react";
import { FormEvent, PointerEvent, useEffect, useMemo, useRef, useState } from "react";
import { ChatBubble } from "@/components/voice/ChatBubble";
import { PlutoOrb } from "@/components/voice/PlutoOrb";
import {
  TransactionIllustrationCard,
  type TransactionVisualState
} from "@/components/voice/TransactionIllustrationCard";
import { useVoiceRecorder } from "@/hooks/useVoiceRecorder";
import { cn } from "@/lib/utils/cn";
import type { ChatMessage, Contact, OrbState } from "@/types";

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

const suggestionChips = [
  { title: "Send SOL", detail: "Pay a contact" },
  { title: "Request SOL", detail: "Create a payment link" },
  { title: "Show balance", detail: "Wallet overview" },
  { title: "Add contact", detail: "Save a wallet" }
];

export function VoiceLayer({
  messages,
  isHomeRevealed,
  orbState,
  onRevealChange,
  onSendMessage,
  onSystemMessage,
  onChooseContact,
  onAddContact,
  onSettings
}: {
  messages: ChatMessage[];
  isHomeRevealed: boolean;
  orbState: OrbState;
  onRevealChange: (revealed: boolean) => void;
  onSendMessage: (message: string) => void;
  onSystemMessage: (message: string, variant?: ChatMessage["variant"]) => void;
  onChooseContact: (contact: Contact) => void;
  onAddContact: () => void;
  onSettings: () => void;
}) {
  const [input, setInput] = useState("");
  const [dragOffset, setDragOffset] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(860);
  const [mode, setMode] = useState<"chat" | "voice">("chat");
  const [dismissedResultVisual, setDismissedResultVisual] = useState(false);
  const dragStartRef = useRef<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const revealY = useMemo(() => Math.max(420, viewportHeight - 118), [viewportHeight]);

  const recorder = useVoiceRecorder({
    onTranscript: onSendMessage,
    onError: (message) => onSystemMessage(message, "error")
  });

  useEffect(() => {
    const updateHeight = () => setViewportHeight(window.innerHeight || 860);
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  useEffect(() => {
    window.requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth"
      });
    });
  }, [messages.length, mode]);

  const currentOrbState: OrbState = recorder.isRecording
    ? "listening"
    : recorder.isTranscribing
      ? "thinking"
      : mode === "voice" && orbState === "idle"
        ? "idle"
        : orbState;

  const lastMessages = messages.slice(-3);
  const lastMessage = messages[messages.length - 1];
  const inWalletFlow = lastMessages.some((message) =>
    /(send|sent|request|sol|wallet|muape|alex|balance|confirm|transaction|contact)/i.test(message.text)
  );

  const rawTransactionVisual: TransactionVisualState | undefined = useMemo(() => {
    if (lastMessage?.variant === "error") return "failed";
    if (orbState === "confirming") return "confirm";
    if (orbState === "success" && inWalletFlow) return "success";
    if ((orbState === "thinking" || recorder.isTranscribing) && inWalletFlow) return "lookup";
    return undefined;
  }, [inWalletFlow, lastMessage?.variant, orbState, recorder.isTranscribing]);

  useEffect(() => {
    setDismissedResultVisual(false);
    if (rawTransactionVisual === "success" || rawTransactionVisual === "failed") {
      const timer = window.setTimeout(() => setDismissedResultVisual(true), 1500);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [rawTransactionVisual, lastMessage?.id]);

  const transactionVisual =
    (rawTransactionVisual === "success" || rawTransactionVisual === "failed") && dismissedResultVisual
      ? undefined
      : rawTransactionVisual;

  function submit(event: FormEvent) {
    event.preventDefault();
    const value = input.trim();
    if (!value) return;
    setInput("");
    onSendMessage(value);
  }

  function startDrag(event: PointerEvent<HTMLElement>) {
    dragStartRef.current = event.clientY;
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function updateDrag(event: PointerEvent<HTMLElement>) {
    if (dragStartRef.current === null) return;
    const base = isHomeRevealed ? revealY : 0;
    const next = clamp(base + event.clientY - dragStartRef.current, 0, revealY);
    setDragOffset(next - base);
  }

  function endDrag() {
    if (dragStartRef.current === null) return;
    const base = isHomeRevealed ? revealY : 0;
    const finalY = base + dragOffset;
    onRevealChange(finalY > revealY * 0.36);
    setDragOffset(0);
    dragStartRef.current = null;
  }

  function startVoiceMode() {
    setMode("voice");
    if (!recorder.isRecording) recorder.toggle();
  }

  function endVoiceMode() {
    if (recorder.isRecording) recorder.toggle();
    setMode("chat");
  }

  function handleMicTap() {
    setMode("voice");
    recorder.toggle();
  }

  function handleChip(title: string) {
    if (title === "Add contact") {
      onAddContact();
      return;
    }
    onSendMessage(title);
  }

  const translateY = (isHomeRevealed ? revealY : 0) + dragOffset;
  const hasConversation = messages.length > 0;
  const voiceStatus = recorder.isRecording ? "Listening" : recorder.isTranscribing ? "Thinking" : "Pluto Voice";

  return (
    <section
      className={cn(
        "absolute inset-x-0 top-0 z-20 mx-auto h-[100dvh] max-w-md overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#fbfdff_54%,#f3f9ff_100%)] shadow-sheet transition-transform duration-300 ease-out",
        isHomeRevealed ? "rounded-t-[2rem]" : "rounded-none"
      )}
      style={{
        transform: `translateY(${translateY}px)`,
        transitionDuration: dragStartRef.current === null ? "300ms" : "0ms"
      }}
    >
      <div className="flex h-full flex-col pt-2 safe-pt">
        <button
          type="button"
          aria-label={isHomeRevealed ? "Close home overview" : "Reveal home overview"}
          onClick={() => onRevealChange(!isHomeRevealed)}
          onPointerDown={startDrag}
          onPointerMove={updateDrag}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          className="mx-auto flex h-5 w-20 items-center justify-center"
        >
          <span className="h-1 w-10 rounded-full bg-pluto-line" />
        </button>

        <header className="flex items-center justify-between px-5 pb-2">
          <button
            type="button"
            aria-label={isHomeRevealed ? "Close home overview" : "Reveal home overview"}
            onClick={() => onRevealChange(!isHomeRevealed)}
            className="grid h-11 w-11 place-items-center rounded-full text-pluto-navy transition hover:bg-pluto-mist"
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex items-center gap-1 rounded-full px-3 py-2 text-[22px] font-semibold tracking-normal text-pluto-navy">
            {mode === "voice" ? (
              <>
                <span>Pluto</span>
                <span className="text-pluto-slate">Voice</span>
              </>
            ) : currentOrbState === "thinking" ? (
              <>
                <span className="text-pluto-blue">Thinking</span>
                <ChevronRight className="h-5 w-5 text-pluto-slate" />
              </>
            ) : (
              <>
                <span>Pluto</span>
                <span className="text-pluto-slate">Chat</span>
              </>
            )}
          </div>

          <button
            type="button"
            aria-label="Open settings"
            onClick={onSettings}
            className="grid h-11 w-11 place-items-center rounded-full text-pluto-navy transition hover:bg-pluto-mist"
          >
            <MoreHorizontal className="h-6 w-6" />
          </button>
        </header>

        <div ref={scrollRef} className="pluto-scrollbar min-h-0 flex-1 overflow-y-auto px-5">
          {mode === "chat" ? (
            <div className="flex min-h-full flex-col">
              {!hasConversation ? (
                <div className="flex flex-1 flex-col justify-end pb-6">
                  <div className="mb-8">
                    <p className="text-sm font-semibold text-pluto-blue">Voice-first Solana wallet</p>
                    <h1 className="mt-3 max-w-[21rem] text-[34px] font-semibold leading-tight tracking-normal text-pluto-navy">
                      What would you like Pluto to do?
                    </h1>
                    <p className="mt-3 max-w-[20rem] text-sm leading-6 text-pluto-slate">
                      Send, request, receive, or check SOL with plain language.
                    </p>
                  </div>
                  <div className="pluto-scrollbar -mx-1 flex gap-3 overflow-x-auto px-1 pb-1">
                    {suggestionChips.map((chip) => (
                      <button
                        type="button"
                        key={chip.title}
                        onClick={() => handleChip(chip.title)}
                        className="w-40 shrink-0 rounded-[1.35rem] border border-pluto-line bg-white p-4 text-left shadow-sm transition active:scale-[0.98]"
                      >
                        <span className="block text-sm font-semibold text-pluto-navy">{chip.title}</span>
                        <span className="mt-1 block text-xs leading-5 text-pluto-slate">{chip.detail}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex min-h-full flex-col justify-end gap-3 pb-5 pt-4">
                  {messages.map((message) => (
                    <ChatBubble key={message.id} message={message} onChooseContact={onChooseContact} />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex min-h-full flex-col">
              <div className="pt-4 text-center">
                <p className="text-sm font-semibold text-pluto-blue">{voiceStatus}</p>
                <p className="mt-1 text-xs text-pluto-slate">
                  {recorder.isRecording ? "Speak naturally. Pluto is listening." : "Tap X to return to chat."}
                </p>
              </div>
              <div
                className={cn(
                  "flex flex-1 items-end justify-center transition-all duration-300",
                  transactionVisual ? "pb-10" : "pb-24"
                )}
              >
                <div className={cn("transition-transform duration-300", transactionVisual ? "-translate-y-8" : "")}>
                  <PlutoOrb state={currentOrbState} size="md" />
                </div>
              </div>
              {messages.length ? (
                <div className="space-y-2 pb-3">
                  {messages.slice(-2).map((message) => (
                    <ChatBubble key={message.id} message={message} onChooseContact={onChooseContact} />
                  ))}
                </div>
              ) : null}
            </div>
          )}
        </div>

        {transactionVisual ? (
          <div className="px-5 pb-3">
            <TransactionIllustrationCard state={transactionVisual} />
          </div>
        ) : mode === "chat" && hasConversation ? (
          <div className="pluto-scrollbar flex gap-2 overflow-x-auto px-5 pb-3">
            {suggestionChips.slice(0, 3).map((chip) => (
              <button
                type="button"
                key={chip.title}
                onClick={() => handleChip(chip.title)}
                className="shrink-0 rounded-full border border-pluto-line bg-white px-4 py-2 text-xs font-semibold text-pluto-slate shadow-sm transition hover:border-pluto-blue/40 hover:text-pluto-blue"
              >
                {chip.title}
              </button>
            ))}
          </div>
        ) : null}

        <form onSubmit={submit} className="px-4 pb-5 safe-pb">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Add contact"
              onClick={onAddContact}
              className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-pluto-line bg-white text-pluto-slate shadow-sm transition active:scale-[0.97]"
            >
              <Plus className="h-7 w-7" />
            </button>

            <div className="flex h-14 min-w-0 flex-1 items-center gap-2 rounded-full border border-pluto-line bg-white px-4 shadow-sm">
              <input
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask Pluto"
                className="min-w-0 flex-1 border-0 bg-transparent text-[18px] font-semibold tracking-normal text-pluto-navy outline-none placeholder:text-pluto-slate/70"
              />
              <button
                type="button"
                aria-label={recorder.isRecording ? "Stop dictation" : "Dictate message"}
                onClick={handleMicTap}
                className={cn(
                  "grid h-10 w-10 shrink-0 place-items-center rounded-full text-pluto-slate transition",
                  recorder.isRecording ? "bg-blue-50 text-pluto-blue" : "hover:bg-pluto-mist"
                )}
              >
                <Mic className="h-6 w-6" />
              </button>
            </div>

            <button
              type="button"
              aria-label={mode === "voice" ? "End voice mode" : "Start voice mode"}
              onClick={mode === "voice" ? endVoiceMode : startVoiceMode}
              className={cn(
                "grid h-14 w-14 shrink-0 place-items-center rounded-full shadow-sm transition active:scale-[0.97]",
                mode === "voice"
                  ? "border border-pluto-line bg-white text-pluto-navy"
                  : "bg-pluto-blue text-white shadow-[0_16px_32px_rgba(10,132,255,0.22)]"
              )}
            >
              {mode === "voice" ? <X className="h-7 w-7" /> : <AudioWaveform className="h-7 w-7" />}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
