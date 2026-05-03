"use client";

import { ArrowLeft, Copy, Droplets, ExternalLink, QrCode } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PlutoLogo } from "@/components/ui/Logo";
import { useQrCode } from "@/hooks/useQrCode";
import { createSolanaPayUrl } from "@/lib/solana/solanaPay";
import { shortenAddress } from "@/lib/utils/format";
import type { WalletSummary } from "@/types";

export function AddFundsScreen({
  wallet,
  onBack,
  onReceive
}: {
  wallet: WalletSummary;
  onBack: () => void;
  onReceive: () => void;
}) {
  const receiveUrl = createSolanaPayUrl({
    recipient: wallet.publicKey,
    label: "Pluto",
    message: "Add SOL to Pluto"
  });
  const qrCode = useQrCode(receiveUrl);

  async function copyAddress() {
    await navigator.clipboard?.writeText(wallet.publicKey);
  }

  return (
    <main className="min-h-[100dvh] bg-white px-4 pb-6 pt-5 safe-pt">
      <div className="mx-auto flex min-h-[calc(100dvh-2rem)] max-w-md flex-col gap-5">
        <header className="flex items-center justify-between">
          <Button variant="secondary" size="icon" aria-label="Back" icon={<ArrowLeft className="h-4 w-4" />} onClick={onBack} />
          <h1 className="text-base font-semibold text-pluto-navy">Add SOL</h1>
          <PlutoLogo showWordmark={false} />
        </header>

        <section>
          <h2 className="text-[34px] font-semibold leading-tight tracking-normal text-pluto-navy">Fund your Pluto wallet.</h2>
          <p className="mt-3 text-sm leading-6 text-pluto-slate">
            Use the receive address below, scan the QR, or request Devnet SOL for the hackathon demo.
          </p>
        </section>

        <Card className="grid place-items-center p-5 shadow-sm">
          <div className="grid aspect-square w-full max-w-[15rem] place-items-center rounded-[1.5rem] border border-pluto-line bg-white p-4">
            {qrCode ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img alt="Add SOL QR" src={qrCode} className="h-full w-full rounded-2xl" />
            ) : (
              <QrCode className="h-16 w-16 text-pluto-blue/40" />
            )}
          </div>
        </Card>

        <Card className="space-y-3 shadow-sm">
          <p className="text-sm font-semibold text-pluto-navy">Wallet address</p>
          <button onClick={copyAddress} className="flex w-full items-center justify-between gap-3 rounded-[1rem] bg-pluto-mist px-3 py-3 text-left">
            <span className="truncate text-sm font-semibold text-pluto-navy">{shortenAddress(wallet.publicKey, 10, 10)}</span>
            <Copy className="h-4 w-4 shrink-0 text-pluto-blue" />
          </button>
        </Card>

        <Card className="bg-blue-50/70 shadow-none">
          <div className="flex items-start gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-pluto-blue">
              <Droplets className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-pluto-navy">Devnet demo funding</p>
              <p className="mt-1 text-sm leading-6 text-pluto-slate">
                For a real Devnet send, fund the configured demo wallet from the Solana faucet, then set `DEMO_REAL_SEND=true`.
              </p>
            </div>
          </div>
        </Card>

        <div className="mt-auto grid gap-2">
          <Button variant="secondary" icon={<ExternalLink className="h-4 w-4" />} onClick={() => window.open("https://faucet.solana.com/", "_blank", "noopener,noreferrer")}>Open Solana faucet</Button>
          <Button variant="secondary" onClick={onReceive}>Show receive screen</Button>
          <Button onClick={copyAddress}>Copy address</Button>
        </div>
      </div>
    </main>
  );
}
