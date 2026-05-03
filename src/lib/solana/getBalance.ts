import { PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { getSolanaConnection } from "@/lib/solana/connection";
import type { Network } from "@/types";

export async function getSolBalance(publicKey: string, network: Network = "devnet") {
  const connection = getSolanaConnection(network);
  const balance = await connection.getBalance(new PublicKey(publicKey));
  return balance / LAMPORTS_PER_SOL;
}
