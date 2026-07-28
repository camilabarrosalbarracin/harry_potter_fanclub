export type HouseName = "Gryffindor" | "Slytherin" | "Hufflepuff" | "Ravenclaw";

// Order matters: defines the totalLetters % 4 -> house mapping.
const HOUSES_BY_REMAINDER: HouseName[] = [
  "Gryffindor",
  "Slytherin",
  "Hufflepuff",
  "Ravenclaw",
];

// Pure and deterministic on purpose: based on the email (not the name) so
// the same person always gets the same house, no matter how they spell
// their name in the form each time they go through the Sorting Hat.
export function getHouseFromEmail(email: string): HouseName {
  const normalized = email.trim().toLowerCase();
  const totalLetters = normalized.replace(/\s/g, "").length;
  return HOUSES_BY_REMAINDER[totalLetters % 4];
}
