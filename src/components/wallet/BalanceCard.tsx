"use client";

import { Eye, EyeOff, Plus, QrCode, Send, WalletCards } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatSol, formatUsd } from "@/lib/utils/format";
import type { WalletSummary } from "@/types";

export function BalanceCard({
  wallet,
  onReceive,
  onSend,
  onRequest,
  onAddFunds
}: {
  wallet: WalletSummary;
  onReceive: () => void;
  onSend: () => void;
  onRequest: () => void;
  onAddFunds: () => void;
}) {
  const [hidden, setHidden] = useState(false);

  return (
    <Card className="overflow-hidden p-0">
      <div className="relative p-6">
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-blue-50 to-transparent" />
        <div className="relative flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-pluto-slate">Total balance</p>
            <div className="mt-3 flex items-center gap-2">
              <h2 className="text-[40px] font-semibold leading-none tracking-normal text-pluto-navy">
                {hidden ? "**** SOL" : formatSol(wallet.balanceSol)}
              </h2>
            </div>
            <p className="mt-2 text-sm text-pluto-slate">
              {hidden ? "**** USD" : `${formatUsd(wallet.fiatValueUsd)} USD`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onAddFunds}
              className="inline-flex h-10 items-center gap-1.5 rounded-full border border-pluto-line bg-white px-3 text-xs font-semibold text-pluto-blue"
            >
              <Plus className="h-3.5 w-3.5" />
              Add SOL
            </button>
            <button
              aria-label={hidden ? "Show balance" : "Hide balance"}
              onClick={() => setHidden((value) => !value)}
              className="grid h-10 w-10 place-items-center rounded-full border border-pluto-line bg-white text-pluto-slate"
            >
              {hidden ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="relative mt-6 grid grid-cols-3 gap-2">
          <Button
            variant="secondary"
            className="h-14 flex-col gap-1 px-2 text-xs"
            icon={<QrCode className="h-4 w-4" />}
            onClick={onReceive}
          >
            Receive
          </Button>
          <Button
            className="h-14 flex-col gap-1 px-2 text-xs"
            icon={<Send className="h-4 w-4" />}
            onClick={onSend}
          >
            Send
          </Button>
          <Button
            variant="secondary"
            className="h-14 flex-col gap-1 px-2 text-xs"
            icon={<WalletCards className="h-4 w-4" />}
            onClick={onRequest}
          >
            Request
          </Button>
        </div>
      </div>
    </Card>
  );
}
