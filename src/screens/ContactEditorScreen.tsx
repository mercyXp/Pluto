"use client";

import { ArrowLeft, Check, Mic, ShieldCheck } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PlutoLogo } from "@/components/ui/Logo";
import { TextArea, TextInput } from "@/components/ui/TextInput";
import type { Contact } from "@/types";

export type ContactEditorDraft = Partial<Contact> & {
  name?: string;
  walletAddress?: string;
};

export function ContactEditorScreen({
  mode,
  draft,
  onBack,
  onSave
}: {
  mode: "add" | "edit";
  draft?: ContactEditorDraft;
  onBack: () => void;
  onSave: (contact: Contact) => void;
}) {
  const [name, setName] = useState(draft?.name || "");
  const [walletAddress, setWalletAddress] = useState(draft?.walletAddress || "");
  const [aliases, setAliases] = useState(draft?.aliases?.join(", ") || draft?.name || "");
  const [notes, setNotes] = useState(draft?.notes || "");
  const [trusted, setTrusted] = useState(draft?.trusted ?? true);

  const canSave = name.trim().length > 1 && walletAddress.trim().length > 5;
  const voiceHint = useMemo(() => {
    if (draft?.name || draft?.walletAddress) return "Voice draft ready. Review the details before saving.";
    return "You can also say: Add contact Nia with wallet 7x...";
  }, [draft]);

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!canSave) return;

    const normalizedName = name.trim();
    const address = walletAddress.trim();
    const id =
      draft?.id ||
      normalizedName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") ||
      `contact-${Date.now()}`;

    onSave({
      id,
      name: normalizedName,
      aliases: aliases
        .split(",")
        .map((alias) => alias.trim())
        .filter(Boolean),
      walletAddress: address,
      walletEnding: address.slice(-4),
      trusted,
      recent: draft?.recent ?? false,
      lastTransactionSummary: draft?.lastTransactionSummary || "New contact",
      color: draft?.color || "bg-blue-100 text-blue-700",
      notes
    });
  }

  return (
    <main className="min-h-[100dvh] bg-white px-4 pb-6 pt-5 safe-pt">
      <form onSubmit={submit} className="mx-auto flex min-h-[calc(100dvh-2rem)] max-w-md flex-col gap-5">
        <header className="flex items-center justify-between">
          <Button type="button" variant="secondary" size="icon" aria-label="Back" icon={<ArrowLeft className="h-4 w-4" />} onClick={onBack} />
          <h1 className="text-base font-semibold text-pluto-navy">{mode === "add" ? "Add contact" : "Edit contact"}</h1>
          <PlutoLogo showWordmark={false} />
        </header>

        <Card className="bg-pluto-mist/70 shadow-none">
          <div className="flex items-start gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-pluto-blue">
              <Mic className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-pluto-navy">Manual or voice</p>
              <p className="mt-1 text-sm leading-6 text-pluto-slate">{voiceHint}</p>
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-pluto-navy">Name</span>
            <TextInput value={name} onChange={(event) => setName(event.target.value)} placeholder="Muape K" />
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-pluto-navy">Solana wallet address</span>
            <TextInput value={walletAddress} onChange={(event) => setWalletAddress(event.target.value)} placeholder="7xC1..." />
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-pluto-navy">Aliases</span>
            <TextInput value={aliases} onChange={(event) => setAliases(event.target.value)} placeholder="Muape, MK" />
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-pluto-navy">Notes</span>
            <TextArea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="How you know this contact..." />
          </label>
        </div>

        <button
          type="button"
          onClick={() => setTrusted((value) => !value)}
          className="flex items-center justify-between rounded-[1.25rem] border border-pluto-line bg-white px-4 py-4 text-left shadow-sm"
        >
          <span>
            <span className="block text-sm font-semibold text-pluto-navy">Trusted contact</span>
            <span className="mt-1 block text-xs text-pluto-slate">Pluto will still require confirmation before sends.</span>
          </span>
          <span className={`grid h-9 w-9 place-items-center rounded-full ${trusted ? "bg-blue-50 text-pluto-blue" : "bg-pluto-mist text-pluto-slate"}`}>
            <ShieldCheck className="h-4 w-4" />
          </span>
        </button>

        <Button type="submit" size="lg" className="mt-auto w-full" disabled={!canSave} icon={<Check className="h-4 w-4" />}>
          Save contact
        </Button>
      </form>
    </main>
  );
}
