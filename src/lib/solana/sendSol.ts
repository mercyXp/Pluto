import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
  sendAndConfirmTransaction
} from "@solana/web3.js";
import { getSolanaConnection } from "@/lib/solana/connection";
import { keypairFromSecret } from "@/lib/solana/wallet";
import type { Network } from "@/types";

const MEMO_PROGRAM_ID = new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr");

export async function sendSolTransaction({
  toPublicKey,
  amountSol,
  memo,
  network = "devnet"
}: {
  toPublicKey: string;
  amountSol: number;
  memo?: string;
  network?: Network;
}) {
  if (!Number.isFinite(amountSol) || amountSol <= 0) {
    throw new Error("Please enter an amount greater than 0.");
  }

  if (!process.env.DEMO_WALLET_SECRET_KEY) {
    throw new Error("DEMO_WALLET_SECRET_KEY is required for real Devnet sends.");
  }

  const fromKeypair = keypairFromSecret(process.env.DEMO_WALLET_SECRET_KEY);
  const to = new PublicKey(toPublicKey);
  const lamports = Math.round(amountSol * LAMPORTS_PER_SOL);
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: fromKeypair.publicKey,
      toPubkey: to,
      lamports
    })
  );

  if (memo) {
    transaction.add(
      new TransactionInstruction({
        keys: [],
        programId: MEMO_PROGRAM_ID,
        data: Buffer.from(memo, "utf8")
      })
    );
  }

  const connection = getSolanaConnection(network);
  return sendAndConfirmTransaction(connection, transaction, [fromKeypair], {
    commitment: "confirmed"
  });
}
