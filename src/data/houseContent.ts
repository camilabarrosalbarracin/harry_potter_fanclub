// Editorial content per house that doesn't come from the API (brand
// accent and tagline), defined by the design handoff. Used as a
// punctual accent (bar, dot, ring, glow), never as a large fill, per
// Nocturne's rule of "accent as a line, not a flood".
export interface HouseVisualContent {
  accent: string;
  tagline: string;
}

export const HOUSE_CONTENT: Record<string, HouseVisualContent> = {
  Gryffindor: {
    accent: "#b3453f",
    tagline: "Where the brave of heart dwell.",
  },
  Slytherin: {
    accent: "#3f8a5c",
    tagline: "Where cunning finds its true power.",
  },
  Hufflepuff: {
    accent: "#d9a441",
    tagline: "Where loyalty never wavers.",
  },
  Ravenclaw: {
    accent: "#5b7fc4",
    tagline: "Where wit knows no bounds.",
  },
};

const DEFAULT_ACCENT = "var(--color-accent-700)";

export function getHouseAccent(houseName: string): string {
  return HOUSE_CONTENT[houseName]?.accent ?? DEFAULT_ACCENT;
}

export function getHouseTagline(houseName: string): string {
  return HOUSE_CONTENT[houseName]?.tagline ?? "";
}
