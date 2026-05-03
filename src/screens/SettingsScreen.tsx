"use client";

import { ArrowLeft, Copy } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PlutoLogo } from "@/components/ui/Logo";
import { shortenAddress } from "@/lib/utils/format";
import type { WalletSummary } from "@/types";

export function SettingsScreen({
  wallet,
  onBack
}: {
  wallet: WalletSummary;
  onBack: () => void;
}) {
  return (
    <main className="min-h-[100dvh] bg-pluto-mist px-4 pb-6 pt-5 safe-pt">
      <div className="mx-auto flex min-h-[calc(100dvh-2rem)] max-w-md flex-col gap-5">
        <header className="flex items-center justify-between">
          <Button variant="secondary" size="icon" aria-label="Back" icon={<ArrowLeft className="h-4 w-4" />} onClick={onBack} />
          <h1 className="text-base font-semibold text-pluto-navy">Settings</h1>
          <PlutoLogo showWordmark={false} />
        </header>

        <SettingsSection title="Wallet">
          <SettingRow label="Wallet address" value={shortenAddress(wallet.publicKey, 6, 6)} icon={<Copy className="h-4 w-4" />} />
          <SettingRow label="Export recovery phrase" value="Placeholder" />
        </SettingsSection>

        <SettingsSection title="Security">
          <SettingRow label="PIN enabled" value="On" />
          <SettingRow label="Biometric unlock" value="Placeholder" />
          <SettingRow label="Require confirmation for all sends" value="On" />
        </SettingsSection>

        <SettingsSection title="Voice">
          <SettingRow label="Voice responses" value="On" />
          <SettingRow label="Voice style" value="Calm" />
        </SettingsSection>

        <SettingsSection title="Network">
          <SettingRow label="Active network" value={wallet.network === "devnet" ? "Devnet" : "Mainnet"} />
          <SettingRow label="Mainnet toggle" value="Locked for demo" />
        </SettingsSection>

        <SettingsSection title="About">
          <SettingRow label="Pluto" value="DEV3PACK Hackathon" />
          <SettingRow label="Powered by" value="Solana + ElevenLabs" />
        </SettingsSection>
      </div>
    </main>
  );
}

function SettingsSection({
  title,
  children
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold text-pluto-slate">{title}</h2>
      <Card className="divide-y divide-pluto-line p-0 shadow-sm">{children}</Card>
    </section>
  );
}

function SettingRow({
  label,
  value,
  icon
}: {
  label: string;
  value: string;
  icon?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-4">
      <p className="text-sm font-semibold text-pluto-navy">{label}</p>
      <div className="flex items-center gap-2 text-right text-sm text-pluto-slate">
        <span>{value}</span>
        {icon}
      </div>
    </div>
  );
}
