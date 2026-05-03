"use client";

import { ArrowDownLeft, ArrowLeft, Copy, Share2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PlutoLogo } from "@/components/ui/Logo";
import { useQrCode } from "@/hooks/useQrCode";
import { createSolanaPayUrl } from "@/lib/solana/solanaPay";
import { shortenAddress } from "@/lib/utils/format";
import type { WalletSummary } from "@/types";

export function ReceiveScreen({
  wallet,
  onBack
}: {
  wallet: WalletSummary;
  onBack: () => void;
}) {
  const paymentUrl = createSolanaPayUrl({
    recipient: wallet.publicKey,
    label: "Pluto",
    message: "Send SOL to Pluto"
  });
  const qrCode = useQrCode(paymentUrl);

  async function copyAddress() {
    await navigator.clipboard?.writeText(wallet.publicKey);
  }

  async function shareReceive() {
    if (navigator.share) {
      await navigator
        .share({
          title: "Pluto SOL address",
          text: `Send SOL to my Pluto wallet: ${paymentUrl}`
        })
        .catch(() => undefined);
      return;
    }

    await copyAddress();
  }

  return (
    <main className="min-h-[100dvh] bg-pluto-mist px-4 pb-6 pt-5 safe-pt">
      <div className="mx-auto flex min-h-[calc(100dvh-2rem)] max-w-md flex-col gap-5">
        <header className="flex items-center justify-between">
          <Button variant="secondary" size="icon" aria-label="Back" icon={<ArrowLeft className="h-4 w-4" />} onClick={onBack} />
          <h1 className="text-base font-semibold text-pluto-navy">Receive SOL</h1>
          <PlutoLogo showWordmark={false} />
        </header>

        <section className="text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-blue-50 text-pluto-blue">
            <ArrowDownLeft className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-3xl font-semibold tracking-normal text-pluto-navy">Scan to send SOL</h2>
          <p className="mt-2 text-sm leading-6 text-pluto-slate">Share your address to receive payments on Solana.</p>
        </section>

        <Card className="grid place-items-center p-5">
          <div className="grid aspect-square w-full max-w-[18rem] place-items-center rounded-[1.5rem] border border-pluto-line bg-white p-4">
            {qrCode ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img alt="Solana receive QR code" src={qrCode} className="h-full w-full rounded-2xl" />
            ) : (
              <div className="h-full w-full animate-pulse rounded-2xl bg-blue-50" />
            )}
          </div>
        </Card>

        <Card className="space-y-3 shadow-sm">
          <p className="text-sm font-semibold text-pluto-navy">Your SOL address</p>
          <div className="flex items-center justify-between gap-3 rounded-[1rem] bg-pluto-mist px-3 py-3">
            <p className="truncate text-sm font-semibold text-pluto-navy">{shortenAddress(wallet.publicKey, 8, 8)}</p>
            <button className="text-pluto-blue" aria-label="Copy address" onClick={copyAddress}>
              <Copy className="h-4 w-4" />
            </button>
          </div>
        </Card>

        <div className="mt-auto grid grid-cols-2 gap-2">
          <Button variant="secondary" icon={<Copy className="h-4 w-4" />} onClick={copyAddress}>Copy address</Button>
          <Button icon={<Share2 className="h-4 w-4" />} onClick={shareReceive}>Share request</Button>
        </div>
        <p className="text-center text-xs leading-5 text-pluto-slate">
          Only send SOL on Solana. Sending other assets may result in loss.
        </p>
      </div>
    </main>
  );
}
