import { Keypair } from "@solana/web3.js";

export function keypairFromSecret(secret: string) {
  const parsed = JSON.parse(secret) as number[];
  return Keypair.fromSecretKey(Uint8Array.from(parsed));
}

export function createDemoKeypair() {
  return Keypair.generate();
}
