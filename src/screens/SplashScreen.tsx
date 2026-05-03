"use client";

import { PlutoLogo } from "@/components/ui/Logo";

export function SplashScreen() {
  return (
    <main className="grid min-h-[100dvh] place-items-center bg-[radial-gradient(circle_at_50%_35%,rgba(10,132,255,0.15),transparent_18rem),linear-gradient(180deg,#ffffff,#f1f8ff)] px-6">
      <div className="flex animate-[breathe_0.8s_ease-out_1] flex-col items-center text-center">
        <div className="relative mb-5 grid h-28 w-28 place-items-center rounded-full">
          <span className="absolute h-24 w-36 -rotate-12 rounded-full border border-pluto-blue/30 animate-orbit" />
          <PlutoLogo showWordmark={false} size="lg" />
        </div>
        <PlutoLogo size="lg" />
        <p className="mt-4 text-sm font-medium text-pluto-slate">Voice-first Solana wallet.</p>
      </div>
    </main>
  );
}
