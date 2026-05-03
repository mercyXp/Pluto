import { resolveContact } from "@/lib/contacts/resolveContact";
import { createSolanaPayUrl } from "@/lib/solana/solanaPay";
import { parseIntent } from "@/lib/intent/parseIntent";
import type {
  Contact,
  ConversationContext,
  ConversationResult,
  IntentParseResult,
  PaymentRequest,
  PendingTransaction,
  WalletSummary
} from "@/types";

const SOL_USD_DEMO_RATE = 173;
const DEVNET_FEE_SOL = 0.000005;

function buildPendingTransaction({
  amountSol,
  recipient,
  memo,
  wallet
}: {
  amountSol: number;
  recipient: Contact;
  memo?: string;
  wallet: WalletSummary;
}): PendingTransaction {
  return {
    amountSol,
    token: "SOL",
    recipient,
    memo,
    fromWalletName: wallet.walletName,
    fromAddress: wallet.publicKey,
    network: wallet.network,
    feeSol: DEVNET_FEE_SOL,
    fiatValueUsd: amountSol * SOL_USD_DEMO_RATE
  };
}

function buildPaymentRequest({
  amountSol,
  fromName,
  memo,
  wallet
}: {
  amountSol: number;
  fromName: string;
  memo?: string;
  wallet: WalletSummary;
}): PaymentRequest {
  return {
    id: `request-${Date.now()}`,
    amountSol,
    token: "SOL",
    fromName,
    memo,
    network: wallet.network,
    paymentUrl: createSolanaPayUrl({
      recipient: wallet.publicKey,
      amountSol,
      message: memo ? `Pluto request: ${memo}` : "Pluto request",
      memo
    })
  };
}

function mergePendingWithAnswer(pending: IntentParseResult, answer: string): IntentParseResult {
  const parsed = parseIntent(answer);
  return {
    ...pending,
    amount: pending.amount ?? parsed.amount,
    recipientName:
      pending.recipientName ??
      parsed.recipientName ??
      (parsed.intent === "unknown" ? answer.replace(/[.!?]+$/g, "").trim() : undefined),
    memo: pending.memo ?? parsed.memo,
    missingFields: []
  };
}

export function handleConversationMessage(
  message: string,
  context: ConversationContext
): ConversationResult {
  const normalized = message.trim();
  const parsed = parseIntent(normalized);

  if (parsed.intent === "cancel") {
    return {
      reply: "No problem. I cancelled the transaction.",
      nextState: "idle",
      intent: parsed
    };
  }

  const activeIntent =
    context.state === "disambiguating_contact" && context.pendingIntent
      ? {
          ...context.pendingIntent,
          recipientName: normalized.replace(/[.!?]+$/g, "").trim(),
          missingFields: []
        }
      : context.state && context.state !== "idle" && context.pendingIntent
        ? mergePendingWithAnswer(context.pendingIntent, normalized)
        : parsed;

  if (activeIntent.intent === "send") {
    if (!activeIntent.amount || activeIntent.amount <= 0) {
      return {
        reply: "How much SOL would you like to send?",
        nextState: "collecting_amount",
        intent: activeIntent
      };
    }

    if (!activeIntent.recipientName) {
      return {
        reply: "Who would you like to send SOL to?",
        nextState: "collecting_recipient",
        intent: activeIntent
      };
    }

    const resolution = resolveContact({
      queryName: activeIntent.recipientName,
      contacts: context.contacts
    });

    if (resolution.status === "no_match") {
      return {
        reply: `I couldn't find ${activeIntent.recipientName} in your contacts.`,
        nextState: "error",
        intent: activeIntent
      };
    }

    if (resolution.status === "multiple_matches") {
      const names = resolution.matches
        .map((contact) => `${contact.name} ending ${contact.walletEnding}`)
        .join(" or ");
      return {
        reply: `I found ${resolution.matches.length} ${activeIntent.recipientName}s. Do you mean ${names}?`,
        nextState: "disambiguating_contact",
        intent: activeIntent,
        contactChoices: resolution.matches
      };
    }

    const pendingTransaction = buildPendingTransaction({
      amountSol: activeIntent.amount,
      recipient: resolution.contact,
      memo: activeIntent.memo,
      wallet: context.wallet
    });

    return {
      reply: `You're sending ${activeIntent.amount.toFixed(2)} SOL to ${resolution.contact.name} on the Solana network. Ready to proceed?`,
      nextState: "ready_to_confirm",
      intent: activeIntent,
      pendingTransaction
    };
  }

  if (activeIntent.intent === "request") {
    if (!activeIntent.amount || activeIntent.amount <= 0) {
      return {
        reply: "How much SOL would you like to request?",
        nextState: "collecting_amount",
        intent: activeIntent
      };
    }

    if (!activeIntent.recipientName) {
      return {
        reply: "Who would you like to request SOL from?",
        nextState: "collecting_recipient",
        intent: activeIntent
      };
    }

    const paymentRequest = buildPaymentRequest({
      amountSol: activeIntent.amount,
      fromName: activeIntent.recipientName,
      memo: activeIntent.memo,
      wallet: context.wallet
    });

    return {
      reply: `I created a request for ${activeIntent.amount.toFixed(2)} SOL from ${activeIntent.recipientName}.`,
      nextState: "success",
      intent: activeIntent,
      paymentRequest
    };
  }

  if (parsed.intent === "balance") {
    return {
      reply: `You have ${context.wallet.balanceSol.toFixed(2)} SOL available on Solana Devnet.`,
      nextState: "idle",
      intent: parsed,
      revealHome: true
    };
  }

  if (parsed.intent === "receive") {
    return {
      reply: "Here is your Solana receive QR and wallet address.",
      nextState: "idle",
      intent: parsed
    };
  }

  if (parsed.intent === "contacts") {
    return {
      reply: "Opening your trusted contacts.",
      nextState: "idle",
      intent: parsed
    };
  }

  return {
    reply:
      "I can help you send SOL, request SOL, show your balance, or open your receive address.",
    nextState: "idle",
    intent: parsed
  };
}
