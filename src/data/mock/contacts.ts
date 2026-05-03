import type { Contact } from "@/types";

export const demoContacts: Contact[] = [
  {
    id: "muape-k",
    name: "Muape K",
    aliases: ["muape", "mk", "muape k"],
    walletAddress: "8MuaPekDEV3PACKvoiceFirstSolanaWalletk9f2",
    walletEnding: "k9f2",
    trusted: true,
    recent: true,
    lastTransactionSummary: "Received 1.20 SOL",
    color: "bg-blue-100 text-blue-700",
    notes: "Lunch, hackathon demos, and quick reimbursements."
  },
  {
    id: "muape-a",
    name: "Muape A",
    aliases: ["muape", "muape a"],
    walletAddress: "5MuaPeaDEV3PACKvoiceFirstSolanaWallet2p91",
    walletEnding: "2p91",
    trusted: true,
    recent: false,
    lastTransactionSummary: "Requested 0.30 SOL",
    color: "bg-cyan-100 text-cyan-700",
    notes: "Second Muape contact used for ambiguity testing."
  },
  {
    id: "alex",
    name: "Alex",
    aliases: ["alex", "al"],
    walletAddress: "9AlexDEV3PACKvoiceFirstSolanaWallet91xA",
    walletEnding: "91xA",
    trusted: true,
    recent: true,
    lastTransactionSummary: "Paid lunch request",
    color: "bg-sky-100 text-sky-700",
    notes: "Usually pays payment requests."
  },
  {
    id: "zena",
    name: "Zena",
    aliases: ["zena", "z"],
    walletAddress: "4ZenaDEV3PACKvoiceFirstSolanaWallet8qZ3",
    walletEnding: "8qZ3",
    trusted: true,
    recent: true,
    lastTransactionSummary: "Sent 0.50 SOL",
    color: "bg-indigo-100 text-indigo-700",
    notes: "Trusted demo recipient."
  },
  {
    id: "solaris",
    name: "Solaris",
    aliases: ["solaris", "sol"],
    walletAddress: "2SolarisDEV3PACKvoiceFirstSolanaWallet7sLr",
    walletEnding: "7sLr",
    trusted: false,
    recent: true,
    lastTransactionSummary: "Received 2.00 SOL",
    color: "bg-violet-100 text-violet-700",
    notes: "Needs review before larger sends."
  }
];
