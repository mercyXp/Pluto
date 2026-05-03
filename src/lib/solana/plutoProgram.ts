import { AnchorProvider, BN, Program, type Idl } from "@coral-xyz/anchor";
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { IDL } from "@/lib/solana/pluto_program_idl";

export interface PlutoProgramSendResult {
  signature: string;
  programId: string;
  transactionRecord: string;
}

function getPlutoProgramId() {
  const programId = process.env.NEXT_PUBLIC_PLUTO_PROGRAM_ID;
  if (!programId || programId === "PLACEHOLDER") {
    throw new Error("NEXT_PUBLIC_PLUTO_PROGRAM_ID is required to call the Pluto Anchor program.");
  }
  return new PublicKey(programId);
}

export async function sendWithMemoOnChain({
  connection,
  senderKeypair,
  recipientAddress,
  amountSol,
  recipientAlias,
  memo
}: {
  connection: Connection;
  senderKeypair: Keypair;
  recipientAddress: string;
  amountSol: number;
  recipientAlias: string;
  memo?: string;
}): Promise<PlutoProgramSendResult> {
  const programId = getPlutoProgramId();
  const wallet = {
    publicKey: senderKeypair.publicKey,
    signTransaction: async (transaction: Transaction) => {
      transaction.sign(senderKeypair);
      return transaction;
    },
    signAllTransactions: async (transactions: Transaction[]) =>
      transactions.map((transaction) => {
        transaction.sign(senderKeypair);
        return transaction;
      })
  };

  const provider = new AnchorProvider(
    connection,
    wallet as any,
    { commitment: "confirmed" }
  );

  const idl = { ...IDL, address: programId.toString() } as unknown as Idl;
  const program = new Program(idl, provider);
  const recipientPubkey = new PublicKey(recipientAddress);
  const amountLamports = new BN(Math.round(amountSol * LAMPORTS_PER_SOL));
  const timestamp = Math.floor(Date.now() / 1000);
  const timestampSeed = new BN(timestamp).toArrayLike(Buffer, "le", 8);

  const [transactionRecord] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("pluto_tx"),
      senderKeypair.publicKey.toBuffer(),
      recipientPubkey.toBuffer(),
      timestampSeed
    ],
    programId
  );

  const signature = await program.methods
    .sendWithMemo(
      amountLamports,
      recipientAlias.slice(0, 50),
      (memo || "").slice(0, 100),
      new BN(timestamp)
    )
    .accounts({
      sender: senderKeypair.publicKey,
      recipient: recipientPubkey,
      transactionRecord,
      systemProgram: SystemProgram.programId
    })
    .rpc();

  return {
    signature,
    programId: programId.toString(),
    transactionRecord: transactionRecord.toString()
  };
}
