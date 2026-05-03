"use client";

import { ArrowLeft, Plus, Search, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PlutoLogo } from "@/components/ui/Logo";
import { TextInput } from "@/components/ui/TextInput";
import { cn } from "@/lib/utils/cn";
import { shortenAddress } from "@/lib/utils/format";
import type { Contact } from "@/types";

export function ContactsScreen({
  contacts,
  onBack,
  onAddContact,
  onSelectContact
}: {
  contacts: Contact[];
  onBack: () => void;
  onAddContact: () => void;
  onSelectContact: (contact: Contact) => void;
}) {
  const [query, setQuery] = useState("");
  const filtered = contacts.filter((contact) =>
    `${contact.name} ${contact.aliases.join(" ")} ${contact.walletAddress}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  return (
    <main className="min-h-[100dvh] bg-pluto-mist px-4 pb-6 pt-5 safe-pt">
      <div className="mx-auto flex min-h-[calc(100dvh-2rem)] max-w-md flex-col gap-5">
        <header className="flex items-center justify-between">
          <Button variant="secondary" size="icon" aria-label="Back" icon={<ArrowLeft className="h-4 w-4" />} onClick={onBack} />
          <h1 className="text-base font-semibold text-pluto-navy">Contacts</h1>
          <PlutoLogo showWordmark={false} />
        </header>

        <div className="flex gap-2">
          <div className="relative min-w-0 flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-pluto-slate" />
            <TextInput className="pl-11" placeholder="Search name or wallet" value={query} onChange={(event) => setQuery(event.target.value)} />
          </div>
          <Button size="icon" aria-label="Add contact" icon={<Plus className="h-4 w-4" />} onClick={onAddContact} />
        </div>

        <div className="space-y-3">
          {filtered.map((contact) => (
            <button
              type="button"
              key={contact.id}
              onClick={() => onSelectContact(contact)}
              className="block w-full text-left"
            >
              <Card className="flex items-center gap-3 p-4 shadow-sm transition hover:border-pluto-blue/35">
                <div className={cn("grid h-12 w-12 place-items-center rounded-full text-sm font-bold", contact.color)}>
                  {contact.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold text-pluto-navy">{contact.name}</p>
                    {contact.trusted ? <ShieldCheck className="h-4 w-4 text-pluto-blue" /> : null}
                  </div>
                  <p className="mt-0.5 truncate text-xs text-pluto-slate">{shortenAddress(contact.walletAddress, 7, 6)}</p>
                  <p className="mt-1 text-xs text-pluto-slate">{contact.lastTransactionSummary}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  {contact.trusted ? <span className="rounded-full bg-blue-50 px-2 py-1 text-[10px] font-semibold text-pluto-blue">Trusted</span> : null}
                  {contact.recent ? <span className="rounded-full bg-pluto-mist px-2 py-1 text-[10px] font-semibold text-pluto-slate">Recent</span> : null}
                </div>
              </Card>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
