"use client";

import { ExternalLink, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PlutoLogo } from "@/components/ui/Logo";
import { PlutoOrb } from "@/components/voice/PlutoOrb";
import { formatSol, formatUsd, shortenAddress } from "@/lib/utils/format";
import type { PendingTransaction } from "@/types";

export function SuccessScreen({
  transaction,
  signature,
  onDone,
  onSendAgain
}: {
  transaction: PendingTransaction;
  signature: string;
  onDone: () => void;
  onSendAgain: () => void;
}) {
  const explorerUrl = `https://explorer.solana.com/tx/${signature}?cluster=devnet`;

  return (
    <main className="min-h-[100dvh] bg-pluto-mist px-4 pb-6 pt-5 safe-pt">
      <div className="mx-auto flex min-h-[calc(100dvh-2rem)] max-w-md flex-col gap-5">
        <header className="flex justify-center">
          <PlutoLogo />
        </header>

        <section className="flex flex-col items-center pt-4 text-center">
          <PlutoOrb state="success" />
          <h1 className="mt-6 text-4xl font-semibold tracking-normal text-pluto-navy">Sent</h1>
          <p className="mt-2 text-lg font-semibold text-pluto-navy">
            {formatSol(transaction.amountSol)} to {transaction.recipient.name}
          </p>
          <p className="mt-1 text-sm text-pluto-slate">{formatUsd(transaction.fiatValueUsd)} USD</p>
        </section>

        <Card className="space-y-4">
          {[
            { label: "Transaction hash", value: shortenAddress(signature, 6, 6) },
            { label: "Date & time", value: new Date().toLocaleString() },
            { label: "Network", value: "Solana Devnet" },
            { label: "Fee", value: `~${transaction.feeSol} SOL` }
          ].map((row) => (
            <div key={row.label} className="flex items-center justify-between gap-4">
              <p className="text-sm text-pluto-slate">{row.label}</p>
              <p className="text-right text-sm font-semibold text-pluto-navy">{row.value}</p>
            </div>
          ))}
        </Card>

        <Card className="bg-blue-50/80 shadow-none">
          <p className="text-sm font-semibold text-pluto-navy">Your SOL has been sent.</p>
          <p className="mt-1 text-sm text-pluto-slate">{transaction.recipient.name} will receive it shortly.</p>
        </Card>

        <div className="mt-auto grid gap-2">
          <Button
            variant="secondary"
            icon={<ExternalLink className="h-4 w-4" />}
            onClick={() => window.open(explorerUrl, "_blank", "noopener,noreferrer")}
          >
            View transaction
          </Button>
          <Button
            variant="secondary"
            icon={<RotateCcw className="h-4 w-4" />}
            onClick={onSendAgain}
          >
            Send again
          </Button>
          <Button onClick={onDone}>Done</Button>
        </div>
      </div>
    </main>
  );
}
