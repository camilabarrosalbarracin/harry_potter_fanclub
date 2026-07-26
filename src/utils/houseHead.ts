import type { House, HouseHead } from "../api/wizardWorldApi";

// Si la misma persona figura como founder Y como head (ej. Godric
// Gryffindor en Gryffindor), se excluye acá para no repetirla: ya se
// muestra clickeable en el campo "Founder". Esta lista queda solo con los
// heads que no son el fundador (puede ser más de uno, ej. Slytherin:
// Snape + Slughorn).
export function getHouseHeads(house: House): HouseHead[] {
  return house.heads.filter(
    (head) => `${head.firstName} ${head.lastName}` !== house.founder
  );
}
