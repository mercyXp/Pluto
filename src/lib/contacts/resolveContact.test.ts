import { describe, expect, it } from "vitest";
import { resolveContact } from "@/lib/contacts/resolveContact";
import { demoContacts } from "@/data/mock/contacts";

describe("resolveContact", () => {
  it("finds an exact match", () => {
    const result = resolveContact({ queryName: "Alex", contacts: demoContacts });

    expect(result.status).toBe("single_match");
    if (result.status === "single_match") expect(result.contact.name).toBe("Alex");
  });

  it("finds an alias match", () => {
    const result = resolveContact({ queryName: "MK", contacts: demoContacts });

    expect(result.status).toBe("single_match");
    if (result.status === "single_match") expect(result.contact.name).toBe("Muape K");
  });

  it("returns multiple Muape matches", () => {
    const result = resolveContact({ queryName: "Muape", contacts: demoContacts });

    expect(result.status).toBe("multiple_matches");
    if (result.status === "multiple_matches") {
      expect(result.matches.map((contact) => contact.name)).toEqual(["Muape K", "Muape A"]);
    }
  });

  it("returns no match", () => {
    const result = resolveContact({ queryName: "Unknown", contacts: demoContacts });

    expect(result.status).toBe("no_match");
  });

  it("matches wallet ending", () => {
    const result = resolveContact({ queryName: "k9f2", contacts: demoContacts });

    expect(result.status).toBe("single_match");
    if (result.status === "single_match") expect(result.contact.name).toBe("Muape K");
  });
});
