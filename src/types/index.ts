export type Network = "devnet" | "mainnet-beta";

export type OrbState =
  | "idle"
  | "listening"
  | "thinking"
  | "speaking"
  | "confirming"
  | "success";

export type Screen =
  | "splash"
  | "onboarding"
  | "auth"
  | "create-wallet"
  | "import-wallet"
  | "pin"
  | "app"
  | "confirm"
  | "success"
  | "receive"
  | "request"
  | "contacts"
  | "contact-detail"
  | "contact-editor"
  | "activity-detail"
  | "add-funds"
  | "settings";

export type IntentName =
  | "send"
  | "request"
  | "receive"
  | "balance"
  | "contacts"
  | "help"
  | "cancel"
  | "unknown";

export interface IntentParseResult {
  intent: IntentName;
  amount?: number;
  token?: "SOL";
  recipientName?: string;
  memo?: string;
  confidence: number;
  missingFields?: string[];
}

export interface Contact {
  id: string;
  name: string;
  aliases: string[];
  walletAddress: string;
  walletEnding: string;
  trusted: boolean;
  recent?: boolean;
  lastTransactionSummary?: string;
  color: string;
  notes?: string;
}

export interface Activity {
  id: string;
  type: "send" | "receive" | "request";
  title: string;
  timestamp: string;
  amountSol: number;
  contactName: string;
  signature?: string;
  memo?: string;
  network?: Network;
  counterpartyAddress?: string;
  feeSol?: number;
  status?: "confirmed" | "pending" | "failed";
}

export interface ChatMessage {
  id: string;
  role: "user" | "pluto";
  text: string;
  createdAt: string;
  variant?: "normal" | "error" | "success";
  choices?: Contact[];
}

export interface PendingTransaction {
  amountSol: number;
  token: "SOL";
  recipient: Contact;
  memo?: string;
  fromWalletName: string;
  fromAddress: string;
  network: Network;
  feeSol: number;
  fiatValueUsd: number;
}

export interface PaymentRequest {
  id: string;
  amountSol: number;
  token: "SOL";
  fromName: string;
  memo?: string;
  network: Network;
  paymentUrl: string;
}

export interface PlutoSettings {
  voiceEnabled: boolean;
  voiceStyle: "calm" | "bright" | "quiet";
  biometricEnabled: boolean;
  requireConfirmation: boolean;
  network: Network;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email?: string | null;
  createdAt?: string;
  defaultWalletId: string;
  demoMode: boolean;
  settings: PlutoSettings;
}

export interface WalletSummary {
  ownerName: string;
  walletName: string;
  publicKey: string;
  balanceSol: number;
  fiatValueUsd: number;
  network: Network;
  demoMode: boolean;
}

export interface ConversationContext {
  contacts: Contact[];
  wallet: WalletSummary;
  pendingIntent?: IntentParseResult;
  state?:
    | "idle"
    | "collecting_amount"
    | "collecting_recipient"
    | "disambiguating_contact"
    | "ready_to_confirm"
    | "sending"
    | "success"
    | "error";
}

export interface ConversationResult {
  reply: string;
  nextState: NonNullable<ConversationContext["state"]>;
  intent: IntentParseResult;
  pendingTransaction?: PendingTransaction;
  paymentRequest?: PaymentRequest;
  contactChoices?: Contact[];
  revealHome?: boolean;
}
