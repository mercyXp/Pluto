import { describe, expect, it } from "vitest";
import { parseIntent } from "@/lib/intent/parseIntent";

describe("parseIntent", () => {
  it("parses a complete send command", () => {
    const result = parseIntent("Send 0.2 SOL to Muape for lunch");

    expect(result.intent).toBe("send");
    expect(result.amount).toBe(0.2);
    expect(result.token).toBe("SOL");
    expect(result.recipientName).toBe("Muape");
    expect(result.memo).toBe("lunch");
    expect(result.missingFields).toEqual([]);
  });

  it("reports missing amount for send command", () => {
    const result = parseIntent("Send SOL to Alex");

    expect(result.intent).toBe("send");
    expect(result.recipientName).toBe("Alex");
    expect(result.missingFields).toContain("amount");
  });

  it("parses a request command", () => {
    const result = parseIntent("Request 0.5 SOL from Sarah");

    expect(result.intent).toBe("request");
    expect(result.amount).toBe(0.5);
    expect(result.recipientName).toBe("Sarah");
  });

  it("parses a balance command", () => {
    const result = parseIntent("Show my balance");

    expect(result.intent).toBe("balance");
    expect(result.token).toBe("SOL");
  });

  it("parses receive intent", () => {
    const result = parseIntent("Receive SOL");

    expect(result.intent).toBe("receive");
  });
});
