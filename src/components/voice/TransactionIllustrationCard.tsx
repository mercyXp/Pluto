"use client";

import { ArrowRight, Check, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export type TransactionVisualState = "lookup" | "confirm" | "sending" | "success" | "failed";

export function TransactionIllustrationCard({
  state,
  amount = "0.20 SOL",
  from = "You",
  to = "Muape K"
}: {
  state: TransactionVisualState;
  amount?: string;
  from?: string;
  to?: string;
}) {
  return (
    <div
      className={cn(
        "animate-transaction-card rounded-[1.6rem] border border-pluto-line bg-white/96 p-4 shadow-[0_18px_48px_rgba(7,26,51,0.14)] backdrop-blur-xl",
        state === "failed" ? "animate-transaction-shake" : ""
      )}
    >
      {state === "lookup" ? <LookupIllustration /> : null}
      {state === "confirm" ? <ConfirmIllustration amount={amount} from={from} to={to} /> : null}
      {state === "sending" ? <SendingIllustration /> : null}
      {state === "success" ? <ResultIllustration tone="success" /> : null}
      {state === "failed" ? <ResultIllustration tone="failed" /> : null}
    </div>
  );
}

function LookupIllustration() {
  return (
    <div className="flex items-center gap-4">
      <div className="relative grid h-16 w-16 shrink-0 place-items-center rounded-full bg-blue-50">
        {[0, 0.45, 0.9].map((delay) => (
          <span
            key={delay}
            className="absolute h-7 w-7 rounded-full border border-pluto-blue/40 animate-sonar"
            style={{ animationDelay: `${delay}s` }}
          />
        ))}
        <span className="relative h-3 w-3 rounded-full bg-pluto-blue shadow-[0_0_0_7px_rgba(10,132,255,0.1)]" />
      </div>
      <div>
        <p className="text-sm font-semibold text-pluto-navy">Looking up contact</p>
        <p className="mt-1 text-xs leading-5 text-pluto-slate">Checking trusted names and wallet endings.</p>
      </div>
    </div>
  );
}

function ConfirmIllustration({ amount, from, to }: { amount: string; from: string; to: string }) {
  return (
    <div>
      <p className="text-sm font-semibold text-pluto-navy">Ready to confirm</p>
      <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <Identity label="From" value={from} />
        <div className="flex flex-col items-center gap-2">
          <p className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-pluto-blue">{amount}</p>
          <ArrowRight className="h-4 w-4 text-pluto-slate" />
        </div>
        <Identity label="To" value={to} align="right" />
      </div>
    </div>
  );
}

function SendingIllustration() {
  return (
    <div>
      <p className="text-sm font-semibold text-pluto-navy">Sending</p>
      <div className="relative mt-5 h-14 overflow-hidden rounded-full bg-pluto-mist">
        <div className="absolute left-5 right-5 top-1/2 h-1 -translate-y-1/2 rounded-full bg-blue-100" />
        <span className="absolute left-4 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white text-xs font-bold text-pluto-blue shadow-sm animate-token-send">
          SOL
        </span>
      </div>
    </div>
  );
}

function ResultIllustration({ tone }: { tone: "success" | "failed" }) {
  const success = tone === "success";
  return (
    <div className="flex items-center gap-4">
      <div className={cn("relative grid h-16 w-16 shrink-0 place-items-center rounded-full", success ? "bg-emerald-50" : "bg-red-50")}>
        <span className={cn("absolute h-full w-full rounded-full border animate-result-burst", success ? "border-emerald-300" : "border-red-300")} />
        <span className={cn("grid h-10 w-10 place-items-center rounded-full text-white animate-result-draw", success ? "bg-emerald-500" : "bg-red-500")}>
          {success ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
        </span>
      </div>
      <div>
        <p className="text-sm font-semibold text-pluto-navy">{success ? "Sent successfully" : "Transaction failed"}</p>
        <p className="mt-1 text-xs leading-5 text-pluto-slate">
          {success ? "Receipt is being prepared." : "No funds were sent."}
        </p>
      </div>
    </div>
  );
}

function Identity({
  label,
  value,
  align = "left"
}: {
  label: string;
  value: string;
  align?: "left" | "right";
}) {
  return (
    <div className={cn("min-w-0", align === "right" ? "text-right" : "")}>
      <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-pluto-slate">{label}</p>
      <p className="mt-1 truncate text-sm font-semibold text-pluto-navy">{value}</p>
    </div>
  );
}
