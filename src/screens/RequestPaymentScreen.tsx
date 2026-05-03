"use client";

import { ArrowLeft, Copy, QrCode, Share2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PlutoLogo } from "@/components/ui/Logo";
import { useQrCode } from "@/hooks/useQrCode";
import { cn } from "@/lib/utils/cn";
import { formatSol, formatUsd, shortenAddress } from "@/lib/utils/format";
import type { PaymentRequest } from "@/types";

export function RequestPaymentScreen({
  request,
  onBack
}: {
  request: PaymentRequest;
  onBack: () => void;
}) {
  const qrCode = useQrCode(request.paymentUrl);
  const fiatValue = request.amountSol * 173;

  async function copyLink() {
    await navigator.clipboard?.writeText(request.paymentUrl);
  }

  return (
    <main className="min-h-[100dvh] bg-pluto-mist px-4 pb-6 pt-5 safe-pt">
      <div className="mx-auto flex min-h-[calc(100dvh-2rem)] max-w-md flex-col gap-5">
        <header className="flex items-center justify-between">
          <Button variant="secondary" size="icon" aria-label="Back" icon={<ArrowLeft className="h-4 w-4" />} onClick={onBack} />
          <h1 className="text-base font-semibold text-pluto-navy">Request payment</h1>
          <PlutoLogo showWordmark={false} />
        </header>

        <section className="text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-blue-50 text-lg font-bold text-pluto-blue">
            {request.fromName.slice(0, 2).toUpperCase()}
          </div>
          <p className="mt-4 text-sm text-pluto-slate">From {request.fromName}</p>
          <h2 className="mt-1 text-[42px] font-semibold leading-none tracking-normal text-pluto-navy">
            {formatSol(request.amountSol)}
          </h2>
          <p className="mt-2 text-sm text-pluto-slate">{formatUsd(fiatValue)} USD</p>
        </section>

        <Card className="space-y-4">
          <div className="flex justify-between gap-3"><span className="text-sm text-pluto-slate">From</span><strong className="text-sm">{request.fromName}</strong></div>
          <div className="flex justify-between gap-3"><span className="text-sm text-pluto-slate">For</span><strong className="max-w-[60%] text-right text-sm">{request.memo || "Payment request"}</strong></div>
          <div className="flex justify-between gap-3"><span className="text-sm text-pluto-slate">Network</span><strong className="text-sm">Solana Devnet</strong></div>
        </Card>

        <div className="grid grid-cols-2 rounded-[1.25rem] bg-blue-50 p-1">
          {["QR code", "Payment link"].map((item, index) => (
            <button
              key={item}
              className={cn(
                "h-10 rounded-2xl text-sm font-semibold",
                index === 0 ? "bg-white text-pluto-blue shadow-sm" : "text-pluto-slate"
              )}
            >
              {item}
            </button>
          ))}
        </div>

        <Card className="grid gap-4 p-5">
          <div className="grid aspect-square w-full place-items-center rounded-[1.5rem] border border-pluto-line bg-white p-4">
            {qrCode ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img alt="Solana Pay request QR" src={qrCode} className="h-full w-full rounded-2xl" />
            ) : (
              <QrCode className="h-16 w-16 text-pluto-blue/40" />
            )}
          </div>
          <button onClick={copyLink} className="truncate rounded-[1rem] bg-pluto-mist px-3 py-3 text-left text-xs font-semibold text-pluto-blue">
            {shortenAddress(request.paymentUrl, 20, 14)}
          </button>
        </Card>

        <div className="mt-auto grid grid-cols-2 gap-2">
          <Button variant="secondary" icon={<Copy className="h-4 w-4" />} onClick={copyLink}>Copy link</Button>
          <Button icon={<Share2 className="h-4 w-4" />}>Share request</Button>
        </div>
        <p className="text-center text-xs text-pluto-slate">Only {request.fromName} can pay this request.</p>
      </div>
    </main>
  );
}
