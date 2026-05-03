import { clusterApiUrl, Connection } from "@solana/web3.js";
import type { Network } from "@/types";

export function getSolanaConnection(network: Network = "devnet") {
  const rpcUrl =
    process.env.SOLANA_RPC_URL ||
    (network === "devnet" ? clusterApiUrl("devnet") : clusterApiUrl("mainnet-beta"));

  return new Connection(rpcUrl, "confirmed");
}
