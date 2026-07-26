// Contenido editorial por casa que no viene de la API (acento de marca y
// tagline), definido por el handoff de diseño. Se usa como acento puntual
// (barra, punto, anillo, glow) — nunca como relleno grande, siguiendo la
// regla de Nocturne de "acento como línea, no como flood".
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
