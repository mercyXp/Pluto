"use client";

import { ArrowLeft, ShieldCheck } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PlutoLogo } from "@/components/ui/Logo";
import { TransactionIllustrationCard } from "@/components/voice/TransactionIllustrationCard";
import { formatSol, formatUsd, shortenAddress } from "@/lib/utils/format";
import type { PendingTransaction } from "@/types";

export function ConfirmationScreen({
  transaction,
  isSending,
  onBack,
  onConfirm
}: {
  transaction: PendingTransaction;
  isSending: boolean;
  onBack: () => void;
  onConfirm: () => void;
}) {
  const [holding, setHolding] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function clearHold() {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
    setHolding(false);
  }

  function startHold() {
    if (isSending) return;
    setHolding(true);
    timerRef.current = setTimeout(() => {
      setHolding(false);
      onConfirm();
    }, 1400);
  }

  return (
    <main className="min-h-[100dvh] bg-pluto-mist px-4 pb-6 pt-4 safe-pt">
      <div className="mx-auto flex min-h-[calc(100dvh-2rem)] max-w-md flex-col gap-5">
        <header className="flex items-center justify-between">
          <Button
            variant="secondary"
            size="icon"
            aria-label="Back"
            icon={<ArrowLeft className="h-4 w-4" />}
            onClick={onBack}
          />
          <h1 className="text-base font-semibold text-pluto-navy">Confirm send</h1>
          <PlutoLogo showWordmark={false} />
        </header>

        <section className="rounded-[2rem] border border-white/80 bg-white p-6 text-center shadow-pluto">
          <p className="text-sm font-medium text-pluto-slate">You're sending</p>
          <h2 className="mt-2 text-[46px] font-semibold leading-none tracking-normal text-pluto-navy">
            {formatSol(transaction.amountSol)}
          </h2>
          <p className="mt-2 text-sm text-pluto-slate">{formatUsd(transaction.fiatValueUsd)} USD</p>
        </section>

        {isSending ? <TransactionIllustrationCard state="sending" /> : null}

        <Card className="space-y-4">
          {[
            {
              label: "To",
              value: transaction.recipient.name,
              subtext: `wallet ending ${transaction.recipient.walletEnding}`
            },
            {
              label: "From",
              value: transaction.fromWalletName,
              subtext: shortenAddress(transaction.fromAddress)
            },
            {
              label: "Memo",
              value: transaction.memo || "None",
              subtext: undefined
            },
            {
              label: "Network",
              value: transaction.network === "devnet" ? "Solana Devnet" : "Solana Mainnet",
              subtext: undefined
            },
            {
              label: "Network fee",
              value: `~${transaction.feeSol} SOL`,
              subtext: undefined
            },
            {
              label: "Total",
              value: `${(transaction.amountSol + transaction.feeSol).toFixed(6)} SOL`,
              subtext: undefined
            }
          ].map((row) => (
            <div key={row.label} className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-pluto-slate">{row.label}</p>
                {row.subtext ? <p className="mt-0.5 text-xs text-pluto-slate/75">{row.subtext}</p> : null}
              </div>
              <p className="max-w-[54%] text-right text-sm font-semibold text-pluto-navy">{row.value}</p>
            </div>
          ))}
        </Card>

        <div className="mt-auto space-y-3">
          <button
            type="button"
            disabled={isSending}
            onPointerDown={startHold}
            onPointerUp={clearHold}
            onPointerCancel={clearHold}
            onPointerLeave={clearHold}
            className="relative h-16 w-full overflow-hidden rounded-[1.35rem] bg-pluto-navy text-white shadow-[0_18px_40px_rgba(7,26,51,0.22)] disabled:opacity-70"
          >
            <span
              className="absolute inset-y-0 left-0 bg-pluto-blue transition-[width] duration-[1400ms] ease-linear"
              style={{ width: holding || isSending ? "100%" : "0%" }}
            />
            <span className="relative z-10 inline-flex items-center gap-2 font-semibold">
              <ShieldCheck className="h-5 w-5" />
              {isSending ? "Sending..." : "Hold to confirm"}
            </span>
          </button>
          <p className="px-2 text-center text-xs leading-5 text-pluto-slate">
            This transaction is secure and cannot be changed after confirmation.
          </p>
        </div>
      </div>
    </main>
  );
}
