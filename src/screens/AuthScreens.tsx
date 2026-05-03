"use client";

import { ArrowLeft, Fingerprint, KeyRound, Lock, Mail, Shield } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PlutoLogo } from "@/components/ui/Logo";
import { TextArea, TextInput } from "@/components/ui/TextInput";

export function AuthScreen({
  onContinue,
  onDemo
}: {
  onContinue: (email: string, password: string) => Promise<void> | void;
  onDemo: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    setError("");
    setLoading(true);
    try {
      await onContinue(email, password);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to create or sign in to your account.";
      setError(message.replace(/^Firebase:\s*/i, ""));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthFrame title="Create account" subtitle="Use a simple account for the demo. Firebase Auth is wired through env configuration.">
      <div className="space-y-3">
        <label className="block space-y-2">
          <span className="text-sm font-semibold text-pluto-navy">Email</span>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-pluto-slate" />
            <TextInput
              className="pl-11"
              placeholder="samuel@pluto.dev"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-semibold text-pluto-navy">Password</span>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-pluto-slate" />
            <TextInput
              className="pl-11"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
        </label>
        {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm leading-5 text-red-700">{error}</p> : null}
        <Button size="lg" className="w-full" onClick={submit} disabled={loading || !email || password.length < 6}>
          {loading ? "Connecting..." : "Continue"}
        </Button>
        <Button size="lg" variant="ghost" className="w-full" onClick={onDemo}>Use demo mode</Button>
      </div>
    </AuthFrame>
  );
}

export function CreateWalletScreen({
  onBack,
  onContinue
}: {
  onBack: () => void;
  onContinue: () => void;
}) {
  return (
    <AuthFrame title="Create wallet" subtitle="Pluto creates a Solana wallet for you. You can export your recovery phrase later." onBack={onBack}>
      <Card className="bg-blue-50/70 shadow-none">
        <div className="flex gap-3">
          <Shield className="mt-0.5 h-5 w-5 shrink-0 text-pluto-blue" />
          <p className="text-sm leading-6 text-pluto-slate">
            Your keys are protected. Pluto never sends without confirmation. For this hackathon MVP, real custody should be replaced with production-grade secure key storage before mainnet use.
          </p>
        </div>
      </Card>
      <Button size="lg" className="mt-5 w-full" icon={<KeyRound className="h-4 w-4" />} onClick={onContinue}>
        Create wallet
      </Button>
    </AuthFrame>
  );
}

export function ImportWalletScreen({
  onBack,
  onContinue
}: {
  onBack: () => void;
  onContinue: () => void;
}) {
  const [advanced, setAdvanced] = useState(false);

  return (
    <AuthFrame title="Import wallet" subtitle="Paste a recovery phrase or use the advanced private key option." onBack={onBack}>
      <div className="space-y-4">
        <label className="block space-y-2">
          <span className="text-sm font-semibold text-pluto-navy">Recovery phrase</span>
          <TextArea placeholder="twelve or twenty four words..." />
        </label>
        <button className="text-sm font-semibold text-pluto-blue" onClick={() => setAdvanced((value) => !value)}>
          {advanced ? "Hide advanced" : "Show private key option"}
        </button>
        {advanced ? <TextInput placeholder="Private key" type="password" /> : null}
        <Button size="lg" className="w-full" onClick={onContinue}>Import wallet</Button>
      </div>
    </AuthFrame>
  );
}

export function PinScreen({ onContinue }: { onContinue: () => void }) {
  return (
    <AuthFrame title="Secure Pluto" subtitle="Create a 6-digit PIN. Biometric unlock can be enabled later.">
      <div className="space-y-5">
        <div className="flex justify-center gap-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <span key={index} className="h-4 w-4 rounded-full border border-pluto-blue bg-blue-50" />
          ))}
        </div>
        <Card className="flex items-center justify-between bg-white shadow-sm">
          <div>
            <p className="text-sm font-semibold text-pluto-navy">Biometric unlock</p>
            <p className="text-xs text-pluto-slate">Placeholder for device auth.</p>
          </div>
          <Fingerprint className="h-6 w-6 text-pluto-blue" />
        </Card>
        <Button size="lg" className="w-full" onClick={onContinue}>Enter Pluto</Button>
      </div>
    </AuthFrame>
  );
}

function AuthFrame({
  title,
  subtitle,
  children,
  onBack
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  onBack?: () => void;
}) {
  return (
    <main className="min-h-[100dvh] bg-pluto-mist px-4 pb-6 pt-5 safe-pt">
      <div className="mx-auto flex min-h-[calc(100dvh-2rem)] max-w-md flex-col">
        <header className="flex items-center justify-between">
          {onBack ? (
            <Button variant="secondary" size="icon" aria-label="Back" icon={<ArrowLeft className="h-4 w-4" />} onClick={onBack} />
          ) : (
            <PlutoLogo />
          )}
          {onBack ? <PlutoLogo showWordmark={false} /> : null}
        </header>
        <section className="flex flex-1 flex-col justify-center py-8">
          <h1 className="text-[38px] font-semibold leading-tight tracking-normal text-pluto-navy">{title}</h1>
          <p className="mt-3 text-base leading-7 text-pluto-slate">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </section>
      </div>
    </main>
  );
}
