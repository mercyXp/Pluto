import { describe, expect, it } from "vitest";
import { createSolanaPayUrl } from "@/lib/solana/solanaPay";

describe("solana utilities", () => {
  it("creates a Solana Pay URL", () => {
    const url = createSolanaPayUrl({
      recipient: "7xC1DemoWallet",
      amountSol: 0.5,
      label: "Pluto",
      message: "Lunch",
      memo: "dinner"
    });

    expect(url).toContain("solana:7xC1DemoWallet");
    expect(url).toContain("amount=0.5");
    expect(url).toContain("label=Pluto");
    expect(url).toContain("message=Lunch");
    expect(url).toContain("memo=dinner");
  });
});
