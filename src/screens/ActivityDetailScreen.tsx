"use client";

import { ArrowDownLeft, ArrowLeft, ArrowUpRight, Copy, ExternalLink, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PlutoLogo } from "@/components/ui/Logo";
import { formatSol, shortenAddress } from "@/lib/utils/format";
import type { Activity, WalletSummary } from "@/types";

export function ActivityDetailScreen({
  activity,
  wallet,
  onBack,
  onRepeat
}: {
  activity: Activity;
  wallet: WalletSummary;
  onBack: () => void;
  onRepeat: (activity: Activity) => void;
}) {
  const isReceive = activity.amountSol > 0;
  const signature = activity.signature || "demo-signature";
  const explorerUrl = `https://explorer.solana.com/tx/${signature}?cluster=devnet`;

  async function copyHash() {
    await navigator.clipboard?.writeText(signature);
  }

  return (
    <main className="min-h-[100dvh] bg-white px-4 pb-6 pt-5 safe-pt">
      <div className="mx-auto flex min-h-[calc(100dvh-2rem)] max-w-md flex-col gap-5">
        <header className="flex items-center justify-between">
          <Button variant="secondary" size="icon" aria-label="Back" icon={<ArrowLeft className="h-4 w-4" />} onClick={onBack} />
          <h1 className="text-base font-semibold text-pluto-navy">Receipt</h1>
          <PlutoLogo showWordmark={false} />
        </header>

        <section className="rounded-[2rem] border border-pluto-line bg-pluto-mist p-6 text-center">
          <div className={`mx-auto grid h-14 w-14 place-items-center rounded-full ${isReceive ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-pluto-blue"}`}>
            {isReceive ? <ArrowDownLeft className="h-6 w-6" /> : <ArrowUpRight className="h-6 w-6" />}
          </div>
          <p className="mt-4 text-sm font-medium text-pluto-slate">{isReceive ? "Received" : "Sent"}</p>
          <h2 className="mt-2 text-[42px] font-semibold leading-none tracking-normal text-pluto-navy">
            {isReceive ? "+" : ""}
            {formatSol(activity.amountSol)}
          </h2>
          <p className="mt-2 text-sm text-pluto-slate">
            {activity.contactName} - {activity.timestamp}
          </p>
        </section>

        <Card className="space-y-4 shadow-sm">
          <ReceiptRow label="Status" value={activity.status || "confirmed"} />
          <ReceiptRow label={isReceive ? "From" : "To"} value={activity.contactName} />
          <ReceiptRow label="Wallet" value={shortenAddress(activity.counterpartyAddress || wallet.publicKey, 8, 8)} />
          <ReceiptRow label="Memo" value={activity.memo || "None"} />
          <ReceiptRow label="Network" value={activity.network === "mainnet-beta" ? "Solana Mainnet" : "Solana Devnet"} />
          <ReceiptRow label="Network fee" value={`~${activity.feeSol || 0.000005} SOL`} />
          <ReceiptRow label="Signature" value={shortenAddress(signature, 7, 7)} />
          {activity.programId ? <ReceiptRow label="Program" value={shortenAddress(activity.programId, 7, 7)} /> : null}
          {activity.transactionRecord ? <ReceiptRow label="On-chain record" value={shortenAddress(activity.transactionRecord, 7, 7)} /> : null}
        </Card>

        <div className="mt-auto grid gap-2">
          <Button variant="secondary" icon={<Copy className="h-4 w-4" />} onClick={copyHash}>Copy transaction hash</Button>
          <Button variant="secondary" icon={<ExternalLink className="h-4 w-4" />} onClick={() => window.open(explorerUrl, "_blank", "noopener,noreferrer")}>View on Explorer</Button>
          <Button icon={<RotateCcw className="h-4 w-4" />} onClick={() => onRepeat(activity)}>
            {isReceive ? "Request again" : "Send again"}
          </Button>
        </div>
      </div>
    </main>
  );
}

function ReceiptRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <p className="text-sm text-pluto-slate">{label}</p>
      <p className="max-w-[62%] text-right text-sm font-semibold text-pluto-navy">{value}</p>
    </div>
  );
}
