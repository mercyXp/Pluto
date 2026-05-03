import { NextResponse } from "next/server";
import { sendSolTransaction } from "@/lib/solana/sendSol";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      toPublicKey?: string;
      amountSol?: number;
      memo?: string;
      recipientAlias?: string;
      demoMode?: boolean;
    };

    if (!body.toPublicKey || !body.amountSol) {
      return NextResponse.json({ error: "Recipient and amount are required" }, { status: 400 });
    }

    // Hackathon shortcut: the visual demo can run without a funded Devnet
    // wallet. Set DEMO_REAL_SEND=true with DEMO_WALLET_SECRET_KEY to force a
    // real Devnet transaction from the server-side demo wallet.
    if (body.demoMode && process.env.DEMO_REAL_SEND !== "true") {
      return NextResponse.json({
        signature: `demo_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`,
        simulated: true
      });
    }

    const result = await sendSolTransaction({
      toPublicKey: body.toPublicKey,
      amountSol: body.amountSol,
      memo: body.memo,
      recipientAlias: body.recipientAlias,
      network: "devnet"
    });

    return NextResponse.json(
      "programId" in result
        ? {
            signature: result.signature,
            programId: result.programId,
            transactionRecord: result.transactionRecord
          }
        : {
            signature: result.signature
          }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Transaction failed. No funds were sent."
      },
      { status: 500 }
    );
  }
}
