import type { Contact } from "@/types";

export type ContactResolution =
  | { status: "single_match"; contact: Contact; matches?: never }
  | { status: "multiple_matches"; matches: Contact[]; contact?: never }
  | { status: "no_match"; matches?: never; contact?: never };

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function levenshtein(a: string, b: string) {
  const matrix = Array.from({ length: a.length + 1 }, (_, index) => [index]);

  for (let column = 1; column <= b.length; column += 1) matrix[0][column] = column;

  for (let row = 1; row <= a.length; row += 1) {
    for (let column = 1; column <= b.length; column += 1) {
      const cost = a[row - 1] === b[column - 1] ? 0 : 1;
      matrix[row][column] = Math.min(
        matrix[row - 1][column] + 1,
        matrix[row][column - 1] + 1,
        matrix[row - 1][column - 1] + cost
      );
    }
  }

  return matrix[a.length][b.length];
}

function scoreContact(query: string, contact: Contact) {
  const normalizedQuery = normalize(query);
  const names = [contact.name, ...contact.aliases, contact.walletEnding].map(normalize);

  let score = 0;
  for (const name of names) {
    if (name === normalizedQuery) score = Math.max(score, 100);
    if (name.startsWith(normalizedQuery)) score = Math.max(score, 84);
    if (normalizedQuery.startsWith(name)) score = Math.max(score, 78);
    if (name.includes(normalizedQuery) || normalizedQuery.includes(name)) score = Math.max(score, 72);

    const distance = levenshtein(normalizedQuery, name);
    if (distance <= 1 && normalizedQuery.length > 3) score = Math.max(score, 64);
  }

  return score;
}

export function resolveContact({
  queryName,
  contacts
}: {
  queryName: string;
  contacts: Contact[];
}): ContactResolution {
  const query = queryName.trim();
  if (!query) return { status: "no_match" };

  const scored = contacts
    .map((contact) => ({ contact, score: scoreContact(query, contact) }))
    .filter((entry) => entry.score >= 60)
    .sort((a, b) => b.score - a.score);

  if (scored.length === 0) return { status: "no_match" };

  const bestScore = scored[0].score;
  const matches = scored.filter((entry) => bestScore - entry.score <= 10).map((entry) => entry.contact);

  if (matches.length === 1) return { status: "single_match", contact: matches[0] };
  return { status: "multiple_matches", matches };
}
