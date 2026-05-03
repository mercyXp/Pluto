"use client";

import { ArrowLeft, Check, Copy } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PlutoLogo } from "@/components/ui/Logo";
import { shortenAddress } from "@/lib/utils/format";
import type { PlutoSettings, WalletSummary } from "@/types";

export function SettingsScreen({
  wallet,
  settings,
  backendLabel,
  onSettingsChange,
  onBack
}: {
  wallet: WalletSummary;
  settings: PlutoSettings;
  backendLabel?: string;
  onSettingsChange: (settings: PlutoSettings) => void;
  onBack: () => void;
}) {
  async function copyAddress() {
    await navigator.clipboard?.writeText(wallet.publicKey);
  }

  function updateSettings(patch: Partial<PlutoSettings>) {
    onSettingsChange({ ...settings, ...patch });
  }

  return (
    <main className="min-h-[100dvh] bg-pluto-mist px-4 pb-6 pt-5 safe-pt">
      <div className="mx-auto flex min-h-[calc(100dvh-2rem)] max-w-md flex-col gap-5">
        <header className="flex items-center justify-between">
          <Button variant="secondary" size="icon" aria-label="Back" icon={<ArrowLeft className="h-4 w-4" />} onClick={onBack} />
          <h1 className="text-base font-semibold text-pluto-navy">Settings</h1>
          <PlutoLogo showWordmark={false} />
        </header>

        <SettingsSection title="Wallet">
          <SettingRow
            label="Wallet address"
            value={shortenAddress(wallet.publicKey, 6, 6)}
            icon={<Copy className="h-4 w-4" />}
            onClick={copyAddress}
          />
          <SettingRow label="Export recovery phrase" value="Placeholder" />
        </SettingsSection>

        <SettingsSection title="Security">
          <SettingRow label="PIN enabled" value="On" />
          <ToggleRow
            label="Biometric unlock"
            description="Stored as a preference until native biometric auth is added."
            enabled={settings.biometricEnabled}
            onToggle={() => updateSettings({ biometricEnabled: !settings.biometricEnabled })}
          />
          <ToggleRow
            label="Require confirmation for all sends"
            description="Keep this on for wallet safety."
            enabled={settings.requireConfirmation}
            onToggle={() => updateSettings({ requireConfirmation: !settings.requireConfirmation })}
          />
        </SettingsSection>

        <SettingsSection title="Voice">
          <ToggleRow
            label="Voice responses"
            description="Play ElevenLabs audio when available."
            enabled={settings.voiceEnabled}
            onToggle={() => updateSettings({ voiceEnabled: !settings.voiceEnabled })}
          />
          <SettingRow label="Voice style" value={settings.voiceStyle === "calm" ? "Calm" : settings.voiceStyle} />
        </SettingsSection>

        <SettingsSection title="Network">
          <SettingRow label="Active network" value={settings.network === "devnet" ? "Devnet" : "Mainnet"} />
          <SettingRow label="Mainnet toggle" value="Locked for demo" />
        </SettingsSection>

        <SettingsSection title="Backend">
          <SettingRow label="Firebase sync" value={backendLabel || "Local fallback"} />
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
  icon,
  onClick
}: {
  label: string;
  value: string;
  icon?: ReactNode;
  onClick?: () => void;
}) {
  const content = (
    <>
      <p className="text-sm font-semibold text-pluto-navy">{label}</p>
      <div className="flex items-center gap-2 text-right text-sm text-pluto-slate">
        <span>{value}</span>
        {icon}
      </div>
    </>
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left">
        {content}
      </button>
    );
  }

  return (
    <div className="flex items-center justify-between gap-4 px-4 py-4">
      {content}
    </div>
  );
}

function ToggleRow({
  label,
  description,
  enabled,
  onToggle
}: {
  label: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button type="button" onClick={onToggle} className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left">
      <span>
        <span className="block text-sm font-semibold text-pluto-navy">{label}</span>
        <span className="mt-1 block text-xs leading-5 text-pluto-slate">{description}</span>
      </span>
      <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${enabled ? "bg-blue-50 text-pluto-blue" : "bg-pluto-mist text-pluto-slate"}`}>
        {enabled ? <Check className="h-4 w-4" /> : null}
      </span>
    </button>
  );
}
