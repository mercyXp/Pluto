"use client";

import { ArrowLeft, Copy, Pencil, Send, ShieldCheck, Trash2, WalletCards } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PlutoLogo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils/cn";
import { shortenAddress } from "@/lib/utils/format";
import type { Contact } from "@/types";

export function ContactDetailScreen({
  contact,
  onBack,
  onSend,
  onRequest,
  onEdit,
  onRemove
}: {
  contact: Contact;
  onBack: () => void;
  onSend: (contact: Contact) => void;
  onRequest: (contact: Contact) => void;
  onEdit: (contact: Contact) => void;
  onRemove: (contact: Contact) => void;
}) {
  const [confirmRemove, setConfirmRemove] = useState(false);

  async function copyAddress() {
    await navigator.clipboard?.writeText(contact.walletAddress);
  }

  return (
    <main className="min-h-[100dvh] bg-white px-4 pb-6 pt-5 safe-pt">
      <div className="mx-auto flex min-h-[calc(100dvh-2rem)] max-w-md flex-col gap-5">
        <header className="flex items-center justify-between">
          <Button variant="secondary" size="icon" aria-label="Back" icon={<ArrowLeft className="h-4 w-4" />} onClick={onBack} />
          <h1 className="text-base font-semibold text-pluto-navy">Contact</h1>
          <PlutoLogo showWordmark={false} />
        </header>

        <section className="pt-4 text-center">
          <div className={cn("mx-auto grid h-24 w-24 place-items-center rounded-full text-2xl font-bold shadow-sm", contact.color)}>
            {contact.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}
          </div>
          <div className="mt-4 flex items-center justify-center gap-2">
            <h2 className="text-3xl font-semibold tracking-normal text-pluto-navy">{contact.name}</h2>
            {contact.trusted ? <ShieldCheck className="h-5 w-5 text-pluto-blue" /> : null}
          </div>
          <p className="mt-2 text-sm text-pluto-slate">{shortenAddress(contact.walletAddress, 10, 8)}</p>
        </section>

        <div className="grid grid-cols-3 gap-2">
          <Button className="h-14 flex-col gap-1 px-2 text-xs" icon={<Send className="h-4 w-4" />} onClick={() => onSend(contact)}>Send</Button>
          <Button variant="secondary" className="h-14 flex-col gap-1 px-2 text-xs" icon={<WalletCards className="h-4 w-4" />} onClick={() => onRequest(contact)}>Request</Button>
          <Button variant="secondary" className="h-14 flex-col gap-1 px-2 text-xs" icon={<Copy className="h-4 w-4" />} onClick={copyAddress}>Copy</Button>
        </div>

        <Card className="space-y-4 shadow-sm">
          <DetailRow label="Wallet ending" value={contact.walletEnding} />
          <DetailRow label="Aliases" value={contact.aliases.join(", ")} />
          <DetailRow label="Trust status" value={contact.trusted ? "Trusted contact" : "Review before sending"} />
          <DetailRow label="Last activity" value={contact.lastTransactionSummary || "No activity yet"} />
        </Card>

        <Card className="bg-pluto-mist/80 shadow-none">
          <p className="text-sm font-semibold text-pluto-navy">Notes</p>
          <p className="mt-2 text-sm leading-6 text-pluto-slate">{contact.notes || "No notes yet."}</p>
        </Card>

        {confirmRemove ? (
          <Card className="mt-auto border-red-100 bg-red-50 shadow-none">
            <p className="text-sm font-semibold text-red-800">Remove {contact.name}?</p>
            <p className="mt-1 text-sm leading-6 text-red-700">
              This only removes the saved contact. Past receipts stay in activity.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button variant="secondary" onClick={() => setConfirmRemove(false)}>Cancel</Button>
              <Button variant="danger" icon={<Trash2 className="h-4 w-4" />} onClick={() => onRemove(contact)}>Remove</Button>
            </div>
          </Card>
        ) : (
          <div className="mt-auto grid grid-cols-2 gap-2">
            <Button variant="secondary" icon={<Pencil className="h-4 w-4" />} onClick={() => onEdit(contact)}>Edit</Button>
            <Button variant="danger" icon={<Trash2 className="h-4 w-4" />} onClick={() => setConfirmRemove(true)}>Remove</Button>
          </div>
        )}
      </div>
    </main>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <p className="text-sm text-pluto-slate">{label}</p>
      <p className="max-w-[62%] text-right text-sm font-semibold text-pluto-navy">{value}</p>
    </div>
  );
}
