"use client";

import { Settings } from "lucide-react";
import { PlutoLogo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { BalanceCard } from "@/components/wallet/BalanceCard";
import { ContactsStrip } from "@/components/wallet/ContactsStrip";
import { ActivityList } from "@/components/wallet/ActivityList";
import type { Activity, Contact, WalletSummary } from "@/types";

export function HomeLayer({
  wallet,
  contacts,
  activities,
  onReceive,
  onSend,
  onRequest,
  onAddFunds,
  onAddContact,
  onContacts,
  onContact,
  onActivity,
  onSettings
}: {
  wallet: WalletSummary;
  contacts: Contact[];
  activities: Activity[];
  onReceive: () => void;
  onSend: () => void;
  onRequest: () => void;
  onAddFunds: () => void;
  onAddContact: () => void;
  onContacts: () => void;
  onContact: (contact: Contact) => void;
  onActivity: (activity: Activity) => void;
  onSettings: () => void;
}) {
  return (
    <div className="absolute inset-0 overflow-y-auto px-4 pb-32 pt-5 safe-pt">
      <div className="mx-auto flex min-h-full w-full max-w-md flex-col gap-5">
        <header className="flex items-center justify-between">
          <PlutoLogo />
          <Button
            aria-label="Open settings"
            variant="secondary"
            size="icon"
            icon={<Settings className="h-4 w-4" />}
            onClick={onSettings}
          />
        </header>

        <div>
          <h1 className="text-2xl font-semibold tracking-normal text-pluto-navy">
            Good evening, {wallet.ownerName}
          </h1>
          <p className="mt-1 text-sm text-pluto-slate">Here&apos;s your wallet overview.</p>
        </div>

        <BalanceCard
          wallet={wallet}
          onReceive={onReceive}
          onSend={onSend}
          onRequest={onRequest}
          onAddFunds={onAddFunds}
        />
        <ContactsStrip
          contacts={contacts}
          onViewAll={onContacts}
          onAddContact={onAddContact}
          onSelectContact={onContact}
        />
        <ActivityList activities={activities} onActivityClick={onActivity} />

        <div className="mx-auto mt-auto h-1.5 w-12 rounded-full bg-pluto-line" />
      </div>
    </div>
  );
}
