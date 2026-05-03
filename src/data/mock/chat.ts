import type { ChatMessage } from "@/types";

export const starterMessages: ChatMessage[] = [];

export const mockConversationPresets = {
  send: [
    "Send 0.20 SOL to Muape K",
    "Sure, I can help with that. Let me confirm the details for you.",
    "You’re sending 0.20 SOL to Muape K on the Solana network. Ready to proceed?"
  ],
  request: [
    "Request 0.50 SOL from Alex for dinner",
    "I created a request for 0.50 SOL from Alex. You can share the payment link or QR."
  ],
  balance: ["Show my balance", "You have 12.45 SOL available on Solana Devnet."],
  ambiguous: [
    "Send 0.10 SOL to Muape for lunch",
    "I found two Muapes. Which one do you mean?"
  ]
};
