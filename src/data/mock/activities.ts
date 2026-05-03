import type { Activity } from "@/types";

export const demoActivities: Activity[] = [
  {
    id: "activity-1",
    type: "receive",
    title: "Received from Muape K",
    timestamp: "2m ago",
    amountSol: 1.2,
    contactName: "Muape K",
    signature: "5sP9wqH2kA7nVbQzDevnetk9f2",
    memo: "Demo top-up",
    network: "devnet",
    counterpartyAddress: "8MuaPekDEV3PACKvoiceFirstSolanaWalletk9f2",
    feeSol: 0.000005,
    status: "confirmed"
  },
  {
    id: "activity-2",
    type: "send",
    title: "Sent to Zena",
    timestamp: "1h ago",
    amountSol: -0.5,
    contactName: "Zena",
    signature: "8nL1xP5aDEV3PACKSentToZena8qZ3",
    memo: "Coffee",
    network: "devnet",
    counterpartyAddress: "4ZenaDEV3PACKvoiceFirstSolanaWallet8qZ3",
    feeSol: 0.000005,
    status: "confirmed"
  },
  {
    id: "activity-3",
    type: "receive",
    title: "Received from Solaris",
    timestamp: "Yesterday",
    amountSol: 2,
    contactName: "Solaris",
    signature: "9bQ4rSolarisDEV3PACKReceived7sLr",
    memo: "Hackathon funds",
    network: "devnet",
    counterpartyAddress: "2SolarisDEV3PACKvoiceFirstSolanaWallet7sLr",
    feeSol: 0.000005,
    status: "confirmed"
  }
];
