export type HouseName = "Gryffindor" | "Slytherin" | "Hufflepuff" | "Ravenclaw";

// El orden importa: define el mapeo de totalLetras % 4 -> casa.
const HOUSES_BY_REMAINDER: HouseName[] = [
  "Gryffindor",
  "Slytherin",
  "Hufflepuff",
  "Ravenclaw",
];

// Pura y determinística a propósito: mismo nombre + apellido siempre da la
// misma casa, y es fácil de testear sin mockear nada.
export function getHouseFromName(nombre: string, apellido: string): HouseName {
  const totalLetras = `${nombre}${apellido}`.replace(/\s/g, "").length;
  return HOUSES_BY_REMAINDER[totalLetras % 4];
}
