"use client";

import { ArrowRight, Check, KeyRound, Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PlutoLogo } from "@/components/ui/Logo";
import { PlutoOrb } from "@/components/voice/PlutoOrb";

const screens = [
  {
    eyebrow: "Voice payments",
    title: "Send Solana by voice.",
    subtitle:
      "Pluto lets you send, receive, and request SOL using simple voice or text commands.",
    visual: "orb"
  },
  {
    eyebrow: "Contacts first",
    title: "No wallet addresses needed.",
    subtitle:
      "Send to trusted contacts by name. Pluto asks follow-up questions when something is unclear.",
    visual: "chat"
  },
  {
    eyebrow: "Confirmation required",
    title: "You always confirm first.",
    subtitle:
      "Pluto will never send funds without showing a clear confirmation screen.",
    visual: "confirm"
  }
];

export function Onboarding({
  onCreateWallet,
  onImportWallet,
  onDemo
}: {
  onCreateWallet: () => void;
  onImportWallet: () => void;
  onDemo: () => void;
}) {
  const [index, setIndex] = useState(0);
  const screen = screens[index];
  const isLast = index === screens.length - 1;

  return (
    <main className="min-h-[100dvh] bg-[linear-gradient(180deg,#ffffff_0%,#f7fbff_58%,#eef7ff_100%)] px-4 pb-6 pt-5 safe-pt">
      <div className="mx-auto flex min-h-[calc(100dvh-2rem)] max-w-md flex-col">
        <header className="flex items-center justify-between">
          <PlutoLogo />
          <button onClick={onDemo} className="rounded-full border border-pluto-line bg-white px-4 py-2 text-sm font-semibold text-pluto-blue shadow-sm">
            Try demo
          </button>
        </header>

        <section className="flex flex-1 flex-col justify-center py-8">
          <div className="mb-8 flex min-h-[16rem] items-center justify-center">
            {screen.visual === "orb" ? (
              <div className="rounded-full bg-white p-6 shadow-[0_30px_90px_rgba(10,132,255,0.14)]">
                <PlutoOrb size="lg" />
              </div>
            ) : null}
            {screen.visual === "chat" ? (
              <Card className="w-full max-w-[21rem] space-y-3 p-4 shadow-[0_22px_60px_rgba(7,26,51,0.08)]">
                <div className="ml-auto max-w-[75%] rounded-[1.2rem] rounded-br-md bg-pluto-blue px-4 py-3 text-sm text-white">
                  Send 0.2 SOL to Muape.
                </div>
                <div className="max-w-[82%] rounded-[1.2rem] rounded-bl-md border border-pluto-line bg-white px-4 py-3 text-sm text-pluto-navy">
                  I found two Muapes. Which one do you mean?
                </div>
              </Card>
            ) : null}
            {screen.visual === "confirm" ? (
              <Card className="w-full max-w-[21rem] p-5 shadow-[0_22px_60px_rgba(7,26,51,0.08)]">
                <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-blue-50 text-pluto-blue">
                  <KeyRound className="h-5 w-5" />
                </div>
                <p className="text-center text-sm text-pluto-slate">Confirm send</p>
                <h3 className="mt-2 text-center text-4xl font-semibold text-pluto-navy">0.20 SOL</h3>
                <div className="mt-5 space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-pluto-slate">To</span><strong>Muape K</strong></div>
                  <div className="flex justify-between"><span className="text-pluto-slate">Network</span><strong>Devnet</strong></div>
                  <div className="flex justify-between"><span className="text-pluto-slate">Fee</span><strong>~0.000005 SOL</strong></div>
                </div>
              </Card>
            ) : null}
          </div>

          <p className="text-sm font-semibold text-pluto-blue">{screen.eyebrow}</p>
          <h1 className="mt-3 text-[38px] font-semibold leading-[1.05] tracking-normal text-pluto-navy">
            {screen.title}
          </h1>
          <p className="mt-4 text-base leading-7 text-pluto-slate">{screen.subtitle}</p>
        </section>

        <div className="space-y-3">
          <div className="mb-3 flex justify-center gap-2">
            {screens.map((item, itemIndex) => (
              <span
                key={item.title}
                className={`h-2 rounded-full transition-all ${itemIndex === index ? "w-8 bg-pluto-blue" : "w-2 bg-pluto-line"}`}
              />
            ))}
          </div>

          {!isLast ? (
            <Button
              size="lg"
              className="w-full"
              icon={index === 0 ? <Sparkles className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
              onClick={() => setIndex((value) => value + 1)}
            >
              {index === 0 ? "Get started" : "Continue"}
            </Button>
          ) : (
            <>
              <Button size="lg" className="w-full" icon={<Check className="h-4 w-4" />} onClick={onCreateWallet}>
                Create wallet
              </Button>
              <Button size="lg" variant="secondary" className="w-full" onClick={onImportWallet}>
                Import wallet
              </Button>
              <Button size="lg" variant="ghost" className="w-full" onClick={onDemo}>
                Try demo mode
              </Button>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
