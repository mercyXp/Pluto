export function createSolanaPayUrl({
  recipient,
  amountSol,
  label = "Pluto",
  message,
  memo
}: {
  recipient: string;
  amountSol?: number;
  label?: string;
  message?: string;
  memo?: string;
}) {
  const url = new URL(`solana:${recipient}`);
  if (amountSol) url.searchParams.set("amount", String(amountSol));
  if (label) url.searchParams.set("label", label);
  if (message) url.searchParams.set("message", message);
  if (memo) url.searchParams.set("memo", memo);
  return url.toString();
}
