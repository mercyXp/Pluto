import type { IntentName, IntentParseResult } from "@/types";

const AMOUNT_PATTERN = /(?:^|\s)(\d+(?:\.\d+)?)\s*(?:sol)?\b/i;
const MEMO_PATTERN = /\bfor\s+(.+?)(?:[.!?]|$)/i;
const SEND_TO_PATTERN = /\b(?:send|pay|transfer)\b.*?\bto\s+(.+?)(?:\s+for\b|[.!?]|$)/i;
const REQUEST_FROM_PATTERN = /\b(?:request|ask|charge)\b.*?\bfrom\s+(.+?)(?:\s+for\b|[.!?]|$)/i;

function normalizeMessage(message: string) {
  return message.trim().replace(/\s+/g, " ");
}

function inferIntent(message: string): IntentName {
  const lower = message.toLowerCase();

  if (/\b(cancel|stop|never mind|nevermind)\b/.test(lower)) return "cancel";
  if (/\b(send|pay|transfer)\b/.test(lower)) return "send";
  if (/\b(request|ask|charge)\b/.test(lower)) return "request";
  if (/\b(receive|deposit|qr|address)\b/.test(lower)) return "receive";
  if (/\b(balance|how much|available|wallet)\b/.test(lower)) return "balance";
  if (/\b(contact|contacts|address book)\b/.test(lower)) return "contacts";
  if (/\b(help|what can you do|commands)\b/.test(lower)) return "help";

  return "unknown";
}

function extractAmount(message: string) {
  const match = message.match(AMOUNT_PATTERN);
  if (!match) return undefined;
  const parsed = Number.parseFloat(match[1]);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function cleanName(value?: string) {
  if (!value) return undefined;
  const cleaned = value
    .replace(/\b(on|using|via)\s+solana\b/gi, "")
    .replace(/\b(sol|devnet|mainnet)\b/gi, "")
    .replace(/[.,!?]+$/g, "")
    .trim();

  return cleaned.length > 0 ? cleaned : undefined;
}

function extractRecipient(message: string, intent: IntentName) {
  if (intent === "send") return cleanName(message.match(SEND_TO_PATTERN)?.[1]);
  if (intent === "request") return cleanName(message.match(REQUEST_FROM_PATTERN)?.[1]);
  return undefined;
}

function extractMemo(message: string) {
  const memo = message.match(MEMO_PATTERN)?.[1]
    ?.replace(/[.!?]+$/g, "")
    .trim();
  return memo || undefined;
}

export function parseIntent(input: string): IntentParseResult {
  const message = normalizeMessage(input);
  const intent = inferIntent(message);
  const amount = extractAmount(message);
  const recipientName = extractRecipient(message, intent);
  const memo = extractMemo(message);
  const lower = message.toLowerCase();
  const token = lower.includes("sol") || ["send", "request", "receive", "balance"].includes(intent) ? "SOL" : undefined;
  const missingFields: string[] = [];

  if (intent === "send" || intent === "request") {
    if (!amount) missingFields.push("amount");
    if (!recipientName) missingFields.push("recipientName");
  }

  let confidence = 0.5;
  if (intent !== "unknown") confidence += 0.25;
  if (amount) confidence += 0.1;
  if (recipientName) confidence += 0.1;
  if (token) confidence += 0.05;
  if (missingFields.length > 0) confidence -= missingFields.length * 0.08;

  return {
    intent,
    amount,
    token,
    recipientName,
    memo,
    confidence: Math.max(0.1, Math.min(0.98, Number(confidence.toFixed(2)))),
    missingFields
  };
}
