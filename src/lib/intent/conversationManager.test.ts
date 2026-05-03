import { describe, expect, it } from "vitest";
import { demoContacts } from "@/data/mock/contacts";
import { demoWallet } from "@/data/mock/wallet";
import { handleConversationMessage } from "@/lib/intent/conversationManager";

describe("handleConversationMessage", () => {
  it("builds a complete send flow", () => {
    const result = handleConversationMessage("Send 0.2 SOL to Alex for lunch", {
      contacts: demoContacts,
      wallet: demoWallet,
      state: "idle"
    });

    expect(result.nextState).toBe("ready_to_confirm");
    expect(result.pendingTransaction?.amountSol).toBe(0.2);
    expect(result.pendingTransaction?.recipient.name).toBe("Alex");
  });

  it("asks for a missing amount", () => {
    const result = handleConversationMessage("Send SOL to Alex", {
      contacts: demoContacts,
      wallet: demoWallet,
      state: "idle"
    });

    expect(result.nextState).toBe("collecting_amount");
    expect(result.reply).toContain("How much");
  });

  it("handles ambiguous contacts", () => {
    const first = handleConversationMessage("Send 0.1 SOL to Muape for lunch", {
      contacts: demoContacts,
      wallet: demoWallet,
      state: "idle"
    });

    expect(first.nextState).toBe("disambiguating_contact");
    expect(first.contactChoices).toHaveLength(2);

    const second = handleConversationMessage("Muape K", {
      contacts: demoContacts,
      wallet: demoWallet,
      state: first.nextState,
      pendingIntent: first.intent
    });

    expect(second.nextState).toBe("ready_to_confirm");
    expect(second.pendingTransaction?.recipient.name).toBe("Muape K");
  });

  it("handles cancel flow", () => {
    const result = handleConversationMessage("cancel", {
      contacts: demoContacts,
      wallet: demoWallet,
      state: "ready_to_confirm"
    });

    expect(result.nextState).toBe("idle");
    expect(result.reply).toContain("cancelled");
  });
});
